/**
 * Pre-compute keyword metrics + domain authority before synthesis.
 *
 * Mirrors the pattern in crawl-precompute.ts: do the deterministic data work
 * in code (calls to KeywordDataProvider), produce a structured object, then
 * splice it into the synthesiser's output before Zod validation.
 *
 * Why before synthesis:
 *   - The synthesiser doesn't need to know volume/difficulty/DA — it does
 *     analytical reasoning over what's already in the audit.
 *   - Doing it in code = predictable, reproducible, no token cost.
 *   - The provider is mocked today; swapping in SEMrush/Ahrefs/DataForSEO
 *     later requires zero changes here.
 */

import {
  getKeywordDataProvider,
  type KeywordDataProvider,
  type KeywordMetricsEnrichment,
  type AuthoritySection,
  type ClientContext,
} from "@rynk/core";
import { createLogger } from "@rynk/core";

const log = createLogger("layer1.keywordEnrichment");

export interface KeywordEnrichment {
  /**
   * Lookup map from keyword string → metrics. Synthesiser injects these into
   * each SerpKeywordData entry whose `.keyword` matches.
   */
  metricsByKeyword: Map<string, KeywordMetricsEnrichment>;
  /** Top-level authority section spliced onto the audit object. */
  authority: AuthoritySection;
}

export interface EnrichOptions {
  /** Client context — gives competitors list. */
  client: ClientContext;
  /**
   * Keywords to enrich. Typically the client's seedKeywords; callers may
   * extend with additional keywords (e.g. discovered in the audit).
   */
  keywords: string[];
  /** Country code for keyword metrics. Default = "US". */
  country?: string;
  /** Provider override — pass a mock or alternate provider in tests. */
  provider?: KeywordDataProvider;
}

/**
 * Build a KeywordEnrichment object for the given client + keywords.
 *
 * - Calls getKeywordMetricsBulk() once for every keyword (deduplicated)
 * - Calls getDomainAuthorityBulk() for client.domain + every competitor
 * - Returns a structured object the synthesiser can splice in
 *
 * Failures from the provider don't throw — they degrade to null fields so
 * the audit can still be produced.
 */
export async function enrichKeywordsAndAuthority(
  opts: EnrichOptions,
): Promise<KeywordEnrichment> {
  const provider = opts.provider ?? getKeywordDataProvider();
  const country = opts.country ?? "US";

  // ── Deduplicate keywords (case-insensitive) ──────────────────────────────
  const dedupedKeywords = Array.from(
    new Map(opts.keywords.map((k) => [k.trim().toLowerCase(), k.trim()])).values(),
  ).filter((k) => k.length > 0);

  log.info("enriching keywords", {
    provider: provider.providerName,
    keywordCount: dedupedKeywords.length,
    competitorCount: opts.client.competitors.length,
  });

  // ── Fetch keyword metrics in bulk ────────────────────────────────────────
  let metrics: Awaited<ReturnType<typeof provider.getKeywordMetricsBulk>> = [];
  try {
    metrics = await provider.getKeywordMetricsBulk(dedupedKeywords, { country });
  } catch (err) {
    log.warn("keyword metrics bulk failed — falling back to empty", {
      error: (err as Error).message,
    });
  }

  const metricsByKeyword = new Map<string, KeywordMetricsEnrichment>();
  for (const m of metrics) {
    metricsByKeyword.set(m.keyword.trim().toLowerCase(), {
      searchVolume: m.searchVolume,
      difficulty: m.difficulty,
      cpc: m.cpc,
      intent: m.intent,
      country: m.country,
    });
  }

  // ── Fetch domain authority for client + competitors ──────────────────────
  const domains = [opts.client.domain, ...opts.client.competitors];
  let authorities: Awaited<ReturnType<typeof provider.getDomainAuthorityBulk>> = [];
  try {
    authorities = await provider.getDomainAuthorityBulk(domains);
  } catch (err) {
    log.warn("authority bulk failed — falling back to nulls", {
      error: (err as Error).message,
    });
  }

  const authorityByDomain = new Map(authorities.map((a) => [a.domain, a]));
  const clientAuth = authorityByDomain.get(opts.client.domain.toLowerCase()) ?? {
    domain: opts.client.domain,
    score: null,
    backlinks: null,
    referringDomains: null,
    provider: provider.providerName,
  };

  const competitorAuth: Record<string, ReturnType<typeof Object>> = {};
  for (const competitor of opts.client.competitors) {
    const record = authorityByDomain.get(competitor.toLowerCase()) ?? {
      domain: competitor,
      score: null,
      backlinks: null,
      referringDomains: null,
      provider: provider.providerName,
    };
    competitorAuth[competitor] = record;
  }

  const authority: AuthoritySection = {
    client: clientAuth,
    competitors: competitorAuth as AuthoritySection["competitors"],
  };

  log.info("enrichment complete", {
    keywordsEnriched: metricsByKeyword.size,
    clientDA: clientAuth.score,
    competitorsEnriched: Object.keys(competitorAuth).length,
  });

  return { metricsByKeyword, authority };
}
