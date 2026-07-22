/**
 * Apply-state store - tracks when rynk last modified each page on a
 * client's WordPress, plus a per-client "human-only" URL allowlist.
 *
 * Purpose: prevent rynk from silently overwriting a client's manual
 * edit. When a handler is about to modify a page it has touched before,
 * it compares WP's `modified_gmt` timestamp to rynk's `lastAppliedAt`.
 * If the human edited between rynk's applies, the handler skips.
 *
 * Storage: one JSON file per client at `{runDir}/rynk-apply-state.json`.
 * This is a stopgap until the client-scoped database lands - the store
 * interface is deliberately narrow so swapping to Postgres / Supabase
 * is a single-file change.
 *
 * File shape:
 *   {
 *     "version": 1,
 *     "records": {
 *       "page/2": { "lastAppliedAt": "2026-...", "lastAppliedActionId": "meta-001" }
 *     },
 *     "humanOnlyUrls": [ "https://itechdata.ai/", "https://itechdata.ai/about/" ]
 *   }
 *
 * The `humanOnlyUrls` list is populated manually today (client tells us
 * "never touch these pages"). Once the dashboard has an approval workflow,
 * we can toggle URLs on/off from there.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

/** One record per post/page rynk has touched. Keyed by "{postType}/{postId}". */
export interface ApplyRecord {
  /** ISO 8601 UTC timestamp of rynk's last successful apply. */
  lastAppliedAt: string;
  /** ID of the action that produced the last apply - useful for audit. */
  lastAppliedActionId: string;
}

interface ApplyStateFile {
  version: 1;
  records: Record<string, ApplyRecord>;
  humanOnlyUrls: string[];
}

const EMPTY_STATE: ApplyStateFile = {
  version: 1,
  records: {},
  humanOnlyUrls: [],
};

function buildKey(postType: "post" | "page", postId: number): string {
  return `${postType}/${postId}`;
}

function loadFile(path: string): ApplyStateFile {
  if (!existsSync(path)) return { ...EMPTY_STATE, records: {}, humanOnlyUrls: [] };
  try {
    const raw = readFileSync(path, "utf8");
    const parsed = JSON.parse(raw) as ApplyStateFile;
    if (typeof parsed !== "object" || parsed === null) throw new Error("not an object");
    // Defensive shape - old files without every field are still readable.
    return {
      version: 1,
      records: parsed.records ?? {},
      humanOnlyUrls: parsed.humanOnlyUrls ?? [],
    };
  } catch {
    // Corrupt file - start fresh so we don't crash the apply pass. We
    // lose one client's apply history; better than blocking every apply.
    return { ...EMPTY_STATE, records: {}, humanOnlyUrls: [] };
  }
}

function saveFile(path: string, state: ApplyStateFile): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(state, null, 2), "utf8");
}

/**
 * File-backed apply-state store bound to a specific per-client JSON file.
 * Constructing multiple stores that point at the same file is safe because
 * every read and write goes through the disk - there is no in-memory cache
 * to invalidate.
 */
export class FileApplyStateStore {
  constructor(private readonly filePath: string) {}

  /** Get the last apply record for a post, or null if rynk has never touched it. */
  getRecord(postType: "post" | "page", postId: number): ApplyRecord | null {
    const state = loadFile(this.filePath);
    return state.records[buildKey(postType, postId)] ?? null;
  }

  /** Save the apply record for a post. */
  setRecord(postType: "post" | "page", postId: number, record: ApplyRecord): void {
    const state = loadFile(this.filePath);
    state.records[buildKey(postType, postId)] = record;
    saveFile(this.filePath, state);
  }

  /** True if this URL is on the client's human-only allowlist. */
  isHumanOnly(url: string): boolean {
    const state = loadFile(this.filePath);
    // Normalize trailing slashes so /about and /about/ are treated identically.
    const norm = (u: string): string => u.replace(/\/+$/, "");
    return state.humanOnlyUrls.some((u) => norm(u) === norm(url));
  }

  /** Add a URL to the human-only allowlist. Idempotent. */
  markHumanOnly(url: string): void {
    const state = loadFile(this.filePath);
    if (!state.humanOnlyUrls.includes(url)) state.humanOnlyUrls.push(url);
    saveFile(this.filePath, state);
  }

  /** Remove a URL from the human-only allowlist. */
  unmarkHumanOnly(url: string): void {
    const state = loadFile(this.filePath);
    state.humanOnlyUrls = state.humanOnlyUrls.filter((u) => u !== url);
    saveFile(this.filePath, state);
  }
}
