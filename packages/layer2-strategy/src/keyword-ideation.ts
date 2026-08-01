/**
 * Keyword ideation — LLM generates the keywords a business *should* rank for
 * from its full context, then the KeywordDataProvider validates + enriches them
 * with real volume / difficulty.
 *
 * Why this exists:
 *   The keyword provider (Semrush etc.) is great at metrics for a term you
 *   already have, and at "related keywords" for a seed — but it won't invent
 *   the high-intent long-tail a specific business should target, especially the
 *   local combos ("fade haircut plano", "kids barber near frisco") that carry
 *   low volume but high intent. An Anthropic model, given the client's industry,
 *   services, service areas, and brand, produces those candidates; the provider
 *   then attaches real numbers so strategy can rank + filter them.
 *
 * Flow: context → LLM candidates → provider.getKeywordMetricsBulk → enriched.
 * The LLM never invents metrics; the provider never invents candidates.
 */

import {
  runAgent,
  extractJson,
  createLogger,
  getKeywordDataProvider,
  type ClientContext,
  type KeywordDataProvider,
} from "@rynk/core";
import { z } from "zod";

const log = createLogger("strategy.keyword-ideation");

// ── Output shapes ──────────────────────────────────────────────────────────────

const CandidateSchema = z.object({
  keyword: z.string().min(1),
  intent: z
    .enum(["local", "commercial", "informational", "navigational"])
    .default("commercial"),
  rationale: z.string().default(""),
});
const CandidatesSchema = z.object({ keywords: z.array(CandidateSchema) });

export interface IdeatedKeyword {
  keyword: string;
  intent: "local" | "commercial" | "informational" | "navigational";
  /** Short reason the LLM proposed it — useful in the strategy review. */
  rationale: string;
  searchVolume: number | null;
  difficulty: number | null;
  cpc: number | null;
}

export interface IdeateKeywordsOptions {
  /** Override the provider (defaults to the env-configured one). */
  provider?: KeywordDataProvider;
  /** ISO country for metrics. Default "US". */
  country?: string;
  /** Cap on candidates sent for enrichment. Default 60. */
  max?: number;
}

// ── Prompt ─────────────────────────────────────────────────────────────────────

const IDEATION_PROMPT = `
You are a keyword strategist for rynk.ai. Given a business's full context,
propose the search keywords it should try to rank for.

Output ONLY a JSON object of this shape — nothing else:
{
  "keywords": [
    { "keyword": string, "intent": "local"|"commercial"|"informational"|"navigational", "rationale": string }
  ]
}

Rules:
- Propose 30–60 candidates. Be specific to THIS business, not generic head terms.
- Cover a mix of intents:
    • commercial — buyer-ready terms ("emergency plumber", "crm for startups")
    • informational — questions the audience asks ("how often should i get a fade")
    • local — ONLY when the business has a service area. Then generate
      service × place × modifier combos:
        "{service} {city}", "{service} near me", "best {service} in {city}",
        "{service} near {neighborhood}". Use the real services and service areas.
- Lean into long-tail, high-intent phrases. These convert and are winnable —
  don't only list broad, impossible head terms.
- Ground every keyword in the provided services, offerings, and topics. Do NOT
  invent services the business doesn't offer.
- rationale: one short clause on why it fits (e.g. "core service + city").
- Do NOT include search volumes or difficulty — those are added later.
`.trim();

function buildUserMessage(ctx: ClientContext): string {
  const b = ctx.brand;
  const p = ctx.presence;
  const lines: string[] = [
    `Domain: ${ctx.domain}`,
    `Industry: ${ctx.industry}`,
    ctx.verticals.length ? `Service lines: ${ctx.verticals.join(", ")}` : "",
    ctx.icp ? `Ideal customer: ${ctx.icp}` : "",
    b.description ? `What they do: ${b.description}` : "",
    b.valueProposition ? `Value proposition: ${b.valueProposition}` : "",
    b.contentThemes.length ? `Content themes: ${b.contentThemes.join(", ")}` : "",
    p.primaryCategory ? `Business category: ${p.primaryCategory}` : "",
    p.serviceAreas.length ? `Service areas: ${p.serviceAreas.join(", ")}` : "(no local service area — skip local combos)",
    p.services.length ? `Services: ${p.services.map((s) => s.name).join(", ")}` : "",
    ctx.competitors.length ? `Competitors: ${ctx.competitors.join(", ")}` : "",
    ctx.seedKeywords.length ? `Existing seed keywords: ${ctx.seedKeywords.join(", ")}` : "",
  ].filter(Boolean);

  return `${lines.join("\n")}\n\nOutput ONLY the keywords JSON.`;
}

// ── Main ─────────────────────────────────────────────────────────────────────

/**
 * Generate + enrich keyword candidates for a client.
 *
 * Returns candidates sorted by search volume (nulls last). Callers (strategy)
 * decide final selection — e.g. keep local high-intent terms even at low volume.
 */
export async function ideateKeywords(
  ctx: ClientContext,
  opts: IdeateKeywordsOptions = {},
): Promise<IdeatedKeyword[]> {
  const provider = opts.provider ?? getKeywordDataProvider();
  const country = opts.country ?? "US";
  const max = opts.max ?? 60;

  log.info("ideating keywords", { domain: ctx.domain, provider: provider.providerName });

  // 1 — LLM proposes candidates (no tools, single shot).
  const result = await runAgent({
    system: IDEATION_PROMPT,
    userMessage: buildUserMessage(ctx),
    tools: [],
    maxOutputTokens: 4_000,
    maxIterations: 3,
    logger: log,
  });

  const parsed = CandidatesSchema.safeParse(JSON.parse(extractJson(result.finalText)));
  if (!parsed.success) {
    throw new Error(`Keyword ideation returned invalid JSON: ${parsed.error.issues[0]?.message}`);
  }

  // Dedupe (case-insensitive), cap.
  const seen = new Set<string>();
  const candidates = parsed.data.keywords
    .filter((k) => {
      const key = k.keyword.toLowerCase().trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, max);

  log.info("candidates generated", { count: candidates.length });

  // 2 — provider validates + enriches with real metrics.
  const metrics = await provider.getKeywordMetricsBulk(
    candidates.map((c) => c.keyword),
    { country },
  );
  const byKeyword = new Map(metrics.map((m) => [m.keyword.toLowerCase(), m]));

  const enriched: IdeatedKeyword[] = candidates.map((c) => {
    const m = byKeyword.get(c.keyword.toLowerCase());
    return {
      keyword: c.keyword,
      intent: c.intent,
      rationale: c.rationale,
      searchVolume: m?.searchVolume ?? null,
      difficulty: m?.difficulty ?? null,
      cpc: m?.cpc ?? null,
    };
  });

  // 3 — rank by volume (nulls last). Strategy applies its own filtering.
  enriched.sort((a, b) => (b.searchVolume ?? -1) - (a.searchVolume ?? -1));

  log.info("ideation complete", { enriched: enriched.length });
  return enriched;
}
