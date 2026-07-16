/**
 * /pricing - three tiers + one-time site-build offer + free scan CTA.
 * Content from the design team (Starter / Growth / Enterprise).
 *
 * Same layout grid as the rest of the marketing site:
 *   - sections: px-6 md:px-10, py-14 md:py-16
 *   - content: mx-auto max-w-screen-xl
 *
 * Middle tier (Growth) is the highlighted recommendation.
 */

import Link from "next/link";
import { Check, ArrowRight, Sparkles } from "lucide-react";

const PLATFORMS = [
  "Google",
  "ChatGPT",
  "Perplexity",
  "Claude",
  "Gemini",
  "AI Overview",
  "Bing",
  "Copilot",
  "DuckDuckGo",
];

const TIERS = [
  {
    name: "Starter",
    price: "$249",
    cadence: "/ month",
    target: "For small businesses",
    featuresLabel: "Includes:",
    features: [
      "4 rounds of SEO improvements / month",
      "See how you rank against your competitors",
      "Automatic WordPress website updates",
      "Monthly performance tracking"
    ],
    cta: "Get Starter",
    href: "/sign-in",
    accent: true,
    tint: "emerald",
  },
  {
    name: "Growth",
    price: "$449",
    cadence: "/ month",
    target: "For scaling businesses",
    featuresLabel: "Includes:",
    features: [
      "8 rounds SEO improvements / month",
      "See how you rank against your competitors",
      "Automatic updates to WordPress website",
      "Daily performance tracking",
      "Custom strategy document",
      "New website recommendations weekly",
      "Extra rounds of SEO improvements",
      "Priority support"
    ],
    cta: "Get Growth",
    href: "/sign-in",
    accent: true,
    badge: "Most teams pick this",
    tint: "violet",
  }
];

/**
 * Per-tier color styling. Each tier owns a hue so the row reads as three
 * distinct products: Starter green, Growth violet (recommended), and
 * Enterprise cyan. The site-build offer below uses the orange highlight.
 */
const TIER_STYLES: Record<
  string,
  { ring: string; topBar: string; check: string; price: string; ambient: string }
> = {
  emerald: {
    ring: "ring-brand-emerald/40",
    topBar: "bg-gradient-to-r from-transparent via-brand-emerald to-transparent",
    check: "text-brand-emeraldSoft",
    price: "text-brand-emeraldSoft",
    ambient: "bg-brand-emerald/18",
  },
  violet: {
    ring: "ring-brand-violet/50",
    topBar: "bg-gradient-to-r from-transparent via-brand-violet to-transparent",
    check: "text-brand-violetSoft",
    price: "text-brand-violetSoft",
    ambient: "bg-brand-violet/22",
  },
  cyan: {
    ring: "ring-brand-cyan/40",
    topBar: "bg-gradient-to-r from-transparent via-brand-cyan to-transparent",
    check: "text-brand-cyanSoft",
    price: "text-brand-cyanSoft",
    ambient: "bg-brand-cyan/18",
  },
};

export default function PricingPage(): React.JSX.Element {
  return (
    <div className="relative text-brand-text overflow-x-hidden">
      {/* ═════ HERO ═════ */}
      <section className="relative px-6 py-5 md:px-10 md:py-5">
        <div className="pointer-events-none absolute inset-0 bg-grid-brand opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft animate-rise">
            Pricing
          </p>
          <h1
            className="mt-5 font-serif text-4xl md:text-5xl font-medium leading-[1.02] tracking-tight animate-rise"
            style={{ animationDelay: "60ms" }}
          >
            Simple, <span className="italic text-brand-blueSoft">per-team</span> pricing.
          </h1>
          <p
            className="mt-4 mb-5 text-[16px] leading-[1.75] text-brand-textMute animate-rise"
            style={{ animationDelay: "160ms" }}
          >
            Pick the tier that fits your business. 
          </p>
        </div>
      </section>

      {/* ═════ TIERS ═════ */}
      <section className="relative px-6 py-2 md:px-10 md:py-2">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 left-1/4 h-72 w-72 rounded-full bg-brand-violet/15 blur-3xl animate-float-slow"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-brand-blue/15 blur-3xl animate-float-slow"
          style={{ animationDelay: "4s" }}
        />

        <div className="relative mx-auto max-w-screen-xl">
          <div className="grid gap-5 lg:grid-cols-2">
            {TIERS.map((tier) => {
              const s = TIER_STYLES[tier.tint]!;
              return (
                <div
                  key={tier.name}
                  className={`relative flex flex-col overflow-hidden rounded-3xl bg-white/[0.03] p-5 md:p-6 ring-1 ${s.ring} transition-all duration-300 hover:-translate-y-1 ${
                    tier.accent ? "shadow-[0_18px_50px_-15px_rgba(156,140,240,0.45)]" : ""
                  }`}
                >
                  <div className={`absolute inset-x-0 top-0 h-[2px] ${s.topBar}`} aria-hidden />
                  {/* Tint blob so each card carries its color */}
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute -top-14 -right-14 h-40 w-40 rounded-full ${s.ambient} blur-3xl opacity-80`}
                  />

                  {tier.badge && (
                    <span className="absolute right-6 top-5 rounded-full bg-brand-violet/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-brand-violetSoft ring-1 ring-brand-violet/40">
                      {tier.badge}
                    </span>
                  )}

                  <div className="relative">
                    <h3 className="font-serif text-2xl font-medium tracking-tight">{tier.name}</h3>
                    <p className="mt-1 text-[13px] text-brand-textMute">{tier.target}</p>
                    <div className="mt-4 flex items-baseline gap-1.5">
                      <span className={`font-serif text-5xl font-medium tracking-tight ${s.price}`}>
                        {tier.price}
                      </span>
                      <span className="font-mono text-sm text-brand-textMute">{tier.cadence}</span>
                    </div>
                  </div>

                  <Link
                    href={tier.href}
                    className={`relative mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full font-serif text-[15px] font-medium transition-all ${
                      tier.accent
                        ? "bg-white text-brand-ink hover:shadow-[0_14px_36px_-14px_rgba(255,255,255,0.4)]"
                        : "ring-1 ring-white/15 text-brand-text hover:bg-white/5"
                    }`}
                  >
                    {tier.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <div className="relative mt-5 border-t border-white/8 pt-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-brand-textMute">
                      {tier.featuresLabel}
                    </p>
                    <ul className="mt-3 grid grid-cols-2 gap-x-5 gap-y-1.5">
                      {tier.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2 text-[13px] leading-snug">
                          <Check className={`mt-0.5 h-4 w-4 shrink-0 ${s.check}`} />
                          <span className="text-brand-text/90">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ═════ SITE-BUILD ONE-TIME OFFER ═════ */}
          <div className="relative mt-5 overflow-hidden rounded-3xl bg-white/[0.02] ring-1 ring-brand-highlight/30 px-8 py-7 md:px-10 md:py-8">
            <div
              className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-highlight to-transparent"
              aria-hidden
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-16 right-16 h-56 w-56 rounded-full bg-brand-highlight/15 blur-3xl"
            />

            <div className="relative grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-center">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-medium leading-[1.05] tracking-tight text-brand-text">
                  Starting from zero?{" "}
                  <span className="italic text-brand-highlight">We&apos;ll build the site too.</span>
                </h2>
                <p className="mt-4 text-[15px] leading-[1.7] text-brand-textMute">
                  Full WordPress website with 2-3 pages, SEO-optimized from day one.
                </p>
                <p className="text-[12px] text-brand-textMute md:text-left">
                  Requires a Starter or Growth plan for ongoing
                  optimization.
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 md:items-end">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-5xl font-medium tracking-tight text-brand-text">
                    $499
                  </span>
                  <span className="font-mono text-sm text-brand-textMute">one-time</span>
                </div>
                <Link
                  href="/contact"
                  className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-7 font-serif text-[16px] font-medium text-brand-ink transition-all hover:shadow-[0_14px_36px_-14px_rgba(255,255,255,0.4)]"
                >
                  Get my site built
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════ WATCH RYNK WORK (free scan) ═════ */}
      <section className="relative px-0 py-4 md:px-0 md:py-4">
        <div className="relative mx-auto max-w-screen-xl overflow-hidden rounded-[32px]  ring-0 ring-white/8 px-2 py-12 md:px-2 md:py-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 right-24 h-72 w-72 rounded-full  blur-3xl animate-float-slow"
          />

          <div className="relative grid gap-4 md:grid-cols-[.9fr_1fr] md:items-center">
            <div className="w-full">
              <h2 className="w-full font-serif text-3xl md:text-4xl font-medium leading-[1.05] tracking-tight text-brand-text">                Watch Rynk work <span className="italic text-brand-blueSoft">on your site.</span>
              </h2>
              <p className="mt-3 w-full text-[15px] leading-[1.7] text-brand-textMute">
                Run a free scan: Rynk&apos;s will find out why your customers aren't seeing your site while using Google or AI.
              </p>
            </div>

            <form
              action="/sign-in"
              className="group relative ml-auto min-w-0 flex w-[75%] items-center gap-2 rounded-full bg-white/[0.06] ring-1 ring-white/12 py-2 pl-6 pr-2 text-brand-text"
            >
              <Sparkles className="h-4 w-4 text-brand-violetSoft" />
              <input
                type="text"
                placeholder="yoursite.com"
                aria-label="Your domain"
                className="flex-1 bg-transparent font-serif text-[16px] text-brand-text placeholder:text-brand-textMute focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Scan my site"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-ink transition-all group-hover:scale-105"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ═════ TRUST BAR (marquee) ═════ */}
      <section className="px-6 py-10 md:px-10 md:py-10">
        <div className="mx-auto max-w-screen-xl border-y border-brand-blue/30">
          <div className="py-4">
            <div className="flex items-center gap-4">
              <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-brand-textMute md:block">
                Get cited by
              </span>
              <span className="h-px flex-1 bg-white/8" />
            </div>
          </div>

          <div
            className="mt-2 mb-7 overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            }}
          >
            <div className="flex w-max animate-marquee gap-14">
              {[...PLATFORMS, ...PLATFORMS].map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="font-serif text-2xl md:text-3xl text-brand-textMute"
                >
                  {name}
                  <span className="mx-8 text-brand-violet/40">•</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}