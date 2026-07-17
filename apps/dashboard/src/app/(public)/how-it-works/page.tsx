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
        title: "Full Site Scan",
        body: "We go through every page of your website — just like a visitor or Google would — to see what's working and what's missing.",
      },
      /*
      {
        title: "Speed Check",
        body: "We check how fast your site loads and flag anything that's slowing it down for visitors",
      },
      {
        title: "Search Visibility",
        body: "We check where you actually show up — on Google and on AI tools like ChatGPT — for the searches your customers are making."
      },
      */
      {
        title: "Keyword Insights",
        body: "We find out what people are searching for, how hard it is to rank for, and how you compare to your competitors.",
      },
      /*
      {
        title: "Trust Signals",
        body: "We check the things that make Google and customers trust your business — reviews, credentials, and consistent info across the web.",
      },
      */
      {
        title: "Duplicate Content Check",
        body: "We find pages on your site that are competing with each other and fix it so the right one shows up in search.",
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
        title: "Site Updates",
        body: "We write the behind-the-scenes fixes your website needs — like updated page titles, working links, and consistent business info — ready to go live.",
      },
      {
        title: "New Web Pages",
        body: "We write full pages for your site, from the main content down to the small details that help you get found in search.",
      },
      {
        title: "Photos & Graphics",
        body: "We create the images your site and posts need — banners, simple graphics, and thumbnails — sized and labeled correctly.",
      },
/*
      {
        title: "Partnership Emails",
        body: "We draft emails to other sites and publications who could feature or link to your business — ready for you to send.",
      },
   
      {
        title: "Social Posts",
        body: "We write posts for LinkedIn, Reddit, and other platforms in your brand's voice, so you can build a presence without starting from scratch.",
      },
      /*
      {
        title: "Sales Materials",
        body: "We put together documents like sales sheets and guides you can share with customers or partners.",
      },
      */
    ],
  },
  {
    n: "3",
    name: "Publish",
    tint: "pink",
    intro: "Every action is dispatched to the right service - WordPress, GitHub, image generation, document rendering.",
    cards: [
      {
        title: "Website Publishing",
        body: "If your site runs on WordPress, we publish updates directly — no need to copy and paste anything yourself.",
      },
      {
        title: "Image Publishing",
        body: "New images are automatically attached to the right page or post — no extra steps for you.",
      },
      /*
      {
        title: "Shareable Documents",
        body: "Your sales sheets and guides are turned into ready-to-share files you can send to customers or post online.",
      },
      {
        title: "Developer Handoff",
        body: "If your site is custom-built, we prepare the code changes for your developer to review and approve.",
      },
      {
        title: "You Stay in Control",
        body: "Bigger changes wait for your OK before going live. Smaller, safe updates go out automatically.",
      },
      */
      {
        title: "See What's Done",
        body: "You can always check what's been published, what's waiting on you, and what's in progress.",
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
        title: "Weekly Search Check",
        body: "Every week, we check how the top results look for your key searches — so we catch changes before they cost you customers.",
      },
      {
        title: "Ranking Tracker",
        body: "See exactly where you stand — on Google and on AI tools — for every search that matters to your business.",
      },
      {
        title: "Competitor Watch",
        body: "If a competitor jumps ahead of you, we notice right away and adjust your plan to help you catch up.",
      },
      /*
      {
        title: "Real Traffic Numbers",
        body: "We check how many people are actually visiting your site and taking action, not just where you rank.",
      },
      {
        title: "Reputation Tracking",
        body: "We keep an eye on other sites linking to yours, since that's one of the things that builds trust with Google."
      },
      {
        title: "Weekly Update",
        body: "A simple weekly summary: what changed, what we did about it, and what's coming next.",
      },
      */
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
          </p>
          <h1
            className="mt-4 font-serif text-5xl md:text-6xl lg:text-[72px] font-medium leading-[1.02] tracking-tight animate-rise"
            style={{ animationDelay: "60ms" }}
          >
            Leads on <span className="italic text-brand-blueSoft">autopilot.</span>
          </h1>
          <p
            className="mt-7 text-[16px] leading-[1.75] text-brand-textMute animate-rise"
            style={{ animationDelay: "160ms" }}
          >
            a

            We scan your website, find every fix worth making, and ship those changes 
            straight to your site and channels — no manual work on your end. As search 
            keeps evolving, we keep watching and adjusting, so you consistently rank 
            higher on Google and get cited more when people 
            ask AI assistants questions.

          </p> <br /> <br />


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
              Watch Rynk work on your site. <span className="italic text-brand-blueSoft">your site. </span>
              </h2>
              <p className="mt-2 text-[15px] leading-[1.7] text-brand-textMute">
                Enter your website URL and see what Rynk has to say.

.
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
