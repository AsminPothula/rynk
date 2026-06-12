/**
 * Meta description + title generator.
 *
 * Walks the audit findings looking for:
 *   - Pages with missing meta descriptions
 *   - Pages with duplicate meta descriptions
 *   - Pages flagged in strategy.contentInventory with recommendedAction
 *     "update" or "expand"
 *
 * For each, produces an `update_meta` ExecutionAction. The action carries a
 * draft title + meta description string. For now we use deterministic
 * heuristic-based copy (page title from existing H1 or URL slug; meta from
 * a templated value-prop + keyword fragment). Future versions can swap in
 * an LLM-based generator behind the same generator function — no manifest
 * shape changes needed.
 *
 * Pure transformation, no I/O. Easy to test with a fixture audit + strategy.
 */

import type {
  AuditFindings,
  ClientContext,
  StrategyOutput,
} from "@rynk/core";
import type {
  ExecutionAction,
  UpdateMetaAction,
} from "../schema/execution-manifest.js";

export interface MetaGeneratorOptions {
  audit: AuditFindings;
  strategy: StrategyOutput;
  client: ClientContext;
  /** Action ID prefix — caller passes "meta" so IDs are namespaced. */
  idPrefix?: string;
}

const MAX_TITLE_CHARS = 60;
const MAX_META_CHARS = 158;

// ─── Heuristic copywriting ───────────────────────────────────────────────────

/**
 * Generate a title-cased page name from a URL slug. Fallback when the
 * existing title is missing or duplicated.
 */
function titleFromUrl(url: string): string {
  try {
    const path = new URL(url).pathname;
    const segs = path.split("/").filter(Boolean);
    const last = segs[segs.length - 1] ?? "Home";
    return last
      .replace(/[-_]/g, " ")
      .replace(/\.html?$/i, "")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();
  } catch {
    return "Untitled";
  }
}

/**
 * Pick the best target keyword for a URL by checking content briefs and
 * topic clusters. Falls back to the page title if no match.
 */
function pickKeywordForUrl(url: string, strategy: StrategyOutput): string | null {
  // 1. Match by competitorUrlsToOutperform — a brief that mentions this URL
  for (const brief of strategy.contentBriefs) {
    if (brief.competitorUrlsToOutperform.some((c) => c.url === url)) {
      return brief.targetKeyword;
    }
  }
  // 2. Match by content inventory action URL
  const inventoryItem = strategy.contentInventory.find((i) => i.url === url);
  if (inventoryItem) {
    // Try to pull a keyword from the parent cluster the URL might belong to.
    const cluster = strategy.topicClusterMap.find((c) =>
      c.competitorUrls.includes(url),
    );
    if (cluster) return cluster.pillarKeyword;
  }
  return null;
}

function buildTitle(opts: {
  url: string;
  existingTitle: string | null;
  keyword: string | null;
  brand: string;
}): string {
  const base = opts.existingTitle?.trim() || opts.keyword || titleFromUrl(opts.url);
  const full = opts.brand ? `${base} | ${opts.brand}` : base;
  return full.length > MAX_TITLE_CHARS ? full.slice(0, MAX_TITLE_CHARS - 1).trim() + "…" : full;
}

function buildMetaDescription(opts: {
  url: string;
  keyword: string | null;
  industry: string;
  legalEntity: string;
}): string {
  // Heuristic templated description. LLM-driven version will replace this
  // behind the same function signature.
  const keyword = opts.keyword ?? "expert services";
  const brand = opts.legalEntity || "our team";
  const industry = opts.industry || "your industry";
  const candidate = `${brand} delivers ${keyword} for ${industry}. Discover how we help teams cut cost, scale fast, and stay compliant. Talk to us today.`;
  return candidate.length > MAX_META_CHARS ? candidate.slice(0, MAX_META_CHARS - 1).trim() + "…" : candidate;
}

// ─── Action construction ─────────────────────────────────────────────────────

interface MetaTargetReason {
  url: string;
  reason: string;
  sourceId: string;
  source: "audit-issue" | "content-brief" | "cluster";
}

/**
 * Walk audit + strategy and produce the prioritized list of URLs whose meta
 * needs to be rewritten. De-duped by URL — if the same URL surfaces via
 * multiple paths, the highest-priority source wins.
 */
function collectMetaTargets(opts: MetaGeneratorOptions): MetaTargetReason[] {
  const seen = new Map<string, MetaTargetReason>();

  // 1. Pages with missing meta descriptions
  for (const entry of opts.audit.technicalCrawl.missingMetas) {
    if (!entry.url) continue;
    seen.set(entry.url, {
      url: entry.url,
      reason: "Missing meta description",
      sourceId: "missingMetas",
      source: "audit-issue",
    });
  }

  // 2. Pages with duplicate meta descriptions — rewrite each URL in the group
  for (const dupe of opts.audit.technicalCrawl.duplicateMetas) {
    for (const url of dupe.urls) {
      if (seen.has(url)) continue;
      seen.set(url, {
        url,
        reason: `Duplicate meta description shared by ${dupe.urls.length} URLs`,
        sourceId: "duplicateMetas",
        source: "audit-issue",
      });
    }
  }

  // 3. Pages with "update" / "expand" inventory actions — meta refresh is part of those
  for (const item of opts.strategy.contentInventory) {
    if (item.recommendedAction !== "update" && item.recommendedAction !== "expand") continue;
    if (seen.has(item.url)) continue;
    seen.set(item.url, {
      url: item.url,
      reason: `Strategy flagged for ${item.recommendedAction}: ${item.reason.slice(0, 80)}`,
      sourceId: `inventory-${item.url}`,
      source: "content-brief",
    });
  }

  return Array.from(seen.values());
}

/**
 * Build update_meta actions for every URL flagged by collectMetaTargets.
 */
export function generateMetaActions(opts: MetaGeneratorOptions): ExecutionAction[] {
  const prefix = opts.idPrefix ?? "meta";
  const brand = opts.client.legalEntity || opts.audit.entitySummary.legalEntityName;
  const industry = opts.client.industry;

  const targets = collectMetaTargets(opts);
  const actions: UpdateMetaAction[] = [];

  for (let i = 0; i < targets.length; i++) {
    const t = targets[i]!;
    // Find existing title from the sitemap inventory (if present).
    const sitemapEntry = opts.audit.technicalCrawl.sitemapUrls.find((s) => s.url === t.url);
    const existingTitle = sitemapEntry?.title ?? null;
    const keyword = pickKeywordForUrl(t.url, opts.strategy);

    actions.push({
      id: `${prefix}-${String(i + 1).padStart(3, "0")}`,
      type: "update_meta",
      status: "pending",
      risk: "low",
      channel: "cms",
      automatable: true,
      provenance: {
        source: t.source,
        sourceId: t.sourceId,
        reason: t.reason,
      },
      notes: keyword
        ? `Heuristic copy. Target keyword: "${keyword}". Replace with LLM-generated copy in v2.`
        : "Heuristic copy. No target keyword inferred — uses brand + industry fallback.",
      target: { url: t.url },
      payload: {
        title: buildTitle({ url: t.url, existingTitle, keyword, brand }),
        metaDescription: buildMetaDescription({
          url: t.url,
          keyword,
          industry,
          legalEntity: brand,
        }),
        canonical: null,
        metaRobots: null,
      },
    });
  }

  return actions;
}
