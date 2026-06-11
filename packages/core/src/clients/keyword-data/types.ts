/**
 * KeywordDataProvider — provider-agnostic interface for keyword research data.
 *
 * Why an interface:
 *   We don't know yet which provider (SEMrush, Ahrefs, DataForSEO) we'll use
 *   in production. The decision is pending budget approval. By keeping every
 *   call site behind this interface, swapping providers is a one-line change
 *   in the factory — no agent, generator, or schema needs to know.
 *
 * Normalized return shapes:
 *   Each provider's raw response is mapped into the types below. Callers
 *   never see vendor-specific JSON. This protects against:
 *     - Switching providers later
 *     - Mixing providers (e.g. SEMrush for keywords, Moz for DA)
 *     - Caching / mocking in tests
 *
 * All methods are async + may throw on transport errors. Callers should
 * tolerate partial data — providers occasionally return null for unknown
 * keywords or low-traffic domains.
 */

/** Search intent classification for a keyword. */
export type KeywordIntent =
  | "informational"
  | "commercial"
  | "transactional"
  | "navigational"
  | "unknown";

/** Per-keyword metrics. Volume is monthly searches in the target country. */
export interface KeywordMetrics {
  keyword: string;
  /** Monthly search volume in the queried country. Null if provider has no data. */
  searchVolume: number | null;
  /** 0-100 ranking difficulty score. Higher = harder. Null if unknown. */
  difficulty: number | null;
  /** Cost per click in USD. Indicates commercial intent. Null if unknown. */
  cpc: number | null;
  /** Inferred intent. "unknown" if provider can't classify. */
  intent: KeywordIntent;
  /** ISO-3166 country code the metrics apply to. Default "US". */
  country: string;
}

/** Authority and link-graph data for a domain. */
export interface DomainAuthority {
  domain: string;
  /** 0-100 normalized authority score (Moz DA, Ahrefs DR, SEMrush AS — same scale). */
  score: number | null;
  /** Total backlinks pointing at the domain. */
  backlinks: number | null;
  /** Unique referring domains. */
  referringDomains: number | null;
  /** Which provider produced this score — useful for cross-checks. */
  provider: string;
}

/** Optional country filter for keyword queries. Default = US. */
export interface KeywordQueryOptions {
  country?: string;
}

/** Optional limit for related-keyword queries. Default = 50. */
export interface RelatedKeywordOptions {
  country?: string;
  limit?: number;
}

/**
 * Provider-agnostic interface for keyword research + authority data.
 *
 * Implementations:
 *   - MockKeywordDataProvider (this repo, for dev)
 *   - SemrushKeywordDataProvider (TODO when API access confirmed)
 *   - AhrefsKeywordDataProvider (TODO if we pick Ahrefs)
 *   - DataForSEOKeywordDataProvider (TODO — cheapest fallback)
 */
export interface KeywordDataProvider {
  /** Name of the provider (for logging + manifest provenance). */
  readonly providerName: string;

  /** Single keyword lookup. Prefer the bulk variant when fetching many. */
  getKeywordMetrics(
    keyword: string,
    opts?: KeywordQueryOptions,
  ): Promise<KeywordMetrics>;

  /** Bulk lookup — providers usually have a cheaper bulk endpoint. */
  getKeywordMetricsBulk(
    keywords: string[],
    opts?: KeywordQueryOptions,
  ): Promise<KeywordMetrics[]>;

  /** Domain authority for a single domain. */
  getDomainAuthority(domain: string): Promise<DomainAuthority>;

  /** Bulk authority lookup — for client + all competitors at once. */
  getDomainAuthorityBulk(domains: string[]): Promise<DomainAuthority[]>;

  /**
   * Discover related keywords for a seed term.
   * Used by new-site mode and strategy expansion. Returns the keywords ordered
   * by relevance (provider-defined). Caller can re-rank by volume/difficulty
   * via a follow-up getKeywordMetricsBulk call.
   */
  getRelatedKeywords(
    seed: string,
    opts?: RelatedKeywordOptions,
  ): Promise<string[]>;
}
