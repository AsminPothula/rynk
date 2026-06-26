/**
 * Action explanations - human-readable "what is this + why does it help the
 * client" copy for every ExecutionAction type.
 *
 * Used by the dashboard to surface the *purpose* of each planned action so
 * the team (and the client) can understand the rationale at a glance,
 * without needing SEO knowledge.
 *
 * Each explanation has two parts:
 *
 *   - `what`        plain-English summary of the change (1-2 sentences)
 *   - `whyItHelps`  the SEO / AEO / GEO benefit, customer-facing tone
 *
 * Templates substitute the action's payload / target so the copy is
 * specific (e.g. "rewrites the title to target 'document automation'"
 * not "rewrites the title").
 *
 * Single source of truth: when an action type is added to layer3-generate,
 * also add a case here.
 */

import type { ExecutionAction } from "@rynk/layer3-generate";

export interface ActionExplanation {
  /** Short summary of WHAT the action does. */
  what: string;
  /** Customer-facing reason for WHY it helps the site / brand. */
  whyItHelps: string;
}

export function explainAction(action: ExecutionAction): ActionExplanation {
  switch (action.type) {
    case "create_page":
      return {
        what: `Creates a new ${action.target.pageType} page targeting "${action.target.targetKeyword}".`,
        whyItHelps:
          "Pillar and spoke pages build topical authority. Sites that comprehensively cover a topic rank higher on Google and are far more likely to be cited by AI engines (ChatGPT, Perplexity, Google AI Overview) when someone asks about this subject.",
      };

    case "update_page":
      return {
        what: `Rewrites and expands "${action.target.url}".`,
        whyItHelps:
          "Refreshes thin or outdated content. Google rewards updated, in-depth content and AI engines prefer recent, authoritative sources when picking what to cite.",
      };

    case "update_meta":
      return {
        what: action.payload.title
          ? `Rewrites the page title to "${action.payload.title}" and meta description.`
          : "Rewrites the page meta description.",
        whyItHelps:
          "The title tag is the single biggest on-page signal Google uses to decide what a page is about. A focused title + description means higher rankings and more clicks from the search results page.",
      };

    case "add_redirect":
      return {
        what: `301 redirect from ${action.target.sourceUrl} to ${action.target.targetUrl}.`,
        whyItHelps:
          "Consolidates duplicate or competing pages. Stops cannibalization (where two of your own pages compete for the same keyword - both lose) and passes link authority to the canonical page.",
      };

    case "inject_schema":
      return {
        what: `Adds ${action.target.schemaType} structured data to the page.`,
        whyItHelps:
          "Structured data lets Google show rich results (star ratings, FAQ dropdowns, breadcrumbs) in search. AI engines like ChatGPT and Perplexity heavily rely on schema to understand and cite content - this is one of the highest-leverage AEO/GEO moves.",
      };

    case "insert_internal_link":
      return {
        what: `Adds a link from ${action.target.sourceUrl} to ${action.target.targetUrl} using "${action.payload.anchorText}".`,
        whyItHelps:
          "Internal links pass authority around your site. Strategic links boost the target page's rank for the linked keyword and help Google + AI engines understand how your content is structured.",
      };

    case "create_author":
      return {
        what: `Creates an author profile for ${action.payload.displayName}.`,
        whyItHelps:
          "Named authors with credentials are a core EEAT signal (Experience, Expertise, Authoritativeness, Trust). Google and AI engines weight author authority heavily - especially on YMYL topics like health, finance, and legal.",
      };

    case "assign_author":
      return {
        what: `Attaches @${action.target.authorUsername} byline to ${action.target.postUrl}.`,
        whyItHelps:
          "Turns anonymous posts into authoritative content. Pages with a named expert author rank better and are more likely to be cited by AI engines as a trustworthy source.",
      };

    case "add_nap_block":
      return {
        what: "Adds the canonical Name / Address / Phone block to the contact page.",
        whyItHelps:
          "NAP consistency across your site and the web is a top-3 local SEO ranking factor. Inconsistent NAP confuses Google's local algorithm and tanks rankings in map results.",
      };

    case "create_image": {
      const role = action.target.purpose;
      return {
        what: `Generates a ${role.replace("-", " ")} image for "${action.target.contextSlug}".`,
        whyItHelps:
          "Pages with relevant, original images rank better and get more clicks. Alt text doubles as an accessibility win and an SEO signal. Visual search (Google Images, Pinterest) is also a growing discovery channel.",
      };
    }

    case "create_document": {
      const fmt = action.target.format.toUpperCase();
      const dt = action.target.docType.replace("-", " ");
      return {
        what: `Generates a ${fmt} ${dt} titled "${action.payload.title}".`,
        whyItHelps:
          "Documents on SlideShare and Scribd rank in Google and get heavily cited by LLMs - PDFs and decks are over-represented in ChatGPT, Perplexity, and Gemini training data. One of the highest-ROI AEO/GEO plays we run.",
      };
    }

    case "draft_brand_post": {
      const plat = action.target.platform;
      const platLabel = plat.charAt(0).toUpperCase() + plat.slice(1);
      return {
        what: `Drafts a ${platLabel} post on "${truncate(action.payload.body, 80)}".`,
        whyItHelps:
          "Brand mentions on LinkedIn, Reddit, and Threads build community-platform presence. These platforms feed AI training data heavily - showing up in relevant discussions makes ChatGPT and Perplexity more likely to cite your brand when someone asks AI about your category. Brand mentions are the new backlinks.",
      };
    }

    case "draft_outreach": {
      const recipient =
        action.target.recipientName ?? action.target.recipientDomain;
      const typeLabel = OUTREACH_TYPE_LABEL[action.target.outreachType];
      return {
        what: `${typeLabel} email to ${recipient}.`,
        whyItHelps:
          "Backlinks are still the #1 ranking factor in Google's algorithm. One quality link from a relevant domain can move you 5-10 positions for competitive keywords. Outreach is slow but compounds - every link you land lifts the whole site.",
      };
    }

    case "propose_code_change":
      return {
        what: `Opens a pull request on ${action.target.repo} (branch ${action.target.branch}): ${action.payload.title}.`,
        whyItHelps:
          "Page speed, render-blocking scripts, Core Web Vitals - these are direct ranking factors. Slow pages bounce, fast pages rank. Technical fixes also unblock crawl budget so Google indexes more of your site.",
      };

    case "update_offsite_profile":
      return {
        what: `Updates the ${action.target.platform} profile.`,
        whyItHelps:
          "Consistent, complete profiles across review platforms (G2, Clutch, Capterra) and identity sites (Crunchbase, Wikidata) are a key EEAT signal. AI engines triangulate brand identity from these sources when deciding what to cite.",
      };

    default: {
      // Exhaustiveness check - if a new action type is added, TS will error here.
      const _exhaustive: never = action;
      void _exhaustive;
      return {
        what: "Planned action.",
        whyItHelps: "Contributes to the client's overall SEO / AEO / GEO position.",
      };
    }
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────

const OUTREACH_TYPE_LABEL: Record<string, string> = {
  "backlink-request": "Backlink request",
  "guest-post-pitch": "Guest post pitch",
  "haro-response": "HARO response",
  "podcast-pitch": "Podcast pitch",
  "press-pitch": "Press pitch",
  partnership: "Partnership pitch",
};

function truncate(s: string, n: number): string {
  return s.length <= n ? s : s.slice(0, n).trimEnd() + "...";
}
