/**
 * Redirect generator.
 *
 * Translates strategy.cannibalizationFixes into add_redirect actions.
 * Each cluster designates a canonical URL and a list of supporting URLs
 * with per-URL actions ("301", "noindex", "expand", "consolidate", "keep",
 * "update"). We emit a redirect action for every URL whose action === "301".
 *
 * Risk is medium because redirects affect live URLs — the dashboard surfaces
 * these for explicit human approval unless `autoApprove301Redirects=true` in
 * the future config.
 */

import type {
  AuditFindings,
  ClientContext,
  StrategyOutput,
} from "@rynk/core";
import type {
  AddRedirectAction,
  ExecutionAction,
} from "../schema/execution-manifest.js";

export interface RedirectGeneratorOptions {
  audit: AuditFindings;
  strategy: StrategyOutput;
  client: ClientContext;
  idPrefix?: string;
}

/**
 * Walk all cannibalization fixes and produce add_redirect actions for every
 * URL whose recommendedAction is "301". Skip the canonical URL itself.
 */
export function generateRedirectActions(opts: RedirectGeneratorOptions): ExecutionAction[] {
  const prefix = opts.idPrefix ?? "redir";
  const out: AddRedirectAction[] = [];
  let counter = 1;

  for (const fix of opts.strategy.cannibalizationFixes) {
    const canonical = fix.canonicalUrl;
    if (!canonical) continue;
    for (const [url, action] of Object.entries(fix.urlActions)) {
      if (action !== "301") continue;
      // Don't redirect the canonical to itself.
      if (url === canonical) continue;

      out.push({
        id: `${prefix}-${String(counter++).padStart(3, "0")}`,
        type: "add_redirect",
        status: "pending",
        risk: "medium",
        channel: "cms",
        automatable: true,
        provenance: {
          source: "cannibalization-fix",
          sourceId: fix.cluster,
          reason: `Cannibalization cluster "${fix.cluster}" — consolidate to canonical`,
        },
        notes: "",
        target: { sourceUrl: url, targetUrl: canonical },
        payload: { statusCode: 301 },
      });
    }
  }

  return out;
}
