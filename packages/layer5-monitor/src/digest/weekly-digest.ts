import { createLogger, readJson } from "@rynk/core";
import {
  BacklinkSnapshotSchema,
  DaSnapshotSchema,
  GaSnapshotSchema,
  GscSnapshotSchema,
  RankSnapshotSchema,
  SerpDeltaSchema,
  WeeklyDigestSchema,
  type RankSnapshot,
  type SerpDelta,
  type WeeklyDigest,
} from "../schema/index.js";
import {
  getWeekEnding,
  previousWeekStarting,
  todayIsoDate,
} from "../utils/dates.js";
import {
  findSnapshotPath,
  listSerpDeltaFiles,
  monitorSnapshotPath,
} from "../utils/paths.js";
import {
  loadLatestTwoSnapshots,
  tryReadValidatedSnapshot,
  writeValidatedSnapshot,
} from "../utils/snapshot-io.js";

const log = createLogger("layer5.weekly-digest");

function computeTrend(current: number, previous: number | null): "up" | "down" | "flat" {
  if (previous === null || previous === 0) return "flat";
  const pct = ((current - previous) / previous) * 100;
  if (pct > 5) return "up";
  if (pct < -5) return "down";
  return "flat";
}

function hostFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return url;
  }
}

function normalizeDomain(domain: string): string {
  return domain.replace(/^www\./, "").toLowerCase();
}

function countRankMovements(
  current: RankSnapshot[],
  previous: RankSnapshot[],
): { gains: number; losses: number; manualReview: WeeklyDigest["actionsRecommended"] } {
  const previousByKeyword = new Map(previous.map((r) => [r.keyword, r.rank]));
  let gains = 0;
  let losses = 0;
  const manualReview: WeeklyDigest["actionsRecommended"] = [];

  for (const row of current) {
    const prevRank = previousByKeyword.get(row.keyword) ?? null;
    const currRank = row.rank;

    if (prevRank !== null && currRank !== null) {
      const movement = prevRank - currRank;
      if (movement >= 3) gains += 1;
      if (movement <= -3) losses += 1;
      if (movement <= -10) {
        manualReview.push({
          keyword: row.keyword,
          reason: `Rank dropped ${Math.abs(movement)} positions with no SERP-level trigger recorded`,
        });
      }
    } else if (prevRank !== null && currRank === null && prevRank <= 100) {
      losses += 1;
      if (prevRank <= 20) {
        manualReview.push({
          keyword: row.keyword,
          reason: "Domain fell out of top 100 for this keyword",
        });
      }
    } else if (prevRank === null && currRank !== null && currRank <= 10) {
      gains += 1;
    }
  }

  return { gains, losses, manualReview };
}

function loadSerpDeltas(runsDir: string, domain: string, date: string): SerpDelta[] {
  const files = listSerpDeltaFiles(runsDir, domain, date);
  const deltas: SerpDelta[] = [];
  for (const file of files) {
    const delta = tryReadValidatedSnapshot(SerpDeltaSchema, file);
    if (delta) deltas.push(delta);
  }
  return deltas;
}

function countNewCompetitors(deltas: SerpDelta[], clientDomain: string): number {
  const client = normalizeDomain(clientDomain);
  const competitors = new Set<string>();
  for (const delta of deltas) {
    for (const entry of delta.newInTop10) {
      const host = hostFromUrl(entry.url);
      if (host !== client) competitors.add(host);
    }
  }
  return competitors.size;
}

function loadRankSnapshots(
  runsDir: string,
  domain: string,
  date: string,
): RankSnapshot[] {
  const rankPath = findSnapshotPath(runsDir, domain, "rank", date);
  if (!rankPath) return [];
  const raw = readJson<unknown>(rankPath);
  const parsed = RankSnapshotSchema.array().safeParse(raw);
  if (!parsed.success) {
    throw new Error(`Invalid rank snapshot at ${rankPath}: ${parsed.error.message}`);
  }
  return parsed.data;
}

function loadPreviousRankSnapshots(
  runsDir: string,
  domain: string,
): RankSnapshot[] {
  const [, previous] = loadLatestTwoSnapshots(
    RankSnapshotSchema.array(),
    runsDir,
    domain,
    "rank",
  );
  return previous ?? [];
}

export async function buildWeeklyDigest(
  domain: string,
  weekStarting: string,
  runsDir: string,
): Promise<WeeklyDigest> {
  const weekEnding = getWeekEnding(weekStarting);
  const priorWeek = previousWeekStarting(weekStarting);
  const date = todayIsoDate();

  const gscCurrent = tryReadValidatedSnapshot(
    GscSnapshotSchema,
    monitorSnapshotPath(runsDir, domain, "gsc", weekStarting),
  );
  const gscPreviousPath = findSnapshotPath(runsDir, domain, "gsc", priorWeek);
  const gscPrevious = gscPreviousPath
    ? tryReadValidatedSnapshot(GscSnapshotSchema, gscPreviousPath)
    : null;

  const gaCurrent = tryReadValidatedSnapshot(
    GaSnapshotSchema,
    monitorSnapshotPath(runsDir, domain, "ga", weekStarting),
  );
  const gaPreviousPath = findSnapshotPath(runsDir, domain, "ga", priorWeek);
  const gaPrevious = gaPreviousPath
    ? tryReadValidatedSnapshot(GaSnapshotSchema, gaPreviousPath)
    : null;

  const [daCurrent, daPrevious] = loadLatestTwoSnapshots(
    DaSnapshotSchema,
    runsDir,
    domain,
    "da",
  );
  const [backlinksCurrent, backlinksPrevious] = loadLatestTwoSnapshots(
    BacklinkSnapshotSchema,
    runsDir,
    domain,
    "backlinks",
  );

  const rankCurrent = loadRankSnapshots(runsDir, domain, date);
  const rankPrevious = loadPreviousRankSnapshots(runsDir, domain);
  const serpDeltas = loadSerpDeltas(runsDir, domain, date);
  const { gains, losses, manualReview } = countRankMovements(rankCurrent, rankPrevious);

  const actionsRecommended: WeeklyDigest["actionsRecommended"] = [
    ...serpDeltas
      .filter((d) => d.triggerRestrategy)
      .map((d) => ({
        keyword: d.keyword,
        reason: d.triggerReason ?? "SERP shift triggered re-strategy",
      })),
    ...manualReview,
  ];

  const daChange =
    daCurrent?.da != null && daPrevious?.da != null
      ? daCurrent.da - daPrevious.da
      : null;

  const backlinkChange =
    backlinksCurrent && backlinksPrevious
      ? backlinksCurrent.totalBacklinks - backlinksPrevious.totalBacklinks
      : backlinksCurrent
        ? backlinksCurrent.newSinceLast.length - backlinksCurrent.lostSinceLast.length
        : 0;

  const digest: WeeklyDigest = {
    domain,
    weekStarting,
    weekEnding,
    keywordCount: rankCurrent.length,
    rankGains: gains,
    rankLosses: losses,
    newCompetitors: countNewCompetitors(serpDeltas, domain),
    gscTrend: computeTrend(gscCurrent?.impressions ?? 0, gscPrevious?.impressions ?? null),
    gaTrend: computeTrend(gaCurrent?.sessions ?? 0, gaPrevious?.sessions ?? null),
    daChange,
    backlinkChange,
    actionsRecommended,
  };

  const path = monitorSnapshotPath(runsDir, domain, "digest", date);
  writeValidatedSnapshot(WeeklyDigestSchema, path, digest);
  log.info("Weekly digest written", { domain, weekStarting, path });
  return digest;
}
