/**
 * MockPresenceDataProvider — deterministic fake presence + reputation data.
 *
 * Values are derived from a hash of the domain so a given domain always returns
 * the same numbers (stable across runs, varied across clients). Lets the audit
 * + dashboard be built and tested with no paid APIs and no client credentials.
 */

import type {
  PresenceDataProvider,
  BusinessListing,
  ReviewsSummary,
  CitationAudit,
  LocalRank,
  PresenceQueryOptions,
} from "./types.js";

/** Small deterministic hash → [0, 1). */
function seed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

function pick(s: string, min: number, max: number): number {
  return Math.round(min + seed(s) * (max - min));
}

export class MockPresenceDataProvider implements PresenceDataProvider {
  readonly providerName = "mock";

  async isAuthorized(_domain: string): Promise<boolean> {
    // Mock: pretend the client has NOT granted manager access yet, so insights
    // come back null — matching the real "connect your profile" first-run state.
    return false;
  }

  async getBusinessListing(domain: string): Promise<BusinessListing> {
    const authorized = await this.isAuthorized(domain);
    return {
      claimed: true,
      name: domain.replace(/\..*/, ""),
      primaryCategory: "Barber shop",
      rating: 4 + Math.round(seed(domain + "r") * 10) / 10,
      reviewCount: pick(domain + "rc", 20, 180),
      photosCount: pick(domain + "ph", 5, 60),
      hours: [
        { day: "Mon", open: "09:00", close: "19:00" },
        { day: "Sat", open: "09:00", close: "18:00" },
      ],
      completeness: pick(domain + "cp", 70, 98),
      insights: authorized
        ? {
            profileViews: pick(domain + "pv", 800, 6000),
            calls: pick(domain + "cl", 20, 180),
            directionRequests: pick(domain + "dr", 30, 300),
            websiteClicks: pick(domain + "wc", 40, 400),
            bookings: pick(domain + "bk", 10, 120),
          }
        : null,
      provider: this.providerName,
    };
  }

  async getReviews(domain: string): Promise<ReviewsSummary> {
    const google = pick(domain + "g", 20, 150);
    const yelp = pick(domain + "y", 3, 40);
    return {
      totalCount: google + yelp,
      averageRating: 4 + Math.round(seed(domain + "ar") * 9) / 10,
      unreplied: pick(domain + "un", 0, 8),
      byPlatform: [
        { platform: "Google", count: google, average: 4.6 },
        { platform: "Yelp", count: yelp, average: 4.2 },
      ],
      recentThemes: ["friendly staff", "clean shop", "wait time"],
      provider: this.providerName,
    };
  }

  async getCitationAudit(domain: string): Promise<CitationAudit> {
    const total = pick(domain + "ct", 20, 40);
    const consistent = total - pick(domain + "ci", 2, 6);
    return {
      total,
      consistent,
      issues: [
        { directory: "Yelp", problem: "phone number mismatch" },
        { directory: "Apple Maps", problem: "old address" },
        { directory: "Foursquare", problem: "missing hours" },
      ],
      missing: ["Bing Places", "Nextdoor"],
      duplicates: [],
      provider: this.providerName,
    };
  }

  async getLocalRank(query: string, opts: PresenceQueryOptions = {}): Promise<LocalRank> {
    const location = opts.location ?? "US";
    return {
      query,
      location,
      rank: pick(query + location, 1, 8),
      provider: this.providerName,
    };
  }
}
