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
 *   7. applyInsertInternalLink - wraps in-text phrase with anchor
 *   8. applyCreateAuthor       - creates WP user with role=author
 *   9. applyAssignAuthor       - attaches author byline to the new page
 *  10. applyAddRedirect        - creates redirect via Redirection plugin
 *
 * Redirect test (#9) requires the Redirection plugin:
 *   docker compose -f local-wp/docker-compose.yml run --rm wpcli \
 *     wp plugin install redirection --activate
 *   docker compose -f local-wp/docker-compose.yml run --rm wpcli \
 *     wp redirection database install
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
const newPageUrl = `${WP_URL}/${NEW_PAGE_SLUG}/`;
const VERIFY_AUTHOR_USERNAME = "rynk-verify-author";
const VERIFY_AUTHOR_DISPLAY_NAME = "Rynk Verify Author";

const REDIRECT_SOURCE_PATH = "/rynk-redirect-source";
const redirectSourceUrl = `${WP_URL}${REDIRECT_SOURCE_PATH}`;

function redirectLocationMatches(location: string, sourceUrl: string, targetUrl: string): boolean {
  const resolved = new URL(location, sourceUrl);
  const expected = new URL(targetUrl);
  return (
    resolved.pathname.replace(/\/$/, "") === expected.pathname.replace(/\/$/, "") ||
    resolved.href.replace(/\/$/, "") === expected.href.replace(/\/$/, "")
  );
}

async function verifyHttpRedirect(
  sourceUrl: string,
  targetUrl: string,
  expectedStatus: 301 | 302,
): Promise<{ ok: boolean; detail: string }> {
  const res = await fetch(sourceUrl, { redirect: "manual" });
  const location = res.headers.get("location");
  if (res.status !== expectedStatus) {
    return { ok: false, detail: `expected HTTP ${expectedStatus}, got ${res.status}` };
  }
  if (!location) {
    return { ok: false, detail: "missing Location header" };
  }
  if (!redirectLocationMatches(location, sourceUrl, targetUrl)) {
    return { ok: false, detail: `Location ${location} does not point to ${targetUrl}` };
  }
  return { ok: true, detail: `HTTP ${res.status} → ${location}` };
}

/** Confirm the assigned author's display name is on the page (HTML or REST embed). */
async function verifyAuthorOnPage(
  pageUrl: string,
  expectedDisplayName: string,
): Promise<{ ok: boolean; detail: string }> {
  const html = await fetch(pageUrl).then((r) => r.text());
  if (html.includes(expectedDisplayName)) {
    return { ok: true, detail: `"${expectedDisplayName}" visible in rendered page` };
  }

  const res = await fetch(
    `${WP_URL}/?rest_route=${encodeURIComponent("/wp/v2/pages")}&slug=${encodeURIComponent(NEW_PAGE_SLUG)}&_embed=author`,
  );
  if (!res.ok) {
    return { ok: false, detail: `REST fetch failed: HTTP ${res.status}` };
  }
  const pages = (await res.json()) as Array<{
    link?: string;
    _embedded?: { author?: Array<{ name?: string }> };
  }>;
  const page = pages[0];
  const authorName = page?._embedded?.author?.[0]?.name;
  if (authorName !== expectedDisplayName) {
    return {
      ok: false,
      detail: `expected author "${expectedDisplayName}", got "${authorName ?? "none"}"`,
    };
  }
  return { ok: true, detail: `author "${authorName}" confirmed via REST on ${page?.link ?? pageUrl}` };
}

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
    target: { username: VERIFY_AUTHOR_USERNAME },
    payload: {
      displayName: VERIFY_AUTHOR_DISPLAY_NAME,
      bio: "Created by rynk's applyCreateAuthor verifier. Acts as a byline for blog posts so they carry proper EEAT signals.",
      role: "Lead SEO Strategist",
      credentials: ["MBA", "Google Analytics Certified"],
      linkedinUrl: "https://www.linkedin.com/in/rynk-verify-author",
      headshotImageActionId: null,
    },
  },

  // 9. assign_author - attach the author to the page created in page-001.
  {
    id: "assign-001",
    type: "assign_author",
    status: "approved",
    risk: "low",
    channel: "cms",
    automatable: true,
    provenance: baseProv(
      "verify:assign-author",
      "Verify applyAssignAuthor sets post.author on the rynk-verification page",
    ),
    notes: "verify-wp-handlers.ts",
    target: { postUrl: newPageUrl, authorUsername: VERIFY_AUTHOR_USERNAME },
    payload: {},
  },

  // 10. add_redirect - 301 from a fake path to the test page (Redirection plugin).
  {
    id: "redirect-001",
    type: "add_redirect",
    status: "approved",
    risk: "low",
    channel: "cms",
    automatable: true,
    provenance: baseProv(
      "verify:redirect",
      "Verify applyAddRedirect creates a live 301 via the Redirection plugin",
    ),
    notes: "verify-wp-handlers.ts",
    target: { sourceUrl: redirectSourceUrl, targetUrl: testPageUrl },
    payload: { statusCode: 301 },
  },
];

// ── Run apply ───────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log(`\nTarget WP:   ${WP_URL}`);
  console.log(`Test page:   ${testPageUrl}`);
  console.log(`New page:    ${newPageUrl} (will be created)`);
  console.log(`Redirect:    ${redirectSourceUrl} → ${testPageUrl}\n`);

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

  const assignApply = results["assign-001"];
  if (assignApply?.status !== "applied") {
    console.log(`  FAIL  assign-001  apply status was "${assignApply?.status ?? "missing"}"`);
    allPass = false;
  } else {
    try {
      const assignCheck = await verifyAuthorOnPage(
        assignApply.url || newPageUrl,
        VERIFY_AUTHOR_DISPLAY_NAME,
      );
      console.log(
        `  ${assignCheck.ok ? "PASS" : "FAIL"}  assign-001  author display name on new page`,
      );
      if (!assignCheck.ok) {
        console.log(`        page:   ${assignApply.url || newPageUrl}`);
        console.log(`        detail: ${assignCheck.detail}`);
        allPass = false;
      } else {
        console.log(`        ${assignCheck.detail}`);
      }
    } catch (err) {
      console.log(
        `  FAIL  assign-001  fetch error: ${err instanceof Error ? err.message : String(err)}`,
      );
      allPass = false;
    }
  }

  const redirectApply = results["redirect-001"];
  if (redirectApply?.status === "skipped") {
    console.log(`  FAIL  redirect-001  skipped — Redirection plugin must be installed and active`);
    allPass = false;
  } else if (redirectApply?.status !== "applied") {
    console.log(`  FAIL  redirect-001  apply status was "${redirectApply?.status ?? "missing"}"`);
    allPass = false;
  } else {
    try {
      const redirectCheck = await verifyHttpRedirect(redirectSourceUrl, testPageUrl, 301);
      console.log(
        `  ${redirectCheck.ok ? "PASS" : "FAIL"}  redirect-001  source URL returns 301 to test page`,
      );
      if (!redirectCheck.ok) {
        console.log(`        source: ${redirectSourceUrl}`);
        console.log(`        target: ${testPageUrl}`);
        console.log(`        detail: ${redirectCheck.detail}`);
        allPass = false;
      } else {
        console.log(`        ${redirectCheck.detail}`);
      }
    } catch (err) {
      console.log(
        `  FAIL  redirect-001  fetch error: ${err instanceof Error ? err.message : String(err)}`,
      );
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
