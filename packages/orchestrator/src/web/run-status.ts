/**
 * Run-status file — the single source of truth the web dashboard polls to
 * know how far a triggered pipeline has progressed.
 *
 * Written to runs/{safeDomain}/status.json by the web entry scripts
 * (web/onboard.ts, web/run-layers.ts) and read by the dashboard's
 * /api/status route. Deliberately tiny and flat so a half-written file is
 * never a problem — it's rewritten atomically at each phase boundary.
 */

import { resolve } from "node:path";
import { writeJson, readJson, fileExists, ensureDir } from "@rynk/core";

/** Ordered phases a run moves through. `failed` is terminal + carries `error`. */
export type RunPhase =
  | "onboarding"
  | "onboarded"
  | "layer1"
  | "layer2"
  | "layer3"
  | "done"
  | "failed";

export interface RunStatus {
  domain: string;
  phase: RunPhase;
  updatedAt: string;
  error?: string;
}

/** Same slug transform the rest of the pipeline uses for the runs/ dir. */
export function safeDomainSlug(domain: string): string {
  return domain.replace(/[^a-z0-9.-]/gi, "_");
}

function statusPath(runsDir: string, domain: string): string {
  return resolve(runsDir, safeDomainSlug(domain), "status.json");
}

export function writeStatus(
  runsDir: string,
  domain: string,
  phase: RunPhase,
  error?: string,
): void {
  ensureDir(resolve(runsDir, safeDomainSlug(domain)));
  const status: RunStatus = {
    domain,
    phase,
    updatedAt: new Date().toISOString(),
    ...(error ? { error } : {}),
  };
  writeJson(statusPath(runsDir, domain), status);
}

export function readStatus(runsDir: string, domain: string): RunStatus | null {
  const path = statusPath(runsDir, domain);
  if (!fileExists(path)) return null;
  try {
    return readJson<RunStatus>(path);
  } catch {
    return null;
  }
}
