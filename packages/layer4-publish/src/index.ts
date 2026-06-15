/**
 * @rynk/layer4-publish entry point.
 *
 * Public surface:
 *   - applyManifest()  — walk a manifest, dispatch to adapters
 *   - ActionAdapter / CMSAdapter contracts
 *   - makeWordPressAdapter() — first concrete adapter (skeleton today)
 *
 * Future adapters land alongside `wordpress/` under `./adapters/{name}/`.
 */

export * from "./adapters/types.js";
export * from "./apply.js";
export { makeWordPressAdapter } from "./adapters/wordpress/index.js";
export type { WordPressAdapterConfig } from "./adapters/wordpress/index.js";
export { makeImageAdapter } from "./adapters/image/index.js";
export type { ImageAdapterConfig } from "./adapters/image/index.js";
