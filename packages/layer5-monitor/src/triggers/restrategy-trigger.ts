/**
 * Re-strategy trigger — the Layer 5 → Layer 2 feedback loop.
 *
 * When the SERP monitor detects movement worth acting on, this loads the
 * client's most recent audit and re-runs the Strategy Agent (Layer 2) — but
 * informed by *what changed* (the deltas), so the new plan defends/recovers the
 * affected positions instead of re-planning blind.
 *
 * No DB yet: the run id is a locally-generated UUID. When the DB lands it will
 * assign the real run id and this returns that instead.
 */

import { readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import type { SerpDelta } from "../schema/index.js";
import { createLogger, type ClientContext } from "@rynk/core";
import { runStrategyAgent, loadAuditInput, saveStrategyOutput } from "@rynk/layer2-strategy";

const log = createLogger("layer5.restrategy-trigger");

/** Find the most recent audit for a domain under runs/{safeDomain}/{date}/. */
function findLatestAuditPath(runsDir: string, domain: string): string | null {
  const safeDomain = domain.replace(/[^a-z0-9.-]/gi, "_");
  const clientDir = resolve(runsDir, safeDomain);
  if (!existsSync(clientDir)) return null;

  const datedDirs = readdirSync(clientDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^\d{4}-\d{2}-\d{2}/.test(d.name))
    .map((d) => d.name)
    .sort()
    .reverse(); // newest first

  for (const date of datedDirs) {
    for (const name of ["audit.json", "audit.md"]) {
      const p = resolve(clientDir, date, name);
      if (existsSync(p)) return p;
    }
  }
  return null;
}

/** Turn the triggering deltas into a plain-English change summary for the prompt. */
function summarizeDeltas(deltas: SerpDelta[]): string {
  const lines: string[] = [];
  for (const d of deltas) {
    const parts: string[] = [];
    if (d.triggerReason) parts.push(d.triggerReason);
    if (d.domainPositionChange != null && d.domainPositionChange !== 0) {
      const dir = d.domainPositionChange > 0 ? "improved" : "dropped";
      parts.push(`your position ${dir} by ${Math.abs(d.domainPositionChange)}`);
    }
    if (d.newInTop10.length) parts.push(`${d.newInTop10.length} new URL(s) entered the top 10`);
    if (d.droppedFromTop10.length) parts.push(`${d.droppedFromTop10.length} URL(s) dropped out of the top 10`);
    if (d.positionChanges.length) parts.push(`${d.positionChanges.length} competitor position change(s)`);
    lines.push(`- "${d.keyword}": ${parts.length ? parts.join("; ") : "significant SERP movement"}`);
  }
  return lines.join("\n");
}

/**
 * Decide whether to re-strategize and, if so, do it.
 *
 * Called once per SERP-watch run with the run's deltas (not once per keyword —
 * one re-strategy covers all the movement).
 */
export async function maybeTriggerRestrategy(
  deltas: SerpDelta[],
  clientContext: ClientContext,
  runsDir: string,
): Promise<{ triggered: boolean; runId: string | null }> {
  const triggering = deltas.filter((d) => d.triggerRestrategy);
  if (triggering.length === 0) {
    return { triggered: false, runId: null };
  }

  const { domain } = clientContext;
  log.info("re-strategy triggered by monitor", { domain, keywords: triggering.length });

  // Need the client's latest audit to re-strategize against. If there's none, we
  // can't re-run Layer 2 meaningfully — flag it and bail (a Layer 1 re-audit is a
  // future enhancement).
  const auditPath = findLatestAuditPath(runsDir, domain);
  if (!auditPath) {
    log.warn("no audit found for client — cannot re-strategize", { domain, runsDir });
    return { triggered: false, runId: null };
  }

  const audit = loadAuditInput(auditPath);
  const changeContext = summarizeDeltas(triggering);

  log.info("re-running strategy with monitor findings", { domain, auditPath, auditFormat: audit.format });

  const strategy = await runStrategyAgent({ audit, clientContext, changeContext });

  const { jsonPath, mdPath } = saveStrategyOutput(strategy, runsDir);
  const runId = randomUUID(); // DB assigns the real id once wired.

  log.info("re-strategy complete", { domain, runId, jsonPath, mdPath });
  return { triggered: true, runId };
}
