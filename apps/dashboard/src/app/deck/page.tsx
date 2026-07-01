"use client";

/**
 * Rynk presentation deck - 8-tab interactive walkthrough mirroring the
 * 07/02 slide deck.
 *
 * Navigation:
 *   - Click any tab at the top to jump to that section
 *   - Enter / Right Arrow / Space -> advance one slide (within tab, then
 *     into the next tab automatically)
 *   - Left Arrow -> back one slide
 *   - Up / Down Arrow -> move within the current tab's sub-slides
 *   - Number keys 1-8 -> jump to that tab
 *
 * Visual style matches the rynk dashboard: Geist fonts, cream/warm-pastel
 * palette, same channel colors used for accents.
 */

import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Slide content definitions ──────────────────────────────────────────────

interface Slide {
  /** Optional smaller heading shown above the main slide title. */
  eyebrow?: string;
  /** Slide content - JSX. */
  content: React.ReactNode;
}

interface Tab {
  id: string;
  /** Two-digit number for the tab pill. */
  number: string;
  /** Short tab label. */
  label: string;
  /** Color accent on the tab indicator (matches dashboard channel palette). */
  accent: string;
  slides: Slide[];
}

const TABS: Tab[] = [
  {
    id: "problem",
    number: "01",
    label: "Problem Statement",
    accent: "bg-channel-document",
    slides: [
      { eyebrow: "Problem Statement", content: <SlideProblem /> },
      { eyebrow: "Who We Are", content: <SlideSeoAeoGeo /> },
    ],
  },
  {
    id: "competitors",
    number: "02",
    label: "Competitors",
    accent: "bg-channel-cms",
    slides: [
      { eyebrow: "Competitors", content: <SlideCompetitorTable /> },
      { eyebrow: "Customer Reviews", content: <SlideCompetitorReviews /> },
    ],
  },
  {
    id: "what-is-rynk",
    number: "03",
    label: "What is Rynk",
    accent: "bg-channel-image",
    slides: [{ eyebrow: "Who We Are", content: <SlideWhatIsRynk /> }],
  },
  {
    id: "how-rynk-solves",
    number: "04",
    label: "How Rynk Solves",
    accent: "bg-channel-social",
    slides: [{ eyebrow: "How Rynk Solves the Problem", content: <SlideHowRynkSolves /> }],
  },
  {
    id: "architecture",
    number: "05",
    label: "Architecture",
    accent: "bg-channel-code-pr",
    slides: [{ eyebrow: "Rynk Architecture", content: <SlideArchitecture /> }],
  },
  {
    id: "layers",
    number: "06",
    label: "Rynk's Layers",
    accent: "bg-channel-outreach",
    slides: [
      { eyebrow: "Onboarding & Layer 1 - Audit", content: <SlideLayer01 /> },
      { eyebrow: "Layer 2 - Strategy", content: <SlideLayer2 /> },
      { eyebrow: "Layer 3 - Generation", content: <SlideLayer3 /> },
      { eyebrow: "Layer 4 - Publish", content: <SlideLayer4 /> },
    ],
  },
  {
    id: "why-better",
    number: "07",
    label: "Why Rynk is Better",
    accent: "bg-channel-document",
    slides: [{ eyebrow: "Why Rynk is Better", content: <SlideWhyBetter /> }],
  },
  {
    id: "timeline",
    number: "08",
    label: "Timeline",
    accent: "bg-channel-cms",
    slides: [{ eyebrow: "Development Timeline", content: <SlideTimeline /> }],
  },
];

// ─── Main page (state + keyboard handler + tab bar + slide viewport) ────────

export default function DeckPage(): React.JSX.Element {
  const [tabIdx, setTabIdx] = React.useState(0);
  const [slideIdx, setSlideIdx] = React.useState(0);

  const tab = TABS[tabIdx]!;
  const slide = tab.slides[slideIdx]!;
  const totalSlidesAcrossDeck = TABS.reduce((sum, t) => sum + t.slides.length, 0);
  const flatPosition =
    TABS.slice(0, tabIdx).reduce((sum, t) => sum + t.slides.length, 0) + slideIdx + 1;

  // ── Navigation handlers ────────────────────────────────────────────────

  const goToTab = React.useCallback((nextTab: number) => {
    if (nextTab < 0 || nextTab >= TABS.length) return;
    setTabIdx(nextTab);
    setSlideIdx(0);
  }, []);

  const advance = React.useCallback(() => {
    if (slideIdx + 1 < tab.slides.length) {
      setSlideIdx((s) => s + 1);
    } else if (tabIdx + 1 < TABS.length) {
      setTabIdx((t) => t + 1);
      setSlideIdx(0);
    }
  }, [slideIdx, tab.slides.length, tabIdx]);

  const back = React.useCallback(() => {
    if (slideIdx > 0) {
      setSlideIdx((s) => s - 1);
    } else if (tabIdx > 0) {
      const prevTab = TABS[tabIdx - 1]!;
      setTabIdx((t) => t - 1);
      setSlideIdx(prevTab.slides.length - 1);
    }
  }, [slideIdx, tabIdx]);

  const slideUp = React.useCallback(() => {
    if (slideIdx > 0) setSlideIdx((s) => s - 1);
  }, [slideIdx]);

  const slideDown = React.useCallback(() => {
    if (slideIdx + 1 < tab.slides.length) setSlideIdx((s) => s + 1);
  }, [slideIdx, tab.slides.length]);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      switch (e.key) {
        case "Enter":
        case " ":
        case "ArrowRight":
          e.preventDefault();
          advance();
          break;
        case "ArrowLeft":
          e.preventDefault();
          back();
          break;
        case "ArrowUp":
          e.preventDefault();
          slideUp();
          break;
        case "ArrowDown":
          e.preventDefault();
          slideDown();
          break;
        default: {
          if (e.key >= "1" && e.key <= "8") {
            e.preventDefault();
            goToTab(parseInt(e.key, 10) - 1);
          }
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [advance, back, slideUp, slideDown, goToTab]);

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen flex-col">
      {/* Top bar */}
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-8 px-6 py-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[15px] font-medium tracking-tight">
              rynk<span className="text-primary">.</span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Deck . 07/02
            </span>
          </div>

          {/* Tab nav */}
          <nav className="flex flex-1 items-center gap-1 overflow-x-auto no-scrollbar">
            {TABS.map((t, i) => {
              const active = i === tabIdx;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => goToTab(i)}
                  className={cn(
                    "relative inline-flex h-9 items-center gap-2 px-2.5 text-[13px] transition-colors whitespace-nowrap",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-mono",
                      active
                        ? "bg-foreground text-background"
                        : "border border-border/60 text-muted-foreground",
                    )}
                  >
                    {t.number}
                  </span>
                  <span>{t.label}</span>
                  {active && (
                    <span className={cn("absolute inset-x-0 -bottom-px h-0.5", t.accent)} />
                  )}
                </button>
              );
            })}
          </nav>

          <span className="font-mono text-[10px] text-muted-foreground shrink-0">
            {flatPosition} / {totalSlidesAcrossDeck}
          </span>
        </div>
      </header>

      {/* Slide viewport */}
      <main className="relative flex-1 overflow-hidden">
        <div className="mx-auto flex h-full max-w-screen-2xl items-start gap-6 px-6 py-10">
          {/* Sub-slide nav (only when tab has more than one slide) */}
          {tab.slides.length > 1 && (
            <aside className="flex shrink-0 flex-col items-center gap-3 pt-12">
              <button
                type="button"
                onClick={slideUp}
                disabled={slideIdx === 0}
                aria-label="Previous sub-slide"
                className={cn(
                  "rounded-full border border-border/60 bg-background p-1.5 transition-colors",
                  slideIdx === 0
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-accent hover:text-foreground",
                )}
              >
                <ChevronUp />
              </button>
              <div className="flex flex-col items-center gap-1.5">
                {tab.slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSlideIdx(i)}
                    aria-label={`Go to sub-slide ${i + 1}`}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-colors",
                      i === slideIdx ? "bg-foreground" : "bg-muted-foreground/30",
                    )}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={slideDown}
                disabled={slideIdx === tab.slides.length - 1}
                aria-label="Next sub-slide"
                className={cn(
                  "rounded-full border border-border/60 bg-background p-1.5 transition-colors",
                  slideIdx === tab.slides.length - 1
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-accent hover:text-foreground",
                )}
              >
                <ChevronDown />
              </button>
            </aside>
          )}

          {/* The slide */}
          <section className="flex-1 overflow-y-auto pr-2">
            {slide.eyebrow && (
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                {slide.eyebrow}
              </p>
            )}
            {slide.content}
          </section>
        </div>
      </main>

      {/* Bottom hint bar */}
      <footer className="border-t border-border/60 bg-background/60 px-6 py-2">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between text-[11px] font-mono text-muted-foreground">
          <span>
            {tab.label} . slide {slideIdx + 1} of {tab.slides.length}
          </span>
          <span>
            <Kbd>Enter</Kbd> or <Kbd>→</Kbd> next . <Kbd>←</Kbd> back .{" "}
            <Kbd>↑</Kbd>/<Kbd>↓</Kbd> within tab . <Kbd>1-8</Kbd> jump
          </span>
        </div>
      </footer>
    </div>
  );
}

// ─── Reusable small bits ────────────────────────────────────────────────────

function Kbd({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <kbd className="rounded border border-border bg-card px-1.5 py-px font-mono text-[10px] text-foreground/80">
      {children}
    </kbd>
  );
}

function ChevronUp(): React.JSX.Element {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}
function ChevronDown(): React.JSX.Element {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function H1({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <h1 className="text-4xl font-medium tracking-tight">{children}</h1>;
}
function H2({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <h2 className="text-2xl font-medium tracking-tight">{children}</h2>;
}
function Body({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <p className="text-base leading-relaxed text-foreground/90">{children}</p>;
}
function MutedBody({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>;
}

function Card({ children, className }: { children: React.ReactNode; className?: string }): React.JSX.Element {
  return (
    <div className={cn("rounded-lg border border-border/60 bg-card p-6", className)}>
      {children}
    </div>
  );
}

// ─── Slide components ──────────────────────────────────────────────────────

function SlideProblem(): React.JSX.Element {
  return (
    <div className="space-y-8 max-w-5xl">
      <H1>SMBs are invisible online.</H1>
      <Body>
        Not because they lack quality, but because nobody has fixed the system. Valuable products go
        unnoticed because search algorithms are not optimized for small and medium businesses.
      </Body>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-channel-document/15 border-channel-document/20">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            Invisible online
          </p>
          <p className="text-lg font-medium leading-snug">
            SMBs lack a strong online presence even when their product is great.
          </p>
        </Card>
        <Card className="bg-channel-image/15 border-channel-image/20">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            Lost revenue
          </p>
          <p className="text-lg font-medium leading-snug">
            Customers go to competitors with stronger cyber visibility.
          </p>
        </Card>
        <Card className="bg-channel-social/15 border-channel-social/20">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            Misaligned algorithms
          </p>
          <p className="text-lg font-medium leading-snug">
            Search algorithms are not optimized for the way SMBs actually present themselves.
          </p>
        </Card>
      </div>
    </div>
  );
}

function SlideSeoAeoGeo(): React.JSX.Element {
  const items = [
    {
      tag: "SEO",
      title: "Search Engine Optimization",
      body: "Helps businesses rank higher on search engines like Google through content, keywords, and links.",
      accent: "bg-channel-cms/15 border-channel-cms/20",
    },
    {
      tag: "AEO",
      title: "Answer Engine Optimization",
      body: "Helps businesses appear in search-engine AI answers, such as Google's AI Overview.",
      accent: "bg-channel-image/15 border-channel-image/20",
    },
    {
      tag: "GEO",
      title: "Generative Engine Optimization",
      body: "Helps businesses appear in AI-generated answers from ChatGPT, Perplexity, and Claude.",
      accent: "bg-channel-document/15 border-channel-document/20",
    },
  ];
  return (
    <div className="space-y-8 max-w-6xl">
      <H1>SEO, AEO, GEO.</H1>
      <Body>
        Three distinct disciplines, one shared goal: be the answer wherever the customer is
        searching - human or AI.
      </Body>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((it) => (
          <Card key={it.tag} className={it.accent}>
            <p className="font-mono text-xs font-semibold text-foreground mb-2">{it.tag}</p>
            <p className="text-lg font-medium mb-3 leading-snug">{it.title}</p>
            <MutedBody>{it.body}</MutedBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SlideCompetitorTable(): React.JSX.Element {
  const rows: Array<{ cap: string; rynk: string; athena: string; profound: string; fomo: string; peec: string }> = [
    { cap: "Full-site audit", rynk: "Yes", athena: "Limited", profound: "No", fomo: "Limited", peec: "No" },
    { cap: "E-E-A-T analysis", rynk: "Yes", athena: "No", profound: "Limited", fomo: "Generic", peec: "No" },
    { cap: "Strategy roadmap", rynk: "Yes", athena: "Yes", profound: "No", fomo: "Yes", peec: "No" },
    { cap: "Content generation", rynk: "Yes", athena: "Partial", profound: "Add-on", fomo: "Yes", peec: "No" },
    { cap: "CMS publishing", rynk: "Yes", athena: "No", profound: "No", fomo: "Yes", peec: "No" },
    { cap: "Continuous monitoring", rynk: "Yes", athena: "Limited", profound: "Yes", fomo: "Limited", peec: "Yes" },
    { cap: "AI engines tracked", rynk: "8+", athena: "8", profound: "3", fomo: "4", peec: "3" },
    { cap: "Pricing", rynk: "TBD", athena: "$295/mo", profound: "$399/mo", fomo: "$495/mo", peec: "$245/mo" },
  ];
  return (
    <div className="space-y-6 max-w-6xl">
      <H1>Competitors.</H1>
      <Body>
        Most competitors stop at insights. Rynk goes all the way to publishing and continuous
        monitoring.
      </Body>
      <div className="rounded-lg border border-border/60 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream/60">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Capability</th>
              <th className="text-left px-4 py-3 font-medium text-primary">Rynk.AI</th>
              <th className="text-left px-4 py-3 font-medium">AthenaHQ</th>
              <th className="text-left px-4 py-3 font-medium">Profound</th>
              <th className="text-left px-4 py-3 font-medium">Fomo.ai</th>
              <th className="text-left px-4 py-3 font-medium">Peec AI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.map((r) => (
              <tr key={r.cap} className="hover:bg-cream/30">
                <td className="px-4 py-3 font-medium">{r.cap}</td>
                <td className="px-4 py-3 font-mono text-primary">{r.rynk}</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">{r.athena}</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">{r.profound}</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">{r.fomo}</td>
                <td className="px-4 py-3 font-mono text-muted-foreground">{r.peec}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SlideCompetitorReviews(): React.JSX.Element {
  return (
    <div className="space-y-8 max-w-6xl">
      <H1>Customer reviews.</H1>
      <Body>
        What customers are actually saying about our biggest competitors - and where the gaps are.
      </Body>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="font-mono text-xs font-semibold text-foreground mb-2">AthenaHQ</p>
          <MutedBody>
            "The prompt tracking gives visibility into how AI models discuss our category. The
            dashboard is genuinely intuitive; our marketing ops person picked it up in a day."
          </MutedBody>
        </Card>
        <Card>
          <p className="font-mono text-xs font-semibold text-foreground mb-2">Profound</p>
          <MutedBody>
            "The tool surfaces great recommendations, but acting on them depends entirely on your
            internal capacity. If your content team is stretched, the gap between insight and action
            can feel wide."
          </MutedBody>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-channel-outreach/10 border-channel-outreach/20">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-3">Pros</p>
          <ul className="space-y-2 text-sm">
            <li>Valuable insights</li>
            <li>Consistent brand voice</li>
            <li>Accurate data</li>
            <li>Easy-to-navigate dashboards</li>
          </ul>
        </Card>
        <Card className="bg-channel-document/10 border-channel-document/20">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-3">Cons</p>
          <ul className="space-y-2 text-sm">
            <li>State the problem with no solution</li>
            <li>No publishing or execution layer</li>
            <li>No full audit</li>
            <li>Expensive prices</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

function SlideWhatIsRynk(): React.JSX.Element {
  const points = [
    "Rynk is an automated growth system that makes your business visible wherever people search online.",
    "It covers SEO, AEO, and GEO so that your site shows up on every platform: human or AI.",
    "It uses offsite analysis to strengthen reviews, listings, citations, and other trust signals that help AI platforms confidently recommend your business.",
    "It automates publishing so you can focus on serving your clients and growing your company.",
  ];
  return (
    <div className="space-y-8 max-w-4xl">
      <H1>What Rynk is.</H1>
      <div className="space-y-4">
        {points.map((p, i) => (
          <div key={i} className="flex gap-4 items-start">
            <span className="font-mono text-xs text-muted-foreground pt-2 select-none">
              {String(i + 1).padStart(2, "0")}
            </span>
            <Body>{p}</Body>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideHowRynkSolves(): React.JSX.Element {
  const fills = [
    "Thoroughly reviews the site to find what helps and harms its ranking and visibility.",
    "Provides advice on how to fix those problems - and ships the fixes automatically.",
  ];
  const considers = [
    "Keeps facts consistent (pricing, features, about) everywhere on the web.",
    "Adds and maintains structured data such as FAQs, How-To, and Product schema.",
    "Beats competitors by replacing them with better answers.",
    "Suggests how to establish and build credibility off-site.",
  ];
  return (
    <div className="space-y-8 max-w-6xl">
      <H1>How Rynk solves the problem.</H1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-channel-cms/10 border-channel-cms/20">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-4">
            The gaps Rynk fills
          </p>
          <ol className="space-y-3">
            {fills.map((f, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-mono text-xs text-muted-foreground pt-1 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-relaxed">{f}</span>
              </li>
            ))}
          </ol>
        </Card>
        <Card className="bg-channel-image/10 border-channel-image/20">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-4">
            Other gaps Rynk considers
          </p>
          <ol className="space-y-3">
            {considers.map((c, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-mono text-xs text-muted-foreground pt-1 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-relaxed">{c}</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}

function SlideArchitecture(): React.JSX.Element {
  const layers = [
    { name: "Onboarding", desc: "Learns the client - identity, ICP, keywords, goals, competitors, team." },
    { name: "Layer 1 - Audit Agent", desc: "Crawls the site, researches competition, produces a full SEO audit." },
    { name: "Layer 2 - Strategy Agent", desc: "Turns the audit into a coherent SEO / AEO / GEO playbook." },
    { name: "Layer 3 - Generation Agent", desc: "Builds the individual pages and assets the strategy calls for." },
    { name: "Layer 4 - Publish Agent", desc: "Pushes the changes live across the CMS and supporting channels." },
    { name: "Layer 5 - Monitor Agent", desc: "Watches rankings, citations, and competitors continuously." },
  ];
  return (
    <div className="space-y-8 max-w-5xl">
      <H1>Rynk architecture.</H1>
      <Body>Each layer has a clear input and a clear output. The output of one is the input of the next.</Body>
      <div className="space-y-3">
        {layers.map((l, i) => (
          <div
            key={l.name}
            className="grid grid-cols-[100px_220px_1fr] gap-6 items-center rounded-lg border border-border/60 bg-card px-6 py-4"
          >
            <span className="font-mono text-2xl font-medium text-muted-foreground">
              {String(i).padStart(2, "0")}
            </span>
            <span className="text-base font-medium">{l.name}</span>
            <MutedBody>{l.desc}</MutedBody>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideLayer01(): React.JSX.Element {
  return (
    <div className="space-y-8 max-w-6xl">
      <H1>Onboarding & Layer 1 - Audit.</H1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-cream/60">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
            Onboarding Agent
          </p>
          <H2>Builds the client profile.</H2>
          <MutedBody>
            Scrapes the main pages of the client's site to understand what the company is about and
            writes a structured profile.
          </MutedBody>
          <div className="mt-5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
              Contents of a client profile
            </p>
            <ul className="space-y-1.5 text-sm">
              <li>Identity</li>
              <li>Ideal Customer Profile (ICP)</li>
              <li>Keywords</li>
              <li>Goals</li>
              <li>Competitors</li>
              <li>Team Composition</li>
            </ul>
          </div>
        </Card>
        <Card className="bg-channel-cms/10 border-channel-cms/20">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
            Layer 1 - Audit Agent
          </p>
          <H2>Produces the full SEO audit.</H2>
          <MutedBody>
            Crawls the site, researches the competition, and synthesizes everything into a single
            audit report.
          </MutedBody>
          <div className="mt-5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
              Three sub-agents
            </p>
            <ul className="space-y-1.5 text-sm">
              <li>
                <strong>Data Collection</strong> - AI-driven crawler that checks every URL on the
                site.
              </li>
              <li>
                <strong>Offsite Research</strong> - runs in parallel; researches sources outside the
                website.
              </li>
              <li>
                <strong>Synthesis</strong> - combines the client profile + sub-agent outputs into a
                full audit.
              </li>
            </ul>
          </div>
          <div className="mt-5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
              The audit report contains
            </p>
            <ul className="space-y-1.5 text-sm">
              <li>List of all potential issues</li>
              <li>Total amount of URLs</li>
              <li>Overall performance</li>
              <li>Outside reviews of the client + competition</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}

function SlideLayer2(): React.JSX.Element {
  return (
    <div className="space-y-8 max-w-6xl">
      <H1>Layer 2 - Strategy.</H1>
      <Body>
        The Strategy Agent creates a single report for both the client and Rynk, detailing the steps
        to fully optimize the website for SEO, AEO, and GEO.
      </Body>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
            Contents of the strategy report
          </p>
          <ul className="space-y-2 text-sm">
            <li>Cannibalization fix plan</li>
            <li>Authority and E-E-A-T roadmap</li>
            <li>Topic cluster map</li>
            <li>Gap report</li>
            <li>Content briefs</li>
          </ul>
          <div className="mt-5 pt-4 border-t border-border/60">
            <MutedBody>
              Integrates external tools such as SEMrush, Ahrefs, and Google Search Console for
              keyword analysis and optimization.
            </MutedBody>
          </div>
        </Card>
        <Card className="bg-channel-image/10 border-channel-image/20">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
            Each content brief includes
          </p>
          <ul className="space-y-2 text-sm">
            <li>Intent</li>
            <li>Format</li>
            <li>H1</li>
            <li>Word count</li>
            <li>Suggestions</li>
            <li>H2 main keywords</li>
            <li>Secondary keywords</li>
            <li>Competitors</li>
          </ul>
          <div className="mt-5 pt-4 border-t border-border/60">
            <MutedBody>
              Content briefs are the templates the Generation Agent uses to build the actual
              optimized web pages.
            </MutedBody>
          </div>
        </Card>
      </div>
    </div>
  );
}

function SlideLayer3(): React.JSX.Element {
  return (
    <div className="space-y-8 max-w-5xl">
      <H1>Layer 3 - Generation.</H1>
      <Body>
        Layer 3 is responsible for content generation. It builds the individual web pages to be
        SEO-, AEO-, and GEO-optimized.
      </Body>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-channel-cms/10 border-channel-cms/20">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            New pages
          </p>
          <p className="text-base font-medium">From content briefs, written end-to-end.</p>
        </Card>
        <Card className="bg-channel-image/10 border-channel-image/20">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            Page rewrites
          </p>
          <p className="text-base font-medium">Updated metas, schemas, internal links.</p>
        </Card>
        <Card className="bg-channel-document/10 border-channel-document/20">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            Supporting assets
          </p>
          <p className="text-base font-medium">Images, documents, social posts, outreach drafts.</p>
        </Card>
      </div>
      <MutedBody>
        Every output is typed and structured so Layer 4 can pick it up and publish it without
        guesswork.
      </MutedBody>
    </div>
  );
}

function SlideLayer4(): React.JSX.Element {
  return (
    <div className="space-y-8 max-w-5xl">
      <H1>Layer 4 - Publish.</H1>
      <Body>
        Layer 4 is the publishing layer. It takes the structured outputs from Layer 3 and pushes
        them to the live site and supporting channels.
      </Body>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
            On-site changes
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>Update meta tags + descriptions</li>
            <li>Inject JSON-LD schema</li>
            <li>Add new pages</li>
            <li>Set up redirects</li>
            <li>Add internal links</li>
          </ul>
        </Card>
        <Card>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
            Off-site distribution
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>Outreach email drafts</li>
            <li>Brand posts for LinkedIn, Reddit, Threads</li>
            <li>PDFs + slide decks for SlideShare and Scribd</li>
            <li>Code-level PRs for performance fixes</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

function SlideWhyBetter(): React.JSX.Element {
  const cards = [
    {
      headline: "Less than 5 min setup",
      body: "Connect your website, answer a few questions about your business, and Rynk handles everything from there. No SEO expertise required.",
    },
    {
      headline: "1 platform - end to end",
      body: "No juggling multiple tools, agencies, or reports. Everything you need is managed in one place.",
    },
    {
      headline: "Fully automated execution",
      body: "Rynk handles everything automatically while you focus on running your business - no manual work on your end.",
    },
    {
      headline: "You stay in control",
      body: "Your only input is a quick review and approval before content goes live. Simple, fast, and in your hands.",
    },
  ];
  return (
    <div className="space-y-8 max-w-6xl">
      <H1>Why Rynk is better.</H1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <Card key={c.headline} className="bg-cream/40">
            <p className="font-mono text-2xl text-muted-foreground mb-3">
              {String(i + 1).padStart(2, "0")}
            </p>
            <p className="text-lg font-medium leading-snug mb-3">{c.headline}</p>
            <MutedBody>{c.body}</MutedBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SlideTimeline(): React.JSX.Element {
  const milestones = [
    { date: "Jul 2", title: "Onboarding agent, Layers 1-3, business registration, and website complete." },
    { date: "Jul 17", title: "Layer 4 and Layer 5 complete." },
    { date: "Jul 28", title: "Testing." },
    { date: "Aug 8", title: "Apply to Rynk." },
    { date: "Aug 15", title: "Product live with two clients." },
  ];
  return (
    <div className="space-y-8 max-w-5xl">
      <H1>Timeline.</H1>
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-2">
        <span>H1 2026 - Development</span>
        <span>H2 2026 - Launch</span>
      </div>
      <ol className="space-y-4">
        {milestones.map((m, i) => (
          <li
            key={m.date}
            className="grid grid-cols-[80px_24px_1fr] gap-4 items-center"
          >
            <span className="font-mono text-sm text-muted-foreground">{m.date}</span>
            <span className="flex items-center justify-center">
              <span className="h-2.5 w-2.5 rounded-full bg-channel-cms" />
            </span>
            <Card className="py-4">
              <p className="text-base font-medium">{m.title}</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                Milestone {i + 1}
              </p>
            </Card>
          </li>
        ))}
      </ol>
    </div>
  );
}
