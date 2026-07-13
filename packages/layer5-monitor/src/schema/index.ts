import { z } from "zod";


//stores the results page for one keyword at a time
export const SerpSnapshotSchema = z.object({
  domain: z.string(), //client domain
  keyword: z.string(),
  takenAt: z.string().datetime(),
  results: z.array(
    z.object({ //SERP page result array
      position: z.number().int().positive(),
      url: z.string().url(),
      title: z.string(),
      description: z.string().nullable(),
      domain: z.string(), 
    }),
  ),
});

//stores the website rank for keyword
export const RankSnapshotSchema = z.object({
  // domain: z.string(), //where client's domain ranks -- is domain necessary here either?
  keyword: z.string(),
  takenAt: z.string().datetime(),
  rank: z.number().int().positive().nullable(),
  ai_engine: z.enum(["google", "chatgpt", "perplexity"]),
});

//google search console data - this is taken weekly

export const GscSnapshotSchema = z.object({
  domain: z.string(),
  weekStarting: z.string(),
  impressions: z.number().int().nonnegative(),
  clicks: z.number().int().nonnegative(),
  avgPosition: z.number().nullable(),
  topQueries: z.array( //which queries led to impressions
    z.object({
      query: z.string(),
      impressions: z.number().int().nonnegative(),
      clicks: z.number().int().nonnegative(),
      position: z.number().nullable(),
    }),
  ),
});

//google analytics data 
export const GaSnapshotSchema = z.object({
  domain: z.string(),
  weekStarting: z.string(), //also weekly data
  sessions: z.number().int().nonnegative(),
  conversions: z.number().int().nonnegative(),
  topPages: z.array( //which pages perform the best
    z.object({
      url: z.string().url(),
      sessions: z.number().int().nonnegative(),
      conversions: z.number().int().nonnegative(),
    }),
  ),
});

//stores domain authority
export const DaSnapshotSchema = z.object({
  domain: z.string(),
  takenAt: z.string().datetime(),
  da: z.number().min(0).max(100).nullable(), //1-100 score made by Moz
  source: z.enum(["moz", "ahrefs"]),
});

//backlink totals and stores the urls that have changed since last check
export const BacklinkSnapshotSchema = z.object({
  domain: z.string(),
  takenAt: z.string().datetime(),
  totalBacklinks: z.number().int().nonnegative(),
  referringDomains: z.number().int().nonnegative(),
  newSinceLast: z.array(
    z.object({
      url: z.string().url(), //url of the web page that referred client  
      referringDomain: z.string(), //domain of the web page that referred client? idk why necessary
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

//compares the delta between two serp snapsshots per keyword
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
      position: z.number().int().positive(),
    }),
  ),
  positionChanges: z.array(
    z.object({
      url: z.string().url(),
      from: z.number().int().positive(),
      to: z.number().int().positive(),
    }),
  ),
  domainPositionChange: z.number().nullable(),
  triggerRestrategy: z.boolean(),
  triggerReason: z.string().nullable(),
});

//this is the summary that we're sending perhaps through email .. maybe will show on dash
export const WeeklyDigestSchema = z.object({
  domain: z.string(),
  weekStarting: z.string(),
  weekEnding: z.string(), //why is this necessary? can't we use weekStarting + 7?
  keywordCount: z.number().int().nonnegative(),
  rankGains: z.number().int().nonnegative(),
  rankLosses: z.number().int().nonnegative(),
  newCompetitors: z.number().int().nonnegative(), //comes from new in rankings
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

//types are exported like this so we don't have to redefine these types, infers it from the schema
export type SerpSnapshot = z.infer<typeof SerpSnapshotSchema>;
export type RankSnapshot = z.infer<typeof RankSnapshotSchema>;
export type GscSnapshot = z.infer<typeof GscSnapshotSchema>;
export type GaSnapshot = z.infer<typeof GaSnapshotSchema>;
export type DaSnapshot = z.infer<typeof DaSnapshotSchema>;
export type BacklinkSnapshot = z.infer<typeof BacklinkSnapshotSchema>;
export type SerpDelta = z.infer<typeof SerpDeltaSchema>;
export type WeeklyDigest = z.infer<typeof WeeklyDigestSchema>;