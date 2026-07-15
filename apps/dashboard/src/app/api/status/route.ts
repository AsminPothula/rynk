/**
 * GET /api/status?domain=example.com
 *
 * Returns the current run phase from runs/{domain}/status.json, which the
 * web entry scripts update at each layer boundary. The dashboard polls this
 * to drive the progress view.
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
  const statusPath = resolve(runDomainDir(domain), "status.json");

  if (!existsSync(statusPath)) {
    return NextResponse.json({ domain, phase: "unknown" });
  }
  try {
    const status = JSON.parse(readFileSync(statusPath, "utf8"));
    return NextResponse.json(status);
  } catch {
    return NextResponse.json({ domain, phase: "unknown" });
  }
}
