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

const TIERS = [
  {
    name: "Starter",
    price: "$249",
    cadence: "/ month",
    target: "For small businesses",
    featuresLabel: "Includes:",
    features: [
      "AI visibility tracking",
      "Website AI visibility audit",
      "Competitor analysis",
      "AI search gap detection",
      "AI-generated blog posts",
      "Weekly publishing recommendations",
      "Content approval inbox",
      "WordPress publishing integration",
      "Monthly performance report",
    ],
    cta: "Get Starter",
    href: "/sign-in",
    accent: false,
    tint: "emerald",
  },
  {
    name: "Growth",
    price: "$599",
    cadence: "/ month",
    target: "For scaling businesses",
    featuresLabel: "Everything in Starter and:",
    features: [
      "AI-generated landing pages + FAQ pages",
      "Automated schema markup generation",
      "Internal linking optimization",
      "Content refresh recommendations",
      "Competitor content monitoring",
      "Shopify publishing integration",
      "Continuous optimization loop",
      "Weekly reports + priority support",
    ],
    cta: "Get Growth",
    href: "/sign-in",
    accent: true,
    badge: "Most teams pick this",
    tint: "violet",
  },
  {
    name: "Enterprise",
    price: "$899",
    cadence: "/ month + $50/run",
    target: "For business publishing",
    featuresLabel: "Everything in Growth and:",
    features: [
      "AI-generated product, location & comparison pages",
      "Resource hubs, auto-updated as rankings shift",
      "Advanced AI visibility analytics",
      "Custom optimization strategy",
      "Quarterly strategy consultation",
      "Highest priority support",
    ],
    cta: "Get Enterprise",
    href: "/contact",
    accent: false,
    tint: "cyan",
  },
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
      <section className="relative px-6 py-14 md:px-10 md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-grid-brand opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft animate-rise">
            Pricing
          </p>
          <h1
            className="mt-4 font-serif text-5xl md:text-6xl font-medium leading-[1.02] tracking-tight animate-rise"
            style={{ animationDelay: "60ms" }}
          >
            Simple, <span className="italic text-brand-blueSoft">per-team</span> pricing.
          </h1>
          <p
            className="mt-6 text-[16px] leading-[1.75] text-brand-textMute animate-rise"
            style={{ animationDelay: "160ms" }}
          >
            Pick the tier that fits your business. Every plan runs the full
            rynk pipeline - the tiers change how much gets generated, how
            often, and how many channels it ships to.
          </p>
        </div>
      </section>

      {/* ═════ TIERS ═════ */}
      <section className="relative px-6 py-14 md:px-10 md:py-16">
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
          <div className="grid gap-5 lg:grid-cols-3">
            {TIERS.map((tier) => {
              const s = TIER_STYLES[tier.tint]!;
              return (
                <div
                  key={tier.name}
                  className={`relative flex flex-col overflow-hidden rounded-3xl bg-white/[0.03] p-7 md:p-8 ring-1 ${s.ring} transition-all duration-300 hover:-translate-y-1 ${
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
                    <div className="mt-5 flex items-baseline gap-1.5">
                      <span className={`font-serif text-5xl font-medium tracking-tight ${s.price}`}>
                        {tier.price}
                      </span>
                      <span className="font-mono text-sm text-brand-textMute">{tier.cadence}</span>
                    </div>
                  </div>

                  <Link
                    href={tier.href}
                    className={`relative mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full font-serif text-[15px] font-medium transition-all ${
                      tier.accent
                        ? "bg-white text-brand-ink hover:shadow-[0_14px_36px_-14px_rgba(255,255,255,0.4)]"
                        : "ring-1 ring-white/15 text-brand-text hover:bg-white/5"
                    }`}
                  >
                    {tier.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <div className="relative mt-7 border-t border-white/8 pt-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-brand-textMute">
                      {tier.featuresLabel}
                    </p>
                    <ul className="mt-4 space-y-3">
                      {tier.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5 text-[13.5px] leading-snug">
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
          <div className="relative mt-8 overflow-hidden rounded-3xl bg-white/[0.02] ring-1 ring-brand-highlight/30 px-8 py-10 md:px-12 md:py-12">
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
                  Full WordPress or Shopify build with AI-search-ready structure,
                  technical SEO, and 2-3 optimized pages - live and tracked from
                  day one.
                </p>
                <p className="mt-3 font-mono text-[12px] leading-relaxed text-brand-textMute">
                  Conversion-optimized pages · Schema markup · Mobile &amp; speed
                  tuning · Rynk tracking enabled
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 md:items-end">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-5xl font-medium tracking-tight text-brand-text">
                    $499
                  </span>
                  <span className="font-mono text-sm text-brand-textMute">one-time</span>
                </div>
                <p className="text-[12px] text-brand-textMute md:text-right">
                  Requires a Starter, Growth, or Enterprise plan for ongoing
                  optimization.
                </p>
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
      <section className="relative px-6 py-14 md:px-10 md:py-16">
        <div className="relative mx-auto max-w-screen-xl overflow-hidden rounded-[32px] bg-white/[0.02] ring-1 ring-white/8 px-8 py-12 md:px-14 md:py-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 right-24 h-72 w-72 rounded-full bg-brand-blue/15 blur-3xl animate-float-slow"
          />

          <div className="relative grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium leading-[1.05] tracking-tight text-brand-text">
                Watch Rynk work <span className="italic text-brand-blueSoft">on your site.</span>
              </h2>
              <p className="mt-3 text-[15px] leading-[1.7] text-brand-textMute">
                Run a free scan: find out what Rynk&apos;s analysis reveals about
                your site.
              </p>
            </div>

            <form
              action="/sign-in"
              className="group relative flex items-center gap-2 rounded-full bg-white/[0.06] ring-1 ring-white/12 py-2 pl-6 pr-2 text-brand-text"
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
    </div>
  );
}
