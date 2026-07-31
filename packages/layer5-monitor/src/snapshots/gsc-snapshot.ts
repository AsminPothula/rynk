import {
  createLogger,
  getOwnedDomainDataProvider,
} from "@rynk/core";
import {
  GscSnapshotSchema,
  type GscSnapshot,
} from "../schema/index.js";
import { weekRange } from "../utils/dates.js";
import { monitorSnapshotPath } from "../utils/paths.js";
import { writeValidatedSnapshot } from "../utils/snapshot-io.js";

const log = createLogger("layer5.gsc-snapshot");

export async function takeGscSnapshot(
  domain: string,
  weekStarting: string,
  runsDir: string,
): Promise<GscSnapshot> {
  const provider = getOwnedDomainDataProvider();
  const range = weekRange(weekStarting);
  const topQueries = await provider.getTopQueries(domain, range, 20);

  const impressions = topQueries.reduce((sum, q) => sum + q.impressions, 0);
  const clicks = topQueries.reduce((sum, q) => sum + q.clicks, 0);
  const weightedPosition = topQueries.reduce(
    (sum, q) => sum + q.averagePosition * q.impressions,
    0,
  );
  const avgPosition =
    impressions > 0 ? Number((weightedPosition / impressions).toFixed(1)) : null;

  const snapshot: GscSnapshot = {
    domain,
    weekStarting,
    impressions,
    clicks,
    avgPosition,
    topQueries: topQueries.map((q) => ({
      query: q.query,
      impressions: q.impressions,
      clicks: q.clicks,
      position: q.averagePosition,
    })),
  };

  const path = monitorSnapshotPath(runsDir, domain, "gsc", weekStarting);
  writeValidatedSnapshot(GscSnapshotSchema, path, snapshot);
  log.info("GSC snapshot written", { domain, weekStarting, path });
  return snapshot;
}
