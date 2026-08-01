/**
 * Layer 4 runner — assemble the default adapter set and apply a manifest.
 *
 * This is the piece that makes Layer 4 invocable end-to-end (the package
 * otherwise only exposes `applyManifest` + individual adapter factories). It
 * builds every adapter in its SAFE default mode:
 *   - image / document / social / code-pr / outreach / offsite → mock, writing
 *     drafts under `outputDir`; they never touch a live client property.
 *   - WordPress (the only adapter that can mutate a real site) is included ONLY
 *     when explicit credentials are passed, and even then stays in skeleton
 *     mode unless WORDPRESS_LIVE=true. Omit `wordpress` and CMS actions simply
 *     get status="skipped" (no adapter) — never published by accident.
 *
 * Approval-gated by default (`requireApproval: true`) so only actions a human
 * marked "approved" are applied.
 */

import { resolve } from "node:path";
import { createLogger } from "@rynk/core";
import type { ExecutionManifest } from "@rynk/layer3-generate";
import { applyManifest, type ApplyReport } from "./apply.js";
import type { ActionAdapter } from "./adapters/types.js";
import { makeImageAdapter } from "./adapters/image/index.js";
import { makeDocumentAdapter } from "./adapters/document/index.js";
import { makeSocialAdapter } from "./adapters/social/index.js";
import { makeCodePrAdapter } from "./adapters/code-pr/index.js";
import { makeOutreachAdapter } from "./adapters/outreach/index.js";
import { makeOffsiteAdapter } from "./adapters/offsite/index.js";
import {
  makeWordPressAdapter,
  type WordPressAdapterConfig,
} from "./adapters/wordpress/index.js";

const log = createLogger("layer4.run");

export interface RunLayer4Options {
  manifest: ExecutionManifest;
  /** Where mock adapters write drafts, e.g. runs/{safeDomain}/publish. */
  outputDir: string;
  /** Only apply actions in status "approved". Default true (safe). */
  requireApproval?: boolean;
  /**
   * WordPress credentials. When provided, the CMS adapter is included (still
   * gated by WORDPRESS_LIVE for real HTTP). Omit to skip CMS actions entirely.
   */
  wordpress?: WordPressAdapterConfig;
  /**
   * Extra adapters, prepended so they win `canHandle` over the defaults — used
   * in tests to inject in-memory adapters.
   */
  extraAdapters?: ActionAdapter[];
}

/**
 * Build the default, mock-first adapter set. Exposed so callers/tests can
 * inspect or extend it. WordPress is included only when creds are supplied.
 */
export function defaultAdapterSet(
  outputDir: string,
  wordpress?: WordPressAdapterConfig,
): ActionAdapter[] {
  const adapters: ActionAdapter[] = [
    makeImageAdapter(),
    makeDocumentAdapter({ outputDir: resolve(outputDir, "documents") }),
    makeSocialAdapter({ outputDir: resolve(outputDir, "social") }),
    makeCodePrAdapter({ outputDir: resolve(outputDir, "code-pr") }),
    makeOutreachAdapter({ outputDir: resolve(outputDir, "outreach") }),
    makeOffsiteAdapter({ outputDir: resolve(outputDir, "offsite") }),
  ];
  if (wordpress) {
    // CMS adapter first so it wins canHandle for cms actions.
    adapters.unshift(makeWordPressAdapter(wordpress));
  }
  return adapters;
}

export async function runLayer4(opts: RunLayer4Options): Promise<ApplyReport> {
  const adapters = [
    ...(opts.extraAdapters ?? []),
    ...defaultAdapterSet(opts.outputDir, opts.wordpress),
  ];

  log.info("Layer 4 run start", {
    domain: opts.manifest.domain,
    outputDir: opts.outputDir,
    hasWordPress: Boolean(opts.wordpress),
    adapters: adapters.map((a) => a.adapterName),
  });

  const report = await applyManifest({
    manifest: opts.manifest,
    adapters,
    requireApproval: opts.requireApproval ?? true,
  });

  log.info("Layer 4 run complete", {
    domain: opts.manifest.domain,
    applied: report.applied,
    failed: report.failed,
    skipped: report.skipped,
    unhandled: report.unhandled,
  });

  return report;
}
