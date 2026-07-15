/**
 * Landing page - modern 2026 redesign on a dark ink base.
 *
 * Layout system:
 *   - Every section's content sits in the same `mx-auto max-w-screen-xl`
 *     container so all edges align down the page.
 *   - Sections share one vertical rhythm: py-14 md:py-16 (56/64px).
 *   - The hero fits above the fold on a typical laptop viewport.
 *   - Hero action cards use a structured 2-column staggered grid (no
 *     absolute positioning), so they can never overlap at any width.
 *
 * All motion is pure CSS from globals.css. `prefers-reduced-motion: reduce`
 * disables everything automatically.
 */

import Link from "next/link";
import { WatchRynkForm } from "./_components/WatchRynkForm";
import {
  ArrowRight,
  ArrowUpRight,
  Type,
  Braces,
  MessageSquare,
  FilePlus2,
  Link2,
  Repeat2,
  Image as ImageIcon,
  Mail,
  BookOpen,
  GitPullRequest,
} from "lucide-react";

// ── Offerings ─────────────────────────────────────────────────────────

const OFFERINGS: Array<{
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  tint: TintKey;
}> = [
  {
    label: "Meta Rewrites",
    description: "Titles and descriptions rewritten so pages rank for the keywords they should.",
    icon: Type,
    tint: "emerald",
  },
  {
    label: "Schema Markup",
    description: "Structured data every page needs, injected by type.",
    icon: Braces,
    tint: "pink",
  },
  {
    label: "301 Redirects",
    description: "Duplicate + competing pages consolidated cleanly.",
    icon: Repeat2,
    tint: "amber",
  },
  {
    label: "Internal Links",
    description: "Smart internal links so authority flows to the right pages.",
    icon: Link2,
    tint: "cyan",
  },
  {
    label: "New Pages",
    description: "Fully-optimized new pages targeting keywords the site is missing.",
    icon: FilePlus2,
    tint: "highlight",
  },
  {
    label: "Hero Images",
    description: "AI hero visuals for every page - alt text included.",
    icon: ImageIcon,
    tint: "violet",
  },
  {
    label: "Outreach Emails",
    description: "Backlink pitches + guest post drafts ready to send.",
    icon: Mail,
    tint: "blue",
  },
  {
    label: "Brand Posts",
    description: "LinkedIn, Reddit and Threads posts that feed AI citation signals.",
    icon: MessageSquare,
    tint: "pink",
  },
  {
    label: "Whitepapers",
    description: "PDF + slide-deck assets that LLMs cite heavily.",
    icon: BookOpen,
    tint: "sky",
  },
  {
    label: "GitHub PRs",
    description: "Pull requests fixing page speed and technical SEO issues.",
    icon: GitPullRequest,
    tint: "emerald",
  },
];

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

const STATS = [
  { value: "x", label: "actions per audit" },
  { value: "x", label: "growth channels covered" },
  { value: "x", label: "setup, then rynk drives" },
  { value: "x", label: "platform, not a stack of tools" },
];

// Sample activity cards in the hero. Content is illustrative - each card
// mirrors a real action type the pipeline produces. Rendered in a 2-column
// staggered grid: column A gets indexes 0/2/4, column B gets 1/3.
const HERO_CARDS = [
  {
    icon: Type,
    tint: "emerald",
    label: "Meta rewritten",
    target: "/services/data-analytics",
    status: "shipped",
  },
  {
    icon: Braces,
    tint: "pink",
    label: "Schema injected",
    target: "Organization + FAQ",
    status: "shipped",
  },
  {
    icon: Link2,
    tint: "cyan",
    label: "Internal links added",
    target: "12 pages",
    status: "shipped",
  },
  {
    icon: MessageSquare,
    tint: "amber",
    label: "Brand post drafted",
    target: "LinkedIn",
    status: "in review",
  },
  {
    icon: FilePlus2,
    tint: "highlight",
    label: "New page written",
    target: "/blog/rag-vs-fine-tuning",
    status: "queued",
  },
] as const;

// ── Page ──────────────────────────────────────────────────────────────

export default function LandingPage(): React.JSX.Element {
  return (
    <div className="relative text-brand-text overflow-x-hidden">
      {/* ═════ HERO - fills the first screen (100dvh minus the 64px nav).
             The card stretches to the viewport bottom and its content is
             vertically centered, so there is never dead space below it and
             the next section starts exactly at the fold. 660px floor keeps
             short windows from clipping the content. ═════ */}
      <section className="relative px-6 pt-6 pb-14 md:px-10 md:pb-16 lg:h-[max(calc(100dvh-4rem),700px)] lg:pb-6">
        <div className="pointer-events-none absolute inset-0 bg-grid-brand opacity-60" aria-hidden />

        <div className="relative mx-auto h-full max-w-screen-xl">
          <div className="flex h-full items-center overflow-hidden rounded-[32px] bg-white/[0.02] ring-1 ring-white/8 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_30px_80px_-40px_rgba(0,0,0,0.7)]">
            <div className="grid w-full gap-12 p-8 md:p-12 lg:grid-cols-2 lg:items-center lg:gap-10 lg:px-14 lg:py-10">
            {/* LEFT - copy + CTAs */}
            <div>
              {/* Live pulse eyebrow */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-2.5 pr-4 animate-rise">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-brand-violet/70 animate-pulse-dot" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-violet" />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-brand-textMute">
                  pipelines live for x clients
                </span>
              </div>

              <h1
                className="font-serif text-5xl md:text-6xl font-medium leading-[0.98] tracking-tight animate-rise text-brand-text"
                style={{ animationDelay: "60ms" }}
              >
                SEO that runs<br />
                <span className="italic text-brand-blueSoft">itself.</span>
              </h1>
              <p
                className="mt-6 max-w-xl text-[15.5px] leading-[1.75] text-brand-textMute animate-rise"
                style={{ animationDelay: "160ms" }}
              >
                Rynk is an automated growth system that makes your business visible
                wherever people search - Google, ChatGPT, Perplexity, Claude, or the
                next thing. It audits your site, strengthens the trust signals AI
                engines look for, and ships every fix to your CMS automatically.
              </p>

              <div
                className="mt-9 flex flex-wrap items-center gap-8 animate-rise"
                style={{ animationDelay: "260ms" }}
              >
                <Link
                  href="/sign-in"
                  className="group relative overflow-hidden inline-flex h-12 items-center gap-2.5 rounded-full bg-white pl-7 pr-6 font-serif text-[16px] font-medium text-brand-ink transition-all hover:shadow-[0_14px_36px_-14px_rgba(255,255,255,0.35)]"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-brand-blue/25 to-transparent animate-shimmer"
                  />
                  Get started
                  <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/how-it-works"
                  className="group inline-flex items-center gap-2 font-serif text-[16px] text-brand-textMute transition-colors hover:text-brand-text"
                >
                  Watch how it works
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>

            {/* RIGHT - "rynk at work" action cards in a staggered grid */}
            <div className="relative">
              {/* Ambient orbs behind the cards */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
                <div className="h-80 w-80 rounded-full bg-brand-blue/14 blur-3xl animate-float-slow" />
              </div>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
                <div
                  className="h-56 w-56 rounded-full bg-brand-violet/18 blur-3xl animate-float-slow"
                  style={{ animationDelay: "3s" }}
                />
              </div>

              {/* Criss-cross cascade - cards alternate left/right down the
                  column. Normal document flow (no absolute positioning), so
                  they can never hide each other at any viewport width. */}
              <div className="relative mx-auto flex w-full max-w-md flex-col gap-2.5">
                {HERO_CARDS.map((card, i) => (
                  <div
                    key={card.label}
                    className={`w-[72%] sm:w-[68%] ${i % 2 === 1 ? "self-end" : "self-start"}`}
                  >
                    <ActionCard card={card} delay={`${i * 1.3}s`} />
                  </div>
                ))}
              </div>

              <p className="relative mt-8 font-serif text-xl md:text-2xl leading-tight tracking-tight text-brand-text text-center">
                We&apos;ll grow your <span className="highlight-marker">business</span>.
              </p>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════ TRUST BAR (marquee) ═════ */}
      <section className="px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-screen-xl">
          <div className="flex items-center gap-4">
            <span className="hidden md:block font-mono text-[10px] uppercase tracking-[0.2em] text-brand-textMute shrink-0">
              Get cited by
            </span>
            <span className="h-px flex-1 bg-white/8" />
          </div>
        </div>

        <div
          className="mt-8 overflow-hidden"
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
      </section>

      {/* ═════ WHAT WE OFFER ═════ */}
      <section className="relative px-6 py-14 md:px-10 md:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 left-8 h-72 w-72 rounded-full bg-brand-violet/20 blur-3xl animate-float-slow"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-4 h-80 w-80 rounded-full bg-brand-cyan/15 blur-3xl animate-float-slow"
          style={{ animationDelay: "4s" }}
        />

        <div className="relative mx-auto max-w-screen-xl">
          <div className="mb-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-violetSoft">
              The full growth system.
            </p>
            <h2 className="mt-3 font-serif text-5xl md:text-6xl font-medium tracking-tight text-brand-text">
              What we <span className="italic text-brand-violetSoft">offer.</span>
            </h2>
            <p className="mt-6 text-[15px] leading-[1.75] text-brand-textMute">
              Rynk detects the keywords your customers actually search, optimizes every page to rank for them, and generates the content, meta, and schema to close the gaps - the traditional SEO base. On top of that, it builds the trust signals AI engines like ChatGPT and Perplexity actually look at: brand posts across LinkedIn and Reddit that spread your name, outreach emails that earn third-party mentions, hero images and whitepapers that get indexed as authoritative assets, and code fixes that keep your site fast and structured enough for AI crawlers to trust. All of it, continuously.
            </p>
          </div>

          {/* Aligned 5x2 grid on desktop, 2 cols on tablet, 1 on mobile */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {OFFERINGS.map((item) => (
              <OfferingTile
                key={item.label}
                label={item.label}
                description={item.description}
                icon={item.icon}
                tint={item.tint}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═════ STATS STRIP ═════ */}
      <section className="px-6 py-14 md:px-10 md:py-16">
        <div className="relative mx-auto max-w-screen-xl overflow-hidden rounded-[32px] bg-white/[0.02] ring-1 ring-white/10 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)]">
          <div
            className="pointer-events-none absolute -top-20 -left-16 h-72 w-72 rounded-full bg-brand-violet/15 blur-3xl animate-float-slow"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-brand-blue/15 blur-3xl animate-float-slow"
            style={{ animationDelay: "4s" }}
            aria-hidden
          />

          <div className="relative grid grid-cols-2 gap-8 px-8 py-12 md:grid-cols-4 md:px-14 md:py-14">
            {STATS.map((s, i) => (
              <div key={s.label} className="text-center md:text-left">
                <div
                  className={`font-serif text-5xl md:text-6xl font-medium tracking-tight ${
                    i === 1 ? "text-brand-violetSoft" : i === 3 ? "text-brand-sky" : "text-brand-text"
                  }`}
                >
                  {s.value}
                </div>
                <div className="mt-3 text-[13px] leading-relaxed text-brand-textMute">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════ WATCH RYNK WORK (final CTA) ═════ */}
      <section className="px-6 py-14 md:px-10 md:py-16">
        <div className="relative mx-auto max-w-screen-xl overflow-hidden rounded-[32px] bg-white/[0.02] px-8 py-14 md:px-14 md:py-16 ring-1 ring-white/8">
          <div
            className="pointer-events-none absolute -top-20 right-24 h-72 w-72 rounded-full bg-brand-blue/15 blur-3xl animate-float-slow"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-brand-violet/15 blur-3xl animate-float-slow"
            style={{ animationDelay: "5s" }}
            aria-hidden
          />

          <div className="relative grid gap-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-center">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-[56px] font-medium leading-[1.02] tracking-tight text-brand-text">
                Watch Rynk work<br />
                on <span className="italic text-brand-blueSoft">your site.</span>
              </h2>
              <p className="mt-6 max-w-xl text-[15.5px] leading-[1.7] text-brand-textMute">
                Drop your domain in. Rynk crawls it live, surfaces what&apos;s holding
                it back, and previews the changes we&apos;d ship first.
              </p>
            </div>

            <WatchRynkForm />
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Tint styles ──────────────────────────────────────────────────────

/**
 * Per-tint style bundle. Every visual channel (icon square, glow, ring,
 * top accent bar, ambient blob) shares the same hue so each card reads as
 * one strong color identity. Single source of truth for hero cards +
 * offering tiles.
 */
type TintKey =
  | "blue"
  | "violet"
  | "sky"
  | "highlight"
  | "emerald"
  | "pink"
  | "amber"
  | "cyan";

const CARD_STYLES: Record<
  TintKey,
  {
    ring: string;
    glow: string;
    iconBg: string;
    iconText: string;
    topBar: string;
    ambient: string;
  }
> = {
  blue: {
    ring: "ring-brand-blue/40",
    glow: "shadow-[0_18px_50px_-15px_rgba(109,141,255,0.55),0_0_0_1px_rgba(109,141,255,0.15)_inset]",
    iconBg: "bg-gradient-to-br from-[#8fa8ff] to-[#4b6bef]",
    iconText: "text-white",
    topBar: "bg-gradient-to-r from-transparent via-brand-blue to-transparent",
    ambient: "bg-brand-blue/25",
  },
  violet: {
    ring: "ring-brand-violet/45",
    glow: "shadow-[0_18px_50px_-15px_rgba(156,140,240,0.55),0_0_0_1px_rgba(156,140,240,0.18)_inset]",
    iconBg: "bg-gradient-to-br from-[#c4b8ff] to-[#7a68d8]",
    iconText: "text-white",
    topBar: "bg-gradient-to-r from-transparent via-brand-violet to-transparent",
    ambient: "bg-brand-violet/30",
  },
  sky: {
    ring: "ring-brand-sky/50",
    glow: "shadow-[0_18px_50px_-15px_rgba(201,213,255,0.4),0_0_0_1px_rgba(201,213,255,0.2)_inset]",
    iconBg: "bg-gradient-to-br from-[#e6ecff] to-[#7d94d8]",
    iconText: "text-brand-ink",
    topBar: "bg-gradient-to-r from-transparent via-brand-sky to-transparent",
    ambient: "bg-brand-sky/25",
  },
  highlight: {
    ring: "ring-brand-highlight/45",
    glow: "shadow-[0_18px_50px_-15px_rgba(247,160,114,0.5),0_0_0_1px_rgba(247,160,114,0.2)_inset]",
    iconBg: "bg-gradient-to-br from-[#ffc59a] to-[#e07648]",
    iconText: "text-white",
    topBar: "bg-gradient-to-r from-transparent via-brand-highlight to-transparent",
    ambient: "bg-brand-highlight/25",
  },
  emerald: {
    ring: "ring-brand-emerald/45",
    glow: "shadow-[0_18px_50px_-15px_rgba(52,211,153,0.55),0_0_0_1px_rgba(52,211,153,0.2)_inset]",
    iconBg: "bg-gradient-to-br from-[#6ee7b7] to-[#059669]",
    iconText: "text-white",
    topBar: "bg-gradient-to-r from-transparent via-brand-emerald to-transparent",
    ambient: "bg-brand-emerald/25",
  },
  pink: {
    ring: "ring-brand-pink/45",
    glow: "shadow-[0_18px_50px_-15px_rgba(244,114,182,0.55),0_0_0_1px_rgba(244,114,182,0.2)_inset]",
    iconBg: "bg-gradient-to-br from-[#f9a8d4] to-[#db2777]",
    iconText: "text-white",
    topBar: "bg-gradient-to-r from-transparent via-brand-pink to-transparent",
    ambient: "bg-brand-pink/25",
  },
  amber: {
    ring: "ring-brand-amber/50",
    glow: "shadow-[0_18px_50px_-15px_rgba(251,191,36,0.55),0_0_0_1px_rgba(251,191,36,0.2)_inset]",
    iconBg: "bg-gradient-to-br from-[#fcd34d] to-[#d97706]",
    iconText: "text-white",
    topBar: "bg-gradient-to-r from-transparent via-brand-amber to-transparent",
    ambient: "bg-brand-amber/22",
  },
  cyan: {
    ring: "ring-brand-cyan/50",
    glow: "shadow-[0_18px_50px_-15px_rgba(34,211,238,0.55),0_0_0_1px_rgba(34,211,238,0.2)_inset]",
    iconBg: "bg-gradient-to-br from-[#67e8f9] to-[#0891b2]",
    iconText: "text-white",
    topBar: "bg-gradient-to-r from-transparent via-brand-cyan to-transparent",
    ambient: "bg-brand-cyan/25",
  },
};

const STATUS_COLOR: Record<string, string> = {
  shipped: "bg-brand-blueSoft shadow-[0_0_8px_rgba(143,168,255,0.7)]",
  "in review": "bg-brand-violetSoft shadow-[0_0_8px_rgba(196,184,255,0.7)]",
  queued: "bg-brand-highlight shadow-[0_0_8px_rgba(247,160,114,0.7)]",
};

// ─── ActionCard ───────────────────────────────────────────────────────

/**
 * Floating chip in the hero. Lives inside a structured column (no absolute
 * positioning) so cards stack cleanly at every viewport width. The bob
 * animation delay is passed per card so the group breathes out of sync.
 */
type HeroCard = (typeof HERO_CARDS)[number];

function ActionCard({ card, delay }: { card: HeroCard; delay: string }): React.JSX.Element {
  const Icon = card.icon;
  const s = CARD_STYLES[card.tint];

  return (
    <div className="relative animate-bob" style={{ animationDelay: delay }}>
      {/* Colored ambient glow behind the card */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -inset-4 rounded-3xl ${s.ambient} blur-2xl opacity-70`}
      />

      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-ink2/95 to-brand-surface/95 backdrop-blur-md ring-1 ${s.ring} ${s.glow}`}
      >
        {/* Top accent bar */}
        <div className={`h-[2px] w-full ${s.topBar}`} aria-hidden />

        <div className="flex items-center gap-3 px-3.5 pt-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${s.iconBg} shadow-[0_6px_14px_-4px_rgba(0,0,0,0.5)]`}
          >
            <Icon className={`h-[18px] w-[18px] ${s.iconText}`} strokeWidth={2.2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-serif text-[14px] leading-tight text-brand-text truncate">
              {card.label}
            </div>
            <div className="font-mono text-[10px] text-brand-textMute truncate">{card.target}</div>
          </div>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 border-t border-white/8 bg-black/15 px-3.5 py-2">
          <span className={`h-1.5 w-1.5 rounded-full ${STATUS_COLOR[card.status]}`} />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-textMute">
            {card.status}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── OfferingTile ─────────────────────────────────────────────────────

/**
 * Equal-sized offering card with icon, title, description always visible.
 * Shares the CARD_STYLES palette with the hero action cards so the whole
 * page has one consistent accent language.
 */
function OfferingTile({
  label,
  description,
  icon: Icon,
  tint,
}: {
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  tint: TintKey;
}): React.JSX.Element {
  const s = CARD_STYLES[tint];
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ${s.ring} p-5 transition-all duration-300 hover:-translate-y-1`}
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
        <div className="mt-4 font-serif text-[18px] font-medium leading-tight tracking-tight text-brand-text">
          {label}
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-brand-textMute">
          {description}
        </p>
      </div>
    </div>
  );
}
