/**
 * OwnedDomainDataProvider — ground-truth data for a domain WE control.
 *
 * Where KeywordDataProvider gives market-wide data (volume, difficulty for any
 * keyword), this interface gives the actual numbers Google sees for the
 * client's own domain:
 *   - Impressions, clicks, CTR per query (from Google Search Console)
 *   - Traffic, conversions, sessions (from Google Analytics)
 *   - Indexed URLs, coverage issues, backlinks
 *
 * Two providers usually back this in production:
 *   - Google Search Console for search-side data
 *   - Google Analytics for engagement-side data
 *
 * For development we use a single MockOwnedDomainDataProvider that returns
 * realistic fake data. In production we'll split into GSCClient and GAClient
 * behind the same interface, or compose them.
 *
 * Access requirement: client must grant OAuth access for their own domain.
 * The provider implementation is responsible for storing + refreshing tokens.
 */

/** Range of dates in ISO format. */
export interface DateRange {
  /** ISO date "YYYY-MM-DD". */
  start: string;
  /** ISO date "YYYY-MM-DD". */
  end: string;
}

/** Per-query data from Google Search Console. */
export interface SearchQueryMetrics {
  query: string;
  impressions: number;
  clicks: number;
  /** Click-through rate as a decimal (0.05 = 5%). */
  ctr: number;
  /** Average position in SERPs over the date range. */
  averagePosition: number;
}

/** Per-page data from GSC. */
export interface SearchPageMetrics {
  page: string;
  impressions: number;
  clicks: number;
  ctr: number;
  averagePosition: number;
}

/** Coverage info — how many URLs are indexed vs blocked vs erroring. */
export interface IndexCoverage {
  indexed: number;
  notIndexed: number;
  errors: number;
  warnings: number;
  /** Specific URLs flagged with issues, capped to 100 in typical responses. */
  flaggedUrls: Array<{ url: string; issue: string }>;
}

/** Engagement metrics from Google Analytics. */
export interface EngagementMetrics {
  /** Total sessions in the date range. */
  sessions: number;
  /** Total users (de-duplicated). */
  users: number;
  /** Average session duration in seconds. */
  avgSessionDurationSec: number;
  /** Bounce rate as decimal. */
  bounceRate: number;
  /** Top landing pages by sessions. */
  topLandingPages: Array<{ page: string; sessions: number }>;
}

/** Per-conversion-event data. */
export interface ConversionMetrics {
  eventName: string;
  count: number;
  /** USD value, where applicable. */
  value: number | null;
}

/**
 * Provider-agnostic interface. Real implementations will compose GSC + GA;
 * the mock returns deterministic fake data for all methods.
 */
export interface OwnedDomainDataProvider {
  readonly providerName: string;

  /** Whether the provider currently has valid credentials for this domain. */
  isAuthorized(domain: string): Promise<boolean>;

  /** Top search queries the domain appears for, ordered by impressions. */
  getTopQueries(
    domain: string,
    range: DateRange,
    limit?: number,
  ): Promise<SearchQueryMetrics[]>;

  /** Top pages by impressions, ordered desc. */
  getTopPages(
    domain: string,
    range: DateRange,
    limit?: number,
  ): Promise<SearchPageMetrics[]>;

  /** Index coverage summary + flagged URLs. */
  getIndexCoverage(domain: string): Promise<IndexCoverage>;

  /** Engagement metrics across the date range. */
  getEngagement(domain: string, range: DateRange): Promise<EngagementMetrics>;

  /** Conversion events tracked in GA, ordered by count desc. */
  getConversions(
    domain: string,
    range: DateRange,
    limit?: number,
  ): Promise<ConversionMetrics[]>;
}
