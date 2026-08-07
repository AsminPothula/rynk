/**
 * Sample dashboard data — drives the whole client dashboard UI with realistic
 * fake numbers so every tab can be built and tested before real data (GSC/GA,
 * citation checker, AI citation tracker) is wired.
 *
 * Two archetypes on purpose:
 *   - `local`   → a barbershop. The main rynk audience. Emphasis is Google
 *                 Business Profile, citations/NAP, reviews, the map pack, local
 *                 schema, photos, mobile speed — NOT big content production.
 *   - `content` → a B2B tech company. Emphasis is keywords, pages, authority,
 *                 outreach, AI citations.
 *
 * Real backend fields (audit authority, execution manifest) map onto this shape
 * later; until then these samples are the single source the UI reads from.
 */

export type ClientKind = 'local' | 'content';

export interface TrendPoint {
  t: string; // ISO date
  v: number;
}

export interface ProgressRow {
  label: string;
  day0: number | string | null;
  day30: number | string | null;
  day60: number | string | null;
  day90: number | string | null;
  today: number | string;
  /** higher-is-better (visits) vs lower-is-better (avg rank) — for the trend arrow */
  goodDirection?: 'up' | 'down';
}

export interface Keyword {
  term: string;
  rank: number | null;
  rank30: number | null;
  volume: number;
  intent?: 'local' | 'commercial' | 'informational';
  competitors: Record<string, number | null>; // domain → their rank
}

export interface AiPlatform {
  platform: 'ChatGPT' | 'Perplexity' | 'Google AI Overview';
  now: number;
  baseline: number;
  queries: { q: string; cited: boolean; competitorCited?: string }[];
}

export type ActionStatus = 'shipped' | 'in_review' | 'queued' | 'needs_you' | 'scheduled';

export interface ActionItem {
  id: string;
  type: string; // e.g. update_meta, gbp_optimize, review_reply, create_page
  channel: 'cms' | 'gbp' | 'citations' | 'reviews' | 'image' | 'outreach' | 'social' | 'code-pr' | 'document' | 'schema';
  title: string; // plain-English, client-facing
  detail?: string;
  status: ActionStatus;
  date?: string; // when shipped/scheduled
  automatable: boolean;
  before?: string;
  after?: string;
  priority?: number; // 1 = highest (for the "waiting on you" ordering)
  why?: string; // plain-English reasoning shown in the approval queue
  impact?: string; // estimated SEO impact, e.g. "+ ~800 est. monthly visits"
  publishKey?: string; // which PUBLISH_TYPES category this action belongs to
}

// ── Publishing settings ────────────────────────────────────────────────────────
// Every publishable action type + its default. Technical (no visible impact)
// defaults to auto-publish; visible content defaults to manual approval. The
// client can flip any of them; the approval queue reads these to decide what
// waits for sign-off vs. what auto-applies.
export interface PublishType {
  key: string;
  label: string;
  group: 'technical' | 'content';
  defaultAuto: boolean;
}

export const PUBLISH_TYPES: PublishType[] = [
  { key: 'metadata', label: 'Metadata (titles & descriptions)', group: 'technical', defaultAuto: true },
  { key: 'schema', label: 'Schema markup', group: 'technical', defaultAuto: true },
  { key: 'sitemap', label: 'Sitemap generation & submission', group: 'technical', defaultAuto: true },
  { key: 'robots-canonical', label: 'robots.txt & canonical tags', group: 'technical', defaultAuto: true },
  { key: 'internal-links', label: 'Internal linking', group: 'technical', defaultAuto: true },
  { key: 'indexing', label: 'Indexing requests', group: 'technical', defaultAuto: true },
  { key: 'crawl-fix', label: 'Crawl-error & broken-link fixes', group: 'technical', defaultAuto: true },
  { key: 'citations', label: 'Directory listing / citation fixes', group: 'technical', defaultAuto: true },
  { key: 'image-alt', label: 'Image alt text', group: 'technical', defaultAuto: true },
  { key: 'blog', label: 'Blog posts', group: 'content', defaultAuto: false },
  { key: 'landing-page', label: 'New landing pages', group: 'content', defaultAuto: false },
  { key: 'service-edit', label: 'Service page edits', group: 'content', defaultAuto: false },
  { key: 'faq', label: 'FAQ sections', group: 'content', defaultAuto: false },
  { key: 'copy-rewrite', label: 'Website copy rewrites', group: 'content', defaultAuto: false },
  { key: 'gbp-post', label: 'Google Business Profile posts', group: 'content', defaultAuto: false },
  { key: 'review-reply', label: 'Review replies', group: 'content', defaultAuto: false },
  { key: 'outreach', label: 'Backlink outreach emails', group: 'content', defaultAuto: false },
];

/** Default auto/manual seed for every type (used to init the edit draft). */
export function defaultAutoPublish(): Record<string, boolean> {
  return Object.fromEntries(PUBLISH_TYPES.map((t) => [t.key, t.defaultAuto]));
}

/** Is this action set to auto-publish under the given settings? */
export function isActionAuto(a: ActionItem, autoPublish: Record<string, boolean>): boolean {
  if (!a.publishKey) return false; // untagged → treat as needing approval
  const t = PUBLISH_TYPES.find((x) => x.key === a.publishKey);
  return autoPublish[a.publishKey] ?? t?.defaultAuto ?? false;
}

export interface ContentDraft {
  id: string;
  kind: 'page' | 'brand_post' | 'outreach' | 'review_reply' | 'document';
  title: string;
  channel: ActionItem['channel'];
  preview: string;
  words?: number;
}

export interface LocalPresence {
  gbp: { claimed: boolean; completeness: number; hoursCorrect: boolean; bookingLink: boolean };
  citations: { consistent: number; total: number; issues: string[] };
  reviews: { count: number; avg: number; unreplied: number; series: TrendPoint[] };
  mapPack: { primary: { category: string; rank: number | null }; secondary: { category: string; rank: number | null }[] };
}

/** What rynk understands about the business — powers the Profile tab. Mirrors
 *  the pipeline ClientContext brand + presence blocks; empty strings/arrays are
 *  "not known yet" and render as such. */
export interface ClientProfile {
  // identity + voice
  description: string;
  valueProposition: string;
  differentiators: string[];
  personas: { name: string; description: string }[];
  voice: { tone: string; personality: string[]; avoid: string[] };
  contentThemes: string[];
  products: { name: string; description: string }[];
  guidelines: string;
  languages: string[];
  markets: string[];
  // presence
  serviceAreas: string[];
  primaryCategory: string;
  hours: { day: string; open: string; close: string }[];
  services: { name: string; price: string }[];
  bookingUrl: string;
  reviewProfiles: { platform: string; url: string }[];
}

export interface ClientData {
  id: string;
  domain: string;
  name: string;
  kind: ClientKind;
  industry: string;
  location?: string;
  plan: 'Gold' | 'Platinum';
  baselineDate: string; // Day 0
  lastUpdated: string;
  profile: ClientProfile;

  visibilityScore: { today: number; baseline: number; series: TrendPoint[] };
  progress: ProgressRow[];
  keywords: Keyword[];
  traffic: { impressions: number; clicks: number; ctr: number; impressions30: number; clicks30: number };
  authority: { da: number; backlinks: number; referringDomains: number; competitors: Record<string, { da: number; backlinks: number }> };
  coreWebVitals: { lcp: 'pass' | 'needs-work'; cls: 'pass' | 'needs-work'; inp: 'pass' | 'needs-work' };
  local?: LocalPresence;
  ai: AiPlatform[];
  actions: ActionItem[];
  drafts: ContentDraft[];
  insights: string[];
  waitingOnYou: { id: string; label: string; detail: string }[];
}

// ── helpers ──────────────────────────────────────────────────────────────────

function series(start: number, end: number, days = 90): TrendPoint[] {
  const out: TrendPoint[] = [];
  const base = new Date('2026-04-01').getTime();
  for (let i = 0; i <= days; i += 5) {
    const frac = i / days;
    // ease-in curve so it looks like real, accelerating growth
    const v = start + (end - start) * (frac * frac * (3 - 2 * frac));
    out.push({ t: new Date(base + i * 864e5).toISOString().slice(0, 10), v: Math.round(v * 10) / 10 });
  }
  return out;
}

// ── SAMPLE 1: local barbershop ───────────────────────────────────────────────

const barbershop: ClientData = {
  id: 'sample-fadelab',
  domain: 'fadelabbarbers.com',
  name: 'Fade Lab Barbers',
  kind: 'local',
  industry: 'Barbershop',
  location: 'Plano, TX',
  plan: 'Gold',
  baselineDate: '2026-04-01',
  lastUpdated: '2 hours ago',

  profile: {
    description: 'A modern barbershop in Plano offering fades, beard trims, and hot-towel shaves.',
    valueProposition: 'Clean, precise cuts with no wait — walk-ins welcome, easy online booking.',
    differentiators: ['Walk-ins welcome 7 days a week', 'Hot-towel straight-razor shaves', 'Kid-friendly chairs'],
    personas: [
      { name: 'Busy professionals', description: 'Men 25–45 who want a quick, reliable fade near work or home.' },
      { name: 'Parents', description: 'Families booking kids’ cuts on weekends.' },
    ],
    voice: { tone: 'Friendly, local, down-to-earth', personality: ['welcoming', 'confident', 'no-fuss'], avoid: ['corporate jargon', 'over-promising wait times'] },
    contentThemes: ['Fade styles & trends', 'Beard care', 'Grooming tips', 'Local Plano life'],
    products: [
      { name: 'Signature Fade', description: 'Skin/taper fade tailored to your style.' },
      { name: 'Beard Trim & Line-up', description: 'Shape, trim, and hot-towel finish.' },
    ],
    guidelines: 'Keep it warm and local. Mention Plano/Frisco naturally. Never overstate wait times.',
    languages: ['en'],
    markets: ['Plano, TX', 'Frisco, TX', 'North Dallas'],
    serviceAreas: ['Plano', 'Frisco', 'North Dallas'],
    primaryCategory: 'Barber shop',
    hours: [
      { day: 'Mon–Fri', open: '09:00', close: '19:00' },
      { day: 'Sat', open: '09:00', close: '18:00' },
      { day: 'Sun', open: '11:00', close: '16:00' },
    ],
    services: [
      { name: 'Fade / haircut', price: '$30' },
      { name: 'Beard trim', price: '$18' },
      { name: 'Hot-towel shave', price: '$35' },
      { name: 'Kids cut', price: '$22' },
    ],
    bookingUrl: 'https://booksy.com/fadelabbarbers',
    reviewProfiles: [
      { platform: 'Google', url: 'https://g.co/fadelab' },
      { platform: 'Yelp', url: 'https://yelp.com/biz/fadelab' },
    ],
  },

  visibilityScore: { today: 68, baseline: 31, series: series(31, 68) },
  progress: [
    { label: 'Organic visits', day0: 210, day30: 340, day60: 520, day90: 690, today: 742, goodDirection: 'up' },
    { label: 'Map pack appearances', day0: 12, day30: 40, day60: 88, day90: 150, today: 171, goodDirection: 'up' },
    { label: 'Avg. Google ranking', day0: 24, day30: 18, day60: 12, day90: 7, today: 6, goodDirection: 'down' },
    { label: 'Keywords in top 3', day0: 1, day30: 3, day60: 6, day90: 9, today: 11, goodDirection: 'up' },
    { label: 'Google reviews', day0: 38, day30: 44, day60: 55, day90: 68, today: 74, goodDirection: 'up' },
    { label: 'Citations consistent', day0: 9, day30: 14, day60: 19, day90: 22, today: 23, goodDirection: 'up' },
  ],
  keywords: [
    { term: 'fade haircut plano', rank: 3, rank30: 8, volume: 720, intent: 'local', competitors: { 'sharplinecuts.com': 1, 'planobarber.co': 5 } },
    { term: 'beard trim near me', rank: 4, rank30: 11, volume: 1600, intent: 'local', competitors: { 'sharplinecuts.com': 2, 'planobarber.co': 7 } },
    { term: 'best barber plano', rank: 6, rank30: 14, volume: 480, intent: 'local', competitors: { 'sharplinecuts.com': 1, 'planobarber.co': 3 } },
    { term: 'kids haircut plano tx', rank: 9, rank30: 22, volume: 260, intent: 'local', competitors: { 'sharplinecuts.com': 4, 'planobarber.co': 6 } },
    { term: 'hot towel shave plano', rank: 2, rank30: 5, volume: 140, intent: 'local', competitors: { 'sharplinecuts.com': 3, 'planobarber.co': null } },
  ],
  traffic: { impressions: 18400, clicks: 742, ctr: 4.0, impressions30: 12100, clicks30: 520 },
  authority: {
    da: 22, backlinks: 141, referringDomains: 34,
    competitors: { 'sharplinecuts.com': { da: 29, backlinks: 380 }, 'planobarber.co': { da: 18, backlinks: 96 } },
  },
  coreWebVitals: { lcp: 'needs-work', cls: 'pass', inp: 'pass' },
  local: {
    gbp: { claimed: true, completeness: 92, hoursCorrect: true, bookingLink: true },
    citations: { consistent: 23, total: 27, issues: ['Yelp phone mismatch', 'Apple Maps old address', 'Foursquare missing hours', 'Bing name variant'] },
    reviews: { count: 74, avg: 4.7, unreplied: 3, series: series(38, 74) },
    mapPack: { primary: { category: 'Barber shop', rank: 3 }, secondary: [{ category: "Men's haircut", rank: 2 }, { category: 'Beard trim', rank: 4 }] },
  },
  ai: [
    { platform: 'ChatGPT', now: 6, baseline: 0, queries: [
      { q: 'best barbershop in Plano', cited: true },
      { q: 'where to get a fade in Plano', cited: true },
      { q: 'barber that does hot towel shave near Plano', cited: false, competitorCited: 'sharplinecuts.com' },
    ] },
    { platform: 'Perplexity', now: 4, baseline: 1, queries: [
      { q: 'top rated barbers Plano TX', cited: true },
      { q: 'kids haircut Plano', cited: false, competitorCited: 'planobarber.co' },
    ] },
    { platform: 'Google AI Overview', now: 3, baseline: 0, queries: [
      { q: 'barbershop near me Plano', cited: true },
    ] },
  ],
  actions: [
    { id: 'a1', type: 'review_reply', channel: 'reviews', title: 'Reply to 3 new Google reviews', detail: 'Two 5★, one 3★ mentioning wait time.', status: 'needs_you', automatable: false, priority: 1, publishKey: 'review-reply', why: 'Replying — especially to the 3★ — signals an active, trusted business to Google and reassures prospects reading the reviews. rynk drafted warm, on-brand replies for you to approve.', impact: 'Local ranking + trust' },
    { id: 'a2', type: 'gbp_photo', channel: 'gbp', title: 'Post 5 haircut/interior photos to Google Business Profile', detail: 'You shoot them; rynk optimizes + posts.', status: 'needs_you', automatable: false, priority: 2, publishKey: 'gbp-post', why: 'Profiles with fresh photos get noticeably more calls and direction requests, and Google favors active listings in the map pack.', impact: '+ GBP engagement' },
    { id: 'a3', type: 'citation_fix', channel: 'citations', title: 'Fix phone number on Yelp', detail: 'Yelp shows an old number.', status: 'in_review', automatable: false, priority: 3, publishKey: 'citations', why: 'Your Yelp phone doesn’t match your website. NAP mismatches confuse Google and split your local authority across listings.', impact: 'Local ranking' },
    { id: 'a4', type: 'gbp_optimize', channel: 'gbp', title: 'Completed GBP: services, hours, booking link', status: 'shipped', date: '2026-06-18', automatable: true },
    { id: 'a5', type: 'inject_schema', channel: 'schema', title: 'Added LocalBusiness + Service schema', detail: 'Tells Google your services, hours, price range.', status: 'shipped', date: '2026-06-20', automatable: true },
    { id: 'a6', type: 'create_page', channel: 'cms', title: 'New page: "Fades in Plano" landing page', status: 'shipped', date: '2026-06-24', automatable: false, before: '(no page)', after: '/services/fades-plano' },
    { id: 'a7', type: 'update_meta', channel: 'cms', title: 'Rewrote titles + descriptions on 6 pages', status: 'shipped', date: '2026-06-12', automatable: true },
    { id: 'a8', type: 'image_alt', channel: 'image', title: 'Added descriptive alt text to 14 photos', status: 'shipped', date: '2026-06-13', automatable: true },
    { id: 'a9', type: 'speed_fix', channel: 'code-pr', title: 'Compressed images — mobile load 4.1s → 2.3s', status: 'shipped', date: '2026-06-28', automatable: true },
    { id: 'a10', type: 'citation_sync', channel: 'citations', title: 'Synced listings across 23 directories', status: 'shipped', date: '2026-06-15', automatable: true },
  ],
  drafts: [
    { id: 'd1', kind: 'review_reply', title: 'Reply to Marcus D. (3★)', channel: 'reviews', preview: 'Thanks for the honest feedback, Marcus — sorry about the wait last Saturday. We\'ve added a barber on weekends…' },
    { id: 'd2', kind: 'page', title: 'Kids haircuts in Plano — service page', channel: 'cms', preview: 'A friendly, low-stress kids\' haircut experience in Plano…', words: 620 },
    { id: 'd3', kind: 'brand_post', title: 'GBP post: "Walk-ins welcome this week"', channel: 'gbp', preview: 'Fresh fades, no appointment needed Tue–Thu…' },
  ],
  insights: [
    'Your ranking for "fade haircut plano" jumped 5 spots after the new landing page and GBP update — you\'re now in the top 3.',
    'Reviews are up 36 since Day 0; profiles above 4.5★ with 70+ reviews win the map pack in your area.',
    'Mobile load time dropped to 2.3s — most of your searches come from phones, so this directly helps ranking.',
  ],
  waitingOnYou: [
    { id: 'w1', label: 'Reply to 3 Google reviews', detail: 'Drafts ready — approve or edit.' },
    { id: 'w2', label: 'Upload 5 shop/haircut photos', detail: 'For your Google Business Profile.' },
  ],
};

// ── SAMPLE 2: B2B / content-heavy ────────────────────────────────────────────

const b2b: ClientData = {
  id: 'sample-itech',
  domain: 'itechdata.ai',
  name: 'iTech Data',
  kind: 'content',
  industry: 'Data & AI consulting',
  plan: 'Platinum',
  baselineDate: '2026-04-01',
  lastUpdated: '4 hours ago',

  profile: {
    description: 'A data & AI consulting firm helping mid-market companies modernize their data stack.',
    valueProposition: 'Ship a modern data stack and real AI use-cases without a 12-month project.',
    differentiators: ['Snowflake + dbt specialists', 'Fixed-scope 90-day engagements', 'Published original benchmarks'],
    personas: [
      { name: 'Heads of Data', description: 'Leaders at 200–2000 person companies replacing a legacy warehouse.' },
      { name: 'CTOs', description: 'Technical execs evaluating AI implementation partners.' },
    ],
    voice: { tone: 'Authoritative, technical, plain-spoken', personality: ['expert', 'pragmatic', 'direct'], avoid: ['hype', 'buzzwords without substance'] },
    contentThemes: ['Modern data stack', 'Snowflake migration', 'AI implementation', 'Data governance'],
    products: [
      { name: 'Data Stack Modernization', description: 'Warehouse migration + dbt modeling.' },
      { name: 'AI Implementation', description: 'Scoped AI use-cases from data to production.' },
    ],
    guidelines: 'Lead with substance and proof. Cite real numbers. No vague AI hype.',
    languages: ['en'],
    markets: ['United States', 'Canada'],
    // pure-online — presence fields intentionally empty to show the "not known" state
    serviceAreas: [],
    primaryCategory: '',
    hours: [],
    services: [],
    bookingUrl: '',
    reviewProfiles: [],
  },

  visibilityScore: { today: 61, baseline: 40, series: series(40, 61) },
  progress: [
    { label: 'Organic visits', day0: 3100, day30: 3600, day60: 4400, day90: 5200, today: 5480, goodDirection: 'up' },
    { label: 'Avg. Google ranking', day0: 31, day30: 26, day60: 20, day90: 16, today: 15, goodDirection: 'down' },
    { label: 'Keywords in top 10', day0: 8, day30: 14, day60: 22, day90: 31, today: 34, goodDirection: 'up' },
    { label: 'Keywords in top 3', day0: 2, day30: 3, day60: 6, day90: 9, today: 10, goodDirection: 'up' },
    { label: 'AI citations', day0: 3, day30: 6, day60: 10, day90: 15, today: 18, goodDirection: 'up' },
    { label: 'Backlinks', day0: 940, day30: 1020, day60: 1180, day90: 1340, today: 1390, goodDirection: 'up' },
  ],
  keywords: [
    { term: 'data analytics consulting', rank: 4, rank30: 9, volume: 2400, intent: 'commercial', competitors: { 'competitorA.com': 2, 'competitorB.io': 6 } },
    { term: 'ai implementation services', rank: 7, rank30: 15, volume: 1900, intent: 'commercial', competitors: { 'competitorA.com': 3, 'competitorB.io': 4 } },
    { term: 'snowflake migration partner', rank: 3, rank30: 8, volume: 640, intent: 'commercial', competitors: { 'competitorA.com': 1, 'competitorB.io': null } },
    { term: 'what is a modern data stack', rank: 5, rank30: 12, volume: 3300, intent: 'informational', competitors: { 'competitorA.com': 4, 'competitorB.io': 2 } },
  ],
  traffic: { impressions: 142000, clicks: 5480, ctr: 3.9, impressions30: 118000, clicks30: 4400 },
  authority: {
    da: 33, backlinks: 1390, referringDomains: 210,
    competitors: { 'competitorA.com': { da: 41, backlinks: 3200 }, 'competitorB.io': { da: 28, backlinks: 890 } },
  },
  coreWebVitals: { lcp: 'pass', cls: 'pass', inp: 'needs-work' },
  ai: [
    { platform: 'ChatGPT', now: 9, baseline: 2, queries: [
      { q: 'best data analytics consulting firms', cited: true },
      { q: 'who can help with snowflake migration', cited: true },
      { q: 'top AI implementation partners', cited: false, competitorCited: 'competitorA.com' },
    ] },
    { platform: 'Perplexity', now: 6, baseline: 1, queries: [
      { q: 'modern data stack consultants', cited: true },
    ] },
    { platform: 'Google AI Overview', now: 3, baseline: 0, queries: [
      { q: 'what is a modern data stack', cited: true },
    ] },
  ],
  actions: [
    { id: 'b1', type: 'draft_outreach', channel: 'outreach', title: 'Approve 4 backlink outreach emails', detail: 'To data/AI publications for guest posts.', status: 'needs_you', automatable: false, priority: 1, publishKey: 'outreach', why: 'These 4 publications link to your competitors but not you. Guest posts earn authoritative backlinks that lift the whole domain.', impact: 'Domain authority' },
    { id: 'b2', type: 'create_page', channel: 'cms', title: 'Review draft: "Snowflake Migration Guide" (2,100 words)', status: 'needs_you', automatable: false, priority: 2, publishKey: 'blog', why: 'A high-intent topic three competitors rank for and you have zero coverage on. This pillar page targets it with an original, in-depth guide.', impact: '+ ~800 est. monthly visits' },
    { id: 'b3', type: 'inject_schema', channel: 'schema', title: 'Added Article + FAQ schema to 12 posts', status: 'shipped', date: '2026-06-22', automatable: true },
    { id: 'b4', type: 'insert_internal_link', channel: 'cms', title: 'Added 90 internal links across the blog', status: 'shipped', date: '2026-06-19', automatable: true },
    { id: 'b5', type: 'update_meta', channel: 'cms', title: 'Rewrote metas on 11 high-impression, low-CTR pages', status: 'shipped', date: '2026-06-11', automatable: true },
    { id: 'b6', type: 'propose_code_change', channel: 'code-pr', title: 'Opened PR: fix INP on the resources hub', status: 'in_review', automatable: false, priority: 3 },
  ],
  drafts: [
    { id: 'e1', kind: 'page', title: 'Snowflake Migration Guide', channel: 'cms', preview: 'A step-by-step guide to migrating your warehouse to Snowflake without downtime…', words: 2100 },
    { id: 'e2', kind: 'outreach', title: 'Guest-post pitch to TDS', channel: 'outreach', preview: 'Hi — we published original benchmarks on modern data stacks and thought your readers…' },
    { id: 'e3', kind: 'brand_post', title: 'LinkedIn: "3 signs your data stack is holding you back"', channel: 'social', preview: 'Most teams don\'t realize their warehouse is the bottleneck until…' },
  ],
  insights: [
    'Your ranking for "data analytics consulting" jumped 5 spots after the new pillar page — now #4.',
    'ChatGPT started citing you for "snowflake migration" — AI citations are up 15 since Day 0.',
    '11 pages had high impressions but low CTR; rewriting their titles should recover clicks you\'re already earning impressions for.',
  ],
  waitingOnYou: [
    { id: 'v1', label: 'Approve 4 outreach emails', detail: 'For backlinks from data/AI publications.' },
    { id: 'v2', label: 'Review "Snowflake Migration Guide"', detail: '2,100-word draft ready to publish.' },
  ],
};

export const SAMPLE_CLIENTS: Record<string, ClientData> = {
  [barbershop.domain]: barbershop,
  [b2b.domain]: b2b,
};

export const SAMPLE_LIST = [barbershop, b2b];

export function getSampleClient(domain: string): ClientData {
  return SAMPLE_CLIENTS[domain] ?? barbershop;
}
