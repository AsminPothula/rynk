/**
 * MockKeywordDataProvider — deterministic fake data for development.
 *
 * Lets every layer that depends on keyword data be built and tested before
 * we have real API access. The values are derived from the input string via
 * a stable hash, so the same keyword always returns the same numbers — useful
 * for snapshot tests.
 *
 * Realistic ranges:
 *   - Search volume: 0-50,000 (skewed toward 100-5000)
 *   - Difficulty: 0-100, distributed mostly 20-70
 *   - CPC: $0.10-$15.00
 *   - DA: 0-100, derived from domain length / TLD
 *
 * Swap this for a real provider via getKeywordDataProvider() in index.ts.
 */

import type {
  KeywordDataProvider,
  KeywordMetrics,
  KeywordQueryOptions,
  DomainAuthority,
  RelatedKeywordOptions,
  KeywordIntent,
} from "./types.js";

// ── Stable hash helpers ───────────────────────────────────────────────────────

/**
 * Cheap deterministic 32-bit hash (djb2 variant). Same input → same number.
 * Used to derive mock metrics so tests are reproducible.
 */
function stableHash(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** Map a hash into a numeric range [min, max]. */
function inRange(hash: number, min: number, max: number): number {
  return min + (hash % (max - min + 1));
}

// ── Heuristics ────────────────────────────────────────────────────────────────

const COMMERCIAL_HINTS = ["buy", "price", "cost", "service", "outsourcing", "software", "solution"];
const TRANSACTIONAL_HINTS = ["near me", "hire", "vendor", "company", "agency"];
const INFORMATIONAL_HINTS = ["what is", "how to", "guide", "tutorial", "vs", "comparison"];

/** Heuristic intent inference — good enough for development. */
function inferIntent(keyword: string): KeywordIntent {
  const lower = keyword.toLowerCase();
  if (TRANSACTIONAL_HINTS.some((h) => lower.includes(h))) return "transactional";
  if (COMMERCIAL_HINTS.some((h) => lower.includes(h))) return "commercial";
  if (INFORMATIONAL_HINTS.some((h) => lower.includes(h))) return "informational";
  return "unknown";
}

/** Long tail keywords get lower volume + lower difficulty + lower CPC. */
function lengthMultiplier(keyword: string): number {
  const wordCount = keyword.trim().split(/\s+/).length;
  if (wordCount <= 2) return 1.0;
  if (wordCount === 3) return 0.5;
  if (wordCount === 4) return 0.25;
  return 0.1;
}

// ── Provider ──────────────────────────────────────────────────────────────────

export class MockKeywordDataProvider implements KeywordDataProvider {
  readonly providerName = "mock";

  async getKeywordMetrics(
    keyword: string,
    opts: KeywordQueryOptions = {},
  ): Promise<KeywordMetrics> {
    const hash = stableHash(keyword.toLowerCase());
    const country = opts.country ?? "US";
    const mult = lengthMultiplier(keyword);

    return {
      keyword,
      country,
      searchVolume: Math.round(inRange(hash, 50, 50_000) * mult),
      difficulty: inRange(hash >> 4, 10, 85),
      cpc: parseFloat((inRange(hash >> 8, 10, 1500) / 100).toFixed(2)),
      intent: inferIntent(keyword),
    };
  }

  async getKeywordMetricsBulk(
    keywords: string[],
    opts: KeywordQueryOptions = {},
  ): Promise<KeywordMetrics[]> {
    return Promise.all(keywords.map((k) => this.getKeywordMetrics(k, opts)));
  }

  async getDomainAuthority(domain: string): Promise<DomainAuthority> {
    const clean = domain.replace(/^https?:\/\//, "").replace(/\/$/, "").toLowerCase();
    const hash = stableHash(clean);
    // Established TLDs get a small bonus.
    const tldBoost = /\.(com|org|net|edu|gov)$/i.test(clean) ? 5 : 0;
    // Shorter domains tend to be more authoritative.
    const lengthPenalty = Math.min(15, Math.floor(clean.length / 4));
    const baseScore = inRange(hash, 15, 80);

    return {
      domain: clean,
      score: Math.max(0, Math.min(100, baseScore + tldBoost - lengthPenalty)),
      backlinks: inRange(hash >> 4, 100, 500_000),
      referringDomains: inRange(hash >> 8, 10, 5_000),
      provider: this.providerName,
    };
  }

  async getDomainAuthorityBulk(domains: string[]): Promise<DomainAuthority[]> {
    return Promise.all(domains.map((d) => this.getDomainAuthority(d)));
  }

  async getRelatedKeywords(
    seed: string,
    opts: RelatedKeywordOptions = {},
  ): Promise<string[]> {
    const limit = opts.limit ?? 50;
    const modifiers = [
      "services",
      "outsourcing",
      "software",
      "company",
      "for small business",
      "automation",
      "agency",
      "near me",
      "vs alternatives",
      "best",
      "top",
      "cheap",
      "guide",
      "tutorial",
      "examples",
      "what is",
      "how to use",
      "case study",
      "ROI",
      "implementation",
    ];
    const results: string[] = [];
    for (const mod of modifiers) {
      results.push(`${mod} ${seed}`);
      results.push(`${seed} ${mod}`);
      if (results.length >= limit) break;
    }
    return results.slice(0, limit);
  }
}
