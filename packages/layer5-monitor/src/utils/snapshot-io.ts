import type { z } from "zod";
import { fileExists, readJson, writeJson } from "@rynk/core";
import { join } from "node:path";
import { listDatedJsonFiles, monitorDir } from "./paths.js";

export function writeValidatedSnapshot<T>(
  schema: z.ZodType<T>,
  path: string,
  data: T,
): T {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Snapshot validation failed for ${path}: ${parsed.error.message}`);
  }
  writeJson(path, parsed.data);
  return parsed.data;
}

export function tryReadValidatedSnapshot<T>(
  schema: z.ZodType<T>,
  path: string,
): T | null {
  if (!fileExists(path)) return null;
  const raw = readJson<unknown>(path);
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`Invalid snapshot at ${path}: ${parsed.error.message}`);
  }
  return parsed.data;
}

export function loadLatestTwoSnapshots<T>(
  schema: z.ZodType<T>,
  runsDir: string,
  domain: string,
  type: "rank" | "gsc" | "ga" | "da" | "backlinks" | "digest",
): [T | null, T | null] {
  const dir = join(monitorDir(runsDir, domain), type);
  const files = listDatedJsonFiles(dir);
  const current = files[0] ? tryReadValidatedSnapshot(schema, join(dir, files[0])) : null;
  const previous = files[1] ? tryReadValidatedSnapshot(schema, join(dir, files[1])) : null;
  return [current, previous];
}
