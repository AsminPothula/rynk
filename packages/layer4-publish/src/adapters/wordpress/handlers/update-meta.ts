/**
 * applyUpdateMeta — sets the title + meta description of a single
 * post/page in WordPress.
 *
 * Process:
 *   1. Find the post/page by the action.target.url's slug
 *   2. Detect which SEO plugin is active (Yoast / RankMath / SEOPress / none)
 *   3. PUT the new title to /wp/v2/{type}/{id} → updates the WP title
 *   4. PUT the meta description into the plugin's own meta field
 *      (or _meta_description for "none" fallback — won't render, but
 *      records intent so the human can wire it up)
 *
 * Returns ApplyResult with externalRef = WP post ID, externalUrl = post URL.
 */

import { createLogger } from "@rynk/core";
import type { ExecutionAction, UpdateMetaAction } from "@rynk/layer3-generate";
import type { ApplyResult } from "../../types.js";
import { WordPressClient } from "../client.js";

const log = createLogger("layer4.wp.update-meta");

/**
 * Maps detected SEO plugin → the meta description field name in WP's
 * post.meta JSON. Each plugin stores it differently.
 */
const META_DESCRIPTION_FIELD: Record<string, string> = {
  yoast: "_yoast_wpseo_metadesc",
  "rank-math": "rank_math_description",
  seopress: "_seopress_titles_desc",
  none: "_meta_description", // generic fallback — not rendered without a plugin
};

const META_TITLE_FIELD: Record<string, string> = {
  yoast: "_yoast_wpseo_title",
  "rank-math": "rank_math_title",
  seopress: "_seopress_titles_title",
  none: "_meta_title",
};

export async function applyUpdateMeta(
  client: WordPressClient,
  action: ExecutionAction,
): Promise<ApplyResult> {
  if (action.type !== "update_meta") {
    return { status: "skipped", message: "Not an update_meta action" };
  }
  const update = action as UpdateMetaAction;

  // 1. Find the post.
  const summary = await client.findPostByUrl(update.target.url);
  if (!summary) {
    return {
      status: "failed",
      error: `No post or page found at ${update.target.url}`,
    };
  }
  const postType = summary.type === "page" ? "page" : "post";

  // 2. Detect SEO plugin.
  const plugin = await client.detectSeoPlugin();
  log.info("post found, plugin detected", {
    actionId: action.id,
    postId: summary.id,
    postType,
    plugin,
  });

  // 3. Build the update payload.
  //    - title goes into the standard post.title field (always works)
  //    - meta description goes into the plugin-specific meta key
  const metaFields: Record<string, unknown> = {};
  const titleKey = META_TITLE_FIELD[plugin]!;
  const descKey = META_DESCRIPTION_FIELD[plugin]!;

  if (update.payload.title !== null) metaFields[titleKey] = update.payload.title;
  if (update.payload.metaDescription !== null) metaFields[descKey] = update.payload.metaDescription;

  const updateBody: Record<string, unknown> = {
    meta: metaFields,
  };
  // Also update the standard WP title so the front-end / RSS / etc. reflect it.
  if (update.payload.title !== null) {
    updateBody["title"] = update.payload.title;
  }

  // 4. PUT the update.
  const updated = await client.updatePost(postType, summary.id, updateBody);

  return {
    status: "applied",
    externalRef: String(summary.id),
    externalUrl: updated.link || summary.link,
    message: `Updated meta on ${postType} #${summary.id} via ${plugin === "none" ? "WP core (no SEO plugin detected)" : plugin}`,
  };
}
