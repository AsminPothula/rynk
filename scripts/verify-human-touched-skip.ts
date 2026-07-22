/**
 * Verify the human-touched guard.
 *
 * Scenarios covered:
 *
 *   1. No prior rynk apply (first time)
 *      - state store has no record for the post
 *      - handler should proceed and apply
 *      - after apply, state store should have a record with fresh timestamp
 *
 *   2. Prior rynk apply, no human edit since
 *      - state.lastAppliedAt = T1
 *      - WP modified_gmt      = T1 (unchanged)
 *      - handler should proceed and apply
 *      - state.lastAppliedAt gets bumped to T2
 *
 *   3. Prior rynk apply, human edited after
 *      - state.lastAppliedAt = T1
 *      - WP modified_gmt      = T2 > T1  (human edit)
 *      - handler should SKIP with edgeCase = "human-edit-since-rynk"
 *
 *   4. URL is on the human-only allowlist
 *      - handler should SKIP with edgeCase = "human-only-url"
 *      - even if there is no prior rynk record and no human edit
 *
 * Uses mocked WordPressClient + a temp-directory file-backed state store
 * (real code, real file I/O). No WP Docker needed.
 */

import { mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import type { WordPressClient, WPPost, WPPostSummary } from "../packages/layer4-publish/src/adapters/wordpress/client.ts";
import { applyUpdateMeta } from "../packages/layer4-publish/src/adapters/wordpress/handlers/update-meta.ts";
import { FileApplyStateStore } from "../packages/layer4-publish/src/state/apply-state.ts";
import type { ApplyResult } from "../packages/layer4-publish/src/adapters/types.ts";
import type { ExecutionAction } from "@rynk/layer3-generate";

// ── Mock WordPressClient ────────────────────────────────────────────────────

interface MockConfig {
  wpModifiedGmt: string;
  builder?: "elementor" | "divi" | "wpbakery" | null;
}

class MockClient {
  constructor(private cfg: MockConfig) {}

  async findPostByUrl(_url: string): Promise<WPPostSummary | null> {
    return {
      id: 42,
      slug: "sample-page",
      link: "http://localhost:8080/sample-page/",
      title: { rendered: "Sample Page" },
      type: "page",
      status: "publish",
    };
  }

  async getPost(_type: "post" | "page", id: number): Promise<WPPost> {
    return {
      id,
      slug: "sample-page",
      link: "http://localhost:8080/sample-page/",
      title: { rendered: "Sample Page" },
      type: "page",
      status: "publish",
      modified: this.cfg.wpModifiedGmt,
      modified_gmt: this.cfg.wpModifiedGmt,
      content: { rendered: "<p>content</p>", raw: "<p>content</p>" },
      excerpt: { rendered: "" },
    };
  }

  async updatePost(_type: "post" | "page", _id: number, _fields: Record<string, unknown>): Promise<WPPost> {
    return this.getPost("page", 42);
  }

  async detectPageBuilder(): Promise<"elementor" | "divi" | "wpbakery" | null> {
    return this.cfg.builder ?? null;
  }

  async detectSeoPlugin(): Promise<"yoast" | "rank-math" | "seopress" | "none"> {
    return "none";
  }

  async request(): Promise<unknown> {
    throw new Error("request should not be called in this test");
  }

  async ping(): Promise<{ siteName: string; wpVersion: string; user: string }> {
    return { siteName: "mock", wpVersion: "mock", user: "mock" };
  }
}

// ── Fixtures ────────────────────────────────────────────────────────────────

function metaAction(id = "meta-001"): ExecutionAction {
  return {
    id,
    type: "update_meta",
    status: "approved",
    risk: "low",
    channel: "cms",
    automatable: true,
    provenance: { source: "audit-issue" as const, sourceId: "test", reason: "test" },
    notes: null,
    target: { url: "http://localhost:8080/sample-page/" },
    payload: {
      title: "New title",
      metaDescription: "New description",
      canonical: null,
      metaRobots: null,
    },
  } as unknown as ExecutionAction;
}

// ── Runner ──────────────────────────────────────────────────────────────────

const TMP = "/tmp/rynk-human-touched-test";

interface Case {
  label: string;
  run: () => Promise<{ pass: boolean; detail?: string }>;
}

const CASES: Case[] = [
  {
    label: "1. first time apply - no prior rynk record - proceeds",
    async run() {
      rmSync(TMP, { recursive: true, force: true });
      mkdirSync(TMP, { recursive: true });
      const state = new FileApplyStateStore(join(TMP, "state.json"));
      const client = new MockClient({ wpModifiedGmt: "2026-06-30T09:00:00" }) as unknown as WordPressClient;

      const result = await applyUpdateMeta(client, metaAction(), state);
      const ok = result.status === "applied";
      if (!ok) return { pass: false, detail: `status=${result.status} edgeCase=${result.edgeCase}` };

      const record = state.getRecord("page", 42);
      if (!record) return { pass: false, detail: "no record was written after apply" };
      return { pass: true };
    },
  },
  {
    label: "2. prior rynk record, no human edit since - proceeds and bumps timestamp",
    async run() {
      rmSync(TMP, { recursive: true, force: true });
      mkdirSync(TMP, { recursive: true });
      const state = new FileApplyStateStore(join(TMP, "state.json"));
      // Pre-seed a rynk record from earlier today.
      state.setRecord("page", 42, {
        lastAppliedAt: "2026-06-30T08:00:00.000Z",
        lastAppliedActionId: "prior-001",
      });
      // WP says the page was last modified BEFORE rynk's record - no human edit.
      const client = new MockClient({ wpModifiedGmt: "2026-06-30T07:30:00" }) as unknown as WordPressClient;

      const result = await applyUpdateMeta(client, metaAction("meta-002"), state);
      const ok = result.status === "applied";
      if (!ok) return { pass: false, detail: `status=${result.status} edgeCase=${result.edgeCase}` };

      const record = state.getRecord("page", 42);
      const bumped = record !== null && record.lastAppliedActionId === "meta-002";
      return bumped
        ? { pass: true }
        : { pass: false, detail: "timestamp/action ID was not updated to the latest apply" };
    },
  },
  {
    label: "3. human edited after rynk - skips with edgeCase=human-edit-since-rynk",
    async run() {
      rmSync(TMP, { recursive: true, force: true });
      mkdirSync(TMP, { recursive: true });
      const state = new FileApplyStateStore(join(TMP, "state.json"));
      state.setRecord("page", 42, {
        lastAppliedAt: "2026-06-30T08:00:00.000Z",
        lastAppliedActionId: "prior-001",
      });
      // WP says the page was modified LATER (human editing in wp-admin).
      const client = new MockClient({ wpModifiedGmt: "2026-06-30T14:00:00" }) as unknown as WordPressClient;

      const result = await applyUpdateMeta(client, metaAction("meta-003"), state);
      const ok = result.status === "skipped" && result.edgeCase === "human-edit-since-rynk";
      return ok
        ? { pass: true }
        : { pass: false, detail: `status=${result.status} edgeCase=${result.edgeCase}` };
    },
  },
  {
    label: "4. url is on human-only allowlist - skips with edgeCase=human-only-url",
    async run() {
      rmSync(TMP, { recursive: true, force: true });
      mkdirSync(TMP, { recursive: true });
      const state = new FileApplyStateStore(join(TMP, "state.json"));
      state.markHumanOnly("http://localhost:8080/sample-page/");
      const client = new MockClient({ wpModifiedGmt: "2026-06-30T09:00:00" }) as unknown as WordPressClient;

      const result = await applyUpdateMeta(client, metaAction("meta-004"), state);
      const ok = result.status === "skipped" && result.edgeCase === "human-only-url";
      return ok
        ? { pass: true }
        : { pass: false, detail: `status=${result.status} edgeCase=${result.edgeCase}` };
    },
  },
  {
    label: "5. no state store passed (backwards compat) - proceeds regardless",
    async run() {
      const client = new MockClient({ wpModifiedGmt: "2026-06-30T09:00:00" }) as unknown as WordPressClient;
      const result: ApplyResult = await applyUpdateMeta(client, metaAction("meta-005"));
      const ok = result.status === "applied";
      return ok
        ? { pass: true }
        : { pass: false, detail: `status=${result.status} edgeCase=${result.edgeCase}` };
    },
  },
];

async function main(): Promise<void> {
  let pass = 0;
  for (const c of CASES) {
    const res = await c.run();
    if (res.pass) {
      console.log(`PASS  ${c.label}`);
      pass++;
    } else {
      console.log(`FAIL  ${c.label}`);
      if (res.detail) console.log(`      ${res.detail}`);
    }
  }
  console.log(`\n${pass}/${CASES.length} human-touched cases passed`);
  // Clean up.
  rmSync(TMP, { recursive: true, force: true });
  process.exit(pass === CASES.length ? 0 : 1);
}

main().catch((err) => {
  console.error("verify-human-touched-skip failed:", err);
  process.exit(1);
});
