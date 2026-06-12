/**
 * @rynk/layer3-generate — Layer 3 entry point.
 *
 * Layer 3 consumes Layer 2's strategy.json and produces an
 * ExecutionManifest — a typed, versioned list of every change rynk plans
 * to make for the client (content, meta, schema, redirects, brand posts,
 * outreach drafts, code PRs, offsite updates).
 *
 * The manifest is the contract handed to Layer 4 (publish), which routes
 * each action to the right adapter (CMS, GitHub, GBP, etc).
 *
 * This file re-exports the schema + types. Generators live in `./generators/`
 * (added one at a time). The main `runLayer3()` orchestrator will be added
 * once at least two generators exist.
 */

export * from "./schema/execution-manifest.js";
export * from "./generators/index.js";
export { saveExecutionManifest } from "./utils/output-writer.js";
export type { SaveManifestResult } from "./utils/output-writer.js";
export { executionManifestToMarkdown } from "./utils/markdown-renderer.js";
