/**
 * Web entry — Phase 2: run Layers 1 → 2 → 3.
 *
 * Spawned (detached) by the dashboard's /api/run route as:
 *   tsx packages/orchestrator/src/web/run-layers.ts <domain>
 *
 * Assumes client.json already exists (written by web/onboard.ts and
 * confirmed by the human on the dashboard). Runs audit → strategy →
 * execution manifest and STOPS. It never calls Layer 4 (publish) — the
 * demo shows the plan of changes, it does not touch the client's site.
 *
 * Writes runs/{safeDomain}/status.json at each layer boundary so the
 * dashboard can poll: layer1 → layer2 → layer3 → done (or → failed).
 */

import { resolve } from "node:path";
import { createLogger, moduleDir } from "@rynk/core";
import { runLayer1 } from "@rynk/layer1-audit";
import { runStrategyAgent, saveStrategyOutput, ideateKeywords } from "@rynk/layer2-strategy";
import { composeManifest, saveExecutionManifest } from "@rynk/layer3-generate";
import { loadClientJson, clientJsonExists } from "../onboarding/client-store.js";
import { writeStatus } from "./run-status.js";
import { normalizeDomain } from "./normalize-domain.js";

const log = createLogger("web.run-layers");

const runsDir = resolve(moduleDir(import.meta.url), "../../../../runs");

async function main(): Promise<void> {
  const raw = process.argv[2];
  if (!raw) {
    process.stderr.write("usage: run-layers.ts <domain-or-url>\n");
    process.exit(1);
  }
  const domain = normalizeDomain(raw);

  if (!clientJsonExists(runsDir, domain)) {
    writeStatus(runsDir, domain, "failed", "client.json not found — onboard first");
    log.error("run-layers called before onboarding", { domain });
    process.exit(1);
  }

  try {
    const client = loadClientJson(runsDir, domain);

    // ── Layer 1 — audit ──────────────────────────────────────────────────
    writeStatus(runsDir, domain, "layer1");
    log.info("Layer 1 start", { domain });
    const parallel = process.env["PARALLEL_AGENTS"] === "true";
    const { findings } = await runLayer1({ client, rootDir: runsDir, parallel });
    log.info("Layer 1 done", { domain });

    // ── Layer 2 — strategy ───────────────────────────────────────────────
    writeStatus(runsDir, domain, "layer2");
    log.info("Layer 2 start", { domain });

    // Pre-step: ideate + validate keyword opportunities from the full client
    // context, then feed them into the strategy agent. Non-fatal — if ideation
    // fails, strategy still runs off the audit + seed keywords alone.
    let ideatedKeywords;
    try {
      ideatedKeywords = await ideateKeywords(client);
      log.info("keyword ideation done", { domain, count: ideatedKeywords.length });
    } catch (err) {
      log.warn("keyword ideation failed — strategy will run without it", {
        domain,
        error: (err as Error).message,
      });
    }

    const strategy = await runStrategyAgent({
      audit: { content: JSON.stringify(findings, null, 2), format: "json" },
      clientContext: client,
      ideatedKeywords,
    });
    const l2Paths = saveStrategyOutput(strategy, runsDir);
    log.info("Layer 2 done", { domain });

    // ── Layer 3 — execution manifest (no publish) ────────────────────────
    writeStatus(runsDir, domain, "layer3");
    log.info("Layer 3 start", { domain });
    const manifest = composeManifest({
      audit: findings,
      strategy,
      client,
      strategySource: l2Paths.jsonPath,
    });
    saveExecutionManifest(manifest, runsDir);
    log.info("Layer 3 done", {
      domain,
      actions: manifest.summary.totalActions,
    });

    writeStatus(runsDir, domain, "done");
    log.info("web pipeline complete", { domain });
    process.exit(0);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    writeStatus(runsDir, domain, "failed", msg);
    log.error("web pipeline failed", { domain, error: msg });
    process.exit(1);
  }
}

void main();
