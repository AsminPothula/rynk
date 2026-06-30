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
  process.exit(1);
});
