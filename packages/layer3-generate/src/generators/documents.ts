/**
 * Document generator — produces `create_document` ExecutionActions for
 * PDFs and presentation decks built from pillar content.
 *
 * Why documents matter for SEO/AEO/GEO:
 *
 *   1. PDFs and PPTs hosted on document platforms (SlideShare, Scribd,
 *      Issuu, Academia.edu) frequently surface in Google results AND get
 *      cited by LLMs in answers.
 *   2. Each upload is a backlink target — distributable content the SEO
 *      team can submit to dozens of platforms.
 *   3. Sales / marketing teams reuse them in client conversations, which
 *      drives brand mentions across third-party properties.
 *
 * Heuristic per pillar brief (publishPriority="now" + intent="commercial"):
 *
 *   - One whitepaper PDF (long-form, ~3000 words from the brief's body)
 *   - One sales deck PPTX (10-15 slides, condensed from the same content)
 *
 * Heuristic per blog/informational brief with wordCountTarget >= 2000:
 *
 *   - One one-pager PDF (single-page reference)
 *
 * Layer 4 generates the actual files via a DocumentGenerationProvider
 * (templating + pandoc / python-pptx etc.). This generator only produces
 * the action specifications.
 */

import type {
  AuditFindings,
  ClientContext,
  ContentBrief,
  StrategyOutput,
} from "@rynk/core";
import type {
  CreateDocumentAction,
  ExecutionAction,
} from "../schema/execution-manifest.js";

export interface DocumentGeneratorOptions {
  audit: AuditFindings;
  strategy: StrategyOutput;
  client: ClientContext;
  idPrefix?: string;
}

// ── Heuristics ──────────────────────────────────────────────────────────────

function shouldHaveWhitepaper(brief: ContentBrief): boolean {
  // High-value commercial pillar pages that are publishing-priority "now".
  if (brief.publishPriority !== "now") return false;
  if (brief.intent !== "commercial") return false;
  return brief.wordCountTarget >= 1800;
}

function shouldHaveDeck(brief: ContentBrief): boolean {
  // Same gate as whitepaper — every whitepaper gets a companion deck.
  return shouldHaveWhitepaper(brief);
}

function shouldHaveOnePager(brief: ContentBrief): boolean {
  if (brief.intent !== "informational") return false;
  if (brief.wordCountTarget < 2000) return false;
  if (shouldHaveWhitepaper(brief)) return false; // avoid duplication
  return true;
}

// ── Distribution targets ────────────────────────────────────────────────────

const PDF_PLATFORMS = ["scribd", "issuu", "academia.edu", "calameo"];
const PPTX_PLATFORMS = ["slideshare", "issuu"];

// ── Body builders ───────────────────────────────────────────────────────────

function buildWhitepaperBody(brief: ContentBrief, client: ClientContext): string {
  const brand = client.legalEntity || client.domain;
  return [
    `# ${brief.h1Suggestion || brief.targetKeyword}`,
    ``,
    `**A practical guide from ${brand}.**`,
    ``,
    `## Executive summary`,
    ``,
    `_(2-paragraph summary — replace with executive summary from the matching create_page action's filled body.)_`,
    ``,
    `## What you'll learn`,
    ``,
    ...brief.h2Suggestions.map((h) => `- ${h}`),
    ``,
    `## Body`,
    ``,
    `_(Layer 4 document generator fills this with the create_page action's bodyMarkdown rendered into the whitepaper template.)_`,
    ``,
    `## About ${brand}`,
    ``,
    `${client.icp ? `${brand} works with ${client.icp}.` : `${brand} provides ${client.industry || "specialised services"}.`}`,
    ``,
    `${brief.ctaInstruction}`,
  ].join("\n");
}

function buildDeckBody(brief: ContentBrief, client: ClientContext): string {
  // The deck body is a slide-by-slide outline. Layer 4 converts each H2 to
  // a slide via python-pptx or similar.
  const brand = client.legalEntity || client.domain;
  const lines: string[] = [];
  lines.push(`# ${brief.h1Suggestion || brief.targetKeyword}`);
  lines.push(``);
  lines.push(`## Slide 1 — Title`);
  lines.push(`${brief.h1Suggestion || brief.targetKeyword}`);
  lines.push(`${brand}`);
  lines.push(``);
  lines.push(`## Slide 2 — Agenda`);
  for (const h of brief.h2Suggestions.slice(0, 5)) lines.push(`- ${h}`);
  lines.push(``);
  for (let i = 0; i < brief.h2Suggestions.length; i++) {
    const h = brief.h2Suggestions[i]!;
    lines.push(`## Slide ${i + 3} — ${h}`);
    lines.push(`_(One key point + supporting evidence.)_`);
    lines.push(``);
  }
  lines.push(`## Slide ${brief.h2Suggestions.length + 3} — CTA`);
  lines.push(brief.ctaInstruction);
  return lines.join("\n");
}

function buildOnePagerBody(brief: ContentBrief, client: ClientContext): string {
  const brand = client.legalEntity || client.domain;
  return [
    `# ${brief.h1Suggestion || brief.targetKeyword}`,
    ``,
    `_${brand} one-pager._`,
    ``,
    `## Why this matters`,
    `_(2-3 sentences.)_`,
    ``,
    `## Three things to know`,
    ...brief.h2Suggestions.slice(0, 3).map((h, i) => `${i + 1}. **${h}** — _(one sentence)_`),
    ``,
    `## Next step`,
    brief.ctaInstruction,
  ].join("\n");
}

// ── Action builders ────────────────────────────────────────────────────────

function makeWhitepaper(
  brief: ContentBrief,
  client: ClientContext,
  sourceUrl: string | null,
  id: string,
): CreateDocumentAction {
  return {
    id,
    type: "create_document",
    status: "pending",
    risk: "low",
    channel: "document",
    automatable: true,
    provenance: {
      source: "content-brief",
      sourceId: brief.id,
      reason: `Whitepaper companion to pillar page "${brief.targetKeyword}"`,
    },
    notes: "Pull the filled body from the matching create_page action before rendering.",
    target: { format: "pdf", docType: "whitepaper" },
    payload: {
      title: brief.h1Suggestion || brief.targetKeyword,
      sourceContentUrl: sourceUrl,
      bodyMarkdown: buildWhitepaperBody(brief, client),
      distributionPlatforms: PDF_PLATFORMS,
    },
  };
}

function makeDeck(
  brief: ContentBrief,
  client: ClientContext,
  sourceUrl: string | null,
  id: string,
): CreateDocumentAction {
  return {
    id,
    type: "create_document",
    status: "pending",
    risk: "low",
    channel: "document",
    automatable: true,
    provenance: {
      source: "content-brief",
      sourceId: brief.id,
      reason: `Sales deck companion to pillar page "${brief.targetKeyword}"`,
    },
    notes: "Layer 4 converts each ## heading into a slide via python-pptx.",
    target: { format: "pptx", docType: "deck" },
    payload: {
      title: brief.h1Suggestion || brief.targetKeyword,
      sourceContentUrl: sourceUrl,
      bodyMarkdown: buildDeckBody(brief, client),
      distributionPlatforms: PPTX_PLATFORMS,
    },
  };
}

function makeOnePager(
  brief: ContentBrief,
  client: ClientContext,
  sourceUrl: string | null,
  id: string,
): CreateDocumentAction {
  return {
    id,
    type: "create_document",
    status: "pending",
    risk: "low",
    channel: "document",
    automatable: true,
    provenance: {
      source: "content-brief",
      sourceId: brief.id,
      reason: `One-page reference for "${brief.targetKeyword}"`,
    },
    notes: "Quick distributable for sales conversations and download offers.",
    target: { format: "pdf", docType: "one-pager" },
    payload: {
      title: brief.h1Suggestion || brief.targetKeyword,
      sourceContentUrl: sourceUrl,
      bodyMarkdown: buildOnePagerBody(brief, client),
      distributionPlatforms: PDF_PLATFORMS.slice(0, 2),
    },
  };
}

// ── Public generator ────────────────────────────────────────────────────────

export function generateDocumentActions(opts: DocumentGeneratorOptions): ExecutionAction[] {
  const prefix = opts.idPrefix ?? "doc";
  const out: CreateDocumentAction[] = [];
  let counter = 1;

  const idOf = () => `${prefix}-${String(counter++).padStart(3, "0")}`;

  for (const brief of opts.strategy.contentBriefs) {
    // Source URL of the page this document mirrors — best-effort based on
    // brief target keyword. Layer 4 resolves to actual URL after create_page
    // applies.
    const sourceUrl: string | null = null;

    if (shouldHaveWhitepaper(brief)) {
      out.push(makeWhitepaper(brief, opts.client, sourceUrl, idOf()));
    }
    if (shouldHaveDeck(brief)) {
      out.push(makeDeck(brief, opts.client, sourceUrl, idOf()));
    }
    if (shouldHaveOnePager(brief)) {
      out.push(makeOnePager(brief, opts.client, sourceUrl, idOf()));
    }
  }

  return out;
}
