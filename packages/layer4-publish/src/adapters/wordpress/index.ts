/**
 * WordPress CMS adapter — applies manifest actions via the WP REST API.
 *
 * Live mode is gated by WORDPRESS_LIVE=true. Two handlers are real today:
 *   - applyUpdateMeta — sets title + meta description on a post/page,
 *     using whichever SEO plugin is detected (Yoast / RankMath / SEOPress
 *     / none) for the meta_description field.
 *   - applyInjectSchema — appends a <script type="application/ld+json">
 *     block to the post content, idempotent (replaces an existing block
 *     of the same @type if one is already there).
 *
 * The other handlers still throw "not implemented" — coming soon.
 */

import { createLogger, optionalEnv } from "@rynk/core";
import type { ExecutionAction } from "@rynk/layer3-generate";
import type { ApplyResult, CMSAdapter } from "../types.js";
import { WordPressClient, WordPressApiError } from "./client.js";
import { applyUpdateMeta } from "./handlers/update-meta.js";
import { applyInjectSchema } from "./handlers/inject-schema.js";

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
            return await applyCreatePage(siteUrl, action, config);
          case "update_page":
            return await applyUpdatePage(siteUrl, action, config);
          case "add_redirect":
            return await applyAddRedirect(siteUrl, action, config);
          case "insert_internal_link":
            return await applyInsertInternalLink(siteUrl, action, config);
          case "create_author":
            return await applyCreateAuthor(siteUrl, action, config);
          case "assign_author":
            return await applyAssignAuthor(siteUrl, action, config);
          case "add_nap_block":
            return await applyAddNapBlock(siteUrl, action, config);
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

// ── Stubs for handlers still pending (throw clearly) ────────────────────────

async function applyCreatePage(
  _siteUrl: string,
  _action: ExecutionAction,
  _config: WordPressAdapterConfig,
): Promise<ApplyResult> {
  throw new Error("create_page not yet implemented (needs POST /wp-json/wp/v2/pages or /posts)");
}
async function applyUpdatePage(
  _siteUrl: string,
  _action: ExecutionAction,
  _config: WordPressAdapterConfig,
): Promise<ApplyResult> {
  throw new Error("update_page not yet implemented (needs page-builder detector)");
}
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
async function applyAddNapBlock(
  _siteUrl: string,
  _action: ExecutionAction,
  _config: WordPressAdapterConfig,
): Promise<ApplyResult> {
  throw new Error("add_nap_block not yet implemented (modify page content + LocalBusiness schema)");
}
