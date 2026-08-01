/**
 * Presence & reputation collector.
 *
 * Assembles the audit's `presence` section from the PresenceDataProvider:
 * business listing, reviews, citation consistency, and map-pack ranks. General,
 * not "local"-only — it runs for any client that has a footprint (a location,
 * service area, or review profiles) and returns an empty section otherwise, so
 * pure-online clients are unaffected.
 *
 * Map-pack rank checks are capped (each is a geo SERP call in production).
 */

import {
  getPresenceDataProvider,
  createLogger,
  type PresenceDataProvider,
  type ClientContext,
  type PresenceSection,
} from "@rynk/core";

const log = createLogger("layer1.presence");

export interface CollectPresenceOptions {
  provider?: PresenceDataProvider;
  /** Max map-pack rank checks (each is a SERP call in prod). Default 6. */
  maxRankChecks?: number;
}

/** Empty section for clients with no off-site footprint. */
function emptyPresence(): PresenceSection {
  return {
    tracked: false,
    listing: {
      claimed: false,
      primaryCategory: null,
      rating: null,
      reviewCount: null,
      photosCount: null,
      completeness: null,
      hasManagerAccess: false,
      insights: null,
    },
    reviews: { totalCount: 0, averageRating: null, unreplied: 0, byPlatform: [], themes: [] },
    citations: { total: 0, consistent: 0, issues: [], missing: [], duplicates: [] },
    mapPackRanks: [],
  };
}

/** service × service-area rank queries, capped. */
function buildRankQueries(ctx: ClientContext, max: number): { query: string; location: string }[] {
  const services = ctx.presence.services.map((s) => s.name);
  const areas = ctx.presence.serviceAreas.length ? ctx.presence.serviceAreas : [""];
  const terms = services.length ? services : [ctx.industry];
  const out: { query: string; location: string }[] = [];
  for (const area of areas) {
    for (const term of terms) {
      out.push({ query: area ? `${term} ${area}` : term, location: area || "US" });
      if (out.length >= max) return out;
    }
  }
  return out;
}

export async function collectPresence(
  ctx: ClientContext,
  opts: CollectPresenceOptions = {},
): Promise<PresenceSection> {
  const provider = opts.provider ?? getPresenceDataProvider();
  const p = ctx.presence;
  const tracked = p.hasPhysicalPresence || p.serviceAreas.length > 0 || p.reviewProfiles.length > 0;

  if (!tracked) {
    log.info("no presence footprint — skipping", { domain: ctx.domain });
    return emptyPresence();
  }

  log.info("collecting presence", { domain: ctx.domain, provider: provider.providerName });

  const [listing, reviews, citations] = await Promise.all([
    provider.getBusinessListing(ctx.domain),
    provider.getReviews(ctx.domain),
    provider.getCitationAudit(ctx.domain),
  ]);

  const queries = buildRankQueries(ctx, opts.maxRankChecks ?? 6);
  const mapPackRanks = await Promise.all(
    queries.map(async (q) => {
      const r = await provider.getLocalRank(q.query, { location: q.location });
      return { query: r.query, location: r.location, rank: r.rank };
    }),
  );

  return {
    tracked: true,
    listing: {
      claimed: listing.claimed,
      primaryCategory: listing.primaryCategory,
      rating: listing.rating,
      reviewCount: listing.reviewCount,
      photosCount: listing.photosCount,
      completeness: listing.completeness,
      hasManagerAccess: listing.insights !== null,
      insights: listing.insights,
    },
    reviews: {
      totalCount: reviews.totalCount,
      averageRating: reviews.averageRating,
      unreplied: reviews.unreplied,
      byPlatform: reviews.byPlatform,
      themes: reviews.recentThemes,
    },
    citations: {
      total: citations.total,
      consistent: citations.consistent,
      issues: citations.issues,
      missing: citations.missing,
      duplicates: citations.duplicates,
    },
    mapPackRanks,
  };
}
