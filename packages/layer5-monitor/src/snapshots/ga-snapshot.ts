import {
  createLogger,
  getOwnedDomainDataProvider,
} from "@rynk/core";
import {
  GaSnapshotSchema,
  type GaSnapshot,
} from "../schema/index.js";
import { weekRange } from "../utils/dates.js";
import { monitorSnapshotPath } from "../utils/paths.js";
import { writeValidatedSnapshot } from "../utils/snapshot-io.js";

const log = createLogger("layer5.ga-snapshot");

export async function takeGaSnapshot(
  domain: string,
  weekStarting: string,
  runsDir: string,
): Promise<GaSnapshot> {
  const provider = getOwnedDomainDataProvider();
  const range = weekRange(weekStarting);
  const [engagement, conversions] = await Promise.all([
    provider.getEngagement(domain, range),
    provider.getConversions(domain, range, 10),
  ]);

  const totalConversions = conversions.reduce((sum, c) => sum + c.count, 0);
  const topPages = engagement.topLandingPages.map((page) => {
    const pageConversions = Math.max(
      0,
      Math.round(totalConversions * (page.sessions / Math.max(engagement.sessions, 1))),
    );
    return {
      url: page.page.startsWith("http") ? page.page : `https://${domain}${page.page}`,
      sessions: page.sessions,
      conversions: pageConversions,
    };
  });

  const snapshot: GaSnapshot = {
    domain,
    weekStarting,
    sessions: engagement.sessions,
    conversions: totalConversions,
    topPages,
  };

  const path = monitorSnapshotPath(runsDir, domain, "ga", weekStarting);
  writeValidatedSnapshot(GaSnapshotSchema, path, snapshot);
  log.info("GA snapshot written", { domain, weekStarting, path });
  return snapshot;
}
