/**
 * POST /api/onboard  { url }
 *
 * Phase 1: run the onboarding agent for the given URL and wait for it. On
 * success returns { domain, context } — the dashboard shows the context
 * read-only for the human to confirm before Phase 2 (POST /api/run).
 *
 * Onboarding is short (~1 min) so we await it here. Runs only in dev/local
 * for the demo; not intended for serverless production as-is.
 */

import { NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { normalizeDomain, runDomainDir } from "@/lib/pipeline/paths";
import { runScriptAndWait } from "@/lib/pipeline/spawn";

export const runtime = "nodejs";
export const maxDuration = 300; // dev-only; onboarding can take ~1 min

export async function POST(req: Request): Promise<NextResponse> {
  let url: string;
  try {
    const body = (await req.json()) as { url?: string };
    url = (body.url ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!url) {
    return NextResponse.json({ error: "Missing url." }, { status: 400 });
  }

  const domain = normalizeDomain(url);
  if (!domain.includes(".")) {
    return NextResponse.json({ error: "That doesn't look like a valid domain." }, { status: 400 });
  }

  const { code, stderr } = await runScriptAndWait("onboard", domain);
  if (code !== 0) {
    return NextResponse.json(
      { error: "Onboarding failed.", detail: stderr.slice(-600), domain },
      { status: 500 },
    );
  }

  // Read back the context the agent just wrote.
  try {
    const raw = readFileSync(resolve(runDomainDir(domain), "client.json"), "utf8");
    const context = JSON.parse(raw);
    return NextResponse.json({ domain, context });
  } catch {
    return NextResponse.json(
      { error: "Onboarding finished but client.json could not be read.", domain },
      { status: 500 },
    );
  }
}
