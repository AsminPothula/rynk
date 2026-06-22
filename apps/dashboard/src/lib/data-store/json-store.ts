/**
 * JsonDataStore — reads rynk's `runs/` JSON artifacts directly from disk.
 *
 * This is the day-one implementation: zero setup, zero database, works
 * with the data the pipeline already produces.
 *
 * When we wire up a DB later, the same data goes through SqliteDataStore
 * (or SupabaseDataStore) without any dashboard component changing.
 *
 * Folder layout we read from:
 *   runs/
 *   ├── {domain}/
 *   │   ├── client.json
 *   │   ├── client.md
 *   │   └── {YYYY-MM-DD}/
 *   │       ├── audit.json
 *   │       ├── strategy.json
 *   │       └── execution-manifest.json
 */

import { readFile, readdir, stat } from "node:fs/promises";
import { resolve, join } from "node:path";
import {
  AuditFindingsSchema,
  ClientContextSchema,
  StrategyOutputSchema,
  type AuditFindings,
  type ClientContext,
  type StrategyOutput,
} from "@rynk/core";
import {
  ExecutionManifestSchema,
  type ExecutionManifest,
} from "@rynk/layer3-generate";
import type {
  ClientOverview,
  ClientSummary,
  DataStore,
} from "./types";

/**
 * Absolute path to the `runs/` directory relative to the dashboard app.
 * The data store can be reconfigured for tests or alternate run locations
 * via the constructor argument — never hardcode the path inside methods.
 */
function defaultRunsDir(): string {
  // apps/dashboard/src/lib/data-store/json-store.ts → repo root → /runs
  return resolve(process.cwd(), "../../runs");
}

export class JsonDataStore implements DataStore {
  constructor(private readonly runsDir: string = defaultRunsDir()) {}

  async listClients(): Promise<ClientSummary[]> {
    const domains = await safeReadDomains(this.runsDir);
    const summaries: ClientSummary[] = [];

    for (const domain of domains) {
      const ctx = await this.readClientContext(domain);
      const latestRunDate = await this.findLatestRunDate(domain);

      let actionCount: number | null = null;
      let daScore: number | null = null;

      if (latestRunDate) {
        const manifest = await this.readManifest(domain, latestRunDate);
        if (manifest) actionCount = manifest.summary.totalActions;

        const audit = await this.readAudit(domain, latestRunDate);
        if (audit) daScore = audit.authority.client.score ?? null;
      }

      summaries.push({
        domain,
        legalEntity: ctx?.legalEntity ?? null,
        industry: ctx?.industry ?? null,
        latestRunDate,
        latestActionCount: actionCount,
        latestDAScore: daScore,
      });
    }

    // Sort by domain alphabetically for stable rendering.
    return summaries.sort((a, b) => a.domain.localeCompare(b.domain));
  }

  async getClientOverview(domain: string): Promise<ClientOverview | null> {
    const context = await this.readClientContext(domain);
    if (!context) return null;

    const latestRunDate = await this.findLatestRunDate(domain);
    if (!latestRunDate) {
      return {
        context,
        latestAudit: null,
        latestStrategy: null,
        latestManifest: null,
        latestRunDate: null,
      };
    }

    const [latestAudit, latestStrategy, latestManifest] = await Promise.all([
      this.readAudit(domain, latestRunDate),
      this.readStrategy(domain, latestRunDate),
      this.readManifest(domain, latestRunDate),
    ]);

    return {
      context,
      latestAudit,
      latestStrategy,
      latestManifest,
      latestRunDate,
    };
  }

  // ── Private file helpers ────────────────────────────────────────────────

  private async readClientContext(domain: string): Promise<ClientContext | null> {
    const path = join(this.runsDir, domain, "client.json");
    return safeReadJson(path, ClientContextSchema.parse);
  }

  private async readAudit(domain: string, runDate: string): Promise<AuditFindings | null> {
    const path = join(this.runsDir, domain, runDate, "audit.json");
    return safeReadJson(path, AuditFindingsSchema.parse);
  }

  private async readStrategy(domain: string, runDate: string): Promise<StrategyOutput | null> {
    const path = join(this.runsDir, domain, runDate, "strategy.json");
    return safeReadJson(path, StrategyOutputSchema.parse);
  }

  private async readManifest(domain: string, runDate: string): Promise<ExecutionManifest | null> {
    const path = join(this.runsDir, domain, runDate, "execution-manifest.json");
    return safeReadJson(path, ExecutionManifestSchema.parse);
  }

  private async findLatestRunDate(domain: string): Promise<string | null> {
    const clientDir = join(this.runsDir, domain);
    try {
      const entries = await readdir(clientDir);
      const dateDirs: string[] = [];
      for (const entry of entries) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(entry)) continue;
        const entryStat = await stat(join(clientDir, entry));
        if (entryStat.isDirectory()) dateDirs.push(entry);
      }
      if (dateDirs.length === 0) return null;
      // ISO dates sort lexicographically — most recent last.
      dateDirs.sort();
      return dateDirs[dateDirs.length - 1]!;
    } catch {
      return null;
    }
  }
}

// ── Shared file utilities ───────────────────────────────────────────────

async function safeReadDomains(runsDir: string): Promise<string[]> {
  try {
    const entries = await readdir(runsDir);
    const domains: string[] = [];
    for (const entry of entries) {
      // Filter out hidden files. A domain folder always contains at least
      // one of client.json / a date subdir — but we keep this loose to
      // surface partially-set-up clients in the dashboard.
      if (entry.startsWith(".")) continue;
      const entryStat = await stat(join(runsDir, entry));
      if (entryStat.isDirectory()) domains.push(entry);
    }
    return domains;
  } catch {
    return [];
  }
}

async function safeReadJson<T>(path: string, parse: (input: unknown) => T): Promise<T | null> {
  try {
    const raw = await readFile(path, "utf-8");
    const json = JSON.parse(raw);
    return parse(json);
  } catch {
    return null;
  }
}
