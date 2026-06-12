/**
 * Body-filler agent — one Claude call per create_page action.
 *
 * Receives a ContentBrief + ClientContext + outline. Returns the page body
 * as markdown. No tools, single-turn — keeps the call cheap + predictable.
 *
 * Why a real agent and not just an LLM call:
 *   - Uses the shared `runAgent()` runner so future versions can add
 *     `web_fetch` (fact-grounding from primary sources) without rewriting.
 *   - Same retry / logging / streaming infrastructure as Layer 1/2 agents.
 *   - Same model-selection conventions (LAYER3_MODEL env override).
 *
 * The caller (post-processor) loops over create_page actions, calls this
 * agent per action, and overwrites payload.bodyMarkdown with the result.
 */

import {
  runAgent,
  createLogger,
  envNumber,
  optionalEnv,
  type ClientContext,
  type ContentBrief,
} from "@rynk/core";
import {
  CONTENT_BODY_SYSTEM_PROMPT,
  buildContentBodyUserMessage,
} from "../prompts/content-body-prompt.js";

const log = createLogger("layer3.contentBody");

export interface RunContentBodyOptions {
  brief: ContentBrief;
  client: ClientContext;
  outline: { heading: string; purpose: string }[];
  /** Override the default model (defaults to defaultModel via runAgent). */
  model?: string;
  /** Cap on output tokens. ContentBriefs hit 1500-3000 words = 8-12k tokens. */
  maxOutputTokens?: number;
}

/**
 * Run the body-filler once. Returns the page body as markdown (no fences,
 * no JSON wrapper). Caller updates the action's payload.bodyMarkdown.
 *
 * Throws on hard failures (auth, validation). Soft failures (rate limit,
 * transient) are retried inside runAgent.
 */
export async function runContentBodyAgent(opts: RunContentBodyOptions): Promise<string> {
  const model = opts.model ?? optionalEnv("LAYER3_MODEL", "claude-sonnet-4-6");
  const maxOutputTokens = opts.maxOutputTokens ?? envNumber("MAX_OUTPUT_TOKENS", 16_000);

  log.info("running body-filler", {
    model,
    keyword: opts.brief.targetKeyword,
    wordCountTarget: opts.brief.wordCountTarget,
  });

  const result = await runAgent({
    system: CONTENT_BODY_SYSTEM_PROMPT,
    userMessage: buildContentBodyUserMessage({
      brief: opts.brief,
      client: opts.client,
      outline: opts.outline,
    }),
    model,
    maxOutputTokens,
    maxIterations: 2, // No tools — should finish in one turn. 2 is a safety buffer.
    logger: log,
  });

  log.info("body-filler completed", {
    keyword: opts.brief.targetKeyword,
    chars: result.finalText.length,
    inputTokens: result.usage.input_tokens,
    outputTokens: result.usage.output_tokens,
  });

  return result.finalText.trim();
}
