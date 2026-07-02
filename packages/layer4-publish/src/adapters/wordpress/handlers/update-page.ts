/**
 * applyUpdatePage - modify body content of an existing WordPress page or
 * post. Four operations supported, each with distinct semantics:
 *
 *   rewrite     replace the entire content with payload.newBodyMarkdown
 *   expand      append payload.addSections (h2 + body) to existing content,
 *               wrapped in rynk:section markers so re-runs replace them
 *   consolidate fetch the bodies of payload.consolidateFromUrls and append
 *               them under a "Merged from" header inside rynk:consolidate
 *               markers. The actual 301s from the source URLs are handled
 *               by separate add_redirect actions in the manifest.
 *   refresh     light touch - just PUTs the existing content back so WP
 *               bumps the modified date (Google rewards recency). If
 *               payload.newBodyMarkdown is also provided, treats this as
 *               a rewrite with a date bump message.
 *
 * Idempotency:
 *   - rewrite is naturally idempotent (full replace).
 *   - expand wraps each new section in <!-- rynk:section:{slug} --> markers
 *     so a re-run replaces the section in place instead of duplicating.
 *   - consolidate wraps everything in one <!-- rynk:consolidate --> envelope.
 *   - refresh has nothing to dedupe.
 */

import { createLogger } from "@rynk/core";
import type { ExecutionAction, UpdatePageAction } from "@rynk/layer3-generate";
import type { ApplyResult } from "../../types.js";
import type { FileApplyStateStore } from "../../../state/apply-state.js";
import { WordPressClient } from "../client.js";
import { markdownToHtml } from "../markdown-to-html.js";
import { checkHumanTouched, recordApply } from "./_human-touched-guard.js";

const log = createLogger("layer4.wp.update-page");

const CONSOLIDATE_OPEN = "<!-- rynk:consolidate -->";
const CONSOLIDATE_CLOSE = "<!-- rynk:/consolidate -->";

function sectionOpenMarker(slug: string): string {
  return `<!-- rynk:section:${slug} -->`;
}
function sectionCloseMarker(slug: string): string {
  return `<!-- rynk:/section:${slug} -->`;
}

/** Convert "H2 heading text" -> "h2-heading-text" for marker reuse. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function stripMarkerBlock(content: string, openMarker: string, closeMarker: string): string {
  const start = content.indexOf(openMarker);
  if (start === -1) return content;
  const end = content.indexOf(closeMarker, start);
  if (end === -1) return content;
  return content.slice(0, start) + content.slice(end + closeMarker.length);
}

export async function applyUpdatePage(
  client: WordPressClient,
  action: ExecutionAction,
  stateStore?: FileApplyStateStore,
): Promise<ApplyResult> {
  if (action.type !== "update_page") {
    return { status: "skipped", message: "Not an update_page action" };
  }
  const update = action as UpdatePageAction;

  // 1. Find the page/post.
  const summary = await client.findPostByUrl(update.target.url);
  if (!summary) {
    return { status: "failed", error: `No post or page found at ${update.target.url}` };
  }
  const postType = summary.type === "page" ? "page" : "post";

  // Human-touched guard.
  const touched = await checkHumanTouched({
    client,
    postType,
    postSummary: summary,
    targetUrl: update.target.url,
    stateStore,
  });
  if (touched.skip) return touched.result;

  // 2. Page-builder guard - if the page is managed by Elementor / Divi /
  //    WPBakery, modifying post_content won't affect what visitors see.
  //    Skip with a clear reason so the team can apply manually.
  const builder = await client.detectPageBuilder(postType, summary.id);
  if (builder) {
    return {
      status: "skipped",
      externalRef: String(summary.id),
      externalUrl: summary.link,
      message: `Skipped - this page is built with ${builderLabel(builder)}, which stores content in its own format. Modifying WordPress's raw content field won't affect the rendered page. Apply this change manually via the ${builderLabel(builder)} editor.`,
      edgeCase: `page-builder-${builder}` as const,
    };
  }

  // 3. Fetch the current content.
  const full = await client.getPost(postType, summary.id);
  const existing = full.content.raw ?? full.content.rendered ?? "";

  // 3. Apply the operation.
  let newContent = existing;
  let summaryMessage = "";

  switch (update.target.operation) {
    case "rewrite": {
      if (!update.payload.newBodyMarkdown) {
        return { status: "failed", error: "rewrite operation requires payload.newBodyMarkdown" };
      }
      newContent = markdownToHtml(update.payload.newBodyMarkdown);
      summaryMessage = "rewrote entire body";
      break;
    }

    case "expand": {
      if (update.payload.addSections.length === 0) {
        return { status: "failed", error: "expand operation requires payload.addSections" };
      }
      let working = existing;
      for (const section of update.payload.addSections) {
        const slug = slugify(section.h2);
        const open = sectionOpenMarker(slug);
        const close = sectionCloseMarker(slug);
        const sectionHtml = [
          open,
          `<h2>${escapeHtml(section.h2)}</h2>`,
          markdownToHtml(section.body),
          close,
        ].join("\n");
        // Idempotency - if a section with this slug already exists, replace it.
        const stripped = stripMarkerBlock(working, open, close);
        working = `${stripped.trimEnd()}\n\n${sectionHtml}\n`;
      }
      newContent = working;
      summaryMessage = `appended ${update.payload.addSections.length} section(s)`;
      break;
    }

    case "consolidate": {
      // Fetch content of each source URL, merge into a single block.
      const mergedParts: string[] = [];
      for (const sourceUrl of update.payload.consolidateFromUrls) {
        const sourceSummary = await client.findPostByUrl(sourceUrl);
        if (!sourceSummary) {
          mergedParts.push(`<p><em>Source not found: ${escapeHtml(sourceUrl)}</em></p>`);
          continue;
        }
        const sourceType = sourceSummary.type === "page" ? "page" : "post";
        const sourceFull = await client.getPost(sourceType, sourceSummary.id);
        const sourceHtml = sourceFull.content.raw ?? sourceFull.content.rendered ?? "";
        mergedParts.push(
          `<h2>From ${escapeHtml(sourceSummary.title.rendered || sourceUrl)}</h2>`,
          sourceHtml,
        );
      }
      const stripped = stripMarkerBlock(existing, CONSOLIDATE_OPEN, CONSOLIDATE_CLOSE);
      const consolidatedBlock = [CONSOLIDATE_OPEN, ...mergedParts, CONSOLIDATE_CLOSE].join("\n\n");
      newContent = `${stripped.trimEnd()}\n\n${consolidatedBlock}\n`;
      summaryMessage = `consolidated ${update.payload.consolidateFromUrls.length} source URL(s)`;
      break;
    }

    case "refresh": {
      if (update.payload.newBodyMarkdown) {
        newContent = markdownToHtml(update.payload.newBodyMarkdown);
        summaryMessage = "rewrote body and bumped modified date";
      } else {
        // Just send back what's there. WP auto-bumps the modified timestamp on PUT.
        newContent = existing;
        summaryMessage = "bumped modified date";
      }
      break;
    }
  }

  // 4. PUT the updated content.
  const updated = await client.updatePost(postType, summary.id, { content: newContent });

  recordApply({ postType, postId: summary.id, actionId: action.id, stateStore });

  log.info("update_page applied", {
    actionId: action.id,
    postId: summary.id,
    postType,
    operation: update.target.operation,
  });

  return {
    status: "applied",
    externalRef: String(summary.id),
    externalUrl: updated.link || summary.link,
    message: `${update.target.operation}: ${summaryMessage} on ${postType} #${summary.id}`,
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function builderLabel(builder: "elementor" | "divi" | "wpbakery"): string {
  switch (builder) {
    case "elementor": return "Elementor";
    case "divi": return "Divi Builder";
    case "wpbakery": return "WPBakery Page Builder";
  }
}
