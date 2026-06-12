/**
 * Content-skeleton generator.
 *
 * Translates every ContentBrief in Layer 2's strategy into a `create_page`
 * ExecutionAction. This is the **structural pass** — title, meta description,
 * outline, suggested headings, links to schema/image actions, target slug.
 * It does NOT write page body markdown yet.
 *
 * The body-writing pass is a separate generator (LLM-driven, opt-in) that
 * walks `create_page` actions and fills in `payload.bodyMarkdown`. That
 * separation means:
 *
 *   - Cheap pipeline runs (no LLM) still produce a complete manifest with
 *     every page rynk plans to create — useful for review, planning,
 *     dashboard rendering.
 *   - The expensive body-writing pass can be:
 *       (a) gated behind an env var (no surprise API spend)
 *       (b) run incrementally (write 3 bodies, review, write the next 3)
 *       (c) re-run for specific actions without regenerating the whole manifest.
 *
 * Pure transformation, no I/O. Deterministic — same brief → same action.
 */

import type {
  AuditFindings,
  ClientContext,
  ContentBrief,
  StrategyOutput,
} from "@rynk/core";
import type {
  CreatePageAction,
  ExecutionAction,
} from "../schema/execution-manifest.js";

export interface ContentSkeletonGeneratorOptions {
  audit: AuditFindings;
  strategy: StrategyOutput;
  client: ClientContext;
  idPrefix?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Build a URL slug from a brief's target keyword. Strips punctuation, swaps
 * spaces for dashes, lowercases. We also strip articles ("a"/"the"/"and")
 * for cleaner slugs, mirroring industry-standard SEO patterns.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/\b(a|the|and|or|of|in|on|for|to|with)\b/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * Map brief intent + format to a pageType. Used by the WP adapter to choose
 * between WP post and WP page endpoints.
 */
function pickPageType(brief: ContentBrief): CreatePageAction["target"]["pageType"] {
  const fmt = brief.recommendedFormat.toLowerCase();
  if (brief.intent === "informational" || /blog|article|guide|tutorial/.test(fmt)) return "blog";
  if (/pillar/.test(fmt) || brief.intent === "commercial") return "pillar";
  if (/landing/.test(fmt)) return "landing";
  if (/spoke/.test(fmt)) return "spoke";
  return "spoke";
}

/**
 * Find the parent slug for a brief (which pillar URL it links into).
 * Heuristic: first inbound link with a real targetUrl points to the parent.
 */
function pickParentSlug(brief: ContentBrief): string | undefined {
  const inbound = brief.internalLinks.find((l) => l.direction === "inbound" && l.targetUrl);
  if (!inbound) return undefined;
  try {
    return new URL(inbound.targetUrl).pathname.replace(/^\/+|\/+$/g, "");
  } catch {
    return undefined;
  }
}

/**
 * Build a default meta description from the brief. Used until the LLM
 * body-writer overwrites it with something better.
 */
function buildMetaDescription(brief: ContentBrief, client: ClientContext): string {
  const verb =
    brief.intent === "transactional"
      ? "Get"
      : brief.intent === "commercial"
        ? "Discover"
        : "Learn";
  const brand = client.legalEntity || "our team";
  const candidate = `${verb} how ${brand} delivers ${brief.targetKeyword}. ${brief.ctaInstruction || "Talk to us today."}`;
  return candidate.length > 158 ? candidate.slice(0, 157).trimEnd() + "…" : candidate;
}

/**
 * Build the outline array — one entry per h2Suggestion. Each entry pairs
 * the heading with a one-line "purpose" hint for the body writer.
 */
function buildOutline(brief: ContentBrief): { heading: string; purpose: string }[] {
  const out: { heading: string; purpose: string }[] = [];

  // Always start with an intro.
  out.push({
    heading: "Introduction",
    purpose: `Hook the reader on "${brief.targetKeyword}". Establish the problem and preview the value of reading on.`,
  });

  // Each h2Suggestion becomes a section. Empty heading list = fall back to a
  // 3-section skeleton.
  if (brief.h2Suggestions.length === 0) {
    out.push({ heading: "What it is and why it matters", purpose: "Definitional overview." });
    out.push({ heading: "How it works in practice", purpose: "Process / mechanism explanation." });
    out.push({ heading: "Benefits and use cases", purpose: "Outcomes and example scenarios." });
  } else {
    for (const h2 of brief.h2Suggestions) {
      out.push({ heading: h2, purpose: `Cover "${h2}" with concrete examples.` });
    }
  }

  // FAQ block if GEO requires direct answers.
  if (brief.geoRequirements.needsFAQBlock) {
    out.push({
      heading: "Frequently asked questions",
      purpose: "Answer 3-5 People-Also-Ask questions concisely. Each answer should be 40-80 words and quotable.",
    });
  }

  // Closing CTA.
  out.push({
    heading: "Next steps",
    purpose: `Drive ${brief.intent} action. ${brief.ctaInstruction}`,
  });

  return out;
}

// ── Generator ────────────────────────────────────────────────────────────────

export function generateContentSkeletonActions(
  opts: ContentSkeletonGeneratorOptions,
): ExecutionAction[] {
  const prefix = opts.idPrefix ?? "page";
  const out: CreatePageAction[] = [];
  let counter = 1;

  for (const brief of opts.strategy.contentBriefs) {
    const slug = `/${slugify(brief.targetKeyword)}/`;
    const id = `${prefix}-${String(counter++).padStart(3, "0")}`;

    out.push({
      id,
      type: "create_page",
      status: "pending",
      // Higher risk because a new published page is more visible than a meta edit.
      risk: "medium",
      channel: "cms",
      // Page itself is publishable automatically — but body content for the
      // page must come from a separate body-filler pass before this can be
      // applied. Layer 4 enforces that gate.
      automatable: true,
      provenance: {
        source: "content-brief",
        sourceId: brief.id,
        reason: `Brief "${brief.targetKeyword}" — ${brief.intent} ${brief.recommendedFormat}`,
      },
      notes:
        "Skeleton only — payload.bodyMarkdown is the outline. Run the body-filler pass to write the actual content before applying.",
      target: {
        slug,
        pageType: pickPageType(brief),
        ...(pickParentSlug(brief) ? { parentSlug: pickParentSlug(brief)! } : {}),
      },
      payload: {
        title: brief.h1Suggestion || `${brief.targetKeyword} — ${opts.client.legalEntity}`,
        metaDescription: buildMetaDescription(brief, opts.client),
        // Body starts as the outline serialized as markdown. The body-filler
        // generator (LLM) expands each section into prose.
        bodyMarkdown: renderOutlineAsMarkdown(brief, buildOutline(brief)),
        outline: buildOutline(brief),
        imageActionIds: [],
        schemaActionIds: [],
      },
    });
  }

  return out;
}

/**
 * Serialize the outline as Markdown so the action's payload.bodyMarkdown is
 * never empty. The body-filler pass replaces it with prose.
 */
function renderOutlineAsMarkdown(brief: ContentBrief, outline: { heading: string; purpose: string }[]): string {
  const lines: string[] = [];
  lines.push(`# ${brief.h1Suggestion || brief.targetKeyword}`);
  lines.push("");
  lines.push(`> **Outline only.** Run the LLM body-filler to expand each section.`);
  lines.push("");
  for (const section of outline) {
    lines.push(`## ${section.heading}`);
    lines.push("");
    lines.push(`_Purpose:_ ${section.purpose}`);
    lines.push("");
  }
  return lines.join("\n");
}
