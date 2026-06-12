/**
 * Persist an ExecutionManifest to disk alongside the audit + strategy.
 *
 * Mirrors saveStrategyOutput in layer2-strategy. Writes both JSON (for the
 * pipeline + dashboard to consume) and Markdown (for humans to skim).
 */

import { writeJson, writeText, buildRunPath } from "@rynk/core";
import type { ExecutionManifest } from "../schema/execution-manifest.js";
import { executionManifestToMarkdown } from "./markdown-renderer.js";

export interface SaveManifestResult {
  jsonPath: string;
  mdPath: string;
}

/**
 * Write `execution-manifest.json` + `execution-manifest.md` under
 * runs/{domain}/{today}/. Returns the resolved paths.
 */
export function saveExecutionManifest(
  manifest: ExecutionManifest,
  rootDir: string,
): SaveManifestResult {
  const jsonPath = buildRunPath(rootDir, manifest.domain, "execution-manifest.json");
  const mdPath = buildRunPath(rootDir, manifest.domain, "execution-manifest.md");

  writeJson(jsonPath, manifest);
  writeText(mdPath, executionManifestToMarkdown(manifest));

  return { jsonPath, mdPath };
}
