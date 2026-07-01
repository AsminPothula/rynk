/**
 * applyInsertInternalLink - inserts an anchor link inside an existing
 * page's content, pointing at another page on the same site.
 *
 * Strategy:
 *   1. Find the source post by URL
 *   2. Search its content for `anchorText` (case-sensitive first, then
 *      case-insensitive fallback)
 *   3. Idempotency check: if the same anchor wrapping already exists
 *      (i.e. a <a href="targetUrl"> already wraps the same phrase),
 *      skip - the link is already there
 *   4. Wrap the first matching occurrence with
 *      <a href="targetUrl" data-rynk="link">{anchorText}</a>
 *      The data-rynk attribute marks it as ours for future dedup / undo
 *   5. If the anchor phrase isn't found in the content (e.g. the body
 *      changed), fall back to appending a "Related" block at the bottom
 *      wrapped in rynk:related markers (idempotent on re-run)
 *
 * The `nearbyText` payload hint, when present, is used to disambiguate
 * which occurrence to wrap if `anchorText` appears multiple times. We
 * prefer the occurrence closest to nearbyText.
 */

import { createLogger } from "@rynk/core";
import type { ExecutionAction, InsertInternalLinkAction } from "@rynk/layer3-generate";
import type { ApplyResult } from "../../types.js";
import { WordPressClient } from "../client.js";

const log = createLogger("layer4.wp.insert-internal-link");

const RELATED_OPEN = "<!-- rynk:related -->";
const RELATED_CLOSE = "<!-- rynk:/related -->";

function escapeHtmlAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Check whether the content already contains an <a href="..."> that wraps
 * a phrase equal to `anchorText`. Catches the idempotent case where this
 * action ran before.
 */
function alreadyLinked(content: string, anchorText: string, targetUrl: string): boolean {
  // Strict: an anchor with our exact href + exact inner text.
  const pattern = new RegExp(
    `<a\\b[^>]*\\bhref\\s*=\\s*['"]${escapeRegex(targetUrl)}['"][^>]*>\\s*${escapeRegex(anchorText)}\\s*</a>`,
    "i",
  );
  return pattern.test(content);
}

/**
 * Find the index of `anchorText` in `content` that is NOT already inside
 * an <a> tag. When `nearbyText` is provided, prefer the occurrence whose
 * absolute distance to nearbyText is smallest.
 *
 * Returns -1 if no safe insertion point found.
 */
function findInsertionIndex(
  content: string,
  anchorText: string,
  nearbyText: string | undefined,
): number {
  // Build a list of all <a>...</a> ranges so we can avoid wrapping inside one.
  const linkRanges: Array<[number, number]> = [];
  const linkRe = /<a\b[^>]*>[\s\S]*?<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(content)) !== null) {
    linkRanges.push([m.index, m.index + m[0].length]);
  }
  const inLink = (idx: number): boolean =>
    linkRanges.some(([s, e]) => idx >= s && idx < e);

  // Collect all occurrences of anchorText that are NOT inside a link.
  const occurrences: number[] = [];
  const anchorRe = new RegExp(escapeRegex(anchorText), "g");
  while ((m = anchorRe.exec(content)) !== null) {
    if (!inLink(m.index)) occurrences.push(m.index);
  }
  // Case-insensitive fallback if strict match missed everything.
  if (occurrences.length === 0) {
    const ciRe = new RegExp(escapeRegex(anchorText), "gi");
    while ((m = ciRe.exec(content)) !== null) {
      if (!inLink(m.index)) occurrences.push(m.index);
    }
  }
  if (occurrences.length === 0) return -1;

  if (!nearbyText) return occurrences[0]!;
  const nearbyIdx = content.indexOf(nearbyText);
  if (nearbyIdx === -1) return occurrences[0]!;

  // Return occurrence closest to nearbyText.
  return occurrences.reduce((best, curr) =>
    Math.abs(curr - nearbyIdx) < Math.abs(best - nearbyIdx) ? curr : best,
  );
}

function stripRelatedBlock(content: string): string {
  const start = content.indexOf(RELATED_OPEN);
  if (start === -1) return content;
  const end = content.indexOf(RELATED_CLOSE, start);
  if (end === -1) return content;
  return content.slice(0, start) + content.slice(end + RELATED_CLOSE.length);
}

export async function applyInsertInternalLink(
  client: WordPressClient,
  action: ExecutionAction,
): Promise<ApplyResult> {
  if (action.type !== "insert_internal_link") {
    return { status: "skipped", message: "Not an insert_internal_link action" };
  }
  const insert = action as InsertInternalLinkAction;
  const anchorText = insert.payload.anchorText;
  const targetUrl = insert.target.targetUrl;

  // 1. Find the source post.
  const summary = await client.findPostByUrl(insert.target.sourceUrl);
  if (!summary) {
    return { status: "failed", error: `No post found at sourceUrl ${insert.target.sourceUrl}` };
  }
  const postType = summary.type === "page" ? "page" : "post";

  // 2. Page-builder guard - inline link insertion in post_content won't
  //    take effect on Elementor/Divi/WPBakery pages.
  const builder = await client.detectPageBuilder(postType, summary.id);
  if (builder) {
    const label = builder === "elementor" ? "Elementor" : builder === "divi" ? "Divi Builder" : "WPBakery";
    return {
      status: "skipped",
      externalRef: String(summary.id),
      externalUrl: summary.link,
      message: `Skipped - ${label} page. Add the link "${anchorText}" -> ${targetUrl} manually via the ${label} editor.`,
      edgeCase: `page-builder-${builder}` as const,
    };
  }

  // 3. Fetch full content.
  const full = await client.getPost(postType, summary.id);
  const existing = full.content.raw ?? full.content.rendered ?? "";

  // 3. Idempotency check.
  if (alreadyLinked(existing, anchorText, targetUrl)) {
    log.info("link already present, skipping", { actionId: action.id, postId: summary.id });
    return {
      status: "applied",
      externalRef: String(summary.id),
      externalUrl: summary.link,
      message: `Internal link already present on ${postType} #${summary.id} - no-op`,
    };
  }

  // 4. Try to find an in-text insertion point.
  const idx = findInsertionIndex(existing, anchorText, insert.payload.nearbyText);

  let newContent: string;
  let mode: "wrapped-inline" | "appended-related";

  if (idx !== -1) {
    // Wrap the matching phrase with the anchor.
    const matchedSlice = existing.slice(idx, idx + anchorText.length);
    const replacement = `<a href="${escapeHtmlAttr(targetUrl)}" data-rynk="link">${matchedSlice}</a>`;
    newContent = existing.slice(0, idx) + replacement + existing.slice(idx + anchorText.length);
    mode = "wrapped-inline";
  } else {
    // Fall back to a "Related" block at the end, idempotent via markers.
    const relatedHtml = [
      RELATED_OPEN,
      `<p><strong>Related:</strong> <a href="${escapeHtmlAttr(targetUrl)}" data-rynk="link">${anchorText}</a></p>`,
      RELATED_CLOSE,
    ].join("\n");
    const stripped = stripRelatedBlock(existing);
    newContent = `${stripped.trimEnd()}\n\n${relatedHtml}\n`;
    mode = "appended-related";
  }

  // 5. PUT updated content.
  const updated = await client.updatePost(postType, summary.id, { content: newContent });

  log.info("internal link inserted", {
    actionId: action.id,
    postId: summary.id,
    postType,
    anchorText,
    targetUrl,
    mode,
  });

  return {
    status: "applied",
    externalRef: String(summary.id),
    externalUrl: updated.link || summary.link,
    message: `Linked "${anchorText}" -> ${targetUrl} on ${postType} #${summary.id} (${mode})`,
  };
}
