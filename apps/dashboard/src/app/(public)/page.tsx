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
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
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
      label: "Better Website Text",
      description: 'We rewrite titles and descriptions so your pages come up when customers hit "search."',
      icon: Type,
      tint: "emerald",
    },
    {
      label: "AI Readability",
      description: "We reformat your pages so AI tools can describe your business accurately to customers.",
      icon: Braces,
      tint: "pink",
    },
    {
      label: "Cleanup",
      description: "We fix duplicate pages so that customers always find you where you expect them to.",
      icon: Repeat2,
      tint: "amber",
    },
    {
      label: "Page Connections",
      description: "We connect your webpages to each other so Google easily finds relevant content.",
      icon: Link2,
      tint: "cyan",
    },
    {
      label: "New Pages",
      description: "We build brand-new web pages for you based on what your site is missing.",
      icon: FilePlus2,
      tint: "highlight",
    },
    {
      label: "Custom images",
      description: "We create polished images for every page, so Google knows your site is professional.",
      icon: ImageIcon,
      tint: "violet",
    },
    {
      label: "Outreach Emails",
      description: "We draft emails to other sites, asking them to include your business name on their website.",
      icon: Mail,
      tint: "blue",
    },
    {
      label: "Social Media Posts",
      description: "We draft LinkedIn, Reddit and Threads posts, so AI tools are more likely to mention you.",
      icon: MessageSquare,
      tint: "pink",
    },
    {
      label: "Credibility Signals",
      description: "We create reports that mention your business, increasing the chance AI references you.",
      icon: BookOpen,
      tint: "sky",
    },
    {
      label: "GitHub Fixes",
      description: "If your site is custom-built, we write down developer-friendly SEO improvement suggestions.",
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
    label: "Scans Your Site",
    target: "",
    status: "Understand your site",
  },
  {
    icon: Braces,
    tint: "pink",
    label: "Analyzes Competitors",
    target: "",
    status: "Find what works in your industry",
  },
  {
    icon: Link2,
    tint: "cyan",
    label: "Updates Your Website",
    target: "",
    status: "Changes Created For You",
  },
  {
    icon: FilePlus2,
    tint: "highlight",
    label: "Monitors the Results",
    target: "",
    status: "See Rynk work and keep improving",
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

      <p className="text-center mt-7 mb-4 font-serif text-5xl md:text-5xl leading-tight tracking-tight text-brand-text">Rynk</p>

      <section className="relative px-6 pt-6 pb-6 md:px-10 md:pb-6 lg:min-h-[700px]">
        <div className="pointer-events-none absolute inset-0 bg-grid-brand opacity-60" aria-hidden />

        <div className="relative mx-auto h-full max-w-screen-xl">
          <div className="flex h-full items-center overflow-hidden rounded-[32px] bg-white/[0.02] ring-1 ring-white/8 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_30px_80px_-40px_rgba(0,0,0,0.7)]">

            <div className="grid w-full gap-12 p-8 md:p-12 lg:grid-cols-2 lg:items-right lg:gap-10 lg:px-14 lg:py-10">

              {/* LEFT - copy + CTAs */}
              <div>

                <h1 className="font-serif text-5xl md:text-6xl font-medium leading-[0.98] tracking-tight animate-rise text-brand-text">
                  Want more sales?
                  <span className="block mt-2 italic text-brand-blueSoft">
                    Get more website visits.
                  </span>
                </h1>
                <p
                  className="mt-6 max-w-xl text-[15.5px] leading-[1.75] text-brand-textMute animate-rise"
                  style={{ animationDelay: "160ms" }}
                >
                  Rynk is the first AI-powered SEO platform that makes growing your website effortless. It studies your site, identifies exactly what's preventing you from ranking, generates the fixes, and deploys them directly to your website—no SEO expertise or manual optimization required.
                </p>

                <div
                  className="mt-20 flex w-full flex-col items-stretch gap-8 animate-rise"
                  style={{ animationDelay: "260ms" }}
                >
                  <div className="w-full">
                    <h2 className="w-full font-serif text-10xl md:text-10xl lg:text-[24px] font-medium leading-[1.02] tracking-tight text-brand-text">
                      Watch Rynk work
                      on <span className="italic text-brand-blueSoft">your site.</span>
                    </h2>
                    <p className="mt-2 w-full text-[15.5px] leading-[1.7] text-brand-textMute">
                      Enter your website URL and see what Rynk has to say.
                    </p>
                  </div>

                  <form
                    action="/sign-in"
                    className="group relative flex w-full items-center gap-2 rounded-full bg-white/[0.06] ring-1 ring-white/12 py-2 pl-6 pr-2 text-brand-text shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]"
                  >
                    <Sparkles className="h-4 w-4 text-brand-violetSoft" />
                    <input
                      type="text"
                      placeholder="www.yoursite.com"
                      aria-label="Your domain"
                      className="min-w-0 flex-1 bg-transparent font-serif text-[16px] text-brand-text placeholder:text-brand-textMute focus:outline-none"
                    />
                    <button
                      type="submit"
                      aria-label="Scan my site"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-brand-ink transition-all group-hover:scale-105"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
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
                <p className="mb-12 font-serif text-xl md:text-2xl leading-tight tracking-tight text-brand-text text-center">
                  Automated SEO, powered by <span>AI</span>.
                </p>

                {/* Criss-cross cascade - cards alternate left/right down the
                 column. Normal document flow (no absolute positioning), so
                 they can never hide each other at any viewport width. */}
                <div className="relative mx-auto flex w-full max-w-md flex-col gap-4">
                  {HERO_CARDS.map((card, i) => (
                    <div
                      key={card.label}
                      className={`w-[72%] sm:w-[68%] ${i % 2 === 1 ? "self-end" : "self-start"}`}
                    >
                      <ActionCard card={card} delay={`${i * 1.3}s`} />
                    </div>
                  ))}
                </div>

              </div>
            </div>
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
            className="mt-3 mb-7 overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            }}
          >
            <div className="flex w-max animate-marquee gap-0">
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

      {/* ═════ WHAT WE OFFER ═════ */}
      <section className="relative px-6 py-5 md:px-10 md:py-5">
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
              The full package.
            </p>
            <h2 className="mt-3.5 font-serif text-5xl md:text-6xl font-medium tracking-tight text-brand-text">
              What you <span className="italic text-brand-violetSoft">get.</span>
            </h2>
            <p className="mt-6 text-[15px] leading-[1.75] text-brand-textMute">
              Rynk does the work of an SEO Specialist and an entire Web Developer team, in minutes. <br></br>
              Every day, potential customers search Google, ChatGPT, and other AI search engines for businesses like yours. Rynk helps ensure your website is the one that Google and AI recommend to them.
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
            <div className="font-serif text-[18px] leading-tight text-brand-text truncate">
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