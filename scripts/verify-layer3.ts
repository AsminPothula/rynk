/**
 * One-off verification: load an existing audit + strategy from disk, compose
 * an ExecutionManifest from them, and write the result.
 *
 * Doesn't require Docker, doesn't burn API calls. Proves that the Layer 3
 * wiring works end-to-end with realistic inputs (real itechdata.ai run data).
 *
 * Usage:
 *   tsx scripts/verify-layer3.ts <runDate>
 *   tsx scripts/verify-layer3.ts 2026-05-18
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  AuditFindingsSchema,
  ClientContextSchema,
  StrategyOutputSchema,
} from "@rynk/core";
import { composeManifest, saveExecutionManifest } from "@rynk/layer3-generate";

const date = process.argv[2] ?? "2026-05-18";
const domain = "itechdata.ai";
const here = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(here, "../runs");

const auditPath = `${rootDir}/${domain}/${date}/audit.json`;
const strategyPath = `${rootDir}/${domain}/${date}/strategy.json`;
const clientPath = `${rootDir}/${domain}/client.json`;

console.log(`Loading inputs:`);
console.log(`  audit:    ${auditPath}`);
console.log(`  strategy: ${strategyPath}`);
console.log(`  client:   ${clientPath}\n`);

const audit = AuditFindingsSchema.parse(JSON.parse(readFileSync(auditPath, "utf-8")));
const strategy = StrategyOutputSchema.parse(JSON.parse(readFileSync(strategyPath, "utf-8")));
const client = ClientContextSchema.parse(JSON.parse(readFileSync(clientPath, "utf-8")));

console.log(`Schema validation: OK`);
console.log(`  audit.sitemapUrls:             ${audit.technicalCrawl.sitemapUrls.length}`);
console.log(`  audit.contentInventory:        ${audit.contentInventory.length}`);
console.log(`  audit.missingMetas:            ${audit.technicalCrawl.missingMetas.length}`);
console.log(`  audit.duplicateMetas:          ${audit.technicalCrawl.duplicateMetas.length}`);
console.log(`  audit.authority.client.score:  ${audit.authority.client.score ?? "(unset — pre-enrichment audit)"}`);
console.log(`  strategy.contentBriefs:        ${strategy.contentBriefs.length}`);
console.log(`  strategy.topicClusterMap:      ${strategy.topicClusterMap.length}\n`);

const manifest = composeManifest({
  audit,
  strategy,
  client,
  strategySource: strategyPath,
});

console.log(`Manifest composed:`);
console.log(`  Total actions:           ${manifest.summary.totalActions}`);
console.log(`  Automatable:             ${manifest.summary.automatable}`);
console.log(`  Requires human approval: ${manifest.summary.requiresHumanApproval}`);
console.log(`  By type:`);
for (const [type, count] of Object.entries(manifest.summary.byType)) {
  console.log(`    ${type.padEnd(22)} ${count}`);
}

const paths = saveExecutionManifest(manifest, rootDir);
console.log(`\nWrote:`);
console.log(`  ${paths.jsonPath}`);
console.log(`  ${paths.mdPath}`);
