import { join } from "node:path";
import {
  createLogger,
  getKeywordDataProvider,
} from "@rynk/core";
import {
  BacklinkSnapshotSchema,
  type BacklinkSnapshot,
} from "../schema/index.js";
import { isoDateTime, todayIsoDate } from "../utils/dates.js";
import { listDatedJsonFiles, monitorDir, monitorSnapshotPath } from "../utils/paths.js";
import {
  tryReadValidatedSnapshot,
  writeValidatedSnapshot,
} from "../utils/snapshot-io.js";

const log = createLogger("layer5.backlinks-snapshot");

export async function takeBacklinksSnapshot(
  domain: string,
  runsDir: string,
): Promise<BacklinkSnapshot> {
  const provider = getKeywordDataProvider();
  const authority = await provider.getDomainAuthority(domain);
  const date = todayIsoDate();
  const takenAt = isoDateTime();

  const backlinksDir = join(monitorDir(runsDir, domain), "backlinks");
  const priorFiles = listDatedJsonFiles(backlinksDir).filter((f) => f !== `${date}.json`);
  const previous = priorFiles[0]
    ? tryReadValidatedSnapshot(BacklinkSnapshotSchema, join(backlinksDir, priorFiles[0]))
    : null;

  const totalBacklinks = authority.backlinks ?? 0;
  const referringDomains = authority.referringDomains ?? 0;

  // KeywordDataProvider exposes aggregate counts, not individual backlink URLs.
  const newSinceLast: BacklinkSnapshot["newSinceLast"] = [];
  const lostSinceLast: BacklinkSnapshot["lostSinceLast"] = [];

  if (previous) {
    const gained = Math.max(0, totalBacklinks - previous.totalBacklinks);
    const lost = Math.max(0, previous.totalBacklinks - totalBacklinks);
    if (gained > 0 || lost > 0) {
      log.info("Backlink totals changed but provider has no URL list", {
        domain,
        gained,
        lost,
      });
    }
  }

  const snapshot: BacklinkSnapshot = {
    domain,
    takenAt,
    totalBacklinks,
    referringDomains,
    newSinceLast,
    lostSinceLast,
  };

  const path = monitorSnapshotPath(runsDir, domain, "backlinks", date);
  writeValidatedSnapshot(BacklinkSnapshotSchema, path, snapshot);
  log.info("Backlinks snapshot written", { domain, totalBacklinks, referringDomains, path });
  return snapshot;
}
