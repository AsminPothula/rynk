<<<<<<< HEAD
/**
 * Smoke tests for Layer 4 channel adapters (outreach, social, …).
 *
 * Docker-free, API-free. Writes to a temp directory and checks artifacts
 * land on disk with the expected content.
 *
 * Usage:
 *   npx tsx scripts/smoke-channel-adapters.ts
 */

import { access, mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { DraftOutreachAction, UpdateOffsiteProfileAction } from "@rynk/layer3-generate";
import { makeOffsiteAdapter, makeOutreachAdapter } from "@rynk/layer4-publish";

const RECIPIENT_DOMAIN = "editor.example.com";
const RECIPIENT_EMAIL = `contact@${RECIPIENT_DOMAIN}`;

async function testOutreachAdapter(outputDir: string): Promise<void> {
  const adapter = makeOutreachAdapter({ outputDir });

  const action: DraftOutreachAction = {
    id: "outreach-smoke-001",
    type: "draft_outreach",
    status: "approved",
    risk: "low",
    channel: "outreach",
    automatable: false,
    provenance: {
      source: "manual",
      sourceId: "smoke:outreach",
      reason: "Smoke test for makeOutreachAdapter",
    },
    notes: "scripts/smoke-channel-adapters.ts",
    target: {
      recipientDomain: RECIPIENT_DOMAIN,
      recipientName: "Jane Editor",
      recipientRole: "Content Lead",
      outreachType: "guest-post-pitch",
    },
    payload: {
      subject: "Guest contribution on AI infrastructure?",
      body: [
        "Hi Jane,",
        "",
        "I wanted to reach out about contributing a guest post on AI infrastructure.",
        "",
        "Best,",
        "Rynk Smoke Test",
      ].join("\n"),
      suggestedSendDate: "2026-07-15",
      followUpActionIds: [],
    },
  };

  if (!adapter.canHandle(action)) {
    throw new Error("outreach adapter declined draft_outreach action");
  }

  const result = await adapter.apply(action);
  if (result.status !== "applied") {
    throw new Error(`expected status applied, got ${result.status}: ${result.error ?? result.message}`);
  }
  if (!result.externalUrl) {
    throw new Error("expected externalUrl to be set");
  }
  if (!result.message?.includes("NOT sent")) {
    throw new Error(`expected message to note email was NOT sent: ${result.message}`);
  }

  const expectedPath = join(outputDir, "outreach", "guest-post-pitch", "outreach-smoke-001.eml");
  if (result.externalUrl !== expectedPath) {
    throw new Error(`expected path ${expectedPath}, got ${result.externalUrl}`);
  }

  await access(expectedPath);
  const eml = await readFile(expectedPath, "utf8");

  if (!eml.includes(RECIPIENT_EMAIL)) {
    throw new Error(`.eml missing recipient address ${RECIPIENT_EMAIL}`);
  }
  if (!eml.includes("Subject: Guest contribution on AI infrastructure?")) {
    throw new Error(".eml missing Subject header");
  }
  if (!eml.includes("Hi Jane,")) {
    throw new Error(".eml missing body content");
  }

  console.log("  PASS  outreach  .eml written with recipient address");
  console.log(`        path: ${expectedPath}`);
}

async function testOffsiteAdapter(outputDir: string): Promise<void> {
  const adapter = makeOffsiteAdapter({ outputDir });

  const action: UpdateOffsiteProfileAction = {
    id: "offsite-smoke-001",
    type: "update_offsite_profile",
    status: "approved",
    risk: "low",
    channel: "offsite",
    automatable: false,
    provenance: {
      source: "manual",
      sourceId: "smoke:offsite",
      reason: "Complete G2 profile improves EEAT signals for AI citation.",
    },
    notes: "scripts/smoke-channel-adapters.ts",
    target: {
      platform: "g2",
      profileUrl: "https://www.g2.com/products/acme-corp/reviews",
    },
    payload: {
      fieldsToUpdate: {
        company_description:
          "Acme Corp builds AI infrastructure for enterprise data teams.",
        tagline: "Enterprise AI infrastructure, built for scale.",
      },
      instructions:
        "Log into G2 as the verified vendor admin. Update the company description and tagline under Product Profile → About.",
    },
  };

  if (!adapter.canHandle(action)) {
    throw new Error("offsite adapter declined update_offsite_profile action");
  }

  const result = await adapter.apply(action);
  if (result.status !== "applied") {
    throw new Error(`expected status applied, got ${result.status}: ${result.error ?? result.message}`);
  }
  if (!result.externalUrl) {
    throw new Error("expected externalUrl to be set");
  }
  if (!result.message?.includes("NOT applied")) {
    throw new Error(`expected message to note update was NOT applied: ${result.message}`);
  }

  const expectedPath = join(outputDir, "offsite", "g2", "offsite-smoke-001.md");
  if (result.externalUrl !== expectedPath) {
    throw new Error(`expected path ${expectedPath}, got ${result.externalUrl}`);
  }

  await access(expectedPath);
  const md = await readFile(expectedPath, "utf8");

  if (!md.includes("# G2 Profile Update")) {
    throw new Error(".md missing title");
  }
  if (!md.includes("https://www.g2.com/products/acme-corp/reviews")) {
    throw new Error(".md missing profile URL");
  }
  if (!md.includes("Enterprise AI infrastructure, built for scale.")) {
    throw new Error(".md missing proposed field content");
  }

  console.log("  PASS  offsite   .md written at expected path");
  console.log(`        path: ${expectedPath}`);
}

async function main(): Promise<void> {
  const outputDir = await mkdtemp(join(tmpdir(), "rynk-channel-smoke-"));
  console.log(`\nSmoke test output: ${outputDir}\n`);

  await testOutreachAdapter(outputDir);
  await testOffsiteAdapter(outputDir);

  console.log("\nAll channel adapter smoke tests passed.\n");
}

main().catch((err) => {
  console.error("\nFAIL", err instanceof Error ? err.message : String(err));
=======
import { makeDocumentAdapter, makeSocialAdapter, makeCodePrAdapter } from "@rynk/layer4-publish";
import type { ExecutionAction } from "@rynk/layer3-generate";
import { existsSync, readFileSync } from "node:fs";

const baseProv = { source: "audit-issue" as const, sourceId: "smoke", reason: "smoke test" };

const docAction = {
  id: "doc-smoke-001",
  type: "create_document",
  status: "approved",
  risk: "low",
  channel: "document",
  automatable: true,
  provenance: baseProv,
  notes: null,
  target: { format: "pdf", docType: "whitepaper" },
  payload: {
    title: "Rynk Smoke Whitepaper",
    sourceContentUrl: "https://itechdata.ai/data-capture-services/",
    bodyMarkdown: "## Introduction\n\nThis is a smoke test document.\n\n## Conclusion\n\nIt works.",
    distributionPlatforms: ["SlideShare", "Scribd"],
  },
} as unknown as ExecutionAction;

const socialAction = {
  id: "social-smoke-001",
  type: "draft_brand_post",
  status: "approved",
  risk: "low",
  channel: "social",
  automatable: true,
  provenance: baseProv,
  notes: null,
  target: { platform: "linkedin" },
  payload: {
    body: "Excited to share that we just shipped a new feature...",
    suggestedPublishDate: "2026-07-15",
    rationale: "Builds brand mentions on LinkedIn which feed AI citation training data.",
    imageActionIds: ["img-001"],
  },
} as unknown as ExecutionAction;

const prAction = {
  id: "pr-smoke-001",
  type: "propose_code_change",
  status: "approved",
  risk: "medium",
  channel: "code-pr",
  automatable: true,
  provenance: baseProv,
  notes: null,
  target: { repo: "itech/website", branch: "perf/defer-render-blocking" },
  payload: {
    title: "Defer render-blocking scripts",
    description: "Lighthouse flagged 3 render-blocking scripts hurting LCP.",
    instructions: "## Steps\n\n1. Add `defer` to `<script src=...>` in header.php\n2. Move analytics inline -> async\n3. Test on staging.",
    reviewers: ["dev-lead"],
  },
} as unknown as ExecutionAction;

async function main(): Promise<void> {
  const docAdapter = makeDocumentAdapter({ outputDir: "/tmp/rynk-adapter-test/documents" });
  const socialAdapter = makeSocialAdapter({ outputDir: "/tmp/rynk-adapter-test/social" });
  const prAdapter = makeCodePrAdapter({ outputDir: "/tmp/rynk-adapter-test/code-pr" });

  const results = [
    await docAdapter.apply(docAction),
    await socialAdapter.apply(socialAction),
    await prAdapter.apply(prAction),
  ];

  let pass = 0;
  for (const r of results) {
    const ok = r.status === "applied" && !!r.externalUrl && existsSync(r.externalUrl);
    console.log(ok ? "PASS" : "FAIL", "-", r.message);
    if (ok) pass++;
  }
  console.log(`\n${pass}/3 adapters passed`);

  if (results[0]?.externalUrl && existsSync(results[0].externalUrl)) {
    const sample = readFileSync(results[0].externalUrl, "utf8").slice(0, 250);
    console.log("\n--- document html preview head ---\n" + sample);
  }
  process.exit(pass === 3 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
>>>>>>> d019dfa2f9041e2b75f71c20232cd41fa13af5c4
  process.exit(1);
});
