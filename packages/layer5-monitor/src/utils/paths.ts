import { readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileExists } from "@rynk/core";

export function safeDomain(domain: string): string {
  return domain.replace(/[^a-z0-9.-]/gi, "_");
}

export function monitorDir(runsDir: string, domain: string): string {
  return resolve(runsDir, safeDomain(domain), "monitor");
}

export function monitorSnapshotPath(
  runsDir: string,
  domain: string,
  type: "rank" | "gsc" | "ga" | "da" | "backlinks" | "digest",
  date: string,
): string {
  return join(monitorDir(runsDir, domain), type, `${date}.json`);
}

export function serpDeltaDir(runsDir: string, domain: string): string {
  return join(monitorDir(runsDir, domain), "serp");
}

export function listDatedJsonFiles(dir: string): string[] {
  if (!fileExists(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith(".json") && !name.startsWith("delta-"))
    .sort()
    .reverse();
}

export function findSnapshotPath(
  runsDir: string,
  domain: string,
  type: "rank" | "gsc" | "ga" | "da" | "backlinks" | "digest",
  date: string,
): string | null {
  const path = monitorSnapshotPath(runsDir, domain, type, date);
  return fileExists(path) ? path : null;
}

export function listSerpDeltaFiles(runsDir: string, domain: string, date: string): string[] {
  const serpRoot = serpDeltaDir(runsDir, domain);
  if (!fileExists(serpRoot)) return [];

  const results: string[] = [];
  for (const keywordDir of readdirSync(serpRoot, { withFileTypes: true })) {
    if (!keywordDir.isDirectory()) continue;
    const deltaPath = join(serpRoot, keywordDir.name, `delta-${date}.json`);
    if (fileExists(deltaPath)) results.push(deltaPath);
  }
  return results;
}
