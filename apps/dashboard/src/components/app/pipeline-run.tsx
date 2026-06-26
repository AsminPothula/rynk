"use client";

/**
 * Pipeline Run UI - drawer + provider + trigger button.
 *
 * The drawer is mounted at the client-scoped layout level so it persists
 * across navigation within /app/clients/[domain]/*. Click "Run pipeline",
 * the drawer slides in from the right, the run plays out via Server-Sent
 * Events from /api/pipeline/run, and the user can keep navigating to
 * manifest / content / outreach tabs while the run finishes.
 *
 * When the run completes, a "View N generated actions" button takes the
 * user to the manifest page for the same client.
 *
 * Architecture:
 *
 *   <PipelineRunProvider domain="itechdata.ai">
 *     ...page content...
 *     <RunPipelineButton />
 *     // drawer rendered by provider, fixed-positioned overlay
 *   </PipelineRunProvider>
 *
 * The drawer is controlled via the `usePipelineRun()` hook.
 */

import * as React from "react";
import Link from "next/link";
import { X, Minus, Play, ArrowUpRight, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LAYER_NAMES, DEMO_PIPELINE_DURATION_MS } from "@/lib/demo/pipeline-script";

// ── Types ───────────────────────────────────────────────────────────────────

type LayerId = 0 | 1 | 2 | 3 | 4;
type LayerStatus = "queued" | "running" | "done";
type RunStatus = "idle" | "running" | "complete" | "error";

interface LayerState {
  status: LayerStatus;
  lastLog: string | null;
  logCount: number;
}

interface RunState {
  status: RunStatus;
  domain: string | null;
  startedAt: number | null;
  layers: Record<LayerId, LayerState>;
  totalActions: number | null;
  errorMsg: string | null;
}

type DrawerMode = "open" | "minimized" | "closed";

interface PipelineRunContextValue {
  state: RunState;
  drawerMode: DrawerMode;
  startRun: () => void;
  openDrawer: () => void;
  minimizeDrawer: () => void;
  closeDrawer: () => void;
}

const initialLayers: Record<LayerId, LayerState> = {
  0: { status: "queued", lastLog: null, logCount: 0 },
  1: { status: "queued", lastLog: null, logCount: 0 },
  2: { status: "queued", lastLog: null, logCount: 0 },
  3: { status: "queued", lastLog: null, logCount: 0 },
  4: { status: "queued", lastLog: null, logCount: 0 },
};

const initialState: RunState = {
  status: "idle",
  domain: null,
  startedAt: null,
  layers: initialLayers,
  totalActions: null,
  errorMsg: null,
};

const PipelineRunContext = React.createContext<PipelineRunContextValue | null>(null);

export function usePipelineRun(): PipelineRunContextValue {
  const ctx = React.useContext(PipelineRunContext);
  if (!ctx) throw new Error("usePipelineRun must be used inside <PipelineRunProvider>");
  return ctx;
}

// ── Provider ────────────────────────────────────────────────────────────────

export function PipelineRunProvider({
  domain,
  children,
}: {
  domain: string;
  children: React.ReactNode;
}): React.JSX.Element {
  const [state, setState] = React.useState<RunState>(initialState);
  const [drawerMode, setDrawerMode] = React.useState<DrawerMode>("closed");
  const eventSourceRef = React.useRef<EventSource | null>(null);

  const closeEventSource = React.useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    // Clean up on unmount (e.g. navigation away from /app/clients/[domain]).
    return () => closeEventSource();
  }, [closeEventSource]);

  const startRun = React.useCallback(() => {
    // If a run is already in progress, just re-open the drawer.
    if (state.status === "running") {
      setDrawerMode("open");
      return;
    }

    // Reset and start fresh.
    setState({
      status: "running",
      domain,
      startedAt: Date.now(),
      layers: { ...initialLayers },
      totalActions: null,
      errorMsg: null,
    });
    setDrawerMode("open");

    closeEventSource();
    const es = new EventSource(`/api/pipeline/run?domain=${encodeURIComponent(domain)}`);
    eventSourceRef.current = es;

    es.onmessage = (msg) => {
      try {
        const evt = JSON.parse(msg.data) as
          | { type: "ready" }
          | { type: "error"; msg: string }
          | { type: "layer_start"; layer: LayerId; name: string }
          | { type: "log"; layer: LayerId; msg: string }
          | { type: "layer_done"; layer: LayerId }
          | { type: "complete"; totalActions: number };

        if (evt.type === "ready") return;
        if (evt.type === "error") {
          setState((s) => ({ ...s, status: "error", errorMsg: evt.msg }));
          closeEventSource();
          return;
        }
        if (evt.type === "layer_start") {
          setState((s) => ({
            ...s,
            layers: {
              ...s.layers,
              [evt.layer]: { ...s.layers[evt.layer], status: "running" },
            },
          }));
          return;
        }
        if (evt.type === "log") {
          setState((s) => ({
            ...s,
            layers: {
              ...s.layers,
              [evt.layer]: {
                status: "running",
                lastLog: evt.msg,
                logCount: s.layers[evt.layer].logCount + 1,
              },
            },
          }));
          return;
        }
        if (evt.type === "layer_done") {
          setState((s) => ({
            ...s,
            layers: {
              ...s.layers,
              [evt.layer]: { ...s.layers[evt.layer], status: "done" },
            },
          }));
          return;
        }
        if (evt.type === "complete") {
          setState((s) => ({ ...s, status: "complete", totalActions: evt.totalActions }));
          closeEventSource();
          return;
        }
      } catch {
        // Ignore malformed events.
      }
    };

    es.onerror = () => {
      // EventSource auto-retries by default, but once the stream closes it
      // fires onerror. If we're already complete, that's fine. Otherwise
      // surface it.
      setState((s) => (s.status === "complete" ? s : { ...s, status: "error", errorMsg: "Connection lost" }));
      closeEventSource();
    };
  }, [domain, state.status, closeEventSource]);

  const openDrawer = React.useCallback(() => setDrawerMode("open"), []);
  const minimizeDrawer = React.useCallback(() => setDrawerMode("minimized"), []);
  const closeDrawer = React.useCallback(() => {
    setDrawerMode("closed");
    // If the run is still going, the SSE keeps streaming in the background.
    // We let it finish; the state still updates. User can re-open via the
    // minimized pill.
  }, []);

  const value = React.useMemo<PipelineRunContextValue>(
    () => ({ state, drawerMode, startRun, openDrawer, minimizeDrawer, closeDrawer }),
    [state, drawerMode, startRun, openDrawer, minimizeDrawer, closeDrawer],
  );

  return (
    <PipelineRunContext.Provider value={value}>
      {children}
      <PipelineRunDrawer />
      <MinimizedPill />
    </PipelineRunContext.Provider>
  );
}

// ── Trigger button ──────────────────────────────────────────────────────────

export function RunPipelineButton(): React.JSX.Element {
  const { state, startRun } = usePipelineRun();
  const running = state.status === "running";
  return (
    <Button
      onClick={startRun}
      size="sm"
      className="gap-2"
      variant={running ? "outline" : "default"}
    >
      {running ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Running...
        </>
      ) : (
        <>
          <Play className="h-3.5 w-3.5" />
          Run pipeline
        </>
      )}
    </Button>
  );
}

// ── Minimized pill (visible when drawer is minimized) ───────────────────────

function MinimizedPill(): React.JSX.Element | null {
  const { state, drawerMode, openDrawer } = usePipelineRun();
  if (drawerMode !== "minimized") return null;
  if (state.status === "idle") return null;

  const isRunning = state.status === "running";
  const isComplete = state.status === "complete";

  return (
    <button
      type="button"
      onClick={openDrawer}
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2 text-xs font-medium shadow-lg hover:bg-accent",
      )}
    >
      {isRunning && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {isComplete && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
      {state.status === "error" && <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />}
      <span className="font-mono">
        {isRunning && "Pipeline running"}
        {isComplete && "Run complete"}
        {state.status === "error" && "Run errored"}
      </span>
    </button>
  );
}

// ── The drawer ──────────────────────────────────────────────────────────────

function PipelineRunDrawer(): React.JSX.Element | null {
  const { state, drawerMode, minimizeDrawer, closeDrawer } = usePipelineRun();
  if (drawerMode !== "open") return null;
  if (state.status === "idle") return null;

  const overallPct = computeOverallPct(state);
  const elapsed = state.startedAt ? Date.now() - state.startedAt : 0;

  return (
    <>
      {/* Soft backdrop - clickable to minimize so the user keeps page access */}
      <div
        className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px] transition-opacity"
        onClick={minimizeDrawer}
        aria-hidden
      />

      <aside
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border/60 bg-card shadow-2xl"
        role="dialog"
        aria-label="Pipeline run"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/60 px-5 py-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Pipeline run
            </p>
            <h2 className="mt-0.5 text-base font-medium">{state.domain ?? "—"}</h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={minimizeDrawer}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Minimize"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={closeDrawer}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Overall progress */}
        <div className="border-b border-border/60 px-5 py-4">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Progress
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {formatElapsed(elapsed)}
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-foreground/80 transition-all duration-500 ease-out"
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <div className="mt-1 text-right font-mono text-[10px] text-muted-foreground">
            {overallPct}%
          </div>
        </div>

        {/* Layer list */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Layers
          </p>
          <ol className="space-y-3">
            {([0, 1, 2, 3, 4] as LayerId[]).map((layer) => {
              const ls = state.layers[layer];
              return <LayerRow key={layer} index={layer} name={LAYER_NAMES[layer]} layer={ls} />;
            })}
          </ol>

          {state.status === "error" && state.errorMsg && (
            <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              <div className="mb-1 flex items-center gap-1.5 font-medium">
                <AlertTriangle className="h-3.5 w-3.5" />
                Run errored
              </div>
              <p className="font-mono text-[11px] leading-relaxed">{state.errorMsg}</p>
            </div>
          )}
        </div>

        {/* Footer - shown on complete */}
        {state.status === "complete" && state.totalActions !== null && state.domain && (
          <div className="border-t border-border/60 bg-cream/40 px-5 py-4">
            <p className="mb-3 text-sm">
              Pipeline complete. <span className="font-medium">{state.totalActions} actions</span>{" "}
              generated across 6 channels.
            </p>
            <Link
              href={`/app/clients/${state.domain}/execution`}
              onClick={closeDrawer}
              className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-xs font-medium text-background hover:bg-foreground/90"
            >
              View {state.totalActions} generated actions
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}

// ── Layer row ───────────────────────────────────────────────────────────────

function LayerRow({
  index,
  name,
  layer,
}: {
  index: LayerId;
  name: string;
  layer: LayerState;
}): React.JSX.Element {
  return (
    <li className="rounded-md border border-border/60 bg-background p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <LayerStatusDot status={layer.status} />
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Layer {index}
          </span>
          <span className="text-sm font-medium">{name}</span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">
          {layer.status === "done" && "done"}
          {layer.status === "running" && "running"}
          {layer.status === "queued" && "queued"}
        </span>
      </div>
      {layer.lastLog && (
        <p
          className={cn(
            "mt-2 truncate font-mono text-[11px]",
            layer.status === "done" ? "text-muted-foreground" : "text-foreground/80",
          )}
          title={layer.lastLog}
        >
          {layer.lastLog}
        </p>
      )}
    </li>
  );
}

function LayerStatusDot({ status }: { status: LayerStatus }): React.JSX.Element {
  if (status === "done") {
    return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
  }
  if (status === "running") {
    return <Loader2 className="h-4 w-4 animate-spin text-foreground/70" />;
  }
  return <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function computeOverallPct(state: RunState): number {
  if (state.status === "complete") return 100;
  if (state.status === "idle") return 0;
  // Weight: each layer contributes 20%. A "done" layer = full 20%,
  // "running" layer = ~10% (we don't know mid-layer progress without
  // log-based estimation). Cheap heuristic but enough for a demo.
  let pct = 0;
  for (const layer of [0, 1, 2, 3, 4] as LayerId[]) {
    const s = state.layers[layer].status;
    if (s === "done") pct += 20;
    else if (s === "running") pct += 10;
  }
  return Math.min(99, pct);
}

function formatElapsed(ms: number): string {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  return `${m}m ${rs}s`;
}

// Re-export the script's total duration so other components can size their
// timing expectations consistently.
export { DEMO_PIPELINE_DURATION_MS };
