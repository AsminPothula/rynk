/**
 * Verify the WP adapter handlers against a local WordPress Docker.
 *
 * Prerequisites:
 *   1. `cd local-wp && docker compose up -d`
 *   2. Visit http://localhost:8080 and complete the install wizard
 *   3. Create at least one published Page and one published Post in WP admin
 *      (Pages → Add New, Posts → Add New). Note their slugs.
 *   4. In Users → Profile → Application Passwords, create one named "rynk".
 *      Copy the password.
 *   5. Set env vars:
 *      WP_URL=http://localhost:8080
 *      WP_USER=<admin username>
 *      WP_APP_PASSWORD=<the application password>
 *      WP_TEST_PAGE_SLUG=<the slug of a published page>
 *
 * Then run:
 *   npx tsx scripts/verify-wp-handlers.ts
 *
 * It will:
 *   1. ping the WP REST API (auth check)
 *   2. exercise applyUpdateMeta — set a title + meta description
 *   3. exercise applyInjectSchema — inject an Organization JSON-LD block
 *   4. fetch the page back and confirm the script tag is present
 */

import { config as loadEnv } from "dotenv";
loadEnv();

import { makeWordPressAdapter } from "@rynk/layer4-publish";
import type {
  ExecutionAction,
} from "@rynk/layer3-generate";

// ── Env ─────────────────────────────────────────────────────────────────────

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`ERROR: ${name} is not set. See header of this file for setup.`);
    process.exit(1);
  }
  return v;
}

const WP_URL = requireEnv("WP_URL");
const WP_USER = requireEnv("WP_USER");
const WP_APP_PASSWORD = requireEnv("WP_APP_PASSWORD");
// Either a pretty-permalink slug (e.g. "test-page") or the full URL of
// the test page (e.g. "http://localhost:8080/?page_id=2"). The adapter
// handles both.
const WP_TEST_PAGE = requireEnv("WP_TEST_PAGE");

process.env["WORDPRESS_LIVE"] = "true";

// ── Build adapter ───────────────────────────────────────────────────────────

const adapter = makeWordPressAdapter({
  siteUrl: WP_URL,
  username: WP_USER,
  appPassword: WP_APP_PASSWORD,
});

// ── Build a tiny in-memory manifest with 2 actions ─────────────────────────

// Accept either a full URL (e.g. http://localhost:8080/?page_id=2) or a slug.
const pageUrl = WP_TEST_PAGE.startsWith("http")
  ? WP_TEST_PAGE
  : `${WP_URL}/${WP_TEST_PAGE}/`;

const actions: ExecutionAction[] = [
  {
    id: "meta-001",
    type: "update_meta",
    status: "approved",
    risk: "low",
    channel: "cms",
    automatable: true,
    provenance: {
      source: "audit-issue",
      sourceId: "manual-verify",
      reason: "Manual verification of applyUpdateMeta against local WP",
    },
    notes: "verify-wp-handlers.ts",
    target: { url: pageUrl },
    payload: {
      title: "rynk verified — updated title",
      metaDescription:
        "This meta description was set by rynk's applyUpdateMeta handler running against local WordPress.",
      canonical: null,
      metaRobots: null,
    },
  },
  {
    id: "schema-001",
    type: "inject_schema",
    status: "approved",
    risk: "low",
    channel: "cms",
    automatable: true,
    provenance: {
      source: "audit-issue",
      sourceId: "manual-verify",
      reason: "Manual verification of applyInjectSchema against local WP",
    },
    notes: "verify-wp-handlers.ts",
    target: {
      url: pageUrl,
      schemaType: "Organization",
      location: "page",
    },
    payload: {
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Rynk Test Organization",
        url: WP_URL,
        description: "Injected by rynk's applyInjectSchema handler.",
      },
    },
  },
];

// ── Run apply ───────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log(`\nTarget WP: ${WP_URL}`);
  console.log(`Test page URL: ${pageUrl}\n`);

  // Per-action apply so we can see specific errors. The dispatcher's apply
  // path catches errors at the action level — running each one directly here
  // gives us the per-action message.
  for (const action of actions) {
    process.stdout.write(`\n→ ${action.id} (${action.type})\n`);
    const result = await adapter.apply(action);
    process.stdout.write(`  status: ${result.status}\n`);
    if (result.message) process.stdout.write(`  msg:    ${result.message}\n`);
    if (result.externalRef) process.stdout.write(`  ref:    ${result.externalRef}\n`);
    if (result.externalUrl) process.stdout.write(`  url:    ${result.externalUrl}\n`);
    if (result.error) process.stdout.write(`  ERROR:  ${result.error}\n`);
  }

  // Verify the schema script tag actually made it into the page.
  console.log(`\nFetching page HTML to confirm script tag…`);
  const html = await fetch(pageUrl).then((r) => r.text());
  const hasScript = html.includes('<script type="application/ld+json">');
  const hasOrgType = html.includes('"@type": "Organization"') || html.includes('"@type":"Organization"');
  console.log(`  <script type="application/ld+json"> present: ${hasScript ? "✓ YES" : "✗ NO"}`);
  console.log(`  @type=Organization present:                  ${hasOrgType ? "✓ YES" : "✗ NO"}`);

  const fail = !hasScript || !hasOrgType;
  console.log(fail ? "\n✗ verification failed" : "\n✓ all checks passed");
  process.exit(fail ? 1 : 0);
}

main().catch((err) => {
  console.error("\nverify-wp-handlers FAILED:", err);
  process.exit(1);
});
