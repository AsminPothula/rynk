/**
 * ClientContext completeness assessor.
 *
 * After the onboarding AI extraction, this function inspects every field and
 * produces a structured report flagging anything that's weak or missing. The
 * report drives the gap-filling flow:
 *
 *   1. Strong fields → leave alone
 *   2. Weak/missing fields tagged "auto-keyword-research" or "auto-serp-research"
 *      → try to fill via KeywordDataProvider + SerpAPI without bothering the human
 *   3. Whatever is still weak after auto-fill → ask the human via the questionnaire
 *
 * This is intentionally a pure function — no I/O, no provider calls. It only
 * inspects the input and reports. The orchestrator decides what to do with
 * the report.
 *
 * The same assessor is used regardless of site maturity. Established sites
 * pass through with `isComplete=true`; unoptimized sites get a populated gaps
 * list. No fork in the pipeline.
 */

import type { ClientContext } from "@rynk/core";

// ── Types ─────────────────────────────────────────────────────────────────────

export type GapSeverity = "strong" | "weak" | "missing";

/**
 * How we plan to resolve a given gap.
 *   - auto-keyword-research: expandable via KeywordDataProvider.getRelatedKeywords
 *   - auto-serp-research:    inferable via SerpAPI / web search (e.g. competitors)
 *   - human-required:        cannot reliably be auto-filled (ICP, goals, NAP)
 *   - human-preferred:       could try auto but human input is much better
 */
export type FillStrategy =
  | "auto-keyword-research"
  | "auto-serp-research"
  | "human-required"
  | "human-preferred";

export interface FieldGap {
  /** Dot-path identifying the field (e.g. "canonicalNAP.address"). */
  field: string;
  severity: GapSeverity;
  fillStrategy: FillStrategy;
  /** Human-readable reason — shown in logs and (truncated) in the UI. */
  reason: string;
  /** Current value (for display). May be undefined for never-set fields. */
  current?: unknown;
}

export interface CompletenessReport {
  /** Weighted 0-100 score — higher = more complete. */
  overallScore: number;
  /** True if no critical fields are missing AND overallScore ≥ threshold. */
  isComplete: boolean;
  /** Every field that scored "weak" or "missing". */
  gaps: FieldGap[];
  /** Subset of `gaps` that should be tried programmatically first. */
  autoFillable: FieldGap[];
  /** Subset of `gaps` that the questionnaire should ask the human about. */
  needsHuman: FieldGap[];
}

// ── Field-by-field scoring helpers ────────────────────────────────────────────

/**
 * Generic checks for common "weak signal" patterns LLMs emit when they
 * couldn't determine a value.
 */
const GENERIC_PLACEHOLDERS = [
  "unknown",
  "not specified",
  "n/a",
  "tbd",
  "to be determined",
  "[default]",
  "various",
  "general",
  "business",
];

function isPlaceholder(value: string): boolean {
  const norm = value.trim().toLowerCase();
  if (norm === "") return true;
  return GENERIC_PLACEHOLDERS.some((p) => norm === p || norm.startsWith(p));
}

function scoreString(field: string, value: string | null | undefined, opts: {
  fillStrategy: FillStrategy;
  minLength?: number;
  weight: number;
}): { gap: FieldGap | null; weight: number; earned: number } {
  if (value === null || value === undefined || value === "") {
    return {
      gap: {
        field,
        severity: "missing",
        fillStrategy: opts.fillStrategy,
        reason: `${field} is empty`,
        current: value,
      },
      weight: opts.weight,
      earned: 0,
    };
  }
  if (isPlaceholder(value)) {
    return {
      gap: {
        field,
        severity: "weak",
        fillStrategy: opts.fillStrategy,
        reason: `${field} looks like a placeholder ("${value}")`,
        current: value,
      },
      weight: opts.weight,
      earned: 0,
    };
  }
  if (opts.minLength && value.trim().length < opts.minLength) {
    return {
      gap: {
        field,
        severity: "weak",
        fillStrategy: opts.fillStrategy,
        reason: `${field} is too short (${value.trim().length} chars, need ${opts.minLength}+)`,
        current: value,
      },
      weight: opts.weight,
      earned: opts.weight * 0.4,
    };
  }
  return { gap: null, weight: opts.weight, earned: opts.weight };
}

function scoreArray<T>(
  field: string,
  value: T[],
  opts: { strongAt: number; weakAt: number; fillStrategy: FillStrategy; weight: number },
): { gap: FieldGap | null; weight: number; earned: number } {
  const len = value.length;
  if (len === 0) {
    return {
      gap: {
        field,
        severity: "missing",
        fillStrategy: opts.fillStrategy,
        reason: `${field} has no entries`,
        current: value,
      },
      weight: opts.weight,
      earned: 0,
    };
  }
  if (len < opts.weakAt) {
    return {
      gap: {
        field,
        severity: "weak",
        fillStrategy: opts.fillStrategy,
        reason: `${field} has only ${len} entries (target ≥ ${opts.strongAt})`,
        current: value,
      },
      weight: opts.weight,
      earned: opts.weight * 0.3,
    };
  }
  if (len < opts.strongAt) {
    return {
      gap: {
        field,
        severity: "weak",
        fillStrategy: opts.fillStrategy,
        reason: `${field} has ${len} entries (target ≥ ${opts.strongAt})`,
        current: value,
      },
      weight: opts.weight,
      earned: opts.weight * 0.7,
    };
  }
  return { gap: null, weight: opts.weight, earned: opts.weight };
}

// ── Public assessor ───────────────────────────────────────────────────────────

/**
 * Default goals set by the onboarding prompt when nothing better was inferred.
 * Used to detect "still using the placeholder" state.
 */
const DEFAULT_GOALS = [
  "Increase organic search visibility",
  "Generate qualified inbound leads",
];

function goalsAreDefault(goals: string[]): boolean {
  if (goals.length === 0) return true;
  return goals.every((g) => DEFAULT_GOALS.includes(g));
}

/**
 * Score a ClientContext and produce a CompletenessReport. Pure function — no
 * side effects. Caller decides what to do with the report.
 */
export function assessCompleteness(ctx: ClientContext): CompletenessReport {
  // Per-field scoring with weights. Heavier weight = more important.
  // Total possible = sum of weights.
  const results = [
    scoreString("legalEntity", ctx.legalEntity, {
      fillStrategy: "human-preferred",
      minLength: 3,
      weight: 5,
    }),
    scoreString("industry", ctx.industry, {
      fillStrategy: "human-preferred",
      minLength: 3,
      weight: 5,
    }),
    scoreString("icp", ctx.icp, {
      fillStrategy: "human-required",
      minLength: 20,
      weight: 8,
    }),
    scoreString("canonicalNAP.address", ctx.canonicalNAP.address, {
      fillStrategy: "human-preferred",
      minLength: 10,
      weight: 4,
    }),
    scoreString("canonicalNAP.phone", ctx.canonicalNAP.phone, {
      fillStrategy: "human-preferred",
      minLength: 7,
      weight: 3,
    }),
    scoreString("canonicalNAP.email", ctx.canonicalNAP.email, {
      fillStrategy: "human-preferred",
      minLength: 5,
      weight: 3,
    }),
    scoreArray("verticals", ctx.verticals, {
      strongAt: 2,
      weakAt: 1,
      fillStrategy: "human-preferred",
      weight: 5,
    }),
    scoreArray("competitors", ctx.competitors, {
      strongAt: 3,
      weakAt: 1,
      fillStrategy: "auto-serp-research",
      weight: 10,
    }),
    scoreArray("certificationsClaimed", ctx.certificationsClaimed, {
      strongAt: 1,
      weakAt: 1,
      fillStrategy: "human-preferred",
      weight: 2,
    }),
    scoreArray("seedKeywords", ctx.seedKeywords, {
      strongAt: 8,
      weakAt: 3,
      fillStrategy: "auto-keyword-research",
      weight: 12,
    }),
  ];

  // Goals: detect placeholder default
  const goalsGap: FieldGap | null = goalsAreDefault(ctx.goals)
    ? {
        field: "goals",
        severity: "weak",
        fillStrategy: "human-required",
        reason: "goals are still the placeholder defaults",
        current: ctx.goals,
      }
    : null;
  const goalsWeight = 4;
  const goalsEarned = goalsGap ? goalsWeight * 0.3 : goalsWeight;
  results.push({ gap: goalsGap, weight: goalsWeight, earned: goalsEarned });

  // Tally
  const totalWeight = results.reduce((s, r) => s + r.weight, 0);
  const earned = results.reduce((s, r) => s + r.earned, 0);
  const overallScore = Math.round((earned / totalWeight) * 100);

  const gaps = results.map((r) => r.gap).filter((g): g is FieldGap => g !== null);
  const autoFillable = gaps.filter(
    (g) => g.fillStrategy === "auto-keyword-research" || g.fillStrategy === "auto-serp-research",
  );
  const needsHuman = gaps.filter(
    (g) => g.fillStrategy === "human-required" || g.fillStrategy === "human-preferred",
  );

  // "Complete" means: score is high AND no critical fields are outright missing.
  // ICP, competitors, seedKeywords are critical — they drive Layer 2 strategy.
  const criticalMissing = gaps.some(
    (g) =>
      g.severity === "missing" &&
      (g.field === "icp" || g.field === "competitors" || g.field === "seedKeywords"),
  );
  const isComplete = overallScore >= 80 && !criticalMissing;

  return { overallScore, isComplete, gaps, autoFillable, needsHuman };
}

/**
 * Render a one-line summary for terminal display.
 */
export function summarizeReport(report: CompletenessReport): string {
  if (report.isComplete) {
    return `Profile complete — ${report.overallScore}/100. No gaps to fill.`;
  }
  return (
    `Profile is ${report.overallScore}/100. ${report.gaps.length} gaps: ` +
    `${report.autoFillable.length} auto-fillable, ${report.needsHuman.length} need human input.`
  );
}
