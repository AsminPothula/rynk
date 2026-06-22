/**
 * DataStore interface — the contract every implementation of rynk's data
 * layer must satisfy.
 *
 * Implementations:
 *   - JsonDataStore (today)  — reads `runs/` JSON files from disk
 *   - SqliteDataStore (later) — local SQLite via Drizzle ORM
 *   - SupabaseDataStore (later) — managed Postgres + auth + real-time
 *
 * Every page in the dashboard uses this interface, never the raw filesystem
 * or DB calls. Swapping implementations is a single switch in `getDataStore()`.
 *
 * Note: read-only methods only for now. Write methods (approve action,
 * save note, etc.) come when we add the DB layer + auth — JSON files
 * are read-only by design.
 */

import type {
  AuditFindings,
  ClientContext,
  StrategyOutput,
} from "@rynk/core";
import type { ExecutionManifest } from "@rynk/layer3-generate";

/** A summary record for the clients list page. */
export interface ClientSummary {
  domain: string;
  legalEntity: string | null;
  industry: string | null;
  /** Most recent run date in YYYY-MM-DD form, or null if none. */
  latestRunDate: string | null;
  /** Latest manifest's total action count, if available. */
  latestActionCount: number | null;
  /** Latest audit's domain authority score, if available. */
  latestDAScore: number | null;
}

/** Per-client overview record for the client home page. */
export interface ClientOverview {
  context: ClientContext;
  latestAudit: AuditFindings | null;
  latestStrategy: StrategyOutput | null;
  latestManifest: ExecutionManifest | null;
  /** ISO date of the most recent run. */
  latestRunDate: string | null;
}

export interface DataStore {
  /** List every client we have data for. Used by the clients list page. */
  listClients(): Promise<ClientSummary[]>;

  /** Fetch the full overview record for one client. */
  getClientOverview(domain: string): Promise<ClientOverview | null>;
}
