/**
 * Shared "was this page touched by a human since we last applied?" guard.
 *
 * Every content-modifying WP handler calls checkHumanTouched() before
 * doing any work. If it returns { skip: true }, the handler returns the
 * skip result directly and does not touch the site. If { skip: false },
 * the handler proceeds and calls recordApply() at the end of a
 * successful apply so the timestamp is up to date for next time.
 *
 * Two skip paths:
 *   - human-only-url         URL is on the client's manual allowlist
 *   - human-edit-since-rynk  WP's modified_gmt is newer than rynk's
 *                            lastAppliedAt, so a person edited the page
 *                            after we last touched it
 *
 * When no state store is configured (backwards compat), both checks are
 * silently skipped and the handler proceeds as before. This keeps the
 * feature opt-in per adapter instance - if the caller doesn't wire in a
 * state store, existing behavior is unchanged.
 */

import type { ApplyResult, EdgeCaseCode } from "../../types.js";
import type { FileApplyStateStore } from "../../../state/apply-state.js";
import type { WordPressClient, WPPostSummary } from "../client.js";

export interface HumanTouchedSkip {
  skip: true;
  result: ApplyResult;
}

export interface HumanTouchedOk {
  skip: false;
}

export type HumanTouchedCheck = HumanTouchedSkip | HumanTouchedOk;

export async function checkHumanTouched(opts: {
  client: WordPressClient;
  postType: "post" | "page";
  postSummary: WPPostSummary;
  targetUrl: string;
  stateStore: FileApplyStateStore | undefined;
}): Promise<HumanTouchedCheck> {
  const { client, postType, postSummary, targetUrl, stateStore } = opts;

  // No state store means the feature is disabled for this adapter.
  if (!stateStore) return { skip: false };

  // Human-only allowlist takes precedence over any timestamp check.
  if (stateStore.isHumanOnly(targetUrl)) {
    return {
      skip: true,
      result: {
        status: "skipped",
        externalRef: String(postSummary.id),
        externalUrl: postSummary.link,
        message: `Skipped - ${targetUrl} is on the client's human-only allowlist. Rynk does not touch pages on this list. Remove from the allowlist to enable automated updates.`,
        edgeCase: "human-only-url",
      },
    };
  }

  // No previous rynk apply means this is a first-time touch - nothing to
  // compare against. Proceed.
  const priorRecord = stateStore.getRecord(postType, postSummary.id);
  if (!priorRecord) return { skip: false };

  // Compare WP's modified_gmt to rynk's lastAppliedAt. Both are ISO 8601
  // UTC strings, so a lexicographic comparison is correct.
  const full = await client.getPost(postType, postSummary.id);
  const wpModified = full.modified_gmt ?? full.modified ?? null;
  if (!wpModified) {
    // WP didn't return a modified timestamp. Fail open - proceed.
    return { skip: false };
  }

  if (wpModified > priorRecord.lastAppliedAt) {
    return {
      skip: true,
      result: {
        status: "skipped",
        externalRef: String(postSummary.id),
        externalUrl: postSummary.link,
        message: `Skipped - a human edited this page on ${wpModified} (UTC). Rynk last applied on ${priorRecord.lastAppliedAt}. Not overwriting the human's changes. Re-approve to force a rynk overwrite.`,
        edgeCase: "human-edit-since-rynk" satisfies EdgeCaseCode,
      },
    };
  }

  return { skip: false };
}

export function recordApply(opts: {
  postType: "post" | "page";
  postId: number;
  actionId: string;
  stateStore: FileApplyStateStore | undefined;
}): void {
  if (!opts.stateStore) return;
  opts.stateStore.setRecord(opts.postType, opts.postId, {
    lastAppliedAt: new Date().toISOString(),
    lastAppliedActionId: opts.actionId,
  });
}
