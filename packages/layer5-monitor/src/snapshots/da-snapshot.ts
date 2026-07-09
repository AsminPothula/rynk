import {
  createLogger,
  getKeywordDataProvider,
} from "@rynk/core";
import {
  DaSnapshotSchema,
  type DaSnapshot,
} from "../schema/index.js";
import { isoDateTime, todayIsoDate } from "../utils/dates.js";
import { monitorSnapshotPath } from "../utils/paths.js";
import { writeValidatedSnapshot } from "../utils/snapshot-io.js";

const log = createLogger("layer5.da-snapshot");

export async function takeDaSnapshot(
  domain: string,
  runsDir: string,
): Promise<DaSnapshot> {
  const provider = getKeywordDataProvider();
  const authority = await provider.getDomainAuthority(domain);
  const date = todayIsoDate();

  if (authority.score === null) {
    log.warn("Domain authority unavailable — writing null DA", { domain });
  }

  const snapshot: DaSnapshot = {
    domain,
    takenAt: isoDateTime(),
    da: authority.score,
    source: authority.provider === "mock" ? "moz" : "ahrefs",
  };

  const path = monitorSnapshotPath(runsDir, domain, "da", date);
  writeValidatedSnapshot(DaSnapshotSchema, path, snapshot);
  log.info("DA snapshot written", { domain, da: snapshot.da, path });
  return snapshot;
}
