"use client";

/**
 * RunFlow — the review → run → done experience for a triggered pipeline.
 *
 *   1. review   — fetch client.json, show the detected business context
 *                 read-only, "Continue" confirms it (the web version of the
 *                 terminal's "Accept? Y/n" onboarding prompt).
 *   2. running  — POST /api/run, poll /api/status, show layer progress.
 *   3. done      — link into the existing client dashboard to see outputs.
 *
 * Editable context is intentionally out of scope for now (read-only confirm).
 */

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Check, Loader2, AlertTriangle } from "lucide-react";

type Phase =
  | "loading-context"
  | "review"
  | "running"
  | "done"
  | "error";

interface ClientContext {
  domain: string;
  legalEntity?: string;
  industry?: string;
  icp?: string;
  canonicalNAP?: { address: string | null; phone: string | null; email: string | null };
  competitors?: string[];
  goals?: string[];
  seedKeywords?: string[];
  cms?: string | null;
  hosting?: string | null;
}

const LAYER_STEPS: { key: string; label: string; blurb: string }[] = [
  { key: "layer1", label: "Audit", blurb: "Crawling the site, pulling SERPs, scoring the pages." },
  { key: "layer2", label: "Strategy", blurb: "Building the prioritized roadmap." },
  { key: "layer3", label: "Generate", blurb: "Producing every change rynk would ship." },
];

// Where a phase sits in the sequence, for progress rendering.
const PHASE_ORDER: Record<string, number> = {
  onboarding: 0, onboarded: 0, layer1: 1, layer2: 2, layer3: 3, done: 4, failed: -1,
};

export function RunFlow({ domain }: { domain: string }): React.JSX.Element {
  const [phase, setPhase] = useState<Phase>("loading-context");
  const [context, setContext] = useState<ClientContext | null>(null);
  const [runPhase, setRunPhase] = useState<string>("onboarded");
  const [error, setError] = useState<string | null>(null);

  // Load the onboarded context on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/context?domain=${encodeURIComponent(domain)}`);
        if (!res.ok) throw new Error("Context not found — onboard this domain first.");
        const data = await res.json();
        if (!cancelled) {
          setContext(data.context as ClientContext);
          setPhase("review");
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load context.");
          setPhase("error");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [domain]);

  // Poll status while running.
  const poll = useCallback(async () => {
    try {
      const res = await fetch(`/api/status?domain=${encodeURIComponent(domain)}`);
      const data = await res.json();
      setRunPhase(data.phase);
      if (data.phase === "done") setPhase("done");
      else if (data.phase === "failed") {
        setError(data.error ?? "The pipeline failed.");
        setPhase("error");
      }
    } catch {
      /* transient — keep polling */
    }
  }, [domain]);

  useEffect(() => {
    if (phase !== "running") return;
    const id = setInterval(poll, 3000);
    void poll();
    return () => clearInterval(id);
  }, [phase, poll]);

  const startRun = async (): Promise<void> => {
    setPhase("running");
    setRunPhase("layer1");
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Could not start the run.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start the run.");
      setPhase("error");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft">
        Watch Rynk work
      </p>
      <h1 className="mt-3 font-serif text-4xl md:text-5xl font-medium tracking-tight text-brand-text">
        {domain}
      </h1>

      {phase === "loading-context" && (
        <div className="mt-10 flex items-center gap-3 text-brand-textMute">
          <Loader2 className="h-5 w-5 animate-spin" />
          Analyzing your site…
        </div>
      )}

      {phase === "error" && (
        <div className="mt-10 rounded-2xl bg-white/[0.03] ring-1 ring-brand-pink/40 p-6">
          <div className="flex items-center gap-2 text-brand-pinkSoft">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-serif text-lg">Something went wrong</span>
          </div>
          <p className="mt-2 text-[14px] leading-relaxed text-brand-textMute">{error}</p>
        </div>
      )}

      {phase === "review" && context && (
        <ContextReview context={context} onContinue={startRun} />
      )}

      {(phase === "running" || phase === "done") && (
        <RunProgress runPhase={runPhase} domain={domain} done={phase === "done"} />
      )}
    </div>
  );
}

function ContextReview({
  context,
  onContinue,
}: {
  context: ClientContext;
  onContinue: () => void;
}): React.JSX.Element {
  const rows: { label: string; value: string }[] = [
    { label: "Business", value: context.legalEntity || context.domain },
    { label: "Industry", value: context.industry || "—" },
    { label: "Ideal customer", value: context.icp || "—" },
    { label: "Address", value: context.canonicalNAP?.address || "—" },
    { label: "Phone", value: context.canonicalNAP?.phone || "—" },
    { label: "Email", value: context.canonicalNAP?.email || "—" },
    { label: "Competitors", value: (context.competitors ?? []).join(", ") || "—" },
    { label: "Goals", value: (context.goals ?? []).join(" · ") || "—" },
    { label: "CMS / hosting", value: [context.cms, context.hosting].filter(Boolean).join(" · ") || "—" },
  ];

  return (
    <div className="mt-10">
      <p className="text-[15px] leading-relaxed text-brand-textMute">
        Here's what Rynk detected about your business. Confirm it looks right and
        we'll start the audit.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ring-white/10">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-brand-blue to-transparent" />
        <dl className="divide-y divide-white/6">
          {rows.map((r) => (
            <div key={r.label} className="grid grid-cols-[minmax(0,140px)_minmax(0,1fr)] gap-4 px-5 py-3">
              <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-brand-textMute">
                {r.label}
              </dt>
              <dd className="text-[14px] text-brand-text">{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-8 flex items-center gap-5">
        <button
          onClick={onContinue}
          className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-7 font-serif text-[16px] font-medium text-brand-ink transition-all hover:shadow-[0_14px_36px_-14px_rgba(255,255,255,0.4)]"
        >
          Looks right — start the audit
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
        <span className="text-[13px] text-brand-textMute">Editing coming soon</span>
      </div>
    </div>
  );
}

function RunProgress({
  runPhase,
  domain,
  done,
}: {
  runPhase: string;
  domain: string;
  done: boolean;
}): React.JSX.Element {
  const current = PHASE_ORDER[runPhase] ?? 1;

  return (
    <div className="mt-10">
      <div className="space-y-3">
        {LAYER_STEPS.map((step, i) => {
          const stepIndex = i + 1;
          const state = current > stepIndex ? "done" : current === stepIndex ? "active" : "pending";
          return (
            <div
              key={step.key}
              className={`flex items-start gap-4 rounded-2xl bg-white/[0.03] p-5 ring-1 transition-all ${
                state === "active" ? "ring-brand-blue/40" : "ring-white/8"
              }`}
            >
              <div className="mt-0.5">
                {state === "done" ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-emerald/20 text-brand-emeraldSoft">
                    <Check className="h-4 w-4" />
                  </span>
                ) : state === "active" ? (
                  <Loader2 className="h-6 w-6 animate-spin text-brand-blueSoft" />
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 font-mono text-[11px] text-brand-textMute">
                    {stepIndex}
                  </span>
                )}
              </div>
              <div>
                <div className="font-serif text-[18px] font-medium text-brand-text">{step.label}</div>
                <p className="mt-0.5 text-[13px] text-brand-textMute">{step.blurb}</p>
              </div>
            </div>
          );
        })}
      </div>

      {done ? (
        <div className="mt-8">
          <div className="flex items-center gap-2 text-brand-emeraldSoft">
            <Check className="h-5 w-5" />
            <span className="font-serif text-lg">Done — your plan is ready.</span>
          </div>
          <Link
            href={`/app/clients/${encodeURIComponent(domain)}`}
            className="group mt-5 inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-7 font-serif text-[16px] font-medium text-brand-ink transition-all hover:shadow-[0_14px_36px_-14px_rgba(255,255,255,0.4)]"
          >
            View results
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      ) : (
        <p className="mt-8 text-[13px] text-brand-textMute">
          This runs live and takes a few minutes. You can keep this tab open.
        </p>
      )}
    </div>
  );
}
