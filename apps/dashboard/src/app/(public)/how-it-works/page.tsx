/**
 * /how-it-works - public page.
 *
 * Structure:
 *   1. Hero          - "Growth on autopilot" (fills the first screen)
 *   2. What you get  - six outcome cards (value up front)
 *   3. Three jobs    - Analyze / Generate / Publish, six capability
 *                      cards each (content from the design team)
 *   4. Bottom CTA    -> /sign-in
 */

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Timer,
  Layers,
  Settings2,
  Rocket,
} from "lucide-react";

// ── What you get ──────────────────────────────────────────────────────

const OUTCOMES = [
  {
    icon: TrendingUp,
    title: "Higher rankings",
    body: "More of your pages on page one for the keywords your customers actually search.",
    tint: "emerald",
  },
  {
    icon: Sparkles,
    title: "More AI citations",
    body: "The trust signals ChatGPT, Perplexity, and Google AI Overview look for, continuously built.",
    tint: "violet",
  },
  {
    icon: Rocket,
    title: "Fixes shipped for you",
    body: "Rynk ships meta, schema, pages, links, images, and code changes directly to your site.",
    tint: "pink",
  },
  {
    icon: Timer,
    title: "Continuous optimization",
    body: "SERPs shift weekly. Rynk re-audits, re-plans, and re-ships in the background.",
    tint: "amber",
  },
  {
    icon: Settings2,
    title: "Zero tools to learn",
    body: "You don't touch Ahrefs, Screaming Frog, WordPress, or GitHub. Rynk does the work.",
    tint: "cyan",
  },
  {
    icon: Layers,
    title: "One dashboard",
    body: "Every action, every channel, every result - in one place. No stack. No sprawl.",
    tint: "blue",
  },
] as const;

// ── Built around three jobs (content from the design team) ────────────

const JOBS = [
  {
    n: "1",
    name: "Analyze",
    tint: "emerald",
    intro: "Crawl, score, and benchmark - Rynk understands the site as deeply as a human auditor.",
    cards: [
      {
        title: "Full site crawl",
        body: "Renders every page with a real browser, captures titles, metadata, schema, H1s, body, and internal links.",
      },
      {
        title: "Performance scoring",
        body: "PageSpeed Insights per template - TBT, LCP, CLS, render-blocking resources, image weight.",
      },
      {
        title: "SERP + AI Overview",
        body: "Every seed keyword checked: top-ranking URLs, People-Also-Ask, AI Overview citations, featured snippets.",
      },
      {
        title: "Keyword + DA metrics",
        body: "Volume, difficulty, CPC for every keyword. Domain Authority for you and your competitors.",
      },
      {
        title: "Onsite and offsite EEAT",
        body: "Policy pages, author bylines, NAP consistency, certifications, third-party profiles (G2, Crunchbase, Clutch).",
      },
      {
        title: "Cannibalization detection",
        body: "URL clusters competing for the same keyword, with a canonical recommendation per cluster.",
      },
    ],
  },
  {
    n: "2",
    name: "Generate",
    tint: "amber",
    intro: "Eleven generators produce every change rynk plans - typed, validated, traceable.",
    cards: [
      {
        title: "CMS work",
        body: "Meta rewrites, schema injection, 301 redirects, internal links, NAP blocks - all produced as structured actions ready to ship.",
      },
      {
        title: "Full pages",
        body: "Pillar + spoke pages with titles, meta descriptions, outline, and optional fully-written body. Each linked to its schema and image actions.",
      },
      {
        title: "Images",
        body: "Hero images, inline diagrams, social card thumbnails - prompt + dimensions + alt text, generated at publish time.",
      },
      {
        title: "Outreach drafts",
        body: "Guest pitches, press, backlink requests - full subject and body, staggered send dates, ready to personalize.",
      },
      {
        title: "Brand posts",
        body: "LinkedIn thought-leadership, Reddit discussions, Threads short takes - drafted in your brand's voice with a clear rationale per post.",
      },
      {
        title: "Documents + PRs",
        body: "Whitepapers + sales decks for distribution. GitHub PR drafts for code-level fixes when you have a repo.",
      },
    ],
  },
  {
    n: "3",
    name: "Publish",
    tint: "pink",
    intro: "Every action is dispatched to the right service - WordPress, GitHub, image generation, document rendering.",
    cards: [
      {
        title: "WordPress adapter",
        body: "Pushes meta, schema, redirects, pages, and authors via the WP REST API. Detects which SEO plugin (Yoast / RankMath / SEOPress) is installed.",
      },
      {
        title: "Image pipeline",
        body: "Generates each image action via the configured provider and attaches the results to the right post automatically.",
      },
      {
        title: "Document rendering",
        body: "Markdown to PDF / PPTX, distributed to SlideShare, Scribd, and Issuu for wider indexing.",
      },
      {
        title: "GitHub PRs",
        body: "Opens draft pull requests for code-level fixes - proper branch naming, full description, test plan.",
      },
      {
        title: "Approval gating",
        body: "Every action carries a risk score and an automatable flag. Humans approve riskier actions before they fire.",
      },
      {
        title: "Status tracking",
        body: "Every action records its lifecycle: pending, approved, applied, done. Failed actions retry without re-planning.",
      },
    ],
  },
  {
    n: "4",
    name: "Monitor",
    tint: "highlight",
    intro: "Search shifts every week. Rynk watches the results and feeds what changed back into the plan.",
    cards: [
      {
        title: "Weekly SERP re-crawls",
        body: "The top results for every target keyword re-pulled weekly - new entrants, dropped competitors, position shifts.",
      },
      {
        title: "Rank tracking",
        body: "Where you stand for every keyword, tracked over time - on Google and in AI engines.",
      },
      {
        title: "Competitor deltas",
        body: "When a new competitor takes over a top spot, rynk catches it and re-plans that keyword automatically.",
      },
      {
        title: "Traffic ground truth",
        body: "Search Console impressions and clicks plus Analytics sessions and conversions, pulled weekly so results tie back to real traffic.",
      },
      {
        title: "Backlink watch",
        body: "New and lost backlinks tracked over time - the authority signals behind your rankings.",
      },
      {
        title: "Weekly digest",
        body: "One summary per week: what moved, what rynk shipped in response, and what's next.",
      },
    ],
  },
] as const;

// ── Color styles (matches the landing CARD_STYLES palette) ────────────

type TintKey =
  | "blue"
  | "violet"
  | "sky"
  | "highlight"
  | "emerald"
  | "pink"
  | "amber"
  | "cyan";

const TINT_STYLES: Record<
  TintKey,
  { ring: string; iconBg: string; iconText: string; topBar: string; ambient: string; text: string }
> = {
  blue: {
    ring: "ring-brand-blue/40",
    iconBg: "bg-gradient-to-br from-[#8fa8ff] to-[#4b6bef]",
    iconText: "text-white",
    topBar: "bg-gradient-to-r from-transparent via-brand-blue to-transparent",
    ambient: "bg-brand-blue/22",
    text: "text-brand-blueSoft",
  },
  violet: {
    ring: "ring-brand-violet/45",
    iconBg: "bg-gradient-to-br from-[#c4b8ff] to-[#7a68d8]",
    iconText: "text-white",
    topBar: "bg-gradient-to-r from-transparent via-brand-violet to-transparent",
    ambient: "bg-brand-violet/25",
    text: "text-brand-violetSoft",
  },
  sky: {
    ring: "ring-brand-sky/50",
    iconBg: "bg-gradient-to-br from-[#e6ecff] to-[#7d94d8]",
    iconText: "text-brand-ink",
    topBar: "bg-gradient-to-r from-transparent via-brand-sky to-transparent",
    ambient: "bg-brand-sky/22",
    text: "text-brand-sky",
  },
  highlight: {
    ring: "ring-brand-highlight/45",
    iconBg: "bg-gradient-to-br from-[#ffc59a] to-[#e07648]",
    iconText: "text-white",
    topBar: "bg-gradient-to-r from-transparent via-brand-highlight to-transparent",
    ambient: "bg-brand-highlight/22",
    text: "text-brand-highlight",
  },
  emerald: {
    ring: "ring-brand-emerald/45",
    iconBg: "bg-gradient-to-br from-[#6ee7b7] to-[#059669]",
    iconText: "text-white",
    topBar: "bg-gradient-to-r from-transparent via-brand-emerald to-transparent",
    ambient: "bg-brand-emerald/22",
    text: "text-brand-emeraldSoft",
  },
  pink: {
    ring: "ring-brand-pink/45",
    iconBg: "bg-gradient-to-br from-[#f9a8d4] to-[#db2777]",
    iconText: "text-white",
    topBar: "bg-gradient-to-r from-transparent via-brand-pink to-transparent",
    ambient: "bg-brand-pink/22",
    text: "text-brand-pinkSoft",
  },
  amber: {
    ring: "ring-brand-amber/50",
    iconBg: "bg-gradient-to-br from-[#fcd34d] to-[#d97706]",
    iconText: "text-white",
    topBar: "bg-gradient-to-r from-transparent via-brand-amber to-transparent",
    ambient: "bg-brand-amber/20",
    text: "text-brand-amberSoft",
  },
  cyan: {
    ring: "ring-brand-cyan/50",
    iconBg: "bg-gradient-to-br from-[#67e8f9] to-[#0891b2]",
    iconText: "text-white",
    topBar: "bg-gradient-to-r from-transparent via-brand-cyan to-transparent",
    ambient: "bg-brand-cyan/22",
    text: "text-brand-cyanSoft",
  },
};

// ── Page ──────────────────────────────────────────────────────────────

export default function HowItWorksPage(): React.JSX.Element {
  return (
    <div className="relative text-brand-text overflow-x-hidden">
      {/* ═════ HERO - centered, fills the first screen exactly ═════ */}
      <section className="relative flex items-center px-6 py-14 md:px-10 lg:h-[max(calc(100dvh-4rem),560px)] lg:py-0">
        <div className="pointer-events-none absolute inset-0 bg-grid-brand opacity-50" aria-hidden />
        <div className="relative mx-auto w-full max-w-3xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft animate-rise">
            How rynk works
          </p>
          <h1
            className="mt-4 font-serif text-5xl md:text-6xl lg:text-[72px] font-medium leading-[1.02] tracking-tight animate-rise"
            style={{ animationDelay: "60ms" }}
          >
            Growth on <span className="italic text-brand-blueSoft">autopilot.</span>
          </h1>
          <p
            className="mt-7 text-[16px] leading-[1.75] text-brand-textMute animate-rise"
            style={{ animationDelay: "160ms" }}
          >
            Rynk is an automated growth system for your business. It audits your
            site, plans every fix worth making, ships the changes directly to
            your CMS and channels, and monitors what changes as search
            evolves - so you rank higher on Google and get cited more by AI
            engines, without ever touching an SEO tool.
          </p>
        </div>
      </section>

      {/* ═════ WHAT YOU GET ═════ */}
      <section className="relative px-6 py-14 md:px-10 md:py-16">
        <div className="relative mx-auto max-w-screen-xl">
          <div className="mb-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-emeraldSoft">
              What you get
            </p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl font-medium tracking-tight text-brand-text">
              The outcomes, up front.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OUTCOMES.map((o) => (
              <OutcomeCard key={o.title} outcome={o} />
            ))}
          </div>
        </div>
      </section>

      {/* ═════ BUILT AROUND THREE JOBS ═════ */}
      <section className="relative px-6 py-14 md:px-10 md:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 right-8 h-80 w-80 rounded-full bg-brand-violet/15 blur-3xl animate-float-slow"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-20 left-8 h-80 w-80 rounded-full bg-brand-emerald/10 blur-3xl animate-float-slow"
          style={{ animationDelay: "4s" }}
        />

        <div className="relative mx-auto max-w-screen-xl">
          <div className="mb-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-violetSoft">
              Under the hood
            </p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl font-medium tracking-tight text-brand-text">
              Built around four jobs.
            </h2>
            <p className="mt-5 text-[15px] leading-[1.75] text-brand-textMute">
              Rynk analyzes what&apos;s there, generates every change it would
              make, publishes the result, and monitors what happens next. Each
              capability below is a real piece of the pipeline running today.
            </p>
          </div>

          <div className="space-y-16">
            {JOBS.map((job) => {
              const s = TINT_STYLES[job.tint];
              return (
                <div key={job.name}>
                  {/* Job header - colored number chip + name */}
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.iconBg} font-serif text-xl font-medium ${s.iconText} shadow-[0_6px_16px_-4px_rgba(0,0,0,0.5)]`}
                    >
                      {job.n}
                    </span>
                    <h3 className={`font-serif text-3xl md:text-4xl font-medium tracking-tight ${s.text}`}>
                      {job.name}
                    </h3>
                  </div>
                  <p className="mt-4 text-[15px] leading-[1.7] text-brand-textMute">
                    {job.intro}
                  </p>

                  {/* Capability cards - 3x2 aligned grid */}
                  <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {job.cards.map((card) => (
                      <div
                        key={card.title}
                        className={`group relative overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ${s.ring} p-5 transition-all duration-300 hover:-translate-y-0.5`}
                      >
                        <div className={`absolute inset-x-0 top-0 h-[2px] ${s.topBar}`} aria-hidden />
                        {/* Two tint blobs per card so the color reads clearly */}
                        <div
                          aria-hidden
                          className={`pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full ${s.ambient} blur-2xl opacity-80 transition-opacity duration-500 group-hover:opacity-100`}
                        />
                        <div
                          aria-hidden
                          className={`pointer-events-none absolute -bottom-14 -left-14 h-32 w-32 rounded-full ${s.ambient} blur-2xl opacity-45`}
                        />
                        <div className="relative">
                          <div className="flex items-center gap-2.5">
                            <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${s.iconBg}`} />
                            <div className="font-serif text-[17px] font-medium leading-tight tracking-tight text-brand-text">
                              {card.title}
                            </div>
                          </div>
                          <p className="mt-2.5 text-[13.5px] leading-relaxed text-brand-textMute">
                            {card.body}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═════ BOTTOM CTA ═════ */}
      <section className="relative px-6 py-14 md:px-10 md:py-16">
        <div className="relative mx-auto max-w-screen-xl overflow-hidden rounded-[32px] bg-white/[0.02] ring-1 ring-white/8 px-8 py-12 md:px-14 md:py-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 right-24 h-72 w-72 rounded-full bg-brand-violet/18 blur-3xl animate-float-slow"
          />

          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium leading-[1.05] tracking-tight text-brand-text">
                Ready to <span className="italic text-brand-blueSoft">plug rynk in?</span>
              </h2>
              <p className="mt-2 text-[15px] leading-[1.7] text-brand-textMute">
                Setup takes five minutes. After that, rynk runs on its own.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-6">
              <Link
                href="/sign-in"
                className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-7 font-serif text-[16px] font-medium text-brand-ink transition-all hover:shadow-[0_14px_36px_-14px_rgba(255,255,255,0.4)]"
              >
                Get started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/pricing"
                className="group inline-flex items-center gap-2 font-serif text-[16px] text-brand-textMute transition-colors hover:text-brand-text"
              >
                See pricing
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── OutcomeCard ──────────────────────────────────────────────────────

function OutcomeCard({
  outcome,
}: {
  outcome: (typeof OUTCOMES)[number];
}): React.JSX.Element {
  const s = TINT_STYLES[outcome.tint];
  const Icon = outcome.icon;
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ${s.ring} p-6 transition-all duration-300 hover:-translate-y-1`}
    >
      <div className={`absolute inset-x-0 top-0 h-[2px] ${s.topBar}`} aria-hidden />
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full ${s.ambient} blur-2xl opacity-60 transition-opacity duration-500 group-hover:opacity-100`}
      />

      <div className="relative">
        <div
          className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${s.iconBg} shadow-[0_6px_16px_-4px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105`}
        >
          <Icon className={`h-5 w-5 ${s.iconText}`} strokeWidth={2.2} />
        </div>
        <div className="mt-4 font-serif text-[19px] font-medium leading-tight tracking-tight text-brand-text">
          {outcome.title}
        </div>
        <p className="mt-2 text-[13.5px] leading-relaxed text-brand-textMute">
          {outcome.body}
        </p>
      </div>
    </div>
  );
}
