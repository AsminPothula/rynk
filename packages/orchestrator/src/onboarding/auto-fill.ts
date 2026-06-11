/**
 * Auto-fill gaps in the ClientContext using programmatic sources before
 * bothering the human.
 *
 * Sits between the completeness assessor and the questionnaire:
 *
 *   AI extraction
 *        ↓
 *   assessCompleteness  →  report (gaps tagged with fillStrategy)
 *        ↓
 *   autoFillGaps        ←  THIS FILE
 *        ↓
 *   questionnaire (asks for whatever auto-fill couldn't resolve)
 *
 * Strategy by gap type:
 *   - auto-keyword-research:  use KeywordDataProvider.getRelatedKeywords +
 *                             getKeywordMetricsBulk to expand seedKeywords
 *                             and re-rank by volume × inverse difficulty.
 *   - auto-serp-research:     NOT IMPLEMENTED YET (e.g. competitor inference
 *                             from SERP). Falls through to the questionnaire.
 *
 * Returns the (potentially) enriched ClientContext + a list of which fields
 * we successfully filled + the gaps still needing human input.
 */

import {
  getKeywordDataProvider,
  createLogger,
  type ClientContext,
  type KeywordDataProvider,
} from "@rynk/core";
import type { CompletenessReport, FieldGap } from "./completeness.js";

const log = createLogger("onboarding.autoFill");

export interface AutoFillOptions {
  ctx: ClientContext;
  report: CompletenessReport;
  /** Provider override — test injection point. Defaults to factory. */
  provider?: KeywordDataProvider;
  /** Target size for an expanded seedKeywords list. Default 10. */
  targetSeedKeywordCount?: number;
}

export interface AutoFillResult {
  /** New ClientContext with successfully-filled fields updated. */
  enrichedCtx: ClientContext;
  /** Fields we successfully filled — for logging + UX messaging. */
  filledFields: string[];
  /** Gaps still needing the human (passed to the questionnaire). */
  remainingGaps: FieldGap[];
}

// ── seedKeywords expansion ────────────────────────────────────────────────────

/**
 * Pick the best seeds to expand from. Prefer:
 *   1. Existing seedKeywords (whatever onboarding already found)
 *   2. Falling back to industry + verticals if seedKeywords is empty
 *
 * We need at least one seed term to ask the provider for related keywords.
 */
function pickExpansionSeeds(ctx: ClientContext): string[] {
  if (ctx.seedKeywords.length > 0) return ctx.seedKeywords;
  const fallback: string[] = [];
  if (ctx.industry) fallback.push(ctx.industry);
  for (const v of ctx.verticals) fallback.push(v);
  return fallback.filter((s) => s.trim().length > 0);
}

/**
 * Expand a sparse seedKeywords list using KeywordDataProvider.getRelatedKeywords.
 * Filters out duplicates + low-volume terms + terms with very high difficulty.
 * Returns the EXPANDED list including the originals.
 */
async function expandSeedKeywords(
  ctx: ClientContext,
  provider: KeywordDataProvider,
  targetCount: number,
): Promise<string[]> {
  const seeds = pickExpansionSeeds(ctx);
  if (seeds.length === 0) {
    log.warn("no seeds available — cannot auto-expand seedKeywords");
    return ctx.seedKeywords;
  }

  // Pull related candidates from up to 3 seeds to keep API costs predictable.
  const seedSample = seeds.slice(0, 3);
  const relatedLists = await Promise.all(
    seedSample.map((seed) =>
      provider.getRelatedKeywords(seed, { limit: 30 }).catch((err) => {
        log.warn("getRelatedKeywords failed for seed", { seed, error: (err as Error).message });
        return [] as string[];
      }),
    ),
  );

  // Merge + dedupe, case-insensitive, preserving original ordering preference.
  const seen = new Set(ctx.seedKeywords.map((k) => k.toLowerCase()));
  const candidates: string[] = [];
  for (const list of relatedLists) {
    for (const kw of list) {
      const norm = kw.trim().toLowerCase();
      if (!norm || seen.has(norm)) continue;
      seen.add(norm);
      candidates.push(kw.trim());
    }
  }

  if (candidates.length === 0) {
    log.info("no new candidates returned from provider");
    return ctx.seedKeywords;
  }

  // Rank candidates by realistic "value" = (volume) / (difficulty + 1)
  // Drop entries with no volume data (provider returned null) only if we have
  // plenty of others. Otherwise keep them — better some data than none.
  const metricsList = await provider
    .getKeywordMetricsBulk(candidates, { country: "US" })
    .catch((err) => {
      log.warn("getKeywordMetricsBulk failed during expansion", { error: (err as Error).message });
      return [];
    });

  type Ranked = { keyword: string; volume: number; difficulty: number; score: number };
  const ranked: Ranked[] = metricsList
    .map((m) => {
      const volume = m.searchVolume ?? 0;
      const difficulty = m.difficulty ?? 50;
      const score = volume / (difficulty + 1);
      return { keyword: m.keyword, volume, difficulty, score };
    })
    .sort((a, b) => b.score - a.score);

  const slotsToFill = Math.max(0, targetCount - ctx.seedKeywords.length);
  const additions = ranked.slice(0, slotsToFill).map((r) => r.keyword);

  log.info("expanded seedKeywords", {
    existing: ctx.seedKeywords.length,
    added: additions.length,
    target: targetCount,
  });

  return [...ctx.seedKeywords, ...additions];
}

// ── Main orchestration ───────────────────────────────────────────────────────

/**
 * Walk the gaps, try to fill auto-fillable ones, return what's left for the
 * questionnaire. Each strategy is its own helper for testability.
 */
export async function autoFillGaps(opts: AutoFillOptions): Promise<AutoFillResult> {
  const provider = opts.provider ?? getKeywordDataProvider();
  const target = opts.targetSeedKeywordCount ?? 10;

  let ctx = opts.ctx;
  const filled: string[] = [];

  // Apply each auto-fillable strategy. Only modify ctx if the strategy
  // actually produced more data than before.
  for (const gap of opts.report.autoFillable) {
    switch (gap.fillStrategy) {
      case "auto-keyword-research": {
        if (gap.field === "seedKeywords") {
          const expanded = await expandSeedKeywords(ctx, provider, target);
          if (expanded.length > ctx.seedKeywords.length) {
            ctx = { ...ctx, seedKeywords: expanded };
            filled.push("seedKeywords");
          }
        }
        break;
      }
      case "auto-serp-research": {
        // NOT IMPLEMENTED yet. Falls through to questionnaire.
        // Future: infer competitors from top-ranking SERP domains for client's
        // seedKeywords. Will need access to a SerpApiClient and a domain
        // filter (drop wikipedia/reddit/youtube/etc).
        log.debug("auto-serp-research not implemented — leaving gap for questionnaire", { field: gap.field });
        break;
      }
      default:
        break;
    }
  }

  // Anything not in `filled` is still a gap. Plus everything that was
  // human-required from the start.
  const remainingGaps = opts.report.gaps.filter((g) => !filled.includes(g.field));

  return { enrichedCtx: ctx, filledFields: filled, remainingGaps };
}
