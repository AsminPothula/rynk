/**
 * MockOwnedDomainDataProvider — deterministic fake GSC + GA data.
 *
 * Used everywhere until real OAuth integrations are wired up. Values are
 * derived from a stable hash of (domain + method name) so tests are
 * reproducible. Real provider implementations (GSCProvider, GAProvider) will
 * replace this once OAuth credentials are available.
 */

import type {
  OwnedDomainDataProvider,
  DateRange,
  SearchQueryMetrics,
  SearchPageMetrics,
  IndexCoverage,
  EngagementMetrics,
  ConversionMetrics,
} from "./types.js";

function stableHash(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function inRange(hash: number, min: number, max: number): number {
  return min + (hash % (max - min + 1));
}

function normalizeDomain(domain: string): string {
  return domain.replace(/^https?:\/\//, "").replace(/\/$/, "").toLowerCase();
}

/** Synthetic sample queries derived from the domain — looks real-ish in logs. */
function syntheticQueries(domain: string, count: number): string[] {
  const base = domain.split(".")[0] ?? "brand";
  const templates = [
    `${base} services`,
    `${base} pricing`,
    `${base} reviews`,
    `${base} vs alternatives`,
    `${base} login`,
    `how to use ${base}`,
    `is ${base} legit`,
    `${base} discount`,
    `${base} demo`,
    `${base} integration`,
    `best ${base} alternative`,
    `${base} for small business`,
  ];
  return templates.slice(0, count);
}

function syntheticPages(domain: string, count: number): string[] {
  const root = `https://${normalizeDomain(domain)}`;
  const paths = [
    "/",
    "/about/",
    "/contact/",
    "/services/",
    "/pricing/",
    "/blog/",
    "/case-studies/",
    "/solutions/",
    "/integrations/",
    "/blog/getting-started/",
  ];
  return paths.slice(0, count).map((p) => root + p);
}

export class MockOwnedDomainDataProvider implements OwnedDomainDataProvider {
  readonly providerName = "mock";

  async isAuthorized(_domain: string): Promise<boolean> {
    // Mock is always authorized — pretend the client granted access.
    return true;
  }

  async getTopQueries(
    domain: string,
    range: DateRange,
    limit = 20,
  ): Promise<SearchQueryMetrics[]> {
    const queries = syntheticQueries(domain, limit);
    return queries.map((query, i) => {
      const hash = stableHash(`${domain}-${query}-${range.start}`);
      const impressions = inRange(hash, 100, 50_000);
      const clicks = Math.round(impressions * (inRange(hash >> 4, 1, 12) / 100));
      const ctr = clicks / Math.max(impressions, 1);
      return {
        query,
        impressions,
        clicks,
        ctr: parseFloat(ctr.toFixed(4)),
        averagePosition: parseFloat((inRange(hash >> 8, 10, 800) / 10).toFixed(1)),
      };
    });
  }

  async getTopPages(
    domain: string,
    range: DateRange,
    limit = 20,
  ): Promise<SearchPageMetrics[]> {
    const pages = syntheticPages(domain, limit);
    return pages.map((page) => {
      const hash = stableHash(`${page}-${range.start}`);
      const impressions = inRange(hash, 200, 80_000);
      const clicks = Math.round(impressions * (inRange(hash >> 4, 1, 15) / 100));
      const ctr = clicks / Math.max(impressions, 1);
      return {
        page,
        impressions,
        clicks,
        ctr: parseFloat(ctr.toFixed(4)),
        averagePosition: parseFloat((inRange(hash >> 8, 10, 500) / 10).toFixed(1)),
      };
    });
  }

  async getIndexCoverage(domain: string): Promise<IndexCoverage> {
    const hash = stableHash(`coverage-${domain}`);
    const indexed = inRange(hash, 20, 500);
    return {
      indexed,
      notIndexed: inRange(hash >> 4, 0, Math.max(5, Math.floor(indexed / 10))),
      errors: inRange(hash >> 8, 0, 5),
      warnings: inRange(hash >> 12, 0, 10),
      flaggedUrls: [
        {
          url: `https://${normalizeDomain(domain)}/old-page/`,
          issue: "Crawled — currently not indexed",
        },
      ],
    };
  }

  async getEngagement(
    domain: string,
    range: DateRange,
  ): Promise<EngagementMetrics> {
    const hash = stableHash(`eng-${domain}-${range.start}`);
    const sessions = inRange(hash, 500, 50_000);
    return {
      sessions,
      users: Math.round(sessions * 0.75),
      avgSessionDurationSec: inRange(hash >> 4, 30, 240),
      bounceRate: parseFloat((inRange(hash >> 8, 30, 75) / 100).toFixed(2)),
      topLandingPages: syntheticPages(domain, 5).map((page, i) => ({
        page,
        sessions: Math.round(sessions * (0.3 - i * 0.05)),
      })),
    };
  }

  async getConversions(
    domain: string,
    range: DateRange,
    limit = 5,
  ): Promise<ConversionMetrics[]> {
    const events = ["contact_form_submit", "demo_request", "newsletter_signup", "phone_call", "download_pdf"];
    return events.slice(0, limit).map((eventName) => {
      const hash = stableHash(`conv-${domain}-${eventName}-${range.start}`);
      return {
        eventName,
        count: inRange(hash, 1, 200),
        value: inRange(hash >> 4, 0, 1) === 1 ? inRange(hash >> 8, 50, 5000) : null,
      };
    });
  }
}
