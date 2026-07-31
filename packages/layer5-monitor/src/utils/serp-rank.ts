import { createLogger, optionalEnv, withRetry } from "@rynk/core";

const log = createLogger("layer5.serp-rank");

const SERPAPI_BASE = "https://serpapi.com/search.json";

interface SerpApiOrganicResult {
  position: number;
  link: string;
}

interface SerpApiResponse {
  organic_results?: SerpApiOrganicResult[];
}

function stableHash(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function mockRank(domain: string, keyword: string): number | null {
  const hash = stableHash(`${domain}:${keyword}`);
  if (hash % 5 === 0) return null;
  return (hash % 100) + 1;
}

function normalizeHost(urlOrHost: string): string {
  try {
    const withProtocol = urlOrHost.includes("://") ? urlOrHost : `https://${urlOrHost}`;
    return new URL(withProtocol).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return urlOrHost.replace(/^www\./, "").toLowerCase();
  }
}

export async function findDomainRank(
  domain: string,
  keyword: string,
): Promise<number | null> {
  const apiKey = optionalEnv("SERPAPI_API_KEY", "");
  if (!apiKey) {
    log.warn("SERPAPI_API_KEY not set — using mock rank", { domain, keyword });
    return mockRank(domain, keyword);
  }

  const params = new URLSearchParams({
    engine: "google",
    q: keyword,
    api_key: apiKey,
    gl: "us",
    hl: "en",
    google_domain: "google.com",
    num: "100",
  });

  const body = await withRetry(async () => {
    const res = await fetch(`${SERPAPI_BASE}?${params.toString()}`);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`SerpAPI ${res.status}: ${text.slice(0, 200)}`);
    }
    return (await res.json()) as SerpApiResponse;
  });

  const target = normalizeHost(domain);
  for (const result of body.organic_results ?? []) {
    if (normalizeHost(result.link) === target) {
      return result.position;
    }
  }
  return null;
}
