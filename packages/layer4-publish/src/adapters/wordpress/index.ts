/**
 * WordPress CMS adapter - applies manifest actions via the WP REST API.
 *
 * Live mode is gated by WORDPRESS_LIVE=true. Five handlers are real today:
 *   - applyUpdateMeta    - sets title + meta description via the active
 *     SEO plugin's meta keys (Yoast / RankMath / SEOPress / none fallback)
 *   - applyInjectSchema  - appends a <script type="application/ld+json">
 *     block to the post content (idempotent via rynk:schema:Type markers)
 *   - applyCreatePage    - POSTs a new page or post from markdown body,
 *     idempotent on re-runs by slug lookup, defaults to draft status
 *   - applyAddNapBlock   - injects a NAP block (+ optional LocalBusiness
 *     JSON-LD), idempotent via rynk:nap markers
 *   - applyUpdatePage    - 4 operations: rewrite / expand / consolidate /
 *     refresh, each with its own idempotency strategy
 *
 * Still pending (intern handlers, smaller scope):
 *   - applyAddRedirect, applyInsertInternalLink, applyCreateAuthor,
 *     applyAssignAuthor
 */

import { createLogger, optionalEnv } from "@rynk/core";
import type { ExecutionAction } from "@rynk/layer3-generate";
import type { ApplyResult, CMSAdapter } from "../types.js";
import { WordPressClient, WordPressApiError } from "./client.js";
import { applyUpdateMeta } from "./handlers/update-meta.js";
import { applyInjectSchema } from "./handlers/inject-schema.js";
import { applyCreatePage } from "./handlers/create-page.js";
import { applyAddNapBlock } from "./handlers/add-nap-block.js";
import { applyUpdatePage } from "./handlers/update-page.js";

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
            return await applyUpdateMeta(getClient(), action);
          case "inject_schema":
            return await applyInjectSchema(getClient(), action);
          case "create_page":
            return await applyCreatePage(getClient(), action);
          case "update_page":
            return await applyUpdatePage(getClient(), action);
          case "add_nap_block":
            return await applyAddNapBlock(getClient(), action);
          case "add_redirect":
            return await applyAddRedirect(siteUrl, action, config);
          case "insert_internal_link":
            return await applyInsertInternalLink(siteUrl, action, config);
          case "create_author":
            return await applyCreateAuthor(siteUrl, action, config);
          case "assign_author":
            return await applyAssignAuthor(siteUrl, action, config);
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

// ── Stubs for handlers still pending (intern work) ──────────────────────────

async function applyAddRedirect(
  _siteUrl: string,
  _action: ExecutionAction,
  _config: WordPressAdapterConfig,
): Promise<ApplyResult> {
  throw new Error("add_redirect not yet implemented (route: Yoast Premium API / Redirection plugin)");
}
async function applyInsertInternalLink(
  _siteUrl: string,
  _action: ExecutionAction,
  _config: WordPressAdapterConfig,
): Promise<ApplyResult> {
  throw new Error("insert_internal_link not yet implemented (fetch post body, anchor insert, PUT back)");
}
async function applyCreateAuthor(
  _siteUrl: string,
  _action: ExecutionAction,
  _config: WordPressAdapterConfig,
): Promise<ApplyResult> {
  throw new Error("create_author not yet implemented (POST /wp-json/wp/v2/users)");
}
async function applyAssignAuthor(
  _siteUrl: string,
  _action: ExecutionAction,
  _config: WordPressAdapterConfig,
): Promise<ApplyResult> {
  throw new Error("assign_author not yet implemented (PUT post.author)");
}
