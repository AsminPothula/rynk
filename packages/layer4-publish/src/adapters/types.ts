/**
 * Adapter contract — every Layer 4 adapter (CMS, GitHub, GBP, etc.) implements
 * the same interface. The manifest applier walks actions, picks the first
 * adapter that says `canHandle(action) = true`, then calls `apply(action)`.
 *
 * Why one interface for everything (CMS, code-pr, offsite):
 *   - Single dispatch path in applyManifest
 *   - Adapters can be added incrementally without changing the orchestrator
 *   - Tests can swap a real adapter for an in-memory one trivially
 *
 * Adapter families specialise via the `channel` field and optionally extra
 * properties (e.g. `cmsName` on CMSAdapter, `host` for offsite providers).
 */

import type {
  ActionChannel,
  ActionStatus,
  ExecutionAction,
} from "@rynk/layer3-generate";

/**
 * Machine-readable reason codes for skips and failures.
 *
 * These are stable identifiers the dashboard uses to group results across
 * many actions ("show me all actions skipped due to Elementor"). Free-text
 * `message` remains for humans; `edgeCase` is for aggregation.
 *
 * Keep this list ordered by category so adding new codes doesn't shuffle
 * the values that already exist:
 *   - page-builder-*   post is managed by a page builder plugin
 *   - unsupported-*    action or state we don't yet handle
 *   - client-config-*  something in the client's WP config prevents apply
 *   - dependency-*     a required plugin/service is missing on the site
 */
export type EdgeCaseCode =
  | "page-builder-elementor"
  | "page-builder-divi"
  | "page-builder-wpbakery"
  | "unsupported-post-type"
  | "unsupported-permalink-mode"
  | "client-config-cache-locked"
  | "dependency-redirect-plugin-missing"
  | "dependency-seo-plugin-missing"
  /** Human edited the target page in wp-admin AFTER rynk's last apply. */
  | "human-edit-since-rynk"
  /** URL is on the client's human-only allowlist - rynk never touches it. */
  | "human-only-url";

/** Outcome of applying a single action. */
export interface ApplyResult {
  status: Exclude<ActionStatus, "pending">;
  /** Adapter-specific identifier of what was created / updated (e.g. WP post ID). */
  externalRef?: string | null;
  /** URL of the staged or live artifact, when applicable. */
  externalUrl?: string | null;
  /** Free-text detail — surfaced in logs and the dashboard. */
  message?: string;
  /** Set when status === "failed" or "skipped". */
  error?: string;
  /**
   * Machine-readable reason code when we skipped or failed for a known
   * reason. Lets the dashboard group results ("show me every action
   * skipped because of Elementor") without parsing message strings.
   */
  edgeCase?: EdgeCaseCode;
}

/**
 * The shared contract. Every adapter declares which channel it handles plus
 * a `canHandle` filter — usually a check on action.type, but adapters can
 * decline specific actions for any reason (e.g. WP adapter declines page
 * builder pages it can't safely edit).
 */
export interface ActionAdapter {
  /** Stable identifier for logs + manifest provenance. */
  readonly adapterName: string;
  /** Channel this adapter serves. */
  readonly channel: ActionChannel;
  /** Whether this adapter can handle the given action. */
  canHandle(action: ExecutionAction): boolean;
  /** Apply the action. Should never throw — return a failed ApplyResult instead. */
  apply(action: ExecutionAction): Promise<ApplyResult>;
}

/**
 * CMS adapters add a CMS name so the applier can pick the right one when
 * a client uses a specific CMS (WordPress / Webflow / Shopify / etc).
 */
export interface CMSAdapter extends ActionAdapter {
  readonly channel: "cms";
  /** "wordpress", "webflow", "shopify", "contentful"… */
  readonly cmsName: string;
}
