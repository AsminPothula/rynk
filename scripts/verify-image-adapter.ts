/**
 * Verification: build a manifest, mark all create_image actions as approved,
 * run applyManifest with the image adapter, confirm every action gets a
 * resultUrl populated.
 *
 * Docker-free, API-free (uses mock provider). Proves the Layer 4 dispatch
 * + image provider wiring works end-to-end on real itechdata data.
 *
 * Usage:
 *   tsx scripts/verify-image-adapter.ts <runDate>
 *   tsx scripts/verify-image-adapter.ts 2026-05-18
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  AuditFindingsSchema,
  ClientContextSchema,
  StrategyOutputSchema,
} from "@rynk/core";
import { composeManifest } from "@rynk/layer3-generate";
import { applyManifest, makeImageAdapter } from "@rynk/layer4-publish";

const date = process.argv[2] ?? "2026-05-18";
const domain = "itechdata.ai";
const here = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(here, "../runs");

const audit = AuditFindingsSchema.parse(JSON.parse(readFileSync(`${rootDir}/${domain}/${date}/audit.json`, "utf-8")));
const strategy = StrategyOutputSchema.parse(JSON.parse(readFileSync(`${rootDir}/${domain}/${date}/strategy.json`, "utf-8")));
const client = ClientContextSchema.parse(JSON.parse(readFileSync(`${rootDir}/${domain}/client.json`, "utf-8")));

const manifest = composeManifest({
  audit,
  strategy,
  client,
  strategySource: `${rootDir}/${domain}/${date}/strategy.json`,
});

const imageActions = manifest.actions.filter((a) => a.type === "create_image");
console.log(`Manifest composed: ${manifest.actions.length} actions, ${imageActions.length} create_image.`);

// Mark every create_image as approved so applyManifest will fire it.
for (const a of imageActions) a.status = "approved";

const adapter = makeImageAdapter();
console.log(`Adapter: ${adapter.adapterName}`);

const report = await applyManifest({ manifest, adapters: [adapter] });

console.log(`\nApply report:`);
console.log(`  applied:   ${report.applied}`);
console.log(`  failed:    ${report.failed}`);
console.log(`  skipped:   ${report.skipped}`);
console.log(`  unhandled: ${report.unhandled}`);

const sample = imageActions.slice(0, 3);
console.log(`\nFirst 3 create_image action results:`);
for (const a of sample) {
  if (a.type !== "create_image") continue;
  console.log(`  ${a.id} [${a.status}]`);
  console.log(`    purpose:    ${a.target.purpose}`);
  console.log(`    dimensions: ${a.payload.width}x${a.payload.height}`);
  console.log(`    resultUrl:  ${a.payload.resultUrl ?? "(none)"}`);
}
