/**
 * Web entry — Phase 1: onboarding only.
 *
 * Spawned by the dashboard's /api/onboard route as:
 *   tsx packages/orchestrator/src/web/onboard.ts <domain>
 *
 * Runs the onboarding agent (scrape + AI extraction), saves client.json +
 * client.md, and stops. It does NOT run any layers and does NOT prompt —
 * the human confirmation the CLI does in the terminal happens on the web
 * instead (the dashboard shows the context, the user clicks Continue, then
 * /api/run kicks off web/run-layers.ts).
 *
 * Writes runs/{safeDomain}/status.json at each boundary so the dashboard
 * can poll progress: onboarding → onboarded (or → failed).
 */

import { resolve } from "node:path";
import { createLogger, moduleDir } from "@rynk/core";
import { runOnboardingAgent } from "../onboarding/onboard-agent.js";
import { saveClientJson, saveClientMd } from "../onboarding/client-store.js";
import { writeStatus } from "./run-status.js";
import { normalizeDomain } from "./normalize-domain.js";

const log = createLogger("web.onboard");

// From packages/orchestrator/src/web/ up to the repo root, then /runs.
const runsDir = resolve(moduleDir(import.meta.url), "../../../../runs");

async function main(): Promise<void> {
  const raw = process.argv[2];
  if (!raw) {
    process.stderr.write("usage: onboard.ts <domain-or-url>\n");
    process.exit(1);
  }
  const domain = normalizeDomain(raw);

  writeStatus(runsDir, domain, "onboarding");
  log.info("web onboarding start", { domain });

  try {
    const ctx = await runOnboardingAgent({ domain });
    saveClientJson(runsDir, domain, ctx);
    saveClientMd(runsDir, domain, ctx);
    writeStatus(runsDir, domain, "onboarded");
    log.info("web onboarding done", { domain });
    process.exit(0);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    writeStatus(runsDir, domain, "failed", msg);
    log.error("web onboarding failed", { domain, error: msg });
    process.exit(1);
  }
}

void main();
