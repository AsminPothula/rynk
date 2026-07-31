/**
 * Layer 5 — Monitor. Public surface for both halves of the monitor:
 *   - SERP watch (rank/serp snapshots + delta + re-strategy trigger)
 *   - Metrics watch (GSC / GA / DA / backlinks snapshots + weekly digest)
 */

// ── SERP watch ────────────────────────────────────────────────────────────────
export { runSerpWatch } from "./jobs/serp-watch.js";
export { takeSerpSnapshot } from "./snapshots/serp-snapshot.js";
export { computeSerpDelta } from "./diff/serp-diff.js";

// ── Metrics watch ───────────────────────────────────────────────────────────
export { takeRankSnapshot } from "./snapshots/rank-snapshot.js";
export { takeGscSnapshot } from "./snapshots/gsc-snapshot.js";
export { takeGaSnapshot } from "./snapshots/ga-snapshot.js";
export { takeDaSnapshot } from "./snapshots/da-snapshot.js";
export { takeBacklinksSnapshot } from "./snapshots/backlinks-snapshot.js";
export { buildWeeklyDigest } from "./digest/weekly-digest.js";
export { runMetricsWatch } from "./jobs/metrics-watch.js";

// ── Schemas + types ─────────────────────────────────────────────────────────
export {
  SerpSnapshotSchema,
  RankSnapshotSchema,
  GscSnapshotSchema,
  GaSnapshotSchema,
  DaSnapshotSchema,
  BacklinkSnapshotSchema,
  SerpDeltaSchema,
  WeeklyDigestSchema,
  type SerpSnapshot,
  type RankSnapshot,
  type GscSnapshot,
  type GaSnapshot,
  type DaSnapshot,
  type BacklinkSnapshot,
  type SerpDelta,
  type WeeklyDigest,
} from "./schema/index.js";
