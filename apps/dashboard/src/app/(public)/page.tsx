/**
 * Landing page - marketing redesign on brand palette.
 *
 * Sections:
 *   1. Hero - serif headline left, brand mark + tagline right
 *   2. What we offer - flip-tile grid; each tile reveals a description
 *      when hovered (label slides up, description slides in from below)
 *   3. Watch Rynk work - domain-input CTA
 *
 * Colors are from the brand palette (Tailwind `brand-*`). Serif font
 * (Fraunces) drives headings; body copy stays sans.
 */

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const OFFERINGS: Array<{ label: string; description: string }> = [
  {
    label: "Meta Rewrites",
    description: "Rewrites titles and descriptions so pages rank for the keywords they should.",
  },
  {
    label: "Schema Markup",
    description: "Injects structured data so search engines and AI understand every page.",
  },
  {
    label: "301 Redirects",
    description: "Consolidates competing pages so authority isn't split across duplicates.",
  },
  {
    label: "Internal Links",
    description: "Adds smart internal links so authority flows to the pages that matter.",
  },
  {
    label: "New Pages",
    description: "Writes fully-optimized new pages targeting keywords the site is missing.",
  },
  {
    label: "Hero Images",
    description: "Generates hero visuals for every page - alt text included.",
  },
  {
    label: "Outreach Emails",
    description: "Drafts backlink pitches and guest-post emails ready to review and send.",
  },
  {
    label: "Brand Posts",
    description: "Drafts LinkedIn, Reddit and Threads posts that feed AI citation signals.",
  },
  {
    label: "Whitepapers",
    description: "Generates PDF and slide-deck assets that LLMs cite heavily.",
  },
  {
    label: "GitHub PRs",
    description: "Opens pull requests fixing page speed and technical SEO issues.",
  },
];

export default function LandingPage(): React.JSX.Element {
  return (
    <div className="text-brand-navy">
      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <section className="px-6 pt-8 pb-28 md:px-10 lg:px-14">
        {/* One unified white card. Inside, a two-column grid separated by
             a subtle vertical rule. */}
        <div className="rounded-[32px] bg-white/70 shadow-[0_1px_0_rgba(47,65,86,0.05),0_20px_60px_-30px_rgba(47,65,86,0.18)] overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            {/* LEFT - headline + copy + CTAs */}
            <div className="px-8 py-14 md:px-14 md:py-20 lg:px-16 lg:py-24">
              <h1 className="font-serif text-5xl md:text-6xl lg:text-[72px] font-medium leading-[1.02] tracking-tight">
                SEO that runs itself.
              </h1>
              <p className="mt-8 max-w-xl text-[15.5px] leading-[1.75] text-brand-navy/75">
                Rynk is an automated growth system that makes your business visible
                wherever people search online, covering SEO, AEO, and GEO so that your
                site shows up on every platform - human or AI. Using offsite analysis,
                it strengthens reviews, listings, citations, and other trust signals
                that help AI platforms confidently recommend your business to users.
                By automating publishing, rynk frees you to focus on serving your
                clients and growing your company.
              </p>
              <div className="mt-12 flex flex-wrap items-center gap-8">
                <Link
                  href="/signup"
                  className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-brand-navy pl-7 pr-6 font-serif text-[16px] font-medium text-brand-cream transition-all hover:bg-brand-navy2 hover:shadow-[0_8px_24px_-8px_rgba(47,65,86,0.5)]"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/how-it-works"
                  className="group inline-flex items-center gap-2 font-serif text-[16px] text-brand-navy/80 transition-colors hover:text-brand-navy"
                >
                  How it works
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>

            {/* RIGHT - brand mark + tagline */}
            <div className="relative flex flex-col items-center justify-center px-8 py-14 md:py-20 lg:py-24">
              {/* Decorative sky-blue halo behind the mark */}
              <div
                className="absolute h-72 w-72 rounded-full bg-brand-sky/40 blur-2xl md:h-80 md:w-80"
                aria-hidden
              />
              <div className="relative flex h-60 w-60 items-center justify-center rounded-full bg-brand-navy shadow-[0_20px_60px_-20px_rgba(47,65,86,0.55)] md:h-72 md:w-72">
                <LeafMark className="h-32 w-32 text-brand-cream md:h-40 md:w-40" />
              </div>
              <p className="relative mt-10 font-serif text-3xl md:text-4xl leading-tight tracking-tight text-brand-navy">
                We'll grow your business
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHAT WE OFFER ─────────────────────────────────────────────── */}
      <section className="px-6 pb-32 md:px-10 lg:px-14">
        <h2 className="mb-14 font-serif text-5xl md:text-6xl font-medium tracking-tight">
          What we offer
        </h2>

        <div className="flex flex-wrap gap-3.5">
          {OFFERINGS.map((item) => (
            <FlipTile key={item.label} label={item.label} description={item.description} />
          ))}
        </div>
      </section>

      {/* ─── WATCH RYNK WORK ───────────────────────────────────────────── */}
      <section className="px-6 pb-32 md:px-10 lg:px-14">
        <div className="rounded-[32px] bg-white/70 px-8 py-14 md:px-14 md:py-16 lg:px-16 shadow-[0_1px_0_rgba(47,65,86,0.05),0_20px_60px_-30px_rgba(47,65,86,0.18)]">
          <div className="grid gap-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-center">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-navy/50">
                Free scan
              </p>
              <h2 className="mt-3 font-serif text-4xl md:text-5xl lg:text-[54px] font-medium leading-[1.05] tracking-tight">
                Watch Rynk work on your site.
              </h2>
              <p className="mt-5 max-w-xl text-[15.5px] leading-[1.7] text-brand-navy/70">
                Enter your domain and Rynk's analyser will crawl your site, surface
                what's holding it back, and preview the changes we'd ship first.
              </p>
            </div>

            <form
              action="/signup"
              className="flex items-center gap-2 rounded-full bg-brand-navy py-2 pl-6 pr-2 text-brand-cream shadow-[0_10px_30px_-15px_rgba(47,65,86,0.5)]"
            >
              <input
                type="text"
                placeholder="yoursite.com"
                aria-label="Your domain"
                className="flex-1 bg-transparent font-serif text-[16px] text-brand-cream placeholder:text-brand-cream/55 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Scan my site"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-cream text-brand-navy transition-all hover:scale-105 hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── FlipTile ──────────────────────────────────────────────────────────

/**
 * Pill-shaped tile that shows the offering name at rest. On hover the
 * label slides up and the description slides in from below.
 *
 * Fixed-height container + overflow-hidden + a stacked column that
 * translates up by exactly the tile's height when hovered. `min-w`
 * keeps the layout tidy across tile counts; `flex-1` lets the row
 * distribute remaining space.
 */
function FlipTile({
  label,
  description,
}: {
  label: string;
  description: string;
}): React.JSX.Element {
  return (
    <div
      className="group relative h-[72px] min-w-[240px] flex-1 overflow-hidden rounded-full bg-brand-navy px-7 text-brand-cream cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-14px_rgba(47,65,86,0.45)]"
      role="button"
      tabIndex={0}
    >
      <div className="flex flex-col transition-transform duration-[550ms] ease-[cubic-bezier(0.32,0.72,0.24,1)] group-hover:-translate-y-[72px] group-focus:-translate-y-[72px]">
        <div className="flex h-[72px] items-center font-serif text-[17px] font-medium tracking-tight">
          {label}
        </div>
        <div className="flex h-[72px] items-center pr-2 text-[13px] leading-snug text-brand-cream/85">
          {description}
        </div>
      </div>
    </div>
  );
}

// ─── LeafMark ──────────────────────────────────────────────────────────

function LeafMark({ className }: { className?: string }): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2c-1 4-4 6-6 7 0 5 2 8 6 8 2 0 3-1 4-2v6h2v-6l1-1c1-2 2-6 1-9 0-1-1-2-2-2-2 0-3 1-4 2-1-1-1-2-2-3z" />
    </svg>
  );
}
