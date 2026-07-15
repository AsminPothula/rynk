/**
 * GET /api/context?domain=example.com
 *
 * Returns the onboarded ClientContext (runs/{domain}/client.json) so the
 * review page can render it after a fresh page load.
 */

import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { normalizeDomain, runDomainDir } from "@/lib/pipeline/paths";

export const runtime = "nodejs";

export async function GET(req: Request): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("domain");
  if (!raw) {
    return NextResponse.json({ error: "Missing domain." }, { status: 400 });
  }
  const domain = normalizeDomain(raw);
  const path = resolve(runDomainDir(domain), "client.json");

  if (!existsSync(path)) {
    return NextResponse.json({ error: "Not onboarded yet." }, { status: 404 });
  }
  try {
    const context = JSON.parse(readFileSync(path, "utf8"));
    return NextResponse.json({ domain, context });
  } catch {
    return NextResponse.json({ error: "Could not read client.json." }, { status: 500 });
  }
}
