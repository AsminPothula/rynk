/**
 * NAP (Name / Address / Phone) block generator.
 *
 * The audit flags two kinds of NAP gaps:
 *   1. Contact page missing canonical NAP — e.g. only a phone number, no
 *      address or email
 *   2. NAP inconsistency across pages (footer says one address, contact page
 *      says another)
 *
 * For (1) we emit an add_nap_block action targeting the contact page with the
 * canonical NAP from client + audit.entitySummary.
 *
 * For (2) we emit one add_nap_block per inconsistent location, each carrying
 * the canonical NAP so all locations align.
 *
 * Risk is medium because NAP blocks change visible page content. The block
 * also implicitly carries LocalBusiness schema — handled by the WP adapter.
 */

import type {
  AuditFindings,
  ClientContext,
  StrategyOutput,
} from "@rynk/core";
import type {
  AddNAPBlockAction,
  ExecutionAction,
} from "../schema/execution-manifest.js";

export interface NAPGeneratorOptions {
  audit: AuditFindings;
  strategy: StrategyOutput;
  client: ClientContext;
  idPrefix?: string;
}

/**
 * Pick the canonical NAP. Prefer client (human-confirmed) values, fall back
 * to audit.entitySummary (model-inferred).
 */
function canonicalNAP(opts: NAPGeneratorOptions): {
  legalName: string;
  address: string;
  phone: string;
  email: string | null;
} | null {
  const client = opts.client;
  const auditNap = opts.audit.entitySummary.canonicalNAP;
  const address = client.canonicalNAP.address ?? auditNap.address ?? null;
  const phone = client.canonicalNAP.phone ?? auditNap.phone ?? null;
  const email = client.canonicalNAP.email ?? auditNap.email ?? null;
  const legalName = client.legalEntity || opts.audit.entitySummary.legalEntityName;

  // Need at least legal name + address + phone to produce a block.
  if (!legalName || !address || !phone) return null;
  return { legalName, address, phone, email };
}

/**
 * Detect whether a NAPRecord is meaningfully incomplete.
 */
function isIncomplete(nap: { address: string | null; phone: string | null; email: string | null }): boolean {
  return !nap.address || !nap.phone;
}

/**
 * Find the contact-page URL from the audit's sitemap inventory. Heuristic:
 * the first URL whose path looks like /contact/ or /contact-us/.
 */
function findContactUrl(audit: AuditFindings): string | null {
  for (const entry of audit.technicalCrawl.sitemapUrls) {
    try {
      const p = new URL(entry.url).pathname.toLowerCase();
      if (/^\/contact(-us)?\/?$/.test(p)) return entry.url;
    } catch {
      continue;
    }
  }
  return null;
}

export function generateNapBlockActions(opts: NAPGeneratorOptions): ExecutionAction[] {
  const prefix = opts.idPrefix ?? "nap";
  const out: AddNAPBlockAction[] = [];
  let counter = 1;

  const canonical = canonicalNAP(opts);
  if (!canonical) {
    // Without a complete canonical NAP we can't propose blocks.
    return out;
  }

  const napConsistency = opts.audit.onsiteEEAT.napConsistency;

  // ── 1. Contact page missing canonical NAP ───────────────────────────────
  if (isIncomplete(napConsistency.contactPage)) {
    const contactUrl = findContactUrl(opts.audit);
    if (contactUrl) {
      out.push({
        id: `${prefix}-${String(counter++).padStart(3, "0")}`,
        type: "add_nap_block",
        status: "pending",
        risk: "medium",
        channel: "cms",
        automatable: true,
        provenance: {
          source: "audit-issue",
          sourceId: "napConsistency.contactPage",
          reason: "Contact page is missing canonical address/phone — add a visible NAP block",
        },
        notes: "Wrap in LocalBusiness schema to strengthen local entity signals.",
        target: { url: contactUrl },
        payload: {
          legalName: canonical.legalName,
          address: canonical.address,
          phone: canonical.phone,
          email: canonical.email,
          includeLocalBusinessSchema: true,
        },
      });
    }
  }

  // ── 2. Sitewide inconsistencies — emit a high-risk note action ──────────
  // We don't auto-rewrite footers across an unknown number of pages. Instead
  // emit a single propose_code_change to the theme. For now we just emit a
  // contact-page block only — footer changes get flagged when the
  // ProposeCodeChange generator lands.

  return out;
}
