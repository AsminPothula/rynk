/**
 * WordPress CMS adapter - applies manifest actions via the WP REST API.
 *
 * Live mode is gated by WORDPRESS_LIVE=true. Handlers live today:
 *   - applyUpdateMeta          sets title + meta description via the
 *                              active SEO plugin's meta keys
 *   - applyInjectSchema        appends a <script type="application/ld+json">
 *                              block (idempotent via rynk:schema markers)
 *   - applyCreatePage          POSTs a new page/post from markdown,
 *                              idempotent on re-runs by slug lookup
 *   - applyAddNapBlock         injects NAP + optional LocalBusiness JSON-LD
 *                              (idempotent via rynk:nap markers)
 *   - applyUpdatePage          4 ops: rewrite / expand / consolidate /
 *                              refresh, each with its own idempotency
 *   - applyInsertInternalLink  wraps in-text phrase with an <a> to the
 *                              target URL, falls back to a Related block
 *                              if the phrase isn't found in content
 *   - applyCreateAuthor        creates a WP user with role=author, custom
 *                              meta for credentials + LinkedIn + headshot
 *   - applyAddRedirect         creates/updates redirects via the Redirection
 *                              plugin REST API
 *   - applyAssignAuthor        sets post.author to a prior create_author user
 */

import { createLogger, optionalEnv } from "@rynk/core";
import type { ExecutionAction } from "@rynk/layer3-generate";
import type { ApplyResult, CMSAdapter } from "../types.js";
import { WordPressClient, WordPressApiError } from "./client.js";
import { FileApplyStateStore } from "../../state/apply-state.js";
import { applyUpdateMeta } from "./handlers/update-meta.js";
import { applyInjectSchema } from "./handlers/inject-schema.js";
import { applyCreatePage } from "./handlers/create-page.js";
import { applyAddNapBlock } from "./handlers/add-nap-block.js";
import { applyUpdatePage } from "./handlers/update-page.js";
import { applyInsertInternalLink } from "./handlers/insert-internal-link.js";
import { applyCreateAuthor } from "./handlers/create-author.js";
import { applyAddRedirect } from "./handlers/add-redirect.js";
import { applyAssignAuthor } from "./handlers/assign-author.js";


const log = createLogger("layer4.wordpress");

/** Action types this adapter knows about today. */
const SUPPORTED_TYPES = new Set([
  "update_meta",
  "create_page",
  "update_page",
  "inject_schema",
  "add_redirect",
  "insert_internal_link",
  "create_author",
  "assign_author",
  "add_nap_block",
]);

export interface WordPressAdapterConfig {
  /** Site URL — e.g. "https://itechdata.ai". Trailing slash optional. */
  siteUrl: string;
  /** WP REST API username. */
  username: string;
  /** WP REST API application password. */
  appPassword: string;
  /**
   * Optional path to the per-client apply-state JSON file. When set, the
   * adapter records every successful apply and refuses to overwrite pages
   * a human has edited since our last touch. When omitted, no history is
   * tracked and no human-touched check runs (backwards compat).
   */
  stateFilePath?: string;
}

/**
 * Construct the adapter. Pass config explicitly when running per-client
 * (env vars per client = file like `.env.{safeDomain}`).
 */
export function makeWordPressAdapter(config: WordPressAdapterConfig): CMSAdapter {
  const live = optionalEnv("WORDPRESS_LIVE", "false").toLowerCase() === "true";
  const siteUrl = config.siteUrl.replace(/\/$/, "");

  // Client is constructed lazily on first apply so skeleton mode never
  // touches the network even by accident.
  let client: WordPressClient | null = null;
  const getClient = (): WordPressClient => {
    if (!client) client = new WordPressClient({ ...config, siteUrl });
    return client;
  };

  // State store is constructed once - lightweight since it re-reads the
  // JSON file on every access (no in-memory cache to invalidate).
  const stateStore = config.stateFilePath
    ? new FileApplyStateStore(config.stateFilePath)
    : undefined;

  return {
    adapterName: "wordpress",
    channel: "cms",
    cmsName: "wordpress",

    canHandle(action: ExecutionAction): boolean {
      if (action.channel !== "cms") return false;
      return SUPPORTED_TYPES.has(action.type);
    },

    async apply(action: ExecutionAction): Promise<ApplyResult> {
      // Hard guard: never make HTTP calls in skeleton mode.
      if (!live) {
        log.info("skeleton mode — would call WP REST", {
          actionId: action.id,
          type: action.type,
          siteUrl,
        });
        return {
          status: "skipped",
          message: `WordPress adapter is in skeleton mode (set WORDPRESS_LIVE=true to enable).`,
          externalRef: null,
          externalUrl: null,
        };
      }

      try {
        switch (action.type) {
          case "update_meta":
            return await applyUpdateMeta(getClient(), action, stateStore);
          case "inject_schema":
            return await applyInjectSchema(getClient(), action, stateStore);
          case "create_page":
            return await applyCreatePage(getClient(), action);
          case "update_page":
            return await applyUpdatePage(getClient(), action, stateStore);
          case "add_nap_block":
            return await applyAddNapBlock(getClient(), action, stateStore);
          case "insert_internal_link":
            return await applyInsertInternalLink(getClient(), action, stateStore);
          case "create_author":
            return await applyCreateAuthor(getClient(), siteUrl, action);
          case "add_redirect":
            return await applyAddRedirect(getClient(), action);
          case "assign_author":
            return await applyAssignAuthor(getClient(), action);

          default:
            return {
              status: "skipped",
              message: `WordPress adapter doesn't yet support action type "${action.type}".`,
            };
        }
      } catch (err) {
        // Map WordPressApiError to a structured failure for the dashboard to surface.
        if (err instanceof WordPressApiError) {
          const msg = `WP REST ${err.status} on ${err.endpoint}`;
          log.error("apply failed", { actionId: action.id, status: err.status, endpoint: err.endpoint });
          return { status: "failed", error: msg };
        }
        const msg = err instanceof Error ? err.message : String(err);
        log.error("apply failed", { actionId: action.id, error: msg });
        return { status: "failed", error: msg };
      }
    },
  };
}
