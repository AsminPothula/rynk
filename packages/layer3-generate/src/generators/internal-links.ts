/**
 * Internal-link generator.
 *
 * Each content brief in strategy.contentBriefs carries a list of
 * `internalLinks` with direction "inbound" or "outbound":
 *
 *   - outbound: the new (or updated) page links OUT to targetUrl
 *   - inbound: another existing page should link IN to this brief's URL
 *
 * For OUTBOUND links we emit an insert_internal_link action whose sourceUrl
 * is the brief's destination URL (the page being built/edited) and targetUrl
 * is the linked-to page.
 *
 * For INBOUND links we emit an insert_internal_link whose sourceUrl is the
 * suggested host page (targetUrl in the brief's link record) and whose
 * targetUrl is the brief's own URL — i.e. the brief's page receives the link.
 *
 * Risk is medium because rewriting page content has higher blast radius
 * than meta/schema edits.
 */

import type {
  AuditFindings,
  ClientContext,
  StrategyOutput,
} from "@rynk/core";
import type {
  ExecutionAction,
  InsertInternalLinkAction,
} from "../schema/execution-manifest.js";

export interface InternalLinksGeneratorOptions {
  audit: AuditFindings;
  strategy: StrategyOutput;
  client: ClientContext;
  idPrefix?: string;
}

/**
 * Resolve the URL a brief will live at. For now we use the first competitor
 * URL we're outranking, or fall back to a /content/{slug}/ pattern derived
 * from the target keyword. Real implementation will read the canonical URL
 * once the page is created — Layer 4 wires the IDs together.
 */
function briefUrl(client: ClientContext, briefSlug: string): string {
  const slug = briefSlug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `https://${client.domain}/${slug}/`;
}

export function generateInternalLinkActions(
  opts: InternalLinksGeneratorOptions,
): ExecutionAction[] {
  const prefix = opts.idPrefix ?? "link";
  const out: InsertInternalLinkAction[] = [];
  let counter = 1;

  for (const brief of opts.strategy.contentBriefs) {
    const briefDestUrl = briefUrl(opts.client, brief.targetKeyword);

    for (const link of brief.internalLinks) {
      // Skip records without a target URL.
      if (!link.targetUrl) continue;

      const isOutbound = link.direction === "outbound";
      const sourceUrl = isOutbound ? briefDestUrl : link.targetUrl;
      const targetUrl = isOutbound ? link.targetUrl : briefDestUrl;

      out.push({
        id: `${prefix}-${String(counter++).padStart(3, "0")}`,
        type: "insert_internal_link",
        status: "pending",
        risk: "medium",
        channel: "cms",
        automatable: true,
        provenance: {
          source: "content-brief",
          sourceId: brief.id,
          reason: `Brief "${brief.targetKeyword}" — ${link.direction} link`,
        },
        notes: isOutbound
          ? "Insert when the brief's page is created/published."
          : "Insert on the host page once the brief's destination URL is live.",
        target: { sourceUrl, targetUrl },
        payload: {
          anchorText: link.anchorText || brief.targetKeyword,
        },
      });
    }
  }

  return out;
}
