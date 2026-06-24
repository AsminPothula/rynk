/**
 * applyInjectSchema — injects a JSON-LD <script> block into a WP page.
 *
 * Two routes possible:
 *   1. If Yoast or RankMath is installed AND target.location = "sitewide"
 *      and schemaType = "Organization", we could write to the plugin's
 *      schema graph. For now we keep it simple and always inject inline.
 *   2. Inline injection: append a <script type="application/ld+json"> block
 *      to the post's content. Idempotent — if a block of the same @type
 *      already exists, replace it.
 *
 * Why inline first: works on every site regardless of plugins, requires no
 * extra config, and is easy to debug ("View Page Source" reveals it).
 */

import { createLogger } from "@rynk/core";
import type { ExecutionAction, InjectSchemaAction } from "@rynk/layer3-generate";
import type { ApplyResult } from "../../types.js";
import { WordPressClient } from "../client.js";

const log = createLogger("layer4.wp.inject-schema");

/** Marker comment so we can find + replace our own scripts on re-runs. */
const RYNK_MARKER_PREFIX = "<!-- rynk:schema:";
const RYNK_MARKER_SUFFIX = " -->";

function rynkOpenMarker(schemaType: string): string {
  return `${RYNK_MARKER_PREFIX}${schemaType}${RYNK_MARKER_SUFFIX}`;
}
function rynkCloseMarker(schemaType: string): string {
  return `${RYNK_MARKER_PREFIX}/${schemaType}${RYNK_MARKER_SUFFIX}`;
}

/**
 * Build the markdown / HTML snippet that goes into the post content:
 *   <!-- rynk:schema:Article -->
 *   <script type="application/ld+json">
 *   { ... }
 *   </script>
 *   <!-- rynk:schema:/Article -->
 *
 * Wrapping in markers makes us idempotent on re-runs.
 */
function buildSchemaBlock(schemaType: string, jsonLd: unknown): string {
  const json = JSON.stringify(jsonLd, null, 2);
  return [
    rynkOpenMarker(schemaType),
    `<script type="application/ld+json">`,
    json,
    `</script>`,
    rynkCloseMarker(schemaType),
  ].join("\n");
}

/**
 * Remove a previously-injected block of the same schema type, if present.
 * Caller then appends the new block.
 */
function stripExistingBlock(content: string, schemaType: string): string {
  const open = rynkOpenMarker(schemaType);
  const close = rynkCloseMarker(schemaType);
  const startIdx = content.indexOf(open);
  if (startIdx === -1) return content;
  const endIdx = content.indexOf(close, startIdx);
  if (endIdx === -1) return content; // malformed — leave alone
  return content.slice(0, startIdx) + content.slice(endIdx + close.length);
}

export async function applyInjectSchema(
  client: WordPressClient,
  action: ExecutionAction,
): Promise<ApplyResult> {
  if (action.type !== "inject_schema") {
    return { status: "skipped", message: "Not an inject_schema action" };
  }
  const inject = action as InjectSchemaAction;

  // 1. Find the post/page.
  const summary = await client.findPostByUrl(inject.target.url);
  if (!summary) {
    return {
      status: "failed",
      error: `No post or page found at ${inject.target.url}`,
    };
  }
  const postType = summary.type === "page" ? "page" : "post";

  // 2. Fetch full post to get the raw content.
  const full = await client.getPost(postType, summary.id);
  const existingContent = full.content.raw ?? full.content.rendered ?? "";

  // 3. Build the new schema block and splice it in (idempotent).
  const schemaBlock = buildSchemaBlock(inject.target.schemaType, inject.payload.jsonLd);
  const stripped = stripExistingBlock(existingContent, inject.target.schemaType);
  const newContent = `${stripped.trimEnd()}\n\n${schemaBlock}\n`;

  // 4. PUT the updated content.
  const updated = await client.updatePost(postType, summary.id, { content: newContent });

  log.info("schema injected", {
    actionId: action.id,
    postId: summary.id,
    postType,
    schemaType: inject.target.schemaType,
    replacedExisting: stripped !== existingContent,
  });

  return {
    status: "applied",
    externalRef: String(summary.id),
    externalUrl: updated.link || summary.link,
    message: `Injected ${inject.target.schemaType} schema into ${postType} #${summary.id}`,
  };
}
