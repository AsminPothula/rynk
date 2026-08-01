/**
 * Web entry — Layer 4: apply an approved execution manifest.
 *
 * Spawnable as:
 *   tsx packages/orchestrator/src/web/publish.ts <domain>
 *
 * Loads the latest execution-manifest.json for the domain, runs Layer 4 in its
 * SAFE default mode (all adapters mock except WordPress, which is included only
 * when WORDPRESS_* creds are present in the env AND WORDPRESS_LIVE=true), then
 * writes the updated manifest (with per-action statuses) back in place and
 * prints a one-line JSON summary on stdout.
 *
 * By design this is a SEPARATE step from run-layers.ts (Layers 1→3): publishing
 * touches real client properties, so it never runs automatically — a human
 * approves actions first, then invokes this.
 */

import { readdirSync, statSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  createLogger,
  moduleDir,
  readJson,
  writeJson,
} from "@rynk/core";
import {
  ExecutionManifestSchema,
  type ExecutionManifest,
} from "@rynk/layer3-generate";
import {
  runLayer4,
  type WordPressAdapterConfig,
} from "@rynk/layer4-publish";
import { normalizeDomain } from "./normalize-domain.js";

const log = createLogger("web.publish");

const runsDir = resolve(moduleDir(import.meta.url), "../../../../runs");

function safeDomainSlug(domain: string): string {
  return domain.replace(/[^a-z0-9.-]/gi, "_");
}

/** Newest runs/{slug}/{YYYY-MM-DD} dir that holds an execution-manifest.json. */
function findLatestManifestPath(domain: string): string | null {
  const dir = resolve(runsDir, safeDomainSlug(domain));
  if (!existsSync(dir)) return null;
  const dates = readdirSync(dir)
    .filter(
      (e) =>
        /^\d{4}-\d{2}-\d{2}$/.test(e) && statSync(resolve(dir, e)).isDirectory(),
    )
    .sort()
    .reverse();
  for (const date of dates) {
    const p = resolve(dir, date, "execution-manifest.json");
    if (existsSync(p)) return p;
  }
  return null;
}

/** WordPress creds from env — returned only if all three are present. */
function wordpressConfigFromEnv(): WordPressAdapterConfig | undefined {
  const siteUrl = process.env["WORDPRESS_SITE_URL"];
  const username = process.env["WORDPRESS_USERNAME"];
  const appPassword = process.env["WORDPRESS_APP_PASSWORD"];
  if (siteUrl && username && appPassword) {
    return { siteUrl, username, appPassword };
  }
  return undefined;
}

async function main(): Promise<void> {
  const raw = process.argv[2];
  if (!raw) {
    process.stderr.write("usage: publish.ts <domain-or-url>\n");
    process.exit(1);
  }
  const domain = normalizeDomain(raw);

  const manifestPath = findLatestManifestPath(domain);
  if (!manifestPath) {
    process.stderr.write(
      `no execution-manifest.json found for ${domain} — run Layers 1-3 first\n`,
    );
    process.exit(1);
  }

  try {
    const parsed = ExecutionManifestSchema.parse(readJson<ExecutionManifest>(manifestPath));

    // requireApproval can be relaxed for a dry-run demo with PUBLISH_APPLY_ALL=true.
    const requireApproval = process.env["PUBLISH_APPLY_ALL"] !== "true";
    const wordpress = wordpressConfigFromEnv();

    const report = await runLayer4({
      manifest: parsed,
      outputDir: resolve(runsDir, safeDomainSlug(domain), "publish"),
      requireApproval,
      wordpress,
    });

    // Persist updated statuses back to the same manifest file.
    writeJson(manifestPath, report.manifest);

    const summary = {
      domain,
      manifestPath,
      applied: report.applied,
      failed: report.failed,
      skipped: report.skipped,
      unhandled: report.unhandled,
    };
    process.stdout.write(JSON.stringify(summary) + "\n");
    process.exit(0);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log.error("publish failed", { domain, error: msg });
    process.stderr.write(`publish failed: ${msg}\n`);
    process.exit(1);
  }
}

void main();
