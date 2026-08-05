/**
 * Manifest applier — walks every action in an ExecutionManifest, finds the
 * first registered adapter that says canHandle(action), runs apply(action),
 * and updates the action's status in place.
 *
 * Walks safely:
 *   - Actions already in a terminal state (applied / rejected / failed)
 *     are skipped.
 *   - Adapter exceptions are caught — never crashes the whole apply pass.
 *   - Unhandled actions get status="skipped" with a clear message.
 *
 * Returns the same manifest object with updated statuses + a summary that
 * reflects post-apply counts.
 */

import { createLogger } from "@rynk/core";
import {
  summarizeActions,
  type ExecutionManifest,
} from "@rynk/layer3-generate";
import type { ActionAdapter, ApplyResult } from "./adapters/types.js";
import { isEligibleToApply, type PublishPolicy } from "./policy.js";

const log = createLogger("layer4.apply");

export interface ApplyOptions {
  manifest: ExecutionManifest;
  adapters: ActionAdapter[];
  /**
   * If true (default), the publishing policy gates each action: technical
   * actions auto-apply, visible ones need approval (or a client auto-publish
   * opt-in via `policy`). If false, every non-terminal action is applied
   * regardless — used for dry-runs / full mock passes.
   */
  requireApproval?: boolean;
  /**
   * Client publishing preferences — which visible content categories they've
   * opted into auto-publishing. Omitted → every visible action needs approval.
   */
  policy?: PublishPolicy;
  /** Per-action timeout in ms — fail the action if adapter hangs. */
  perActionTimeoutMs?: number;
}

export interface ApplyReport {
  manifest: ExecutionManifest;
  applied: number;
  failed: number;
  skipped: number;
  unhandled: number;
}

/**
 * Apply every applicable action. Returns the updated manifest + per-status
 * counts. Idempotent — safe to call multiple times; already-terminal actions
 * are skipped.
 */
export async function applyManifest(opts: ApplyOptions): Promise<ApplyReport> {
  const requireApproval = opts.requireApproval ?? true;
  const timeoutMs = opts.perActionTimeoutMs ?? 60_000;
  const m = opts.manifest;

  log.info("apply start", {
    domain: m.domain,
    actions: m.actions.length,
    adapters: opts.adapters.map((a) => a.adapterName),
    requireApproval,
  });

  let applied = 0;
  let failed = 0;
  let skipped = 0;
  let unhandled = 0;

  for (const action of m.actions) {
    // Skip terminal states.
    if (
      action.status === "applied" ||
      action.status === "failed" ||
      action.status === "rejected" ||
      action.status === "skipped"
    ) {
      continue;
    }

    // Publishing policy gate: technical actions auto-apply; visible ones need
    // approval (or a client auto-publish opt-in for that category). Ineligible
    // actions stay `pending` — that pending set is the approval queue.
    if (requireApproval && !isEligibleToApply(action, opts.policy)) {
      log.debug("held for approval", {
        actionId: action.id,
        type: action.type,
        status: action.status,
      });
      continue;
    }

    // Find the first adapter that handles this action.
    const adapter = opts.adapters.find((a) => a.canHandle(action));
    if (!adapter) {
      action.status = "skipped";
      unhandled += 1;
      log.warn("no adapter found for action", { actionId: action.id, type: action.type });
      continue;
    }

    // Apply with timeout.
    let result: ApplyResult;
    try {
      result = await withTimeout(adapter.apply(action), timeoutMs);
    } catch (err) {
      result = {
        status: "failed",
        error: err instanceof Error ? err.message : String(err),
      };
    }

    action.status = result.status;
    if (result.status === "applied") applied += 1;
    else if (result.status === "failed") failed += 1;
    else if (result.status === "skipped") skipped += 1;

    log.info("action processed", {
      actionId: action.id,
      type: action.type,
      adapter: adapter.adapterName,
      status: action.status,
      externalRef: result.externalRef,
    });
  }

  // Refresh the summary so the persisted manifest reflects new statuses.
  m.summary = summarizeActions(m.actions);

  log.info("apply complete", { applied, failed, skipped, unhandled });
  return { manifest: m, applied, failed, skipped, unhandled };
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`adapter timed out after ${ms}ms`)), ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}
