import { createLogger } from "@rynk/core";
import {
  RankSnapshotSchema,
  type RankSnapshot,
} from "../schema/index.js";
import { isoDateTime, todayIsoDate } from "../utils/dates.js";
import { monitorSnapshotPath } from "../utils/paths.js";
import { writeValidatedSnapshot } from "../utils/snapshot-io.js";
import { findDomainRank } from "../utils/serp-rank.js";

const log = createLogger("layer5.rank-snapshot");

export async function takeRankSnapshot(
  domain: string,
  keywords: string[],
  runsDir: string,
): Promise<RankSnapshot[]> {
  const takenAt = isoDateTime();
  const snapshots: RankSnapshot[] = [];

  for (const keyword of keywords) {
    const rank = await findDomainRank(domain, keyword);
    snapshots.push({
      domain,
      keyword,
      takenAt,
      rank,
      ai_engine: "google",
    });
    log.info("Rank checked", { domain, keyword, rank });
  }

  const path = monitorSnapshotPath(runsDir, domain, "rank", todayIsoDate());
  for (const snapshot of snapshots) {
    RankSnapshotSchema.parse(snapshot);
  }
  writeValidatedSnapshot(
    RankSnapshotSchema.array(),
    path,
    snapshots,
  );
  log.info("Rank snapshot written", { domain, keywordCount: snapshots.length, path });
  return snapshots;
}
