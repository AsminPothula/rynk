/**
 * Prompt + user-message builder for the content body-filler agent.
 *
 * The agent receives:
 *   - The ContentBrief (target keyword, intent, outline, EEAT + GEO needs)
 *   - The ClientContext (brand voice, ICP, industry, certs)
 *   - The skeleton's outline (heading + purpose per section)
 *   - Optional competitor-content elements to outperform
 *
 * It returns: pure markdown body (no front-matter, no JSON wrapper). The
 * caller updates the create_page action's `payload.bodyMarkdown` field
 * with the returned text.
 *
 * Single-turn, no tools. We may add `web_fetch` later for fact-grounded
 * paragraphs; v1 keeps things simple + cheap.
 */

import type { ClientContext, ContentBrief } from "@rynk/core";

export const CONTENT_BODY_SYSTEM_PROMPT = `
You are rynk.ai's content writer. You produce search-optimised, EEAT-strong
markdown for B2B pages.

NON-NEGOTIABLES

- Output ONLY the page body as markdown. No front-matter, no JSON, no commentary.
- Use the provided H1 verbatim as the top-level heading.
- Follow the outline order. Use each section's "purpose" hint to decide
  what to actually say.
- Write in the brand's voice — informed, direct, never marketing fluff.
- Every claim that quotes a number, statistic, certification, or third-party
  fact MUST be either (a) hedged with realistic language or (b) replaced
  with a clearly-marked placeholder like "[client to provide: X]". Never
  fabricate citations or studies.
- AEO/GEO: write quotable sentences. Direct answers in 40-80-word blocks.
  Use FAQ structure when the brief asks for it.
- Internal links: when the brief mentions an inbound/outbound link, write
  the anchor text as plain markdown link to a placeholder URL like
  \`[anchor text](/internal-link-target/)\`. Layer 4 wires real URLs.
- Target word count: hit the brief's wordCountTarget +/- 15%. Quality
  over quantity — better short and strong than padded.
- Tone: confident, specific, opinionated where the brief allows. Never
  hype. No "revolutionary", "cutting-edge", "leverage", "synergy", etc.

OUTPUT FORMAT

A single markdown document. The first line is "# {h1}". Body follows in the
order of the outline sections. Every section starts with its ## heading.
End with a clear CTA matching the brief's ctaInstruction.

Do not output JSON. Do not output a code fence wrapping the markdown. Just
the raw markdown.
`.trim();

/**
 * Build the user message for the agent — packs brief + client context +
 * outline + audit signals into one structured input.
 */
export function buildContentBodyUserMessage(opts: {
  brief: ContentBrief;
  client: ClientContext;
  outline: { heading: string; purpose: string }[];
}): string {
  const { brief, client, outline } = opts;
  return [
    `# CONTEXT`,
    ``,
    `## Client`,
    `- Brand: ${client.legalEntity || client.domain}`,
    `- Domain: ${client.domain}`,
    `- Industry: ${client.industry || "(unspecified)"}`,
    `- ICP: ${client.icp || "(unspecified)"}`,
    `- Verticals: ${client.verticals.join(", ") || "(unspecified)"}`,
    `- Certifications: ${client.certificationsClaimed.join(", ") || "(none claimed)"}`,
    ``,
    `## Brief`,
    `- Target keyword: ${brief.targetKeyword}`,
    `- Intent: ${brief.intent}`,
    `- Format: ${brief.recommendedFormat}`,
    `- Target word count: ${brief.wordCountTarget}`,
    `- H1 (use verbatim): ${brief.h1Suggestion}`,
    `- CTA instruction: ${brief.ctaInstruction}`,
    `- Secondary keywords: ${brief.secondaryKeywords.join(", ") || "(none)"}`,
    ``,
    `## EEAT requirements`,
    `- Signals needed: ${brief.eeatRequirements.signalsNeeded.join(", ") || "(general)"}`,
    `- YMYL: ${brief.eeatRequirements.isYMYL ? "yes — extra care with claims" : "no"}`,
    `- Needs reviewer credentials in byline: ${brief.eeatRequirements.needsReviewer ? "yes" : "no"}`,
    `- Primary sources to cite: ${brief.eeatRequirements.primarySourcesToCite.join(", ") || "(none specified — only cite if accurate)"}`,
    ``,
    `## GEO / AEO requirements`,
    `- Needs FAQ block: ${brief.geoRequirements.needsFAQBlock ? "yes" : "no"}`,
    `- Needs direct-answer paragraphs: ${brief.geoRequirements.needsDirectAnswer ? "yes — 40-80 word answers" : "no"}`,
    `- Schema type on the page: ${brief.geoRequirements.schemaType}`,
    `- Needs quotable sentences: ${brief.geoRequirements.needsQuotableSentences ? "yes — write standalone-quotable lines" : "no"}`,
    ``,
    `## Outline (follow this order)`,
    ...outline.map((s, i) => `${i + 1}. **${s.heading}** — ${s.purpose}`),
    ``,
    `## Competitor elements to outperform`,
    brief.competitorUrlsToOutperform.length === 0
      ? "(none specified)"
      : brief.competitorUrlsToOutperform
          .map(
            (c) =>
              `- ${c.url} (${c.estimatedDepth}). They have: ${c.contentElementsTheyHave.join("; ") || "n/a"}`,
          )
          .join("\n"),
    ``,
    `## Internal links to include`,
    brief.internalLinks.length === 0
      ? "(none)"
      : brief.internalLinks
          .map((l) => `- [${l.anchorText || brief.targetKeyword}](${l.targetUrl}) (${l.direction})`)
          .join("\n"),
    ``,
    `Write the page body now. Markdown only. No JSON, no commentary.`,
  ].join("\n");
}
