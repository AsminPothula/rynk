/**
 * Verify the WP adapter handlers against a local WordPress Docker.
 *
 * Prerequisites:
 *   1. `cd local-wp && docker compose up -d`
 *   2. Visit http://localhost:8080 and complete the install wizard
 *   3. Create at least one published Page in WP admin (Pages -> Add New).
 *      Note its URL (or use the default "Sample Page" at ?page_id=2).
 *   4. In Users -> Profile -> Application Passwords, create one named "rynk".
 *      Copy the password.
 *   5. Create a .env file at the repo root:
 *        WP_URL=http://localhost:8080
 *        WP_USER=<admin username>
 *        WP_APP_PASSWORD=<the application password>
 *        WP_TEST_PAGE=<slug or full URL of a published page>
 *
 *      Optional flags:
 *        CREATE_PAGE_PUBLISH=true     # publish create_page results live (default: draft)
 *
 * Then run:
 *   npx tsx scripts/verify-wp-handlers.ts
 *
 * The script walks every live handler in the WordPress adapter:
 *
 *   1. applyUpdateMeta         - rewrites title + meta description on WP_TEST_PAGE
 *   2. applyInjectSchema       - injects Organization JSON-LD on WP_TEST_PAGE
 *   3. applyCreatePage         - creates a brand-new "rynk verification" page
 *   4. applyAddNapBlock        - injects a NAP block (+ LocalBusiness schema)
 *                                on WP_TEST_PAGE
 *   5. applyUpdatePage:rewrite - rewrites the create_page's body
 *   6. applyUpdatePage:expand  - appends a section to the create_page
 *
 * For each it prints the per-action result, then fetches the rendered HTML
 * back from WordPress and checks for the expected marker / content so we
 * know the change actually landed (not just that the REST call returned 200).
 */

import { config as loadEnv } from "dotenv";
loadEnv();

import { makeWordPressAdapter } from "@rynk/layer4-publish";
import type { ExecutionAction } from "@rynk/layer3-generate";

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
const WP_TEST_PAGE = requireEnv("WP_TEST_PAGE");

process.env["WORDPRESS_LIVE"] = "true";

// ── Build adapter ───────────────────────────────────────────────────────────

const adapter = makeWordPressAdapter({
  siteUrl: WP_URL,
  username: WP_USER,
  appPassword: WP_APP_PASSWORD,
});

// Accept either a full URL or a slug.
const testPageUrl = WP_TEST_PAGE.startsWith("http")
  ? WP_TEST_PAGE
  : `${WP_URL}/${WP_TEST_PAGE}/`;

// The new page will live at this slug + URL.
const NEW_PAGE_SLUG = "rynk-verification";
const newPageUrl = `${WP_URL}/?pagename=${NEW_PAGE_SLUG}`;

// ── Build the test manifest ────────────────────────────────────────────────

const baseProv = (sourceId: string, reason: string) => ({
  source: "audit-issue" as const,
  sourceId,
  reason,
});

const actions: ExecutionAction[] = [
  // 1. update_meta on the existing test page.
  {
    id: "meta-001",
    type: "update_meta",
    status: "approved",
    risk: "low",
    channel: "cms",
    automatable: true,
    provenance: baseProv("verify:meta", "Verify applyUpdateMeta lands on a real WP page"),
    notes: "verify-wp-handlers.ts",
    target: { url: testPageUrl },
    payload: {
      title: "rynk verified - meta update",
      metaDescription:
        "This meta description was set by rynk's applyUpdateMeta handler running against local WordPress.",
      canonical: null,
      metaRobots: null,
    },
  },

  // 2. inject_schema on the existing test page.
  {
    id: "schema-001",
    type: "inject_schema",
    status: "approved",
    risk: "low",
    channel: "cms",
    automatable: true,
    provenance: baseProv("verify:schema", "Verify applyInjectSchema lands on a real WP page"),
    notes: "verify-wp-handlers.ts",
    target: { url: testPageUrl, schemaType: "Organization", location: "page" },
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

  // 3. create_page - new page from markdown.
  {
    id: "page-001",
    type: "create_page",
    status: "approved",
    risk: "low",
    channel: "cms",
    automatable: true,
    provenance: baseProv("verify:create", "Verify applyCreatePage POSTs a new page"),
    notes: "verify-wp-handlers.ts",
    target: { slug: NEW_PAGE_SLUG, pageType: "pillar" },
    payload: {
      title: "rynk verification - created page",
      metaDescription: "Created by rynk's applyCreatePage handler.",
      bodyMarkdown: [
        "# rynk verification page",
        "",
        "This page was created end-to-end by rynk's `applyCreatePage` handler.",
        "",
        "## What this proves",
        "",
        "- A POST went to `/wp-json/wp/v2/pages` with this slug",
        "- The markdown body was converted to HTML before sending",
        "- WordPress accepted it and rendered the **title**, *paragraphs*,",
        "  lists, and links correctly",
        "",
        "[Visit rynk](https://rynk.ai)",
      ].join("\n"),
      imageActionIds: [],
      schemaActionIds: [],
    },
  },

  // 4. add_nap_block on the existing test page.
  {
    id: "nap-001",
    type: "add_nap_block",
    status: "approved",
    risk: "low",
    channel: "cms",
    automatable: true,
    provenance: baseProv("verify:nap", "Verify applyAddNapBlock injects NAP + LocalBusiness schema"),
    notes: "verify-wp-handlers.ts",
    target: { url: testPageUrl },
    payload: {
      legalName: "Rynk Verification LLC",
      address: "16803 Dallas Pkwy, Addison TX 75001",
      phone: "+1-512-555-0100",
      email: "hello@rynk.ai",
      includeLocalBusinessSchema: true,
    },
  },

  // 5. update_page:rewrite - rewrites the body of the page we just created.
  {
    id: "update-001",
    type: "update_page",
    status: "approved",
    risk: "low",
    channel: "cms",
    automatable: true,
    provenance: baseProv("verify:update-rewrite", "Verify applyUpdatePage rewrite operation"),
    notes: "verify-wp-handlers.ts",
    target: { url: newPageUrl, operation: "rewrite" },
    payload: {
      newBodyMarkdown: [
        "# rewritten body",
        "",
        "rynk's `applyUpdatePage` handler rewrote this whole page using the",
        "`rewrite` operation. The original content is gone; this paragraph",
        "is all that remains.",
      ].join("\n"),
      addSections: [],
      consolidateFromUrls: [],
    },
  },

  // 6. update_page:expand - appends a section to the page we just rewrote.
  {
    id: "update-002",
    type: "update_page",
    status: "approved",
    risk: "low",
    channel: "cms",
    automatable: true,
    provenance: baseProv("verify:update-expand", "Verify applyUpdatePage expand operation"),
    notes: "verify-wp-handlers.ts",
    target: { url: newPageUrl, operation: "expand" },
    payload: {
      addSections: [
        {
          h2: "Expanded section from rynk",
          body: "This section was appended by `applyUpdatePage` using the `expand` operation. It lives inside a `<!-- rynk:section -->` marker so re-running this action would replace rather than duplicate it.",
        },
      ],
      consolidateFromUrls: [],
    },
  },

  // 7. insert_internal_link - link a phrase in the new page back to the test page.
  {
    id: "link-001",
    type: "insert_internal_link",
    status: "approved",
    risk: "low",
    channel: "cms",
    automatable: true,
    provenance: baseProv("verify:link", "Verify applyInsertInternalLink wraps phrase with anchor"),
    notes: "verify-wp-handlers.ts",
    target: { sourceUrl: newPageUrl, targetUrl: testPageUrl },
    payload: {
      // "rynk" appears in the rewritten + expanded body, so this should
      // hit the in-text wrapping path, not the Related fallback.
      anchorText: "rynk",
    },
  },

  // 8. create_author - new author user for byline purposes.
  {
    id: "author-001",
    type: "create_author",
    status: "approved",
    risk: "low",
    channel: "cms",
    automatable: true,
    provenance: baseProv("verify:create-author", "Verify applyCreateAuthor creates WP user with role=author"),
    notes: "verify-wp-handlers.ts",
    target: { username: "rynk-verify-author" },
    payload: {
      displayName: "Rynk Verify Author",
      bio: "Created by rynk's applyCreateAuthor verifier. Acts as a byline for blog posts so they carry proper EEAT signals.",
      role: "Lead SEO Strategist",
      credentials: ["MBA", "Google Analytics Certified"],
      linkedinUrl: "https://www.linkedin.com/in/rynk-verify-author",
      headshotImageActionId: null,
    },
  },
];

// ── Run apply ───────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log(`\nTarget WP:   ${WP_URL}`);
  console.log(`Test page:   ${testPageUrl}`);
  console.log(`New page:    ${newPageUrl} (will be created)\n`);

  const results: Record<string, { status: string; url?: string | null }> = {};

  for (const action of actions) {
    const opLabel = action.type === "update_page" ? `:${action.target.operation}` : "";
    process.stdout.write(`\n-> ${action.id} (${action.type}${opLabel})\n`);
    const result = await adapter.apply(action);
    results[action.id] = { status: result.status, url: result.externalUrl };
    process.stdout.write(`  status: ${result.status}\n`);
    if (result.message) process.stdout.write(`  msg:    ${result.message}\n`);
    if (result.externalRef) process.stdout.write(`  ref:    ${result.externalRef}\n`);
    if (result.externalUrl) process.stdout.write(`  url:    ${result.externalUrl}\n`);
    if (result.error) process.stdout.write(`  ERROR:  ${result.error}\n`);
  }

  // ── Post-apply verification: fetch rendered HTML, check expected content ──

  console.log(`\n\n=== Verifying rendered HTML ===\n`);

  const checks: Array<{ label: string; url: string; needle: string }> = [];

  // Test page should have updated meta title (in <title>)
  checks.push({
    label: "meta-001    title visible in rendered page",
    url: results["meta-001"]?.url || testPageUrl,
    needle: "rynk verified",
  });

  // Test page should have Organization JSON-LD
  checks.push({
    label: "schema-001  Organization JSON-LD present",
    url: results["schema-001"]?.url || testPageUrl,
    needle: '"@type": "Organization"',
  });

  // New page should exist and contain the expanded section
  checks.push({
    label: "page-001 + update-002  new page reachable with expanded body",
    url: results["update-002"]?.url || newPageUrl,
    needle: "Expanded section from rynk",
  });

  // NAP block - LocalBusiness JSON-LD should be present on test page
  checks.push({
    label: "nap-001     LocalBusiness JSON-LD present",
    url: results["nap-001"]?.url || testPageUrl,
    needle: '"@type": "LocalBusiness"',
  });

  // Internal link - the new page should now have an <a href={testPageUrl}>
  // wrapping "rynk" somewhere in the body.
  checks.push({
    label: "link-001    anchor pointing to test page present on new page",
    url: results["link-001"]?.url || newPageUrl,
    needle: `data-rynk="link"`,
  });

  // Create author - GET /users/?slug=rynk-verify-author should succeed
  // (we check by hitting the WP author archive URL).
  checks.push({
    label: "author-001  author archive page reachable",
    url: `${WP_URL}/?author_name=rynk-verify-author`,
    needle: "Rynk Verify Author",
  });

  let allPass = true;
  for (const check of checks) {
    try {
      const html = await fetch(check.url).then((r) => r.text());
      const found = html.includes(check.needle);
      console.log(`  ${found ? "PASS" : "FAIL"}  ${check.label}`);
      if (!found) {
        console.log(`        URL:    ${check.url}`);
        console.log(`        needle: ${check.needle}`);
        allPass = false;
      }
    } catch (err) {
      console.log(`  FAIL  ${check.label} - fetch error: ${err instanceof Error ? err.message : String(err)}`);
      allPass = false;
    }
  }

  console.log(allPass ? "\nAll checks passed.\n" : "\nSome checks failed.\n");
  process.exit(allPass ? 0 : 1);
}

main().catch((err) => {
  console.error("\nverify-wp-handlers FAILED:", err);
  process.exit(1);
});
