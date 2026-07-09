import { z } from "zod";
import { requireEnv, withRetry, createLogger, type AgentTool } from "@rynk/core";
import { SerpSnapshotSchema, RankSnapshotSchema, type SerpSnapshot, type RankSnapshot, } from "@rynk/layer5-monitor/schema";


const log = createLogger("layer1.tools.serpapi");

const SERPAPI_BASE = "https://serpapi.com/search.json";

export interface SerpKeywordResult {
  keyword: string;
  topResults: { url: string; title: string; position: number; description: string | null; }[]; 
  peopleAlsoAsk: string[];
  featuredSnippet: { present: boolean; sourceUrl: string | null };
  aiOverview: { present: boolean; cites: string[]; text: string | null };
  serpFeatures: string[];
}

interface SerpApiResponse {
  organic_results?: Array<{ position: number; link: string; title: string; description?: string }>; //I think it's here?
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
  search: (keyword: string, opts?: { gl?: string; hl?: string }, numResults?: number) => Promise<SerpKeywordResult>;
}

export function makeSerpApiClient(
  apiKey: string = requireEnv("SERPAPI_API_KEY"),
): SerpApiClient {
  return {
    async search(keyword, opts = {}, numResults = 10) {  //defaults to ten results for layer 1 -- we'll call with 100 results for layer 5
      const params = new URLSearchParams({
        engine: "google",
        q: keyword,
        api_key: apiKey,
        gl: opts.gl ?? "us",
        hl: opts.hl ?? "en",
        google_domain: "google.com",
        include_ai_overview: "true",
      });

      const body = await withRetry(async () => {
        const res = await fetch(`${SERPAPI_BASE}?${params.toString()}`);
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          const err = new Error(`SerpAPI ${res.status}: ${text.slice(0, 200)}`);
          (err as unknown as { status: number }).status = res.status;
          throw err;
        }
        return (await res.json()) as SerpApiResponse;
      });

      const features: string[] = [];
      if (body.answer_box) features.push("featured_snippet");
      if (body.knowledge_graph) features.push("knowledge_panel");
      if (body.inline_images) features.push("image_pack");
      if (body.inline_videos) features.push("video_carousel");
      if (body.related_questions?.length) features.push("people_also_ask");
      if (body.ai_overview) features.push("ai_overview");

      const aiCites = body.ai_overview?.references?.map((r) => r.link) ?? [];
      const aiText = body.ai_overview?.text_blocks?.map((b) => b.snippet ?? "").join(" ") ?? null;

      log.info("serp searched", {
        keyword,
        aiOverview: !!body.ai_overview,
        organicResults: body.organic_results?.length ?? 0,
      });

      return {
        keyword,
        topResults: (body.organic_results ?? []).slice(0, numResults).map((r) => ({ //changed from top 10 to top 100 results
          url: r.link,
          title: r.title,
          position: r.position,
          description: r.description ?? null //keeping the description data all the time -- I think will help LLM make better decisions
        })),
        peopleAlsoAsk: (body.related_questions ?? []).map((q) => q.question),
        featuredSnippet: {
          present: !!body.answer_box,
          sourceUrl: body.answer_box?.link ?? null,
        },
        aiOverview: {
          present: !!body.ai_overview,
          cites: aiCites,
          text: aiText && aiText.length > 0 ? aiText.slice(0, 500) : null,
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

//this is for layer 5 -- returns in format of SerpSnapshotSchema 
//format:
export async function getSnapshot(client: SerpApiClient, keyword: string): Promise<SerpSnapshot> {
  
  //how many results should I pull here?
  const result = await client.search(keyword, undefined, 100) //I didn't put any country/language code

  const raw = {
    keyword,
    takenAt: new Date().toISOString(),
    results: result.topResults,
  }

  return SerpSnapshotSchema.parse(raw)
}

//this is also for layer 5 -- returns in format of RankSnapshotSchema
//the user's domain format needs to www.name.extension -- Eg: www.itechdata.ai
//returns null if the domain name isn't in the top 100
export async function getRankSnapshot(client: SerpApiClient, keyword: string, domain:string) : Promise<RankSnapshot> {
  
  
  const result = await client.search(keyword, undefined, 100) //Here also, I didn't put country/language code, pulling top 100

  const position = result.topResults.find((r) => {
    const resultDomain = new URL(r.url).hostname

    return resultDomain === domain
  })?.position ?? null;

  const raw = {
    keyword,
    takenAt: new Date().toISOString(),
    rank: position,
    ai_engine: "google"
  }

  return RankSnapshotSchema.parse(raw)
}
