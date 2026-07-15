/**
 * POST /api/run  { domain }
 *
 * Phase 2: kick off Layers 1 → 2 → 3 for a domain that has already been
 * onboarded (client.json exists). Fire-and-forget — the layer run takes
 * several minutes, so we start it detached and return immediately. The
 * dashboard polls GET /api/status to follow progress.
 */

import { NextResponse } from "next/server";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { normalizeDomain, runDomainDir } from "@/lib/pipeline/paths";
import { startScriptDetached } from "@/lib/pipeline/spawn";

export const runtime = "nodejs";

export async function POST(req: Request): Promise<NextResponse> {
  let domainInput: string;
  try {
    const body = (await req.json()) as { domain?: string };
    domainInput = (body.domain ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!domainInput) {
    return NextResponse.json({ error: "Missing domain." }, { status: 400 });
  }

  const domain = normalizeDomain(domainInput);

  if (!existsSync(resolve(runDomainDir(domain), "client.json"))) {
    return NextResponse.json(
      { error: "This domain hasn't been onboarded yet." },
      { status: 409 },
    );
  }

  startScriptDetached("run-layers", domain);
  return NextResponse.json({ started: true, domain });
}
