/**
 * Landing page.
 *
 * Design moves away from the generic 3-feature-card pattern:
 *   - Hero is asymmetric — headline left, status panel right
 *   - Pipeline visualization shows the 5 layers as named stages
 *   - "What it produces" is a bento-grid of action types, not feature cards
 *   - Buttons are ghost / outline / minimal-fill — no saturated colors
 */

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const PIPELINE_STAGES = [
  { label: "Onboard", note: "Capture client" },
  { label: "Audit", note: "Crawl + research" },
  { label: "Strategy", note: "Decide priorities" },
  { label: "Generate", note: "Plan every change" },
  { label: "Publish", note: "Push to CMS" },
];

/** Static channel-to-dot-class map. Tailwind needs literal class names. */
const CHANNEL_DOT: Record<string, string> = {
  cms: "bg-channel-cms",
  image: "bg-channel-image",
  outreach: "bg-channel-outreach",
  social: "bg-channel-social",
  "code-pr": "bg-channel-code-pr",
  document: "bg-channel-document",
  offsite: "bg-channel-offsite",
};

/** Soft channel-tinted background for action cards. */
const CHANNEL_SOFT: Record<string, string> = {
  cms: "bg-channel-cms-soft",
  image: "bg-channel-image-soft",
  outreach: "bg-channel-outreach-soft",
  social: "bg-channel-social-soft",
  "code-pr": "bg-channel-code-pr-soft",
  document: "bg-channel-document-soft",
  offsite: "bg-channel-offsite-soft",
};

const ACTION_TYPES = [
  { label: "Meta rewrites", count: "30+", channel: "cms" },
  { label: "Schema markup", count: "12+", channel: "cms" },
  { label: "301 redirects", count: "any", channel: "cms" },
  { label: "Internal links", count: "100s", channel: "cms" },
  { label: "New pages", count: "17+", channel: "cms" },
  { label: "Hero images", count: "all", channel: "image" },
  { label: "Outreach emails", count: "guests + press", channel: "outreach" },
  { label: "Brand posts", count: "LinkedIn / Reddit", channel: "social" },
  { label: "Whitepapers", count: "PDF + PPT", channel: "document" },
  { label: "GitHub PRs", count: "if code", channel: "code-pr" },
];

export default function LandingPage(): React.JSX.Element {
  return (
    <>
      {/* HERO — asymmetric, big claim left, signal panel right */}
      <section className="border-b border-border/60 bg-warm-wash">
        <div className="container py-20 lg:py-28 grid gap-12 lg:grid-cols-[1.4fr_1fr] items-end">
          <div>
            <p className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-mono text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-status-success" />
              Pipeline running for itechdata.ai
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tighter leading-[1.05]">
              SEO that runs itself.
            </h1>
            <p className="mt-6 max-w-md text-base text-muted-foreground leading-relaxed">
              Rynk audits your site, plans the strategy, writes the content,
              and pushes it live. Every change tracked, every decision
              traced.
            </p>
            <div className="mt-10 flex items-center gap-5">
              <Link
                href="/app"
                className="inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Open dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex h-10 items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
              >
                How it works
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Signal panel — terminal-aesthetic snapshot */}
          <div className="rounded-lg border border-border/60 bg-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5">
              <span className="font-mono text-[11px] text-muted-foreground">
                rynk pipeline · live
              </span>
              <div className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-status-success" />
                <span className="h-2 w-2 rounded-full bg-status-pending" />
                <span className="h-2 w-2 rounded-full bg-border" />
              </div>
            </div>
            <div className="divide-y divide-border/60 font-mono text-xs">
              {PIPELINE_STAGES.map((stage, i) => (
                <div key={stage.label} className="flex items-center justify-between px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">0{i + 1}</span>
                    <span className="text-foreground">{stage.label}</span>
                  </div>
                  <span className="text-muted-foreground">{stage.note}</span>
                </div>
              ))}
              <div className="flex items-center justify-between bg-muted/30 px-4 py-2.5">
                <span className="text-muted-foreground">Output</span>
                <span className="text-foreground">246 actions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IT PRODUCES — bento grid of action types */}
      <section className="bg-cream/40">
        <div className="container py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                What rynk produces
              </p>
              <h2 className="mt-2 text-3xl font-medium tracking-tight">
                Every change, written and tracked
              </h2>
            </div>
            <p className="hidden md:block max-w-xs text-sm text-muted-foreground text-right">
              From a single domain, rynk plans hundreds of specific changes
              across six output channels.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {ACTION_TYPES.map((item, idx) => (
              <div
                key={item.label}
                className={`group rounded-md border border-border/60 ${CHANNEL_SOFT[item.channel]} p-4 transition-all hover:border-foreground/20 hover:shadow-sm ${
                  // Make the first two and one in the middle wider for asymmetry
                  idx === 0 || idx === 3 ? "lg:col-span-2" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${CHANNEL_DOT[item.channel]}`} />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {item.channel}
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="font-mono text-xs text-muted-foreground">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="border-t border-border/60 bg-tan/30">
        <div className="container py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-medium tracking-tight">
              See it on a real site.
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Open the dashboard and explore the live itechdata.ai pipeline output.
            </p>
          </div>
          <Link
            href="/app"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Open the dashboard
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </>
  );
}
