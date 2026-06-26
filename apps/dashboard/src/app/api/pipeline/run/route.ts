/**
 * Pipeline run trigger - Server-Sent Events stream.
 *
 * GET /api/pipeline/run?domain=itechdata.ai
 *
 * Two modes, controlled by the RYNK_DEMO_MODE env var:
 *
 *   - demo (default): streams the scripted DEMO_PIPELINE_SCRIPT events with
 *     real timing so the dashboard drawer animates a ~70 sec fake run.
 *     The actual pipeline is NOT executed. Used for presentations and for
 *     anyone hitting the dashboard without having API keys / Docker / etc.
 *
 *   - real (RYNK_DEMO_MODE !== "true"): future swap - spawn the
 *     orchestrator as a child process and tail its logs into the same
 *     event format. Not built yet; falls back to demo mode for now.
 *
 * The wire format is standard Server-Sent Events:
 *   data: {"type":"layer_start","layer":0,...}\n\n
 *
 * The client (PipelineRunProvider) consumes this with EventSource.
 */

import { DEMO_PIPELINE_SCRIPT, type DemoEvent } from "@/lib/demo/pipeline-script";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isDemoMode(): boolean {
  // Default to demo. Real mode requires explicit opt-out AND the real
  // subprocess wiring (future work).
  return process.env["RYNK_DEMO_MODE"] !== "false";
}

/** SSE-encode an event line. */
function sseLine(event: DemoEvent | { type: "ready" } | { type: "error"; msg: string }): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const domain = url.searchParams.get("domain") ?? "unknown";

  if (!isDemoMode()) {
    // Real mode not yet implemented. Return a friendly error event so the
    // drawer can surface it instead of silently hanging.
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(
          encoder.encode(
            sseLine({
              type: "error",
              msg: "Real pipeline mode not yet wired. Set RYNK_DEMO_MODE=true to use the simulated run.",
            }),
          ),
        );
        controller.close();
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  }

  // Demo mode - stream the scripted events with realistic delays.
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        // Initial ready ping so the client knows the connection is alive.
        controller.enqueue(encoder.encode(sseLine({ type: "ready" })));

        const runStart = Date.now();
        for (const event of DEMO_PIPELINE_SCRIPT) {
          const elapsed = Date.now() - runStart;
          const wait = Math.max(0, event.at - elapsed);
          if (wait > 0) await new Promise((r) => setTimeout(r, wait));
          controller.enqueue(encoder.encode(sseLine(event)));
        }
        controller.close();
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            sseLine({
              type: "error",
              msg: err instanceof Error ? err.message : String(err),
            }),
          ),
        );
        controller.close();
      }
    },
    cancel() {
      // Client closed the connection mid-stream (e.g. navigated away or
      // closed the drawer). No-op; the for-loop above naturally stops on
      // enqueue failure once the controller is closed.
    },
  });

  // Reference domain in a header so it shows up in network tools during a
  // demo. Not used by the client.
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Rynk-Run-Domain": domain,
      "X-Rynk-Run-Mode": "demo",
    },
  });
}
