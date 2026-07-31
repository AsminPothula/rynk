/**
 * Local verification for Person 2's metrics-watch job.
 *
 * Usage (from repo root):
 *   npm run verify --workspace=@rynk/layer5-monitor
 *
 * Or from this package:
 *   npx tsx scripts/verify-metrics-watch.ts
 *   npx tsx scripts/verify-metrics-watch.ts itechdata.ai
 */

import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ClientContextSchema, readJson } from "@rynk/core";
import { runMetricsWatch } from "../src/jobs/metrics-watch.js";

const domain = process.argv[2] ?? "itechdata.ai";
const here = dirname(fileURLToPath(import.meta.url));
const runsDir = resolve(here, "../../../runs");
const clientPath = resolve(runsDir, domain, "client.json");

console.log(`Loading client: ${clientPath}`);
const client = ClientContextSchema.parse(readJson(clientPath));

console.log(`Running metrics watch for ${domain}...`);
const { digest } = await runMetricsWatch(domain, client, runsDir);

console.log("\nWeekly digest:");
console.log(JSON.stringify(digest, null, 2));
console.log(`\nSnapshots written under: ${resolve(runsDir, domain, "monitor")}/`);
