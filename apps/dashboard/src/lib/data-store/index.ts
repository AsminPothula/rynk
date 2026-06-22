/**
 * DataStore factory + re-exports.
 *
 * Dashboard components import from here, never directly from json-store /
 * sqlite-store / supabase-store. When the time comes to swap, only this
 * file changes.
 *
 * Reads `RYNK_DATA_STORE` env var; defaults to "json". Supported:
 *   - "json"     — read runs/ JSON files (today)
 *   - "sqlite"   — TODO when local DB lands
 *   - "supabase" — TODO when managed DB lands
 */

import { JsonDataStore } from "./json-store";
import type { DataStore } from "./types";

export * from "./types";

let cached: DataStore | null = null;

export function getDataStore(): DataStore {
  if (cached) return cached;
  const kind = (process.env["RYNK_DATA_STORE"] ?? "json").toLowerCase();
  switch (kind) {
    case "json":
      cached = new JsonDataStore();
      break;
    default:
      throw new Error(
        `Unknown RYNK_DATA_STORE "${kind}". Supported: json. (sqlite / supabase coming.)`,
      );
  }
  return cached;
}

/** Test helper — reset memoization. */
export function _resetDataStoreCache(): void {
  cached = null;
}

/** Test helper — inject a custom data store. */
export function _setDataStore(store: DataStore): void {
  cached = store;
}
