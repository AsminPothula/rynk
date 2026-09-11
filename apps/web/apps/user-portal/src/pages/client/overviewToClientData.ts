/**
 * Map the REAL backend overview (context + latest audit/strategy/manifest) onto
 * the ClientData shape the dashboard renders.
 *
 * Rules:
 *  - Everything that comes from the pipeline is mapped for real:
 *    profile ← context.brand + context.presence, actions ← manifest,
 *    authority/keywords/competitors/CWV ← audit.
 *  - Things the pipeline does NOT produce yet (composite score over time, GSC
 *    traffic, AI-citation counts) are left EMPTY/zeroed — the dashboard already
 *    renders honest "not tracked yet / connect GSC" states for those. We never
 *    fabricate them.
 *  - DA/backlinks are currently mock upstream (see task #39); they pass through
 *    but should be labelled estimated in the UI until a real provider is wired.
 */
import type {
  ClientData,
  ClientProfile,
  ActionItem,
  ActionStatus,
  Keyword,
  ContentDraft,
} from './sampleData';
import type { ClientOverviewVm } from '@shared/hooks/rq/queries/useGetClientOverview';

const EMPTY_PROFILE: ClientProfile = {
  description: '',
  valueProposition: '',
  differentiators: [],
  personas: [],
  voice: { tone: '', personality: [], avoid: [] },
  contentThemes: [],
  products: [],
  guidelines: '',
  languages: [],
  markets: [],
  serviceAreas: [],
  primaryCategory: '',
  hours: [],
  services: [],
  bookingUrl: '',
  reviewProfiles: [],
};

/** context.brand + context.presence → the flat ClientProfile the UI edits. */
function mapProfile(ctx: any): ClientProfile {
  if (!ctx) return EMPTY_PROFILE;
  const brand = ctx.brand ?? {};
  const presence = ctx.presence ?? {};
  return {
    description: brand.description ?? '',
    valueProposition: brand.valueProposition ?? '',
    differentiators: brand.differentiators ?? [],
    personas: brand.personas ?? [],
    voice: {
      tone: brand.voice?.tone ?? '',
      personality: brand.voice?.personality ?? [],
      avoid: brand.voice?.avoid ?? [],
    },
    contentThemes: brand.contentThemes ?? [],
    products: brand.products ?? [],
    guidelines: brand.guidelines ?? '',
    languages: brand.languages ?? [],
    markets: brand.markets ?? [],
    serviceAreas: presence.serviceAreas ?? [],
    primaryCategory: presence.primaryCategory ?? '',
    hours: presence.hours ?? [],
    services: presence.services ?? [],
    bookingUrl: presence.bookingUrl ?? '',
    reviewProfiles: presence.reviewProfiles ?? [],
  };
}

/** Pipeline action type → the dashboard's coarse channel. */
const TYPE_CHANNEL: Record<string, ActionItem['channel']> = {
  update_meta: 'cms',
  inject_schema: 'schema',
  add_redirect: 'cms',
  insert_internal_link: 'cms',
  create_page: 'cms',
  create_image: 'image',
  draft_outreach: 'outreach',
  draft_brand_post: 'social',
  propose_code_change: 'code-pr',
  create_document: 'document',
  fix_nap: 'citations',
  gbp_suggestion: 'gbp',
};

/** Pipeline action type → which PUBLISH_TYPES bucket it belongs to. */
const TYPE_PUBLISHKEY: Record<string, string> = {
  update_meta: 'metadata',
  inject_schema: 'schema',
  add_redirect: 'robots-canonical',
  insert_internal_link: 'internal-links',
  create_page: 'landing-page',
  create_image: 'image-alt',
  draft_outreach: 'outreach',
  draft_brand_post: 'gbp-post',
  create_document: 'blog',
  fix_nap: 'citations',
};

function mapActionStatus(a: any): ActionStatus {
  if (a.status === 'applied' || a.status === 'published' || a.status === 'done') return 'shipped';
  if (!a.automatable) return 'needs_you';
  return 'queued';
}

function mapActions(manifest: any): ActionItem[] {
  const actions: any[] = manifest?.actions ?? [];
  return actions.map((a): ActionItem => ({
    id: a.id,
    type: a.type,
    channel: TYPE_CHANNEL[a.type] ?? 'cms',
    title: a.payload?.title ?? a.provenance?.reason ?? a.notes ?? a.type,
    detail: a.notes ?? a.provenance?.reason ?? undefined,
    status: mapActionStatus(a),
    automatable: !!a.automatable,
    before: a.payload?.before ?? undefined,
    after: a.payload?.after ?? a.payload?.metaDescription ?? undefined,
    why: a.provenance?.reason ?? undefined,
    publishKey: TYPE_PUBLISHKEY[a.type],
  }));
}

const CONTENT_TYPES = new Set(['create_page', 'draft_outreach', 'draft_brand_post', 'create_document']);
function mapDrafts(manifest: any): ContentDraft[] {
  const actions: any[] = manifest?.actions ?? [];
  return actions
    .filter((a) => CONTENT_TYPES.has(a.type))
    .slice(0, 40)
    .map((a): ContentDraft => ({
      id: a.id,
      kind: a.type === 'create_page' ? 'page' : a.type === 'draft_brand_post' ? 'brand_post' : a.type === 'draft_outreach' ? 'outreach' : 'document',
      title: a.payload?.title ?? a.provenance?.reason ?? a.type,
      channel: TYPE_CHANNEL[a.type] ?? 'cms',
      preview: a.payload?.body ?? a.payload?.metaDescription ?? a.notes ?? '',
    }));
}

function mapKeywords(audit: any): Keyword[] {
  const byKw = audit?.serpData?.byKeyword;
  if (!byKw) return [];
  const list = Array.isArray(byKw) ? byKw : Object.values(byKw);
  return (list as any[]).slice(0, 40).map((k): Keyword => ({
    term: k.keyword ?? '',
    rank: k.clientRank ?? k.rank ?? null,
    rank30: null, // no history yet
    volume: k.volume ?? 0,
    intent: k.intent,
    competitors: {},
  }));
}

/** Core Web Vitals from the audit's technical crawl / P1 issues (real, PageSpeed). */
function mapCwv(audit: any): ClientData['coreWebVitals'] {
  const cwv = audit?.technicalCrawl?.coreWebVitals ?? audit?.coreWebVitals;
  const norm = (v: any): 'pass' | 'needs-work' =>
    v === 'pass' || v === true || v === 'good' ? 'pass' : 'needs-work';
  if (cwv) return { lcp: norm(cwv.lcp), cls: norm(cwv.cls), inp: norm(cwv.inp) };
  return { lcp: 'needs-work', cls: 'needs-work', inp: 'needs-work' };
}

function mapAuthority(audit: any): ClientData['authority'] {
  const client = audit?.authority?.client ?? {};
  const competitorsRaw = audit?.authority?.competitors ?? {};
  const competitors: Record<string, { da: number; backlinks: number }> = {};
  for (const [name, c] of Object.entries(competitorsRaw as Record<string, any>)) {
    competitors[name] = { da: c?.score ?? 0, backlinks: c?.backlinks ?? 0 };
  }
  return {
    da: client.score ?? 0,
    backlinks: client.backlinks ?? 0,
    referringDomains: client.referringDomains ?? 0,
    competitors,
  };
}

export function overviewToClientData(ov: ClientOverviewVm): ClientData {
  const ctx = ov.context ?? {};
  const audit = ov.latestAudit;
  const manifest = ov.latestManifest;
  const actions = mapActions(manifest);
  const needsYou = actions.filter((a) => a.status === 'needs_you');

  const kind: ClientData['kind'] =
    (ctx as any).presence?.serviceAreas?.length || (ctx as any).presence?.primaryCategory ? 'local' : 'content';

  return {
    id: ov.id,
    domain: ov.domain,
    name: (ctx as any).legalEntity || ov.name || ov.domain,
    kind,
    industry: (ctx as any).industry ?? '',
    location: (ctx as any).presence?.locations?.[0]?.address || (ctx as any).canonicalNAP?.address || undefined,
    plan: 'Gold',
    baselineDate: ov.latestRunDate ?? '',
    lastUpdated: ov.latestRunDate ?? '—',
    profile: mapProfile(ctx),

    // Not tracked yet — no composite score / history. Empty series → UI shows honest state.
    visibilityScore: { today: 0, baseline: 0, series: [] },
    progress: [],
    keywords: mapKeywords(audit),
    // GSC traffic not connected yet.
    traffic: { impressions: 0, clicks: 0, ctr: 0, impressions30: 0, clicks30: 0 },
    authority: mapAuthority(audit),
    coreWebVitals: mapCwv(audit),
    // AI-citation tracking not wired yet.
    ai: [],
    actions,
    drafts: mapDrafts(manifest),
    insights: audit?.prioritizedIssues?.p1?.map((i: any) => i.title).filter(Boolean).slice(0, 5) ?? [],
    waitingOnYou: needsYou.slice(0, 6).map((a) => ({ id: a.id, label: a.title, detail: a.detail ?? '' })),
  };
}
