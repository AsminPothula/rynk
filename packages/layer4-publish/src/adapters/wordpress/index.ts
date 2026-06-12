/**
 * WordPress CMS adapter — applies manifest actions via the WP REST API.
 *
 * Status: **skeleton**. Method shapes + dispatch are real; HTTP calls are
 * stubbed pending live test environment + credentials. Switch
 * `WORDPRESS_LIVE=true` in `.env` to enable real calls once ready (will throw
 * "not implemented" today — the stubs prevent accidental side effects).
 *
 * What this skeleton already does correctly:
 *   - Declares the right channel + cmsName
 *   - Dispatches every CMS-channel action type via canHandle / apply
 *   - Logs each call exactly as the live version will
 *   - Returns a structured ApplyResult (skipped + message) so the manifest
 *     applier records progress consistently
 *
 * What live mode adds (when wired):
 *   - WP REST API auth via application password (per-client .env file)
 *   - Yoast / RankMath / SEOPress detection for meta + schema fields
 *   - Page-builder detector (Elementor/Divi/Gutenberg) for safe content edits
 *   - Redirect plugin selection (Yoast Premium / Redirection / .htaccess)
 */

import { createLogger, optionalEnv } from "@rynk/core";
import type { ExecutionAction } from "@rynk/layer3-generate";
import type { ApplyResult, CMSAdapter } from "../types.js";

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

      // Live dispatch — implementations to come. Throws clearly so a misconfigured
      // env doesn't silently do nothing.
      try {
        switch (action.type) {
          case "update_meta":
            return await applyUpdateMeta(siteUrl, action, config);
          case "create_page":
            return await applyCreatePage(siteUrl, action, config);
          case "update_page":
            return await applyUpdatePage(siteUrl, action, config);
          case "inject_schema":
            return await applyInjectSchema(siteUrl, action, config);
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
        const msg = err instanceof Error ? err.message : String(err);
        log.error("apply failed", { actionId: action.id, error: msg });
        return { status: "failed", error: msg };
      }
    },
  };
}

// ── Per-action handlers — typed but unimplemented ────────────────────────────
// Each method receives a narrowed action type via the discriminator. Live
// implementations will call WP REST endpoints and return ApplyResult.

async function applyUpdateMeta(
  _siteUrl: string,
  _action: ExecutionAction,
  _config: WordPressAdapterConfig,
): Promise<ApplyResult> {
  throw new Error("update_meta not yet implemented (needs Yoast/RankMath detector + REST call)");
}
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
async function applyInjectSchema(
  _siteUrl: string,
  _action: ExecutionAction,
  _config: WordPressAdapterConfig,
): Promise<ApplyResult> {
  throw new Error("inject_schema not yet implemented (route: Yoast schema graph or page body <script>)");
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
