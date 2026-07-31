import { z } from "zod";

// The SERP results page for one keyword at a single point in time.
export const SerpSnapshotSchema = z.object({
  domain: z.string(), // client domain
  keyword: z.string(),
  takenAt: z.string().datetime(),
  results: z.array(
    z.object({
      position: z.number().int().positive(),
      url: z.string().url(),
      title: z.string(),
      description: z.string().nullable(),
      domain: z.string(),
    }),
  ),
});

// The client's own rank for a keyword on a given engine.
export const RankSnapshotSchema = z.object({
  domain: z.string(),
  keyword: z.string(),
  takenAt: z.string().datetime(),
  rank: z.number().int().positive().nullable(),
  ai_engine: z.enum(["google", "chatgpt", "perplexity"]),
});

// Google Search Console data — taken weekly.
export const GscSnapshotSchema = z.object({
  domain: z.string(),
  weekStarting: z.string(),
  impressions: z.number().int().nonnegative(),
  clicks: z.number().int().nonnegative(),
  avgPosition: z.number().nullable(),
  topQueries: z.array(
    z.object({
      query: z.string(),
      impressions: z.number().int().nonnegative(),
      clicks: z.number().int().nonnegative(),
      position: z.number().nullable(),
    }),
  ),
});

// Google Analytics data — taken weekly.
export const GaSnapshotSchema = z.object({
  domain: z.string(),
  weekStarting: z.string(),
  sessions: z.number().int().nonnegative(),
  conversions: z.number().int().nonnegative(),
  topPages: z.array(
    z.object({
      url: z.string().url(),
      sessions: z.number().int().nonnegative(),
      conversions: z.number().int().nonnegative(),
    }),
  ),
});

// Domain Authority score (0-100).
export const DaSnapshotSchema = z.object({
  domain: z.string(),
  takenAt: z.string().datetime(),
  da: z.number().min(0).max(100).nullable(),
  source: z.enum(["moz", "ahrefs"]),
});

// Backlink totals + which referring URLs changed since the last check.
export const BacklinkSnapshotSchema = z.object({
  domain: z.string(),
  takenAt: z.string().datetime(),
  totalBacklinks: z.number().int().nonnegative(),
  referringDomains: z.number().int().nonnegative(),
  newSinceLast: z.array(
    z.object({
      url: z.string().url(),
      referringDomain: z.string(),
      firstSeen: z.string(),
    }),
  ),
  lostSinceLast: z.array(
    z.object({
      url: z.string().url(),
      referringDomain: z.string(),
      lastSeen: z.string(),
    }),
  ),
});

// The delta between two SERP snapshots for one keyword.
export const SerpDeltaSchema = z.object({
  keyword: z.string(),
  from: z.string().datetime(),
  to: z.string().datetime(),
  newInTop10: z.array(
    z.object({
      url: z.string().url(),
      position: z.number().int().positive(),
    }),
  ),
  droppedFromTop10: z.array(
    z.object({
      url: z.string().url(),
      lastPosition: z.number().int().positive(),
    }),
  ),
  positionChanges: z.array(
    z.object({
      url: z.string().url(),
      from: z.number().int().positive(),
      to: z.number().int().positive(),
    }),
  ),
  // The client's own position change (only meaningful if in top 100 both times).
  domainPositionChange: z.number().nullable(),
  triggerRestrategy: z.boolean(),
  triggerReason: z.string().nullable(),
});

// Weekly summary — for email / the dashboard.
export const WeeklyDigestSchema = z.object({
  domain: z.string(),
  weekStarting: z.string(),
  weekEnding: z.string(),
  keywordCount: z.number().int().nonnegative(),
  rankGains: z.number().int().nonnegative(),
  rankLosses: z.number().int().nonnegative(),
  newCompetitors: z.number().int().nonnegative(),
  gscTrend: z.enum(["up", "down", "flat"]),
  gaTrend: z.enum(["up", "down", "flat"]),
  daChange: z.number().nullable(),
  backlinkChange: z.number().int(),
  actionsRecommended: z.array(
    z.object({
      keyword: z.string(),
      reason: z.string(),
    }),
  ),
});

// Types inferred from the schemas — single source of truth.
export type SerpSnapshot = z.infer<typeof SerpSnapshotSchema>;
export type RankSnapshot = z.infer<typeof RankSnapshotSchema>;
export type GscSnapshot = z.infer<typeof GscSnapshotSchema>;
export type GaSnapshot = z.infer<typeof GaSnapshotSchema>;
export type DaSnapshot = z.infer<typeof DaSnapshotSchema>;
export type BacklinkSnapshot = z.infer<typeof BacklinkSnapshotSchema>;
export type SerpDelta = z.infer<typeof SerpDeltaSchema>;
export type WeeklyDigest = z.infer<typeof WeeklyDigestSchema>;
