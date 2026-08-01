/**
 * "Try rynk on your site" — a fast, lightweight scan for a prospect.
 *
 * This is NOT the full pipeline. It scrapes a handful of pages and makes ONE
 * LLM call to surface 5-7 quick audit findings + 3-5 strategy recommendations —
 * enough to show a prospect what rynk sees, in ~15 seconds, with no Crawl4AI,
 * no client.json, and no writes to a client's run history.
 *
 * The full onboard → audit → strategy → generate → publish pipeline runs only
 * once they become a client.
 */

import { z } from "zod";
import { runAgent, extractJson, createLogger, type ServerTool } from "@rynk/core";
import { makeFirecrawlClient } from "@rynk/layer1-audit";

const log = createLogger("quick-scan");

// ── Result shape ────────────────────────────────────────────────────────────

export const QuickScanAuditPointSchema = z.object({
  severity: z.enum(["high", "medium", "low"]),
  /** Short category tag: "Technical", "Content", "Schema", "Local", "Speed", "E-E-A-T". */
  category: z.string(),
  title: z.string(),
  detail: z.string(),
});

export const QuickScanStrategyPointSchema = z.object({
  title: z.string(),
  detail: z.string(),
  impact: z.enum(["high", "medium", "low"]),
});

export const QuickScanCompetitorSchema = z.object({
  name: z.string(),
  /** Bare domain if known, else "". */
  domain: z.string().default(""),
  /** One line on why they're a competitor / what they're winning at. */
  note: z.string(),
});

export const QuickScanResultSchema = z.object({
  domain: z.string(),
  scannedAt: z.string(),
  /** One-line hook for the prospect, e.g. "3 quick wins + 2 bigger opportunities." */
  headline: z.string(),
  businessType: z.string(),
  /** What rynk understood the business does (a taste of onboarding). */
  summary: z.string(),
  /** Who rynk understood they serve. */
  targetCustomer: z.string().default(""),
  /** 1-2 likely competitors. */
  competitors: z.array(QuickScanCompetitorSchema).min(1).max(2),
  auditPoints: z.array(QuickScanAuditPointSchema).min(3).max(7),
  strategyPoints: z.array(QuickScanStrategyPointSchema).min(3).max(5),
});

export type QuickScanResult = z.infer<typeof QuickScanResultSchema>;

// ── Scrape (lightweight — a few pages, not the whole site) ───────────────────

const QUICK_PAGES = ["/", "/about/", "/services/", "/contact/"];
const MAX_CHARS_PER_PAGE = 1500;

async function scrapeQuick(domain: string): Promise<string> {
  const firecrawl = makeFirecrawlClient();
  const urls = QUICK_PAGES.map((p) => `https://${domain}${p}`);
  const results = await Promise.allSettled(urls.map((u) => firecrawl.scrapeUrl(u)));

  const sections: string[] = [];
  for (let i = 0; i < urls.length; i++) {
    const r = results[i]!;
    if (r.status !== "fulfilled") continue;
    const page = r.value;
    if ((page.metadata?.statusCode ?? 200) >= 400) continue;
    const md = (page.markdown ?? "").trim().slice(0, MAX_CHARS_PER_PAGE);
    if (!md) continue;
    const title = page.metadata?.title ? `Title: ${page.metadata.title}` : "";
    const meta = page.metadata?.description ? `Meta: ${page.metadata.description}` : "(no meta description)";
    sections.push(`=== ${urls[i]} ===\n${title}\n${meta}\n${md}`);
  }
  return sections.join("\n\n");
}

// ── Prompt ───────────────────────────────────────────────────────────────────

const QUICK_SCAN_PROMPT = `
You are rynk.ai's instant site scanner. A prospective customer entered their
website URL to see what rynk would do for them. From the scraped pages, produce
a short, honest, specific teaser.

Output ONLY this JSON — nothing else:
{
  "domain": string,
  "headline": string,        // one punchy line, e.g. "4 quick wins and 2 bigger opportunities"
  "businessType": string,    // what kind of business this is, in a few words
  "summary": string,         // one sentence: what this business does (what rynk understood)
  "targetCustomer": string,  // one short phrase: who they serve
  "competitors": [           // 1-2 likely competitors
    { "name": string, "domain": string, "note": string }
  ],
  "auditPoints": [           // 5-7 issues visible from a quick scan
    { "severity": "high"|"medium"|"low", "category": string, "title": string, "detail": string }
  ],
  "strategyPoints": [        // 3-5 things rynk would do to grow their visibility
    { "title": string, "detail": string, "impact": "high"|"medium"|"low" }
  ]
}

Rules:
- summary + targetCustomer: a quick taste of what rynk understood about the
  business from its site — one plain sentence each.
- competitors: 1-2 real businesses competing for the same customers. Use
  web_search to find them (e.g. "{businessType} in {location}" or "{service}
  near {city}"), then give the name, bare domain if you find it, and one line on
  what they seem to be winning at. If you truly can't find any, name one
  plausible category peer and say so in the note.
- auditPoints: exactly 5-7. Real, specific issues you can see — missing/weak meta
  titles & descriptions, missing schema/structured data, thin or missing key
  pages, no clear H1, no visible NAP (name/address/phone) or booking/CTA, no
  local signals for a local business, likely slow/heavy pages, no author/E-E-A-T
  signals. Reference the ACTUAL site, not generic advice. category is one word.
- strategyPoints: exactly 3-5. Concrete moves rynk would make — target specific
  keywords this business should rank for, pages to create, Google Business
  Profile / reviews / citations for local businesses, schema to add, content to
  publish. Be specific to THIS business.
- For a local business (restaurant, salon, clinic, shop) lean into local:
  Google Business Profile, "near me" / city keywords, reviews, local schema.
- Keep every detail to one or two plain sentences a non-expert understands.
- Encouraging but honest — these are real gaps rynk fixes. Do not fabricate.
- Output valid JSON only. Start with { end with }.
`.trim();

// ── Main ─────────────────────────────────────────────────────────────────────

export async function runQuickScan(domain: string): Promise<QuickScanResult> {
  log.info("quick scan starting", { domain });

  const scraped = await scrapeQuick(domain);
  if (!scraped.trim()) {
    throw new Error(`Could not read ${domain}. Check the URL is reachable.`);
  }

  // web_search is used only to find 1-2 real competitors; everything else comes
  // from the scraped pages.
  const serverTools: ServerTool[] = [
    { type: "web_search_20250305", name: "web_search", max_uses: 3 },
  ];

  const result = await runAgent({
    system: QUICK_SCAN_PROMPT,
    userMessage: `Domain: ${domain}\n\nScraped pages:\n\n${scraped}\n\nOutput ONLY the quick-scan JSON.`,
    tools: [],
    serverTools,
    maxOutputTokens: 3_000,
    maxIterations: 5, // room for a couple web searches + the final JSON
    logger: log,
  });

  let parsed: unknown;
  try {
    parsed = JSON.parse(extractJson(result.finalText));
  } catch (err) {
    throw new Error(`Quick scan returned invalid JSON: ${(err as Error).message}`);
  }

  // Inject fields the model shouldn't own.
  const obj = parsed as Record<string, unknown>;
  obj.domain = domain;
  obj.scannedAt = new Date().toISOString();

  const validated = QuickScanResultSchema.safeParse(obj);
  if (!validated.success) {
    throw new Error(
      `Quick scan output failed validation:\n${validated.error.issues
        .slice(0, 8)
        .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
        .join("\n")}`,
    );
  }

  log.info("quick scan complete", {
    domain,
    audit: validated.data.auditPoints.length,
    strategy: validated.data.strategyPoints.length,
  });
  return validated.data;
}
