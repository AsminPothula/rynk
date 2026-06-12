/**
 * Code-PR generator — translates code-level audit findings into
 * `propose_code_change` ExecutionActions for the human dev team.
 *
 * Why a separate generator (vs squeezing into the others):
 *   - Code changes can't safely be auto-applied by the CMS adapter. They
 *     need a dev to review the diff, run tests, and merge.
 *   - The dashboard surfaces these in a "Dev queue" tab, separate from
 *     CMS / outreach / social.
 *   - Each one becomes a GitHub PR draft in Layer 4 once we wire the
 *     GitHubAdapter.
 *
 * Sources:
 *   1. Page-speed P1/P2 issues with category "technical" — render-blocking
 *      scripts, unoptimized images, large bundles, etc.
 *   2. Schema-templates Layer 1 surfaced — if `schemaTemplates` lists
 *      sitewide schema (Organization, Article on blog template) and the
 *      audit already flagged sitewide schema missing, we propose a theme
 *      modification PR.
 *   3. llms.txt status — if missing, propose adding it at the server root
 *      (theme functions.php or .htaccess).
 *
 * All actions are `automatable=false` (a human dev must approve and merge).
 * Channel = "code-pr".
 */

import type {
  AuditFindings,
  ClientContext,
  StrategyOutput,
  AuditIssue,
} from "@rynk/core";
import type {
  ExecutionAction,
  ProposeCodeChangeAction,
} from "../schema/execution-manifest.js";

export interface CodePRGeneratorOptions {
  audit: AuditFindings;
  strategy: StrategyOutput;
  client: ClientContext;
  idPrefix?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugifyForBranch(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

/**
 * Decide whether an audit issue is "dev work" — i.e. needs a code-PR.
 * Heuristic: owner === "dev" + effort >= "M", or category === "technical"
 * and the description mentions code-level fixes (scripts, JS, CSS, theme).
 */
function isDevWork(issue: AuditIssue): boolean {
  if (issue.owner === "dev" && (issue.effort === "M" || issue.effort === "L")) return true;
  if (issue.category === "technical") {
    return /\b(script|javascript|css|theme|plugin|render-blocking|bundle|jquery|defer|lazy-load|core web vitals|tbt|lcp|fid|cls|inp)\b/i.test(
      issue.description + " " + issue.fixInstruction,
    );
  }
  return false;
}

function repoIdentifier(client: ClientContext): string {
  // Real implementation reads from client config (.env.{domain} → GIT_REPO).
  // Placeholder for now — Layer 4 GitHubAdapter will resolve this.
  return `${client.domain}-theme`;
}

function buildBody(issue: AuditIssue, client: ClientContext): string {
  return [
    `## Background`,
    ``,
    `Audit found: ${issue.title}`,
    ``,
    `${issue.description}`,
    ``,
    `## Affected URLs`,
    ``,
    issue.evidenceUrls.length === 0
      ? "_(none listed in audit)_"
      : issue.evidenceUrls.map((u) => `- ${u}`).join("\n"),
    ``,
    `## Suggested fix`,
    ``,
    issue.fixInstruction,
    ``,
    `## Test plan`,
    ``,
    `- [ ] Confirm fix on staging before merge`,
    `- [ ] Re-run audit on affected URLs after deploy`,
    `- [ ] Check Core Web Vitals didn't regress on other pages`,
    ``,
    `## Provenance`,
    ``,
    `- Audit ID: ${issue.id}`,
    `- Priority: ${issue.id.startsWith("P1") ? "P1" : issue.id.startsWith("P2") ? "P2" : "P3"}`,
    `- Client: ${client.legalEntity || client.domain}`,
  ].join("\n");
}

// ── Issue-driven action builder ─────────────────────────────────────────────

function buildIssueAction(
  issue: AuditIssue,
  client: ClientContext,
  id: string,
): ProposeCodeChangeAction {
  return {
    id,
    type: "propose_code_change",
    status: "pending",
    risk: "high",
    channel: "code-pr",
    automatable: false,
    provenance: {
      source: "audit-issue",
      sourceId: issue.id,
      reason: `${issue.id} — ${issue.title}`,
    },
    notes: `Audit category: ${issue.category}, owner: ${issue.owner}, effort: ${issue.effort}.`,
    target: {
      repo: repoIdentifier(client),
      branch: `seo/${issue.id.toLowerCase()}-${slugifyForBranch(issue.title)}`,
    },
    payload: {
      title: `[${issue.id}] ${issue.title}`,
      description: issue.description,
      instructions: buildBody(issue, client),
      reviewers: [],
    },
  };
}

// ── llms.txt action ──────────────────────────────────────────────────────────

function buildLlmsTxtAction(client: ClientContext, id: string): ProposeCodeChangeAction {
  const body = [
    `## Background`,
    ``,
    `\`https://${client.domain}/llms.txt\` is currently missing. As AI search`,
    `(ChatGPT, Perplexity, Claude, Google AI Overviews) increasingly crawls the`,
    `web for citations, an llms.txt file lets us guide LLMs toward authoritative`,
    `pages and establishes the brand identity for AI-driven discovery.`,
    ``,
    `## Suggested fix`,
    ``,
    `Create a static \`/llms.txt\` at the document root with:`,
    ``,
    `- Company name (legal entity)`,
    `- Canonical domain`,
    `- Preferred pages for AI citation (service pages, case studies, key blog posts)`,
    `- Excluded paths (\`/wp-admin/\`, privacy/terms body content)`,
    ``,
    `Implementation options (pick one):`,
    `- Add \`llms.txt\` as a static file in the theme root and route via .htaccess`,
    `- Add a route in \`functions.php\` that serves a dynamically-rendered file`,
    `- Upload directly to the server root via SFTP`,
    ``,
    `## Test plan`,
    `- [ ] Confirm \`curl https://${client.domain}/llms.txt\` returns 200`,
    `- [ ] Validate format follows the emerging llms.txt spec`,
  ].join("\n");

  return {
    id,
    type: "propose_code_change",
    status: "pending",
    risk: "low",
    channel: "code-pr",
    automatable: false,
    provenance: {
      source: "audit-issue",
      sourceId: "llmsTxtStatus",
      reason: "audit.technicalCrawl.llmsTxtStatus indicates missing or 404",
    },
    notes: "Low-effort, high-leverage AEO/GEO signal.",
    target: {
      repo: repoIdentifier(client),
      branch: "seo/add-llms-txt",
    },
    payload: {
      title: "[P3] Add /llms.txt for AI search discoverability",
      description: "Create a static llms.txt file at the document root to guide LLM crawlers.",
      instructions: body,
      reviewers: [],
    },
  };
}

// ── Public generator ────────────────────────────────────────────────────────

export function generateCodePRActions(opts: CodePRGeneratorOptions): ExecutionAction[] {
  const prefix = opts.idPrefix ?? "pr";
  const out: ProposeCodeChangeAction[] = [];
  let counter = 1;

  const idOf = () => `${prefix}-${String(counter++).padStart(3, "0")}`;

  // 1. Walk prioritized issues — P1 and P2 only by default (P3 is too noisy)
  const issues = [
    ...opts.audit.prioritizedIssues.p1,
    ...opts.audit.prioritizedIssues.p2,
  ].filter(isDevWork);

  for (const issue of issues) {
    out.push(buildIssueAction(issue, opts.client, idOf()));
  }

  // 2. llms.txt — if missing
  const llmsStatus = (opts.audit.technicalCrawl.llmsTxtStatus ?? "").toLowerCase();
  if (
    !llmsStatus ||
    llmsStatus.includes("missing") ||
    llmsStatus.includes("404") ||
    llmsStatus.includes("not found")
  ) {
    out.push(buildLlmsTxtAction(opts.client, idOf()));
  }

  return out;
}
