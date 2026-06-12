/**
 * Image generator — produces `create_image` ExecutionActions and links them
 * to the create_page actions that need them.
 *
 * Decisions per page (heuristic, deterministic):
 *
 *   - Every page gets a hero image (1280×640, "hero" purpose).
 *   - Pillar + landing pages also get a thumbnail variant (640×640) for
 *     social cards.
 *   - Technical content (informational intent + word count ≥ 1500) gets
 *     one inline diagram suggestion.
 *
 * The generator runs AFTER content-skeleton so it can find the create_page
 * actions and patch their `payload.imageActionIds` arrays with the new
 * image action IDs. That linkage lets the WP adapter attach uploaded
 * images to the right post when the page is created.
 *
 * The actual image generation (DALL-E / Flux / etc.) happens in Layer 4
 * when an adapter calls into an ImageGenerationProvider. This generator
 * only produces the action specifications (prompt + alt text + dimensions).
 *
 * Note on action ordering: registry runs generators in declaration order.
 * The composer concatenates results. The images generator therefore looks
 * at OTHER generators' output via the registry's two-pass mechanism — but
 * since today we run generators independently in one pass, we accept a
 * small architectural debt: the linkage between create_page and create_image
 * is set up here by mutating create_page actions that have already been
 * produced upstream.
 *
 * To enable that, the composer hands every generator the running actions
 * array via opts.priorActions. See generators/index.ts for the wiring.
 */

import type {
  ClientContext,
  ContentBrief,
  StrategyOutput,
  AuditFindings,
} from "@rynk/core";
import type {
  CreateImageAction,
  CreatePageAction,
  ExecutionAction,
} from "../schema/execution-manifest.js";

export interface ImageGeneratorOptions {
  audit: AuditFindings;
  strategy: StrategyOutput;
  client: ClientContext;
  /** Actions already produced earlier in the run (e.g. create_page from skeleton). */
  priorActions: ExecutionAction[];
  idPrefix?: string;
}

// ── Heuristics ──────────────────────────────────────────────────────────────

const TECHNICAL_KEYWORDS_REGEX = /\b(api|architecture|infrastructure|protocol|algorithm|pipeline|workflow|integration|automation|compliance|security|migration)\b/i;

function needsInlineDiagram(brief: ContentBrief): boolean {
  if (brief.intent !== "informational") return false;
  if (brief.wordCountTarget < 1500) return false;
  return TECHNICAL_KEYWORDS_REGEX.test(brief.targetKeyword) ||
    brief.h2Suggestions.some((h) => TECHNICAL_KEYWORDS_REGEX.test(h));
}

function needsThumbnail(brief: ContentBrief): boolean {
  // Pillar + commercial pages get a thumbnail for social card sharing.
  return brief.intent === "commercial" || brief.publishPriority === "now";
}

// ── Prompt builders ─────────────────────────────────────────────────────────

function buildHeroPrompt(brief: ContentBrief, client: ClientContext): string {
  return [
    `Modern, photorealistic hero image illustrating "${brief.targetKeyword}".`,
    `Style: clean, professional, B2B technology photography.`,
    `Subject matter: ${brief.targetKeyword} in the context of ${client.industry || "enterprise teams"}.`,
    `Color palette: neutral whites and blues, single accent color.`,
    `Composition: wide aspect ratio, room for text overlay on the left third.`,
    `Avoid: stock-photo cliches (handshakes, lightbulbs), text on the image, watermarks, faces.`,
  ].join(" ");
}

function buildDiagramPrompt(brief: ContentBrief): string {
  return [
    `Minimalist process diagram illustrating "${brief.targetKeyword}".`,
    `Style: technical infographic, flat design, vector look.`,
    `Show 3-5 steps in a horizontal flow with simple icons.`,
    `Use neutral background, accent color for active states.`,
    `Include labels at each step (placeholder text — real labels added later).`,
    `Aspect ratio 16:9. No watermarks.`,
  ].join(" ");
}

function buildThumbnailPrompt(brief: ContentBrief, client: ClientContext): string {
  return [
    `Square social card thumbnail for the page "${brief.h1Suggestion || brief.targetKeyword}".`,
    `Style: ${client.legalEntity ? "branded" : "professional"} thumbnail, suitable for LinkedIn / Twitter card.`,
    `Bold title placeholder, brand-colored background.`,
    `Aspect ratio 1:1. Clear focal point.`,
  ].join(" ");
}

function buildAltText(purpose: "hero" | "diagram" | "thumbnail", brief: ContentBrief): string {
  switch (purpose) {
    case "hero":
      return `Hero illustration for ${brief.targetKeyword}`;
    case "diagram":
      return `Process diagram showing how ${brief.targetKeyword} works`;
    case "thumbnail":
      return `Social card thumbnail for ${brief.targetKeyword}`;
  }
}

// ── Action builders ─────────────────────────────────────────────────────────

function makeHero(brief: ContentBrief, client: ClientContext, id: string, slug: string): CreateImageAction {
  return {
    id,
    type: "create_image",
    status: "pending",
    risk: "low",
    channel: "image",
    automatable: true,
    provenance: {
      source: "content-brief",
      sourceId: brief.id,
      reason: `Hero image for "${brief.targetKeyword}"`,
    },
    notes: "Generated at publish time via the configured ImageGenerationProvider.",
    target: { purpose: "hero", contextSlug: slug },
    payload: {
      prompt: buildHeroPrompt(brief, client),
      altText: buildAltText("hero", brief),
      width: 1280,
      height: 640,
      resultUrl: null,
    },
  };
}

function makeDiagram(brief: ContentBrief, id: string, slug: string): CreateImageAction {
  return {
    id,
    type: "create_image",
    status: "pending",
    risk: "low",
    channel: "image",
    automatable: true,
    provenance: {
      source: "content-brief",
      sourceId: brief.id,
      reason: `Inline diagram for "${brief.targetKeyword}" (technical content)`,
    },
    notes: "Diagram labels are placeholders — the publish step or human editor refines them.",
    target: { purpose: "inline-diagram", contextSlug: slug },
    payload: {
      prompt: buildDiagramPrompt(brief),
      altText: buildAltText("diagram", brief),
      width: 1280,
      height: 720,
      resultUrl: null,
    },
  };
}

function makeThumbnail(brief: ContentBrief, client: ClientContext, id: string, slug: string): CreateImageAction {
  return {
    id,
    type: "create_image",
    status: "pending",
    risk: "low",
    channel: "image",
    automatable: true,
    provenance: {
      source: "content-brief",
      sourceId: brief.id,
      reason: `Social card thumbnail for "${brief.targetKeyword}"`,
    },
    notes: "Used for LinkedIn / Twitter card preview.",
    target: { purpose: "thumbnail", contextSlug: slug },
    payload: {
      prompt: buildThumbnailPrompt(brief, client),
      altText: buildAltText("thumbnail", brief),
      width: 640,
      height: 640,
      resultUrl: null,
    },
  };
}

// ── Public generator ────────────────────────────────────────────────────────

export function generateImageActions(opts: ImageGeneratorOptions): ExecutionAction[] {
  const prefix = opts.idPrefix ?? "img";
  const out: CreateImageAction[] = [];
  let counter = 1;

  const briefById = new Map(opts.strategy.contentBriefs.map((b) => [b.id, b]));

  // Find create_page actions in the running manifest so we can patch their
  // imageActionIds with the new images we produce.
  const createPageActions = opts.priorActions.filter(
    (a): a is CreatePageAction => a.type === "create_page",
  );

  for (const page of createPageActions) {
    const brief = briefById.get(page.provenance.sourceId);
    if (!brief) continue;

    const slug = page.target.slug;
    const linkIds: string[] = [];

    // Hero — every page
    const heroId = `${prefix}-${String(counter++).padStart(3, "0")}`;
    out.push(makeHero(brief, opts.client, heroId, slug));
    linkIds.push(heroId);

    // Inline diagram — technical informational pages
    if (needsInlineDiagram(brief)) {
      const dId = `${prefix}-${String(counter++).padStart(3, "0")}`;
      out.push(makeDiagram(brief, dId, slug));
      linkIds.push(dId);
    }

    // Thumbnail — commercial / now-priority pages
    if (needsThumbnail(brief)) {
      const tId = `${prefix}-${String(counter++).padStart(3, "0")}`;
      out.push(makeThumbnail(brief, opts.client, tId, slug));
      linkIds.push(tId);
    }

    // Patch the create_page action's payload with the linked image IDs.
    // Mutation is intentional here — we're enriching upstream output with
    // pointers, not rewriting it.
    page.payload.imageActionIds = [...page.payload.imageActionIds, ...linkIds];
  }

  return out;
}
