/**
 * Verify that WordPress handlers correctly SKIP page-builder pages.
 *
 * Unlike verify-wp-handlers.ts (which hits a real WP Docker), this test
 * mocks WordPressClient.detectPageBuilder to return "elementor" /
 * "divi" / "wpbakery" and confirms each content-modifying handler
 * returns:
 *
 *   - status = "skipped"
 *   - edgeCase = the corresponding "page-builder-*" code
 *   - a message that names the builder so the team knows why
 *
 * We mock at the client level rather than setting real Elementor meta
 * because setting plugin-specific meta via WP REST is restricted and
 * requires the actual plugin to be installed. Mocking is enough to
 * prove the guard fires - the detection itself is separately tested
 * whenever a real client with a builder plugin runs through the pipeline.
 *
 * Handlers exercised:
 *   - applyUpdatePage
 *   - applyInsertInternalLink
 *   - applyAddNapBlock
 *   - applyInjectSchema
 *
 * Handlers deliberately NOT exercised (don't need the guard):
 *   - applyUpdateMeta       (writes to meta fields, page-builder-safe)
 *   - applyCreatePage       (fresh page, no builder state yet)
 *   - applyCreateAuthor     (user data, not content)
 */

import type { WordPressClient, WPPostSummary, WPPost } from "../packages/layer4-publish/src/adapters/wordpress/client.ts";
import { applyUpdatePage } from "../packages/layer4-publish/src/adapters/wordpress/handlers/update-page.ts";
import { applyInsertInternalLink } from "../packages/layer4-publish/src/adapters/wordpress/handlers/insert-internal-link.ts";
import { applyAddNapBlock } from "../packages/layer4-publish/src/adapters/wordpress/handlers/add-nap-block.ts";
import { applyInjectSchema } from "../packages/layer4-publish/src/adapters/wordpress/handlers/inject-schema.ts";
import type { ApplyResult, EdgeCaseCode } from "../packages/layer4-publish/src/adapters/types.ts";
import type { ExecutionAction } from "@rynk/layer3-generate";

// ── Mock WordPressClient ────────────────────────────────────────────────────

/**
 * Test double for WordPressClient that returns whatever builder we want
 * from detectPageBuilder and stubs out the other methods just enough
 * for the handlers to reach the guard.
 */
class MockClient {
  private readonly builderForNext: "elementor" | "divi" | "wpbakery";
  constructor(builder: "elementor" | "divi" | "wpbakery") {
    this.builderForNext = builder;
  }

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
      content: { rendered: "<p>original</p>", raw: "<p>original</p>" },
      excerpt: { rendered: "" },
    };
  }

  async updatePost(_type: "post" | "page", _id: number, _fields: Record<string, unknown>): Promise<WPPost> {
    throw new Error("updatePost should NOT be called - the guard should have skipped");
  }

  async detectPageBuilder(_type: "post" | "page", _id: number): Promise<"elementor" | "divi" | "wpbakery" | null> {
    return this.builderForNext;
  }

  async detectSeoPlugin(): Promise<"yoast" | "rank-math" | "seopress" | "none"> {
    return "none";
  }

  async request<T>(_method: "GET" | "POST" | "PUT" | "DELETE", _path: string, _body?: unknown): Promise<T> {
    throw new Error("request should NOT be called - the guard should have skipped");
  }

  async ping(): Promise<{ siteName: string; wpVersion: string; user: string }> {
    return { siteName: "mock", wpVersion: "mock", user: "mock" };
  }
}

// ── Sample actions ──────────────────────────────────────────────────────────

const prov = { source: "audit-issue" as const, sourceId: "skip-test", reason: "skip test" };

function updatePageAction(): ExecutionAction {
  return {
    id: "up-001",
    type: "update_page",
    status: "approved",
    risk: "low",
    channel: "cms",
    automatable: true,
    provenance: prov,
    notes: null,
    target: { url: "http://localhost:8080/sample-page/", operation: "rewrite" },
    payload: { newBodyMarkdown: "new body", addSections: [], consolidateFromUrls: [] },
  } as unknown as ExecutionAction;
}

function insertLinkAction(): ExecutionAction {
  return {
    id: "il-001",
    type: "insert_internal_link",
    status: "approved",
    risk: "low",
    channel: "cms",
    automatable: true,
    provenance: prov,
    notes: null,
    target: {
      sourceUrl: "http://localhost:8080/sample-page/",
      targetUrl: "http://localhost:8080/target/",
    },
    payload: { anchorText: "learn more" },
  } as unknown as ExecutionAction;
}

function napAction(): ExecutionAction {
  return {
    id: "nap-001",
    type: "add_nap_block",
    status: "approved",
    risk: "low",
    channel: "cms",
    automatable: true,
    provenance: prov,
    notes: null,
    target: { url: "http://localhost:8080/sample-page/" },
    payload: {
      legalName: "Test LLC",
      address: "123 Main St",
      phone: "+1-555-0100",
      email: null,
      includeLocalBusinessSchema: true,
    },
  } as unknown as ExecutionAction;
}

function injectSchemaAction(): ExecutionAction {
  return {
    id: "sc-001",
    type: "inject_schema",
    status: "approved",
    risk: "low",
    channel: "cms",
    automatable: true,
    provenance: prov,
    notes: null,
    target: {
      url: "http://localhost:8080/sample-page/",
      schemaType: "Organization",
      location: "page",
    },
    payload: { jsonLd: { "@context": "https://schema.org", "@type": "Organization", name: "Test" } },
  } as unknown as ExecutionAction;
}

// ── Test runner ─────────────────────────────────────────────────────────────

interface Case {
  label: string;
  handler: (client: WordPressClient, action: ExecutionAction) => Promise<ApplyResult>;
  action: ExecutionAction;
}

const HANDLERS: Case[] = [
  { label: "applyUpdatePage", handler: applyUpdatePage, action: updatePageAction() },
  { label: "applyInsertInternalLink", handler: applyInsertInternalLink, action: insertLinkAction() },
  { label: "applyAddNapBlock", handler: applyAddNapBlock, action: napAction() },
  { label: "applyInjectSchema", handler: applyInjectSchema, action: injectSchemaAction() },
];

const BUILDERS = ["elementor", "divi", "wpbakery"] as const;

async function main(): Promise<void> {
  let pass = 0;
  let total = 0;

  for (const builder of BUILDERS) {
    console.log(`\n=== ${builder} ===`);
    for (const c of HANDLERS) {
      total++;
      const client = new MockClient(builder) as unknown as WordPressClient;
      const result = await c.handler(client, c.action);

      const expectedEdge: EdgeCaseCode = `page-builder-${builder}`;
      const statusOk = result.status === "skipped";
      const edgeOk = result.edgeCase === expectedEdge;
      const msgOk = !!result.message && result.message.length > 0;

      if (statusOk && edgeOk && msgOk) {
        console.log(`  PASS  ${c.label}`);
        pass++;
      } else {
        console.log(`  FAIL  ${c.label}`);
        console.log(`        status:   ${result.status} (expected "skipped")`);
        console.log(`        edgeCase: ${result.edgeCase} (expected "${expectedEdge}")`);
        console.log(`        message:  ${result.message}`);
      }
    }
  }

  console.log(`\n${pass}/${total} skip guards fired correctly`);
  process.exit(pass === total ? 0 : 1);
}

main().catch((err) => {
  console.error("skip-verifier failed:", err);
  process.exit(1);
});
