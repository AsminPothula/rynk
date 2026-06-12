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
