import { createLogger, type ClientContext } from "@rynk/core";
import { buildWeeklyDigest } from "../digest/weekly-digest.js";
import type { WeeklyDigest } from "../schema/index.js";
import { takeBacklinksSnapshot } from "../snapshots/backlinks-snapshot.js";
import { takeDaSnapshot } from "../snapshots/da-snapshot.js";
import { takeGaSnapshot } from "../snapshots/ga-snapshot.js";
import { takeGscSnapshot } from "../snapshots/gsc-snapshot.js";
import { takeRankSnapshot } from "../snapshots/rank-snapshot.js";
import { getWeekStarting } from "../utils/dates.js";

const log = createLogger("layer5.metrics-watch");

export async function runMetricsWatch(
  domain: string,
  clientContext: ClientContext,
  runsDir: string,
): Promise<{ digest: WeeklyDigest }> {
  const weekStarting = getWeekStarting();
  const keywords = clientContext.seedKeywords;

  log.info("Starting metrics watch", { domain, weekStarting, keywordCount: keywords.length });

  await Promise.all([
    takeGscSnapshot(domain, weekStarting, runsDir),
    takeGaSnapshot(domain, weekStarting, runsDir),
    takeDaSnapshot(domain, runsDir),
    takeBacklinksSnapshot(domain, runsDir),
    takeRankSnapshot(domain, keywords, runsDir),
  ]);

  const digest = await buildWeeklyDigest(domain, weekStarting, runsDir);
  log.info("Metrics watch complete", {
    domain,
    weekStarting,
    rankGains: digest.rankGains,
    rankLosses: digest.rankLosses,
  });

  return { digest };
}
