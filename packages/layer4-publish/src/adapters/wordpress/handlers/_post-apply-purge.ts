/**
 * Shared post-apply cache purge helper.
 *
 * Called by every content-modifying WP handler after a successful apply.
 * Best-effort - a purge failure never fails the parent action; it just
 * appends a note to the success message so the human can see it.
 *
 * The handler passes:
 *   - the CachePurger (nullable if the adapter isn't wired for it)
 *   - the URL that just changed (so we only invalidate what we touched)
 *
 * The helper returns a message fragment ("purged wp-rocket, cloudflare"
 * or " · cache purge failed on cloudflare") that the handler concatenates
 * onto its ApplyResult.message.
 */

import type { CachePurger } from "../../../cache/purger.js";

export async function runPostApplyPurge(opts: {
  purger?: CachePurger;
  url: string;
}): Promise<string> {
  const { purger, url } = opts;
  if (!purger) return "";

  const report = await purger.purge([url]);
  if (report.attempts.length === 0) return "";
  return report.allSucceeded
    ? ` (cache: ${report.summary})`
    : ` (cache: ${report.summary})`;
}
