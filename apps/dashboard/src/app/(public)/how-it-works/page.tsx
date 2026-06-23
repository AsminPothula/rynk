/**
 * /how-it-works — public page walking through rynk's 5-layer pipeline.
 *
 * Design: vertical timeline with numbered stages, each with:
 *   - Big stage number + name
 *   - One-line "what it does"
 *   - Concrete outputs (real itechdata numbers)
 *   - Two or three "inside" rows showing the key steps
 *
 * Uses pastel accent on the active stage indicator. Connecting line on
 * the left mimics a pipeline visual. Strong typography hierarchy.
 */

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const STAGES = [
  {
    n: "00",
    name: "Onboard",
    title: "Understand the client",
    subtitle:
      "Rynk scrapes the site, infers what it can, and asks the human only for what it couldn't figure out.",
    inside: [
      "Crawl 8 key pages (homepage, about, contact, services, …)",
      "Detect CMS, hosting, CDN from HTTP signals",
      "Score every ClientContext field; auto-fill gaps via keyword research",
      "Targeted questionnaire only for fields still missing",
    ],
    outputs: [
      { label: "Client profile", value: "client.json" },
      { label: "Fields captured", value: "20+" },
    ],
    accent: "bg-channel-cms",
  },
  {
    n: "01",
    name: "Audit",
    title: "What does Google see today?",
    subtitle:
      "Three parallel sub-agents crawl the site, hit external APIs, and synthesize findings into a single typed report.",
    inside: [
      "Data collection — crawl all pages, run PageSpeed, query SerpAPI",
      "Offsite research — web search for backlinks, reviews, brand mentions",
      "Synthesizer — merge findings into Findings + Issues (P1/P2/P3)",
      "Domain authority + keyword metrics pre-computed for every keyword",
    ],
    outputs: [
      { label: "Pages crawled", value: "~230" },
      { label: "Issues found", value: "60+" },
      { label: "Keywords analyzed", value: "10" },
    ],
    accent: "bg-channel-image",
  },
  {
    n: "02",
    name: "Strategy",
    title: "Decide what to do, prioritized",
    subtitle:
      "A reasoning agent reads the audit and produces a topic cluster map, content briefs, and a sprint plan.",
    inside: [
      "Identify pillar + spoke keyword clusters",
      "Score every cluster by business value × priority",
      "Write content briefs with EEAT + GEO requirements",
      "Build a 30/60/90 sprint plan around the work",
    ],
    outputs: [
      { label: "Topic clusters", value: "10" },
      { label: "Content briefs", value: "17" },
      { label: "Sprints", value: "6" },
    ],
    accent: "bg-channel-outreach",
  },
  {
    n: "03",
    name: "Generate",
    title: "Plan every concrete change",
    subtitle:
      "Eleven generators translate strategy into a typed list of every action rynk plans to take — across six channels.",
    inside: [
      "CMS: meta rewrites, schema, redirects, internal links, NAP",
      "Content: full pages with outlines + (opt-in) LLM-written bodies",
      "Images: hero, diagrams, thumbnails for every new page",
      "Outreach: guest pitches, press, backlink-request emails",
      "Social: LinkedIn / Reddit / Threads post drafts",
      "Code & Docs: GitHub PRs and PDF / PPT whitepapers",
    ],
    outputs: [
      { label: "Actions planned", value: "246" },
      { label: "Channels", value: "6" },
      { label: "Auto / Human", value: "213 / 33" },
    ],
    accent: "bg-channel-social",
  },
  {
    n: "04",
    name: "Publish",
    title: "Actually do the work",
    subtitle:
      "Layer 4 walks the manifest and dispatches each action to the right adapter — WordPress, GitHub, image gen, etc.",
    inside: [
      "Adapter per external service (WordPress, GitHub, GBP, image gen)",
      "Each action routed by channel + type",
      "Approval gating — humans review before live changes go out",
      "Per-action status tracking + retry on failure",
    ],
    outputs: [
      { label: "Adapters", value: "growing" },
      { label: "Approvable", value: "per action" },
    ],
    accent: "bg-channel-code-pr",
  },
];

export default function HowItWorksPage(): React.JSX.Element {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-border/60 bg-warm-wash">
        <div className="container py-20 lg:py-24">
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            How it works
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl sm:text-5xl font-medium tracking-tighter leading-[1.05]">
            One pipeline. Every SEO change, traced.
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground leading-relaxed">
            Rynk is built as five sequential layers. Each one has a clear
            input, a clear output, and a clear handoff to the next. What you
            see on the dashboard is the live output of these layers.
          </p>
        </div>
      </section>

      {/* Pipeline timeline */}
      <section>
        <div className="container py-16 lg:py-20">
          <div className="relative space-y-12 lg:space-y-16">
            {/* Vertical connecting line behind everything */}
            <div className="absolute left-[20px] top-2 bottom-2 w-px bg-border md:left-[24px]" />

            {STAGES.map((stage) => (
              <article key={stage.n} className="relative grid gap-6 lg:grid-cols-[180px_1fr] lg:gap-12">
                {/* LEFT: number + name + accent */}
                <div className="flex items-start gap-3 lg:flex-col lg:gap-2">
                  <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background">
                    <span className={`absolute inset-0 -z-10 rounded-md ${stage.accent} opacity-10`} />
                    <span className="font-mono text-xs text-foreground">{stage.n}</span>
                  </div>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      Layer {stage.n}
                    </p>
                    <h2 className="mt-1 text-xl font-medium tracking-tight">{stage.name}</h2>
                  </div>
                </div>

                {/* RIGHT: title, subtitle, inside steps, outputs */}
                <div>
                  <h3 className="text-2xl font-medium tracking-tight">{stage.title}</h3>
                  <p className="mt-3 max-w-2xl text-base text-muted-foreground leading-relaxed">
                    {stage.subtitle}
                  </p>

                  {/* Inside steps */}
                  <ul className="mt-6 space-y-2">
                    {stage.inside.map((step, i) => (
                      <li
                        key={step}
                        className="flex items-start gap-3 font-mono text-xs text-muted-foreground"
                      >
                        <span className="text-foreground/70 select-none">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Outputs */}
                  <div className="mt-6 inline-flex flex-wrap items-center gap-2 rounded-md border border-border/60 bg-cream/60 px-3 py-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      Outputs
                    </span>
                    {stage.outputs.map((o, i) => (
                      <span key={o.label} className="flex items-center gap-1.5">
                        {i > 0 && <span className="text-border">·</span>}
                        <span className="text-xs text-muted-foreground">{o.label}</span>
                        <span className="font-mono text-xs text-foreground">{o.value}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="border-t border-border/60 bg-tan/30">
        <div className="container py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-medium tracking-tight">See it on a real site.</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              The dashboard renders live output for itechdata.ai. Click around.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/app"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Open dashboard
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/features"
              className="inline-flex h-10 items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
            >
              Features
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
