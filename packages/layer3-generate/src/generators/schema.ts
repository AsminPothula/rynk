/**
 * Schema markup generator.
 *
 * Reads audit + client context, produces `inject_schema` ExecutionActions for
 * the schema types that are missing or under-deployed:
 *
 *   - Organization schema → homepage (always 1 action if homepage exists)
 *   - Service schema → each /solutions/ or /services/ page (N actions)
 *   - Article schema → blog posts (N actions per sampled post)
 *   - FAQPage schema → pages with FAQ blocks (flagged in strategy, future)
 *   - LocalBusiness schema → contact page if a NAP block is being added
 *
 * Each action carries a fully-formed JSON-LD object as `payload.jsonLd`. The
 * Layer 4 adapter just injects it into the right location (page body or
 * theme header).
 */

import type {
  AuditFindings,
  ClientContext,
  StrategyOutput,
} from "@rynk/core";
import type {
  ExecutionAction,
  InjectSchemaAction,
} from "../schema/execution-manifest.js";

export interface SchemaGeneratorOptions {
  audit: AuditFindings;
  strategy: StrategyOutput;
  client: ClientContext;
  /** Action ID prefix. */
  idPrefix?: string;
}

// ─── JSON-LD builders — pure, deterministic ──────────────────────────────────

/**
 * Build the Organization JSON-LD object. Falls back to safe defaults when
 * a field is unknown — schema.org accepts partial Organization records.
 */
function buildOrganizationJsonLd(client: ClientContext, audit: AuditFindings): Record<string, unknown> {
  const nap = client.canonicalNAP.address || audit.entitySummary.canonicalNAP.address;
  const phone = client.canonicalNAP.phone || audit.entitySummary.canonicalNAP.phone;
  const email = client.canonicalNAP.email || audit.entitySummary.canonicalNAP.email;
  const legalName = client.legalEntity || audit.entitySummary.legalEntityName;
  const homepage = `https://${client.domain}/`;

  const sameAs: string[] = [];
  // Pull verified third-party profiles from offsite audit findings.
  if (audit.offsiteEEAT.crunchbaseStatus.profileExists && audit.offsiteEEAT.crunchbaseStatus.url) {
    sameAs.push(audit.offsiteEEAT.crunchbaseStatus.url);
  }
  // Add LinkedIn placeholder — actual URL comes from offsiteEEAT.napDirectories.linkedin
  // in real audits. Safe to omit when unknown.

  const out: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: legalName,
    url: homepage,
  };
  if (nap) {
    out["address"] = { "@type": "PostalAddress", streetAddress: nap };
  }
  if (phone) out["telephone"] = phone;
  if (email) out["email"] = email;
  if (sameAs.length > 0) out["sameAs"] = sameAs;
  return out;
}

/**
 * Build Service JSON-LD for a specific /solutions/ or /services/ URL.
 * Service name + description are heuristic — best-effort from URL + title.
 */
function buildServiceJsonLd(url: string, title: string | null, client: ClientContext): Record<string, unknown> {
  const cleanTitle = title?.trim() || url.split("/").filter(Boolean).pop()?.replace(/[-_]/g, " ") || "Service";
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: cleanTitle,
    url,
    provider: {
      "@type": "Organization",
      name: client.legalEntity,
      url: `https://${client.domain}/`,
    },
    areaServed: client.verticals.length > 0 ? client.verticals : undefined,
  };
}

/**
 * Build Article JSON-LD for a blog post URL. datePublished + dateModified
 * default to current ISO if not in audit. author defaults to Organization
 * (refined later when CreateAuthor actions land).
 */
function buildArticleJsonLd(url: string, title: string | null, client: ClientContext): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title?.trim() || "Untitled article",
    url,
    publisher: {
      "@type": "Organization",
      name: client.legalEntity,
      url: `https://${client.domain}/`,
    },
    author: {
      "@type": "Organization",
      name: client.legalEntity,
    },
    datePublished: new Date().toISOString().split("T")[0],
    dateModified: new Date().toISOString().split("T")[0],
  };
}

// ─── URL classification ──────────────────────────────────────────────────────

function isHomepage(url: string): boolean {
  try {
    const u = new URL(url);
    return u.pathname === "/" || u.pathname === "";
  } catch {
    return false;
  }
}

function isServicePage(url: string): boolean {
  return /\/(solutions?|services?)\//i.test(url);
}

function isBlogPost(url: string): boolean {
  return /\/(blog|insights|articles|posts?|resources)\//i.test(url);
}

/**
 * Get existing schema types deployed on a URL, normalised to lower-case.
 * Used to skip URLs that already have the right schema.
 */
function existingSchemaTypes(audit: AuditFindings, url: string): Set<string> {
  const entry = audit.technicalCrawl.sitemapUrls.find((s) => s.url === url);
  const types = entry?.schemaTypes ?? [];
  return new Set(types.map((t) => t.toLowerCase()));
}

// ─── Action construction ─────────────────────────────────────────────────────

export function generateSchemaActions(opts: SchemaGeneratorOptions): ExecutionAction[] {
  const prefix = opts.idPrefix ?? "schema";
  const out: InjectSchemaAction[] = [];
  let counter = 1;

  const idOf = () => `${prefix}-${String(counter++).padStart(3, "0")}`;

  const sitemap = opts.audit.technicalCrawl.sitemapUrls;

  // ── Organization (sitewide via homepage) ────────────────────────────────
  const homepage = sitemap.find((s) => isHomepage(s.url));
  if (homepage && !existingSchemaTypes(opts.audit, homepage.url).has("organization")) {
    out.push({
      id: idOf(),
      type: "inject_schema",
      status: "pending",
      risk: "low",
      channel: "cms",
      automatable: true,
      provenance: {
        source: "audit-issue",
        sourceId: "schemaMissing:Organization",
        reason: "Homepage is missing Organization schema — required for entity disambiguation.",
      },
      notes: "Deploy via theme/footer if possible to cover all pages.",
      target: { url: homepage.url, schemaType: "Organization", location: "sitewide" },
      payload: { jsonLd: buildOrganizationJsonLd(opts.client, opts.audit) },
    });
  }

  // ── Service schema for each service page ───────────────────────────────
  for (const entry of sitemap) {
    if (!isServicePage(entry.url)) continue;
    if (existingSchemaTypes(opts.audit, entry.url).has("service")) continue;
    out.push({
      id: idOf(),
      type: "inject_schema",
      status: "pending",
      risk: "low",
      channel: "cms",
      automatable: true,
      provenance: {
        source: "audit-issue",
        sourceId: "schemaMissing:Service",
        reason: `Service schema absent on ${entry.url}`,
      },
      notes: "",
      target: { url: entry.url, schemaType: "Service", location: "page" },
      payload: { jsonLd: buildServiceJsonLd(entry.url, entry.title, opts.client) },
    });
  }

  // ── Article schema for blog posts (skip if already present) ────────────
  for (const entry of sitemap) {
    if (!isBlogPost(entry.url)) continue;
    const existing = existingSchemaTypes(opts.audit, entry.url);
    if (existing.has("article")) continue;
    out.push({
      id: idOf(),
      type: "inject_schema",
      status: "pending",
      risk: "low",
      channel: "cms",
      automatable: true,
      provenance: {
        source: "audit-issue",
        sourceId: "schemaMissing:Article",
        reason: `Article schema absent on ${entry.url}`,
      },
      notes: existing.has("webpage")
        ? "Replaces existing WebPage schema — Article is the correct type for posts."
        : "",
      target: { url: entry.url, schemaType: "Article", location: "page" },
      payload: { jsonLd: buildArticleJsonLd(entry.url, entry.title, opts.client) },
    });
  }

  return out;
}
