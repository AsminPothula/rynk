/**
 * Spawns the orchestrator's web entry scripts as child processes.
 *
 * We deliberately shell out to `tsx` rather than importing the orchestrator
 * into Next's runtime: the pipeline is a long-running Node job that calls
 * process.exit and loads its own env, so it's cleanest as a separate
 * process writing to runs/, which the dashboard reads back.
 *
 * cwd is the repo root so the child's `dotenv/config` finds the root .env
 * and its runs/ path math resolves.
 */

import { spawn } from "node:child_process";
import { repoRoot } from "./paths";

type Script = "onboard" | "run-layers";

function scriptPath(script: Script): string {
  return `packages/orchestrator/src/web/${script}.ts`;
}

/**
 * Run a web script and wait for it to exit. Used for onboarding (short,
 * ~1 min) where the caller wants the result before responding.
 */
export function runScriptAndWait(
  script: Script,
  domain: string,
): Promise<{ code: number; stderr: string }> {
  return new Promise((resolveP) => {
    const child = spawn("npx", ["tsx", scriptPath(script), domain], {
      cwd: repoRoot(),
      env: process.env,
    });
    let stderr = "";
    child.stderr.on("data", (d) => {
      stderr += String(d);
    });
    child.on("close", (code) => resolveP({ code: code ?? 1, stderr }));
    child.on("error", (err) => resolveP({ code: 1, stderr: String(err) }));
  });
}

/**
 * Fire-and-forget: start a web script detached and return immediately. Used
 * for the layer run (5-20 min) — the dashboard polls status.json instead of
 * holding the request open.
 */
export function startScriptDetached(script: Script, domain: string): void {
  const child = spawn("npx", ["tsx", scriptPath(script), domain], {
    cwd: repoRoot(),
    env: process.env,
    detached: true,
    stdio: "ignore",
  });
  child.unref();
}
