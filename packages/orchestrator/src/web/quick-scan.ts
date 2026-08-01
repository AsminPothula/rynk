/**
 * Web entry — "Try rynk on your site" quick scan.
 *
 * Spawned by the backend (e.g. POST /api/try) as:
 *   tsx packages/orchestrator/src/web/quick-scan.ts <domain>
 *
 * Unlike onboard/run-layers, this writes NO client files — the prospect isn't a
 * client yet. It prints the QuickScanResult JSON to stdout on the last line so
 * the backend can capture and return it; diagnostics go to stderr.
 */

import { createLogger } from "@rynk/core";
import { runQuickScan } from "../quick-scan/quick-scan.js";
import { normalizeDomain } from "./normalize-domain.js";

const log = createLogger("web.quick-scan");

async function main(): Promise<void> {
  const raw = process.argv[2];
  if (!raw) {
    process.stderr.write("usage: quick-scan.ts <domain-or-url>\n");
    process.exit(1);
  }
  const domain = normalizeDomain(raw);

  try {
    const result = await runQuickScan(domain);
    // Single-line JSON on stdout — the only thing the backend parses.
    process.stdout.write(JSON.stringify(result) + "\n");
    process.exit(0);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log.error("quick scan failed", { domain, error: msg });
    process.stderr.write(`quick scan failed: ${msg}\n`);
    process.exit(1);
  }
}

void main();
