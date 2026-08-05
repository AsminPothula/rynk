/**
 * Publishing policy — decides which actions may publish automatically and which
 * must wait for the client's approval.
 *
 * The product rule (automation-first, client stays in control of anything
 * customer-facing):
 *   - TECHNICAL actions (metadata, schema, internal links, redirects) have no
 *     visible impact → always auto-publish, no approval.
 *   - VISIBLE actions (new pages, rewrites, posts, outreach, listings, images,
 *     documents, code) change what people see → require human approval, UNLESS
 *     the client has turned on auto-publish for that content category.
 *
 * `applyManifest` uses `isEligibleToApply` as its gate; unapproved visible
 * actions are left in `pending` — that pending set IS the approval queue the
 * dashboard shows.
 */

import type { ExecutionAction } from "@rynk/layer3-generate";

/** Action types that never change customer-facing content — always automatic. */
const TECHNICAL_TYPES = new Set([
  "update_meta",
  "inject_schema",
  "insert_internal_link",
  "add_redirect",
]);

export type ActionClass = "technical" | "visible";

/** Technical (auto) vs. visible (approval-gated). */
export function classifyAction(action: ExecutionAction): ActionClass {
  return TECHNICAL_TYPES.has(action.type) ? "technical" : "visible";
}

/**
 * Coarse content category for a visible action — the key the client's per-type
 * auto-publish setting is looked up under. Stable strings so the dashboard's
 * publishing toggles can map onto them.
 */
export function actionCategory(action: ExecutionAction): string {
  switch (action.type) {
    case "create_page":
      return action.target.pageType === "blog" ? "blog" : "landing-page";
    case "update_page":
      return action.target.operation === "rewrite" ? "copy-rewrite" : "page-edit";
    case "draft_brand_post":
      return "brand-post";
    case "draft_outreach":
      return "outreach";
    case "update_offsite_profile":
      return "listing";
    case "propose_code_change":
      return "code";
    case "create_document":
      return "document";
    case "create_image":
      return "image";
    case "create_author":
    case "assign_author":
      return "author";
    case "add_nap_block":
      return "nap";
    default:
      return "other";
  }
}

export interface PublishPolicy {
  /**
   * Content categories the client has opted into auto-publishing (from their
   * per-type Settings toggles). Anything not listed still needs approval.
   * Default: none (every visible action is manual — the new-client default).
   */
  autoPublishCategories?: string[];
}

/**
 * May this action be applied now?
 *   - technical → always yes (auto).
 *   - visible → yes only if a human approved it, or the client auto-publishes
 *     that category. Otherwise it stays pending (the approval queue).
 */
export function isEligibleToApply(
  action: ExecutionAction,
  policy: PublishPolicy = {},
): boolean {
  if (classifyAction(action) === "technical") return true;
  if (action.status === "approved") return true;
  return (policy.autoPublishCategories ?? []).includes(actionCategory(action));
}
