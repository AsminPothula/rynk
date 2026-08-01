/**
 * PresenceDataProvider — a business's off-site presence + reputation.
 *
 * Where KeywordDataProvider is market-wide and OwnedDomainDataProvider is the
 * client's own site (GSC/GA), this interface covers everything OFF the site
 * that drives visibility: the business listing (Google-Business-Profile style),
 * reviews across platforms, directory citations / NAP consistency, and map-pack
 * rank for a query.
 *
 * Deliberately NOT named "local" — every client with a location, listing, or
 * reputation benefits from this; it just returns empty/nulls for a pure-online
 * business. Any client can be enriched with as much of it as exists.
 *
 * Access model:
 *   - Public data (rating, review count, category, map-pack rank, citation
 *     presence) is obtainable by scraping / SERP APIs — no client credentials.
 *   - Business insights (profile views, calls, direction requests, bookings)
 *     require the client to grant listing-manager access → `insights` is null
 *     until then.
 *
 * Production backends: Google Business Profile API + Places, a citation service
 * (BrightLocal / Yext / DataForSEO-local), and a geo SERP source (SerpApi /
 * DataForSEO). The mock returns deterministic fake data for all of them.
 */

/** A business listing (Google Business Profile shape). */
export interface BusinessListing {
  claimed: boolean;
  name: string;
  primaryCategory: string | null;
  rating: number | null;
  reviewCount: number | null;
  photosCount: number | null;
  hours: Array<{ day: string; open: string; close: string }>;
  /** 0-100 completeness estimate of the profile. */
  completeness: number | null;
  /** Requires listing-manager access — null when unauthorized. */
  insights: BusinessInsights | null;
  provider: string;
}

/** Conversion-side listing metrics — the "did I get customers" numbers. */
export interface BusinessInsights {
  profileViews: number;
  calls: number;
  directionRequests: number;
  websiteClicks: number;
  bookings: number;
}

/** Reviews across platforms. */
export interface ReviewsSummary {
  totalCount: number;
  averageRating: number | null;
  /** Reviews the business hasn't responded to. */
  unreplied: number;
  byPlatform: Array<{ platform: string; count: number; average: number | null }>;
  /** Recurring themes surfaced from review text ("wait time", "friendly"). */
  recentThemes: string[];
  provider: string;
}

/** Directory citations / NAP consistency. */
export interface CitationAudit {
  total: number;
  consistent: number;
  issues: Array<{ directory: string; problem: string }>;
  /** Directories with no listing at all. */
  missing: string[];
  /** Duplicate listings that should be merged/removed. */
  duplicates: string[];
  provider: string;
}

/** Map-pack rank for a query at a location. */
export interface LocalRank {
  query: string;
  location: string;
  /** 1-3 = in the local pack; higher = organic-only; null = not ranking. */
  rank: number | null;
  provider: string;
}

export interface PresenceQueryOptions {
  /** Location to evaluate the query from (city / lat,lng). */
  location?: string;
}

/**
 * Provider-agnostic presence + reputation interface. The mock returns
 * deterministic fake data; production composes GBP + a citation service + a geo
 * SERP source behind this same interface.
 */
export interface PresenceDataProvider {
  readonly providerName: string;

  /** Whether the provider has listing-manager access for insights + edits. */
  isAuthorized(domain: string): Promise<boolean>;

  /** The business listing (public fields always; insights only if authorized). */
  getBusinessListing(domain: string): Promise<BusinessListing>;

  /** Reviews summary across platforms. */
  getReviews(domain: string): Promise<ReviewsSummary>;

  /** Directory citation / NAP consistency audit. */
  getCitationAudit(domain: string): Promise<CitationAudit>;

  /** Map-pack rank for a single query (optionally at a location). */
  getLocalRank(query: string, opts?: PresenceQueryOptions): Promise<LocalRank>;
}
