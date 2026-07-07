/**
 * Verify the CachePurger + post-apply purge hook.
 *
 * No Docker, no real HTTP - we mock the WordPressClient's request method
 * and Cloudflare's fetch. The point is to prove:
 *
 *   1. Detected WP cache plugins get their purge endpoints hit
 *   2. Cloudflare purge fires when config is provided
 *   3. All-succeeded runs report cleanly in the summary
 *   4. Partial failures still report success on the parent action but
 *      append a "cache purge failed on X" note
 *   5. Zero-plugin sites (no cache detected + no Cloudflare) produce
 *      an empty summary (no false "purged" noise)
 *   6. Handlers call the purger after their apply completes and the
 *      purge summary lands in the ApplyResult message
 */

import type {
  WordPressClient,
  WPPost,
  WPPostSummary,
} from "../packages/layer4-publish/src/adapters/wordpress/client.ts";
import {
  CachePurger,
  type WPCachePlugin,
} from "../packages/layer4-publish/src/cache/purger.ts";
import { applyUpdateMeta } from "../packages/layer4-publish/src/adapters/wordpress/handlers/update-meta.ts";
import type { ExecutionAction } from "@rynk/layer3-generate";

// ── Mock WordPressClient ──────────────────────────────────────────────

/** Configurable mock so each test controls which plugins/paths respond. */
class MockClient {
  public requestLog: Array<{ method: string; path: string; body?: unknown }> = [];

  constructor(
    private readonly opts: {
      detectedPlugins?: WPCachePlugin[];
      failingPurges?: WPCachePlugin[];
    } = {},
  ) {}

  async findPostByUrl(_url: string): Promise<WPPostSummary | null> {
    return {
      id: 5,
      slug: "sample",
      link: "http://localhost:8080/sample/",
      title: { rendered: "Sample" },
      type: "page",
      status: "publish",
    };
  }

  async getPost(_type: "post" | "page", id: number): Promise<WPPost> {
    return {
      id,
      slug: "sample",
      link: "http://localhost:8080/sample/",
      title: { rendered: "Sample" },
      type: "page",
      status: "publish",
      content: { rendered: "", raw: "" },
      excerpt: { rendered: "" },
      modified_gmt: "2026-01-01T00:00:00",
    };
  }

  async updatePost(_type: "post" | "page", _id: number, _fields: Record<string, unknown>): Promise<WPPost> {
    return this.getPost("page", 5);
  }

  async detectPageBuilder(): Promise<null> {
    return null;
  }

  async detectSeoPlugin(): Promise<"none"> {
    return "none";
  }

  async detectCachingPlugins(): Promise<WPCachePlugin[]> {
    return this.opts.detectedPlugins ?? [];
  }

  async request<T>(method: "GET" | "POST" | "PUT" | "DELETE", path: string, body?: unknown): Promise<T> {
    this.requestLog.push({ method, path, body });
    // Simulate plugin-specific failures for purge endpoints.
    const failing = this.opts.failingPurges ?? [];
    if (failing.includes("wp-rocket") && path.includes("/wp-rocket/")) throw new Error("wp-rocket 404");
    if (failing.includes("litespeed") && path.includes("/litespeed/")) throw new Error("litespeed 401");
    if (failing.includes("w3-total-cache") && path.includes("/w3tc/")) throw new Error("w3tc 404");
    if (failing.includes("wp-super-cache") && path.includes("/wp-super-cache/")) throw new Error("super-cache 404");
    return {} as T;
  }

  async ping(): Promise<{ siteName: string; wpVersion: string; user: string }> {
    return { siteName: "mock", wpVersion: "mock", user: "mock" };
  }
}

// ── Cloudflare fetch mock ────────────────────────────────────────────

const originalFetch = global.fetch;
const cloudflareCallLog: Array<{ url: string; ok: boolean }> = [];

function stubCloudflareFetch(mode: "ok" | "fail" | "off"): void {
  if (mode === "off") {
    global.fetch = originalFetch;
    return;
  }
  global.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (url.includes("cloudflare.com")) {
      cloudflareCallLog.push({ url, ok: mode === "ok" });
      return new Response(mode === "ok" ? '{"success":true}' : "forbidden", {
        status: mode === "ok" ? 200 : 403,
      });
    }
    return originalFetch(input as string | URL | Request, init);
  }) as typeof fetch;
}

// ── Sample action ────────────────────────────────────────────────────

function metaAction(): ExecutionAction {
  return {
    id: "meta-cp-001",
    type: "update_meta",
    status: "approved",
    risk: "low",
    channel: "cms",
    automatable: true,
    provenance: { source: "audit-issue" as const, sourceId: "cache-test", reason: "cache test" },
    notes: null,
    target: { url: "http://localhost:8080/sample/" },
    payload: {
      title: "T",
      metaDescription: "D",
      canonical: null,
      metaRobots: null,
    },
  } as unknown as ExecutionAction;
}

// ── Runner ────────────────────────────────────────────────────────────

interface Case {
  label: string;
  run: () => Promise<{ pass: boolean; detail?: string }>;
}

const CASES: Case[] = [
  {
    label: "1. no cache config - purge report has 0 attempts, empty summary, no message noise",
    async run() {
      const client = new MockClient({ detectedPlugins: [] }) as unknown as WordPressClient;
      const purger = new CachePurger({ wpClient: client });
      const report = await purger.purge(["http://localhost:8080/page/"]);
      const ok =
        report.attempts.length === 0 &&
        report.allSucceeded === true &&
        report.summary === "no caches to purge";
      return ok
        ? { pass: true }
        : { pass: false, detail: `attempts=${report.attempts.length} summary="${report.summary}"` };
    },
  },
  {
    label: "2. wp-rocket + litespeed detected - both purge endpoints called, report all-succeeded",
    async run() {
      const mock = new MockClient({ detectedPlugins: ["wp-rocket", "litespeed"] });
      const purger = new CachePurger({ wpClient: mock as unknown as WordPressClient });
      const report = await purger.purge(["http://localhost:8080/page/"]);
      const paths = mock.requestLog.map((r) => r.path);
      const hitBoth =
        paths.some((p) => p.startsWith("/wp-rocket/")) &&
        paths.some((p) => p.startsWith("/litespeed/"));
      return hitBoth && report.allSucceeded
        ? { pass: true }
        : { pass: false, detail: `paths=${paths.join(",")} allSucceeded=${report.allSucceeded}` };
    },
  },
  {
    label: "3. wp-rocket succeeds, litespeed fails - allSucceeded=false, summary mentions both",
    async run() {
      const mock = new MockClient({
        detectedPlugins: ["wp-rocket", "litespeed"],
        failingPurges: ["litespeed"],
      });
      const purger = new CachePurger({ wpClient: mock as unknown as WordPressClient });
      const report = await purger.purge(["http://localhost:8080/page/"]);
      const ok =
        !report.allSucceeded &&
        report.summary.includes("wp-rocket") &&
        report.summary.includes("litespeed");
      return ok
        ? { pass: true }
        : { pass: false, detail: `summary="${report.summary}" allSucceeded=${report.allSucceeded}` };
    },
  },
  {
    label: "4. cloudflare purge fires when config provided (success path)",
    async run() {
      stubCloudflareFetch("ok");
      cloudflareCallLog.length = 0;
      const client = new MockClient() as unknown as WordPressClient;
      const purger = new CachePurger({
        wpClient: client,
        cloudflare: { apiToken: "TEST_TOKEN", zoneId: "TEST_ZONE" },
      });
      const report = await purger.purge(["http://localhost:8080/page/"]);
      stubCloudflareFetch("off");
      const ok =
        cloudflareCallLog.length === 1 &&
        cloudflareCallLog[0]!.url.includes("TEST_ZONE") &&
        report.allSucceeded &&
        report.summary.includes("cloudflare");
      return ok
        ? { pass: true }
        : { pass: false, detail: `cf-calls=${cloudflareCallLog.length} summary="${report.summary}"` };
    },
  },
  {
    label: "5. cloudflare failure - allSucceeded=false, summary reports the failure",
    async run() {
      stubCloudflareFetch("fail");
      cloudflareCallLog.length = 0;
      const client = new MockClient() as unknown as WordPressClient;
      const purger = new CachePurger({
        wpClient: client,
        cloudflare: { apiToken: "TEST_TOKEN", zoneId: "TEST_ZONE" },
      });
      const report = await purger.purge(["http://localhost:8080/page/"]);
      stubCloudflareFetch("off");
      const ok = !report.allSucceeded && report.summary.includes("cloudflare");
      return ok
        ? { pass: true }
        : { pass: false, detail: `summary="${report.summary}" allSucceeded=${report.allSucceeded}` };
    },
  },
  {
    label: "6. handler calls purger; purge summary lands in ApplyResult.message",
    async run() {
      const mock = new MockClient({ detectedPlugins: ["wp-rocket"] });
      const client = mock as unknown as WordPressClient;
      const purger = new CachePurger({ wpClient: client });
      const result = await applyUpdateMeta(client, metaAction(), undefined, purger);
      const ok =
        result.status === "applied" &&
        !!result.message &&
        result.message.includes("cache:") &&
        result.message.includes("wp-rocket");
      return ok
        ? { pass: true }
        : { pass: false, detail: `status=${result.status} message="${result.message}"` };
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
  console.log(`\n${pass}/${CASES.length} cache-purge cases passed`);
  process.exit(pass === CASES.length ? 0 : 1);
}

main().catch((err) => {
  console.error("verify-cache-purge failed:", err);
  process.exit(1);
});
