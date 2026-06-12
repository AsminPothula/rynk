/**
 * Post-processor: walk an ExecutionManifest, find every `create_page` action
 * with a skeleton-only body, and call the body-filler agent to overwrite
 * `payload.bodyMarkdown` with real prose.
 *
 * Why post-process instead of doing it inline in the content-skeleton
 * generator:
 *
 *   1. **Opt-in to LLM cost.** Skeleton generation is free + deterministic;
 *      body filling burns Anthropic budget. Splitting them lets the caller
 *      decide when to spend.
 *
 *   2. **Idempotency.** If a body has been hand-edited or already filled,
 *      we skip it. Re-running this post-processor is safe.
 *
 *   3. **Partial runs.** Caller can pass `briefIds` to fill only a subset
 *      (e.g. "draft the top 3 highest-priority pages first, review, then
 *      do the rest"). Matches the SEO team's real working pattern.
 *
 * The caller is responsible for re-saving the manifest after this returns
 * (the manifest object is mutated in place + summary is recomputed).
 */

import {
  createLogger,
  type ClientContext,
  type ContentBrief,
  type StrategyOutput,
} from "@rynk/core";
import {
  summarizeActions,
  type CreatePageAction,
  type ExecutionAction,
  type ExecutionManifest,
} from "../schema/execution-manifest.js";
import { runContentBodyAgent } from "../agents/content-body-agent.js";

const log = createLogger("layer3.fillBodies");

/** Marker the skeleton generator uses to flag "this is an outline, not prose". */
const SKELETON_MARKER = "**Outline only.**";

export interface FillContentBodiesOptions {
  manifest: ExecutionManifest;
  strategy: StrategyOutput;
  client: ClientContext;
  /**
   * Optional whitelist of brief IDs to fill. If absent, every skeleton-only
   * action is filled. Useful for incremental review workflows.
   */
  briefIds?: string[];
  /**
   * If true, run multiple body-filler agents in parallel. Default false to
   * stay within per-minute token rate limits on lower API tiers.
   */
  parallel?: boolean;
  /** Concurrency cap when parallel=true. Default 3. */
  maxConcurrent?: number;
}

export interface FillContentBodiesResult {
  /** Number of actions whose body we successfully replaced with prose. */
  filledCount: number;
  /** Number of actions skipped (no matching brief, already filled, etc.). */
  skippedCount: number;
  /** Errors per action ID — non-fatal failures recorded for review. */
  errors: Array<{ actionId: string; error: string }>;
}

// ── Type guards / helpers ────────────────────────────────────────────────────

function isCreatePage(a: ExecutionAction): a is CreatePageAction {
  return a.type === "create_page";
}

function isSkeleton(a: CreatePageAction): boolean {
  // Skeleton is detected by the marker the content-skeleton generator inserts.
  // Hand-edited bodies or already-filled bodies won't have this string.
  return a.payload.bodyMarkdown.includes(SKELETON_MARKER);
}

/**
 * Find the ContentBrief that produced a given create_page action. We rely
 * on the provenance.sourceId being the brief.id.
 */
function findBrief(action: CreatePageAction, briefs: ContentBrief[]): ContentBrief | null {
  return briefs.find((b) => b.id === action.provenance.sourceId) ?? null;
}

// ── Sequential / parallel runners ────────────────────────────────────────────

async function fillOne(
  action: CreatePageAction,
  brief: ContentBrief,
  client: ClientContext,
): Promise<void> {
  const newBody = await runContentBodyAgent({
    brief,
    client,
    outline: action.payload.outline ?? [],
  });
  action.payload.bodyMarkdown = newBody;
  action.notes =
    (action.notes ? action.notes + " · " : "") +
    `Body filled by ${new Date().toISOString().split("T")[0]} content body agent.`;
}

async function runInParallel<T>(
  items: T[],
  worker: (item: T) => Promise<void>,
  maxConcurrent: number,
): Promise<void> {
  let i = 0;
  async function next(): Promise<void> {
    while (i < items.length) {
      const myIndex = i++;
      await worker(items[myIndex]!);
    }
  }
  const workers = Array.from({ length: Math.min(maxConcurrent, items.length) }, () => next());
  await Promise.all(workers);
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Fill skeleton bodies in place. Mutates manifest.actions and recomputes
 * the summary. Returns counts + non-fatal errors.
 */
export async function fillContentBodies(
  opts: FillContentBodiesOptions,
): Promise<FillContentBodiesResult> {
  const briefs = opts.strategy.contentBriefs;
  const whitelist = opts.briefIds ? new Set(opts.briefIds) : null;

  const candidates = opts.manifest.actions.filter(isCreatePage).filter((a) => {
    if (!isSkeleton(a)) return false;
    if (whitelist && !whitelist.has(a.provenance.sourceId)) return false;
    return true;
  });

  log.info("fill-content-bodies start", {
    domain: opts.manifest.domain,
    total: opts.manifest.actions.length,
    createPages: opts.manifest.actions.filter(isCreatePage).length,
    candidates: candidates.length,
    parallel: opts.parallel ?? false,
  });

  let filled = 0;
  let skipped = 0;
  const errors: FillContentBodiesResult["errors"] = [];

  const runOne = async (action: CreatePageAction): Promise<void> => {
    const brief = findBrief(action, briefs);
    if (!brief) {
      log.warn("no brief found for action — skipping", { actionId: action.id, sourceId: action.provenance.sourceId });
      skipped += 1;
      return;
    }
    try {
      await fillOne(action, brief, opts.client);
      filled += 1;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      log.error("body-filler failed", { actionId: action.id, error: msg });
      errors.push({ actionId: action.id, error: msg });
    }
  };

  if (opts.parallel) {
    await runInParallel(candidates, runOne, opts.maxConcurrent ?? 3);
  } else {
    for (const c of candidates) {
      await runOne(c);
    }
  }

  // Recompute summary so status counts stay in sync.
  opts.manifest.summary = summarizeActions(opts.manifest.actions);

  log.info("fill-content-bodies complete", {
    filled,
    skipped,
    errors: errors.length,
  });

  return { filledCount: filled, skippedCount: skipped, errors };
}
