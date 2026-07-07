/**
 * applyAddNapBlock - injects a Name / Address / Phone block on a page.
 *
 * The contact page (or any page targeted by the action) gets a structured
 * block of business identity info appended:
 *
 *   - Legal name
 *   - Address
 *   - Phone (linked tel:)
 *   - Email (linked mailto:) [optional]
 *
 * If payload.includeLocalBusinessSchema is true (default), a JSON-LD
 * LocalBusiness block is also injected so Google + AI engines pick up
 * the entity. The schema injection follows the same rynk:nap marker
 * pattern as inject-schema for idempotent re-runs.
 *
 * Idempotency: a single <!-- rynk:nap --> ... <!-- rynk:/nap --> envelope
 * wraps the whole block (HTML + script). Re-running replaces the previous
 * block instead of appending a duplicate.
 */

import { createLogger } from "@rynk/core";
import type { AddNAPBlockAction, ExecutionAction } from "@rynk/layer3-generate";
import type { ApplyResult } from "../../types.js";
import type { FileApplyStateStore } from "../../../state/apply-state.js";
import type { CachePurger } from "../../../cache/purger.js";
import { WordPressClient } from "../client.js";
import { checkHumanTouched, recordApply } from "./_human-touched-guard.js";
import { runPostApplyPurge } from "./_post-apply-purge.js";

const log = createLogger("layer4.wp.add-nap-block");

const NAP_OPEN = "<!-- rynk:nap -->";
const NAP_CLOSE = "<!-- rynk:/nap -->";

function buildNapHtml(p: AddNAPBlockAction["payload"]): string {
  const lines: string[] = [
    `<div class="rynk-nap" itemscope itemtype="https://schema.org/LocalBusiness">`,
    `  <h3 itemprop="name">${escapeHtml(p.legalName)}</h3>`,
    `  <p itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">`,
    `    <span itemprop="streetAddress">${escapeHtml(p.address)}</span>`,
    `  </p>`,
    `  <p>Phone: <a href="tel:${encodeURI(p.phone)}" itemprop="telephone">${escapeHtml(p.phone)}</a></p>`,
  ];
  if (p.email) {
    lines.push(`  <p>Email: <a href="mailto:${escapeHtml(p.email)}" itemprop="email">${escapeHtml(p.email)}</a></p>`);
  }
  lines.push(`</div>`);
  return lines.join("\n");
}

function buildLocalBusinessJsonLd(p: AddNAPBlockAction["payload"]): string {
  const json: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: p.legalName,
    address: {
      "@type": "PostalAddress",
      streetAddress: p.address,
    },
    telephone: p.phone,
  };
  if (p.email) json["email"] = p.email;
  return [
    `<script type="application/ld+json">`,
    JSON.stringify(json, null, 2),
    `</script>`,
  ].join("\n");
}

function stripExistingNapBlock(content: string): string {
  const start = content.indexOf(NAP_OPEN);
  if (start === -1) return content;
  const end = content.indexOf(NAP_CLOSE, start);
  if (end === -1) return content;
  return content.slice(0, start) + content.slice(end + NAP_CLOSE.length);
}

export async function applyAddNapBlock(
  client: WordPressClient,
  action: ExecutionAction,
  stateStore?: FileApplyStateStore,
  purger?: CachePurger,
): Promise<ApplyResult> {
  if (action.type !== "add_nap_block") {
    return { status: "skipped", message: "Not an add_nap_block action" };
  }
  const nap = action as AddNAPBlockAction;

  // 1. Find the page.
  const summary = await client.findPostByUrl(nap.target.url);
  if (!summary) {
    return { status: "failed", error: `No post or page found at ${nap.target.url}` };
  }
  const postType = summary.type === "page" ? "page" : "post";

  // Human-touched guard.
  const touched = await checkHumanTouched({
    client,
    postType,
    postSummary: summary,
    targetUrl: nap.target.url,
    stateStore,
  });
  if (touched.skip) return touched.result;

  // 2. Page-builder guard - injecting HTML into post_content won't
  //    show on Elementor/Divi/WPBakery pages. The LocalBusiness schema
  //    would still work but the visible NAP wouldn't - inconsistent
  //    result. Safer to skip entirely.
  const builder = await client.detectPageBuilder(postType, summary.id);
  if (builder) {
    const label = builder === "elementor" ? "Elementor" : builder === "divi" ? "Divi Builder" : "WPBakery";
    return {
      status: "skipped",
      externalRef: String(summary.id),
      externalUrl: summary.link,
      message: `Skipped - ${label} page. Add the NAP block manually via the ${label} editor to keep the visible NAP + LocalBusiness schema in sync.`,
      edgeCase: `page-builder-${builder}` as const,
    };
  }

  // 3. Fetch full content.
  const full = await client.getPost(postType, summary.id);
  const existingContent = full.content.raw ?? full.content.rendered ?? "";

  // 3. Build the new NAP block (HTML + optional LocalBusiness JSON-LD).
  const napHtml = buildNapHtml(nap.payload);
  const schemaScript = nap.payload.includeLocalBusinessSchema
    ? buildLocalBusinessJsonLd(nap.payload)
    : "";
  const wrappedBlock = [
    NAP_OPEN,
    napHtml,
    schemaScript,
    NAP_CLOSE,
  ]
    .filter((s) => s.length > 0)
    .join("\n");

  // 4. Strip any previous NAP block from us, append fresh one.
  const stripped = stripExistingNapBlock(existingContent);
  const newContent = `${stripped.trimEnd()}\n\n${wrappedBlock}\n`;

  // 5. PUT the updated content.
  const updated = await client.updatePost(postType, summary.id, { content: newContent });

  recordApply({ postType, postId: summary.id, actionId: action.id, stateStore });

  const purgeNote = await runPostApplyPurge({ purger, url: nap.target.url });

  log.info("NAP block applied", {
    actionId: action.id,
    postId: summary.id,
    postType,
    includeSchema: nap.payload.includeLocalBusinessSchema,
    replacedExisting: stripped !== existingContent,
  });

  return {
    status: "applied",
    externalRef: String(summary.id),
    externalUrl: updated.link || summary.link,
    message: `Injected NAP block${nap.payload.includeLocalBusinessSchema ? " + LocalBusiness schema" : ""} on ${postType} #${summary.id}${purgeNote}`,
  };
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
