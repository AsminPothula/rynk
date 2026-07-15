/**
 * Server-only helpers for triggering + locating pipeline runs.
 *
 * The dashboard app's cwd at runtime is apps/dashboard, so the repo root is
 * two levels up. The orchestrator's web entry scripts are spawned from the
 * repo root (so their `dotenv/config` picks up the root .env, and their
 * runs/ path math resolves correctly).
 */

import { resolve } from "node:path";

/** Repo root, relative to the dashboard's runtime cwd (apps/dashboard). */
export function repoRoot(): string {
  return resolve(process.cwd(), "../..");
}

/** Absolute path to runs/{safeDomain}. */
export function runDomainDir(domain: string): string {
  return resolve(repoRoot(), "runs", safeDomainSlug(domain));
}

/** Same slug transform the pipeline uses for the runs/ dir name. */
export function safeDomainSlug(domain: string): string {
  return domain.replace(/[^a-z0-9.-]/gi, "_");
}

/**
 * Normalize a typed URL/domain into a bare lowercase host. Mirrors
 * packages/orchestrator/src/web/normalize-domain.ts so both sides agree on
 * the runs/{domain}/ directory name.
 */
export function normalizeDomain(input: string): string {
  let s = input.trim().toLowerCase();
  s = s.replace(/^https?:\/\//, "");
  s = s.replace(/^www\./, "");
  s = s.split("/")[0] ?? s;
  s = s.split("?")[0] ?? s;
  s = s.split("#")[0] ?? s;
  s = s.replace(/:\d+$/, "");
  return s.trim();
}
