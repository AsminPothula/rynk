import { z } from "zod";
import { requireEnv, withRetry, createLogger, type AgentTool } from "@rynk/core";


const log = createLogger("layer1.tools.serpapi");

const SERPAPI_BASE = "https://serpapi.com/search.json";

export interface SerpKeywordResult {
  keyword: string;
  topResults: { url: string; title: string; position: number; description: string | null; domain: string; }[]; 
  peopleAlsoAsk: string[];
  featuredSnippet: { present: boolean; sourceUrl: string | null };
  aiOverview: { present: boolean; cites: string[]; text: string | null };
  serpFeatures: string[];
}

interface SerpApiResponse {
  organic_results?: Array<{ position: number; link: string; title: string; snippet?: string }>;
  related_questions?: Array<{ question: string }>;
  answer_box?: { link?: string; title?: string };
  ai_overview?: {
    text_blocks?: Array<{ snippet?: string }>;
    references?: Array<{ link: string; title?: string }>;
  };
  knowledge_graph?: unknown;
  inline_images?: unknown;
  inline_videos?: unknown;
}

export interface SerpApiClient {
  search: (keyword: string, opts?: { gl?: string; hl?: string }, numResults?: number, domain?:string) => Promise<SerpKeywordResult>;
}

export function makeSerpApiClient(
  apiKey: string = requireEnv("SERPAPI_API_KEY"),
): SerpApiClient {
  return {
    async search(keyword, opts = {}, numResults = 10, domain) {
      if (!Number.isInteger(numResults) || numResults < 1) {
        throw new Error("numResults must be a positive integer");
      }

      const collectedResults: NonNullable<
        SerpApiResponse["organic_results"]
      > = [];

      const seenUrls = new Set<string>();

      // Keep the first response because this contains the SERP features
      let firstPageBody: SerpApiResponse | null = null;

      let start = 0;
      let pagesFetched = 0;

      /*
       * calculating the maximum number of pages using Google's
       * approximate page size of 10 results instead of 5.
       */
      // Prevent an unexpected infinite loop.
      const maxPages = Math.max(Math.ceil(numResults / 10) + 5, 10);

      
       //get hostname and remove http, www, etc.
      const clientDomain = domain ? new URL(
        domain.startsWith("http://") || domain.startsWith("https://")
          ? domain
          : `https://${domain}`,
      ).hostname
        .toLowerCase()
        .replace(/^www\./, "") : null;

      while (
        collectedResults.length < numResults &&
        pagesFetched < maxPages
      ) {
        const params = new URLSearchParams({
          engine: "google",
          q: keyword,
          api_key: apiKey,
          gl: opts.gl ?? "us",
          hl: opts.hl ?? "en",
          google_domain: "google.com",
          include_ai_overview: "true",
          start: String(start),
        });

        const body = await withRetry(async () => {
          const res = await fetch(
            `${SERPAPI_BASE}?${params.toString()}`,
          );

          if (!res.ok) {
            const text = await res.text().catch(() => "");

            const err = new Error(
              `SerpAPI ${res.status}: ${text.slice(0, 200)}`,
            );

            (err as unknown as { status: number }).status = res.status;
            throw err;
          }

          return (await res.json()) as SerpApiResponse;
        });

        firstPageBody ??= body;
        pagesFetched++;

        const pageResults = body.organic_results ?? [];

        log.info("serp page searched", {
          keyword,
          start,
          page: pagesFetched,
          pageOrganicResults: pageResults.length,
          totalCollected: collectedResults.length,
          requestedResults: numResults,
        });

        // No results means there is nothing else to collect.
        if (pageResults.length === 0) {
          break;
        }

        let newResultsAdded = 0;

         //Track whether the client's domain appears on this page
         //so pagination can stop immediately after finding it.
        let clientDomainFound = false;

        for (const result of pageResults) {
          if (seenUrls.has(result.link)) {
            continue;
          }

          seenUrls.add(result.link);
          collectedResults.push(result);
          newResultsAdded++;

          //take url, turn it into hostname, remove 'www'
          const resultDomain = new URL(result.link).hostname
            .toLowerCase()
            .replace(/^www\./, "");

          // Stop searching when the result matches client domain or is a subdomain
          // For example, studio.youtube.com counts as youtube.com.
          if (clientDomain && (resultDomain === clientDomain || resultDomain.endsWith(`.${clientDomain}`))) {
            clientDomainFound = true;
            break;
          }

          if (collectedResults.length >= numResults) {
            break;
          }
        }

        //stop requesting pages when client domain is found
        if (clientDomainFound) {
          break;
        }

        /*
         * If the next page returns only duplicate URLs, continuing could
         * repeatedly request equivalent results.
         */
        if (newResultsAdded === 0) {
          log.warn("serp pagination returned no new organic results", {
            keyword,
            start,
            page: pagesFetched,
          });

          break;
        }

        start += 10;
      }

      const body = firstPageBody;

      if (!body) {
        throw new Error(`SerpAPI returned no response for "${keyword}"`);
      }

      const features: string[] = [];

      if (body.answer_box) {
        features.push("featured_snippet");
      }

      if (body.knowledge_graph) {
        features.push("knowledge_panel");
      }

      if (body.inline_images) {
        features.push("image_pack");
      }

      if (body.inline_videos) {
        features.push("video_carousel");
      }

      if (body.related_questions?.length) {
        features.push("people_also_ask");
      }

      if (body.ai_overview) {
        features.push("ai_overview");
      }

      const aiCites =
        body.ai_overview?.references?.map((reference) => reference.link) ??
        [];

      const aiText =
        body.ai_overview?.text_blocks
          ?.map((block) => block.snippet ?? "")
          .join(" ") ?? null;

      log.info("serp searched", {
        keyword,
        aiOverview: !!body.ai_overview,
        organicResults: collectedResults.length,
        requestedResults: numResults,
        pagesFetched,
        complete: collectedResults.length >= numResults,
      });

      return {
        keyword,

        topResults: collectedResults
          .slice(0, numResults)
          .map((result, index) => ({
            url: result.link,
            title: result.title,

            position: index + 1,

            description: result.snippet ?? null,
            domain: new URL(result.link).hostname,
          })),

        peopleAlsoAsk: (body.related_questions ?? []).map(
          (question) => question.question,
        ),

        featuredSnippet: {
          present: !!body.answer_box,
          sourceUrl: body.answer_box?.link ?? null,
        },

        aiOverview: {
          present: !!body.ai_overview,
          cites: aiCites,
          text:
            aiText && aiText.length > 0
              ? aiText.slice(0, 500)
              : null,
        },

        serpFeatures: features,
      };
    },
  };
}

// ─── Agent tool wrapper ──────────────────────────────────────────────────────

const serpInput = z.object({
  keyword: z.string().min(1),
  gl: z.string().length(2).optional(),
  hl: z.string().length(2).optional(),
});

//this is for layer 1 purposes
export function serpSearchTool(client: SerpApiClient): AgentTool<z.infer<typeof serpInput>> {
  return {
    name: "check_serp",
    description:
      "Run a Google SERP query for a target keyword. Returns top 10 organic results, " +
      "People Also Ask questions, featured snippet info, AI Overview presence + citations, " +
      "and other SERP features. Use this for every seed keyword to map the competitive landscape.",
    input_schema: {
      type: "object",
      properties: {
        keyword: { type: "string" },
        gl: { type: "string", description: "Country code, default 'us'" },
        hl: { type: "string", description: "Language code, default 'en'" },
      },
      required: ["keyword"],
      additionalProperties: false,
    },
    inputZod: serpInput,
    async execute(input) {
      const result = await client.search(input.keyword, { gl: input.gl, hl: input.hl });
      return JSON.stringify(result);
    },
  };
}