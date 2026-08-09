/**
 * Monthly cycle selection — how many pages a client gets this cycle, and which.
 *
 * Layer 2 now produces ~15–20 high-priority briefs (see strategy-prompt). Each
 * cycle the scheduler pulls the top-N by publish priority for the client's tier
 * and hands only those to Layer 3 to generate. Numbers are editable here.
 */

import type { StrategyOutput } from "@rynk/core";

/** Pages generated per cycle, by subscription tier. Tweak freely. */
export const TIER_PAGE_QUOTA: Record<string, number> = {
  Gold: 5,
  Platinum: 10,
};

/** Default when a tier isn't recognised (e.g. beta/comp). */
export const DEFAULT_PAGE_QUOTA = 5;

export function cycleQuota(tier: string | undefined | null): number {
  if (!tier) return DEFAULT_PAGE_QUOTA;
  return TIER_PAGE_QUOTA[tier] ?? DEFAULT_PAGE_QUOTA;
}

type Brief = StrategyOutput["contentBriefs"][number];

const PRIORITY_RANK: Record<string, number> = { now: 0, "30d": 1, "60d": 2, "90d+": 3 };

/**
 * Pick the top-N content briefs for this cycle — highest publish priority first
 * (now → 30d → 60d → 90d+), preserving Layer 2's best-first order within a tier.
 */
export function selectCycleBriefs(strategy: StrategyOutput, limit: number): Brief[] {
  return [...strategy.contentBriefs]
    .map((b, i) => ({ b, i }))
    .sort((x, y) => {
      const pr = (PRIORITY_RANK[x.b.publishPriority] ?? 9) - (PRIORITY_RANK[y.b.publishPriority] ?? 9);
      return pr !== 0 ? pr : x.i - y.i; // stable: keep original order within a priority band
    })
    .slice(0, Math.max(0, limit))
    .map(({ b }) => b);
}

/** Convenience: the briefs to generate this cycle for a client's tier. */
export function briefsForTier(strategy: StrategyOutput, tier: string | undefined | null): Brief[] {
  return selectCycleBriefs(strategy, cycleQuota(tier));
}
