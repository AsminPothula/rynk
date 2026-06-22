/**
 * /features — public features page.
 *
 * Groups rynk's capabilities into three pillars (Analyze / Generate /
 * Publish) so the boss / prospective clients can scan what the product
 * actually does. Pairs with /how-it-works which explains the layers.
 */

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const PILLARS = [
  {
    n: "01",
    name: "Analyze",
    accent: "bg-channel-image",
    summary:
      "Crawl, score, and benchmark — rynk understands the site as deeply as a human auditor.",
    items: [
      {
        title: "Full-site crawl",
        body: "Renders every page with a real browser (Crawl4AI), captures titles, metadata, schema, H1s, body, internal links.",
      },
      {
        title: "Performance scoring",
        body: "PageSpeed Insights per template — TBT, LCP, CLS, render-blocking resources, image weight.",
      },
      {
        title: "SERP + AI Overview",
        body: "SerpAPI on every seed keyword: top-ranking URLs, People-Also-Ask, AI Overview citations, featured snippets.",
      },
      {
        title: "Keyword + DA metrics",
        body: "Volume, difficulty, CPC for every keyword. Domain Authority for client and competitors. Swappable provider (mock / Semrush / Ahrefs / DataForSEO).",
      },
      {
        title: "Onsite & offsite EEAT",
        body: "Policy pages, author bylines, NAP consistency, certifications, third-party profiles (G2, Crunchbase, Clutch).",
      },
      {
        title: "Cannibalization detection",
        body: "URL clusters competing for the same keyword, with a canonical recommendation per cluster.",
      },
    ],
  },
  {
    n: "02",
    name: "Generate",
    accent: "bg-channel-social",
    summary:
      "Eleven generators produce every change rynk plans — typed, validated, traceable.",
    items: [
      {
        title: "CMS work",
        body: "Meta rewrites, schema injection, 301 redirects, internal links, NAP blocks — all produced as structured actions ready for the CMS adapter.",
      },
      {
        title: "Full pages",
        body: "Pillar + spoke pages with titles, meta descriptions, outline, optional LLM-written body (opt-in). Each linked to its schema and image actions.",
      },
      {
        title: "Images",
        body: "Hero, inline diagrams, social card thumbnails — prompt + dimensions + alt text, generated at publish time via the configured image provider.",
      },
      {
        title: "Outreach drafts",
        body: "Guest pitches, press, backlink requests — full subject and body, staggered send dates, ready for the SEO team to personalize.",
      },
      {
        title: "Brand posts",
        body: "LinkedIn thought-leadership, Reddit discussions, Threads short takes — drafted with the brand's voice and a clear rationale per post.",
      },
      {
        title: "Documents & PRs",
        body: "Whitepapers + sales decks for distribution. GitHub PR drafts for code-level fixes (when client has a repo).",
      },
    ],
  },
  {
    n: "03",
    name: "Publish",
    accent: "bg-channel-code-pr",
    summary:
      "Layer 4 dispatches every action to the right service — WordPress, GitHub, image gen, document renderer.",
    items: [
      {
        title: "WordPress adapter",
        body: "Pushes meta, schema, redirects, pages, authors via the WP REST API. Detects which SEO plugin (Yoast / RankMath / SEOPress) is installed.",
      },
      {
        title: "Image pipeline",
        body: "Generates each create_image action via DALL-E / Flux / Imagen (or mock). Returns URLs the CMS adapter attaches to the right post.",
      },
      {
        title: "Document rendering",
        body: "Markdown → PDF / PPTX via Pandoc. Distributes to SlideShare, Scribd, Issuu.",
      },
      {
        title: "GitHub PRs",
        body: "Opens draft pull requests for code-level fixes — proper branch naming, full description, test plan.",
      },
      {
        title: "Approval gating",
        body: "Every action carries a risk score and an automatable flag. Humans approve riskier actions before they fire.",
      },
      {
        title: "Status tracking",
        body: "Every action records its lifecycle: pending → approved → applied → done. Failed actions retry-able without re-planning.",
      },
    ],
  },
];

export default function FeaturesPage(): React.JSX.Element {
  return (
    <>
      <section className="border-b border-border/60">
        <div className="container py-20 lg:py-24">
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            Features
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl sm:text-5xl font-medium tracking-tighter leading-[1.05]">
            Built around three jobs.
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground leading-relaxed">
            Rynk analyzes what's there, generates every change it would
            make, and publishes the result. Each capability below is a
            real piece of the pipeline running today.
          </p>
        </div>
      </section>

      {PILLARS.map((pillar) => (
        <section key={pillar.n} className="border-b border-border/60">
          <div className="container py-16 lg:py-20">
            <div className="flex items-center gap-4 mb-10">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background">
                <span className={`absolute inset-0 -z-10 rounded-md ${pillar.accent} opacity-10`} />
                <span className="font-mono text-xs">{pillar.n}</span>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Pillar {pillar.n}
                </p>
                <h2 className="text-2xl font-medium tracking-tight">{pillar.name}</h2>
              </div>
            </div>

            <p className="max-w-2xl text-base text-muted-foreground leading-relaxed mb-10">
              {pillar.summary}
            </p>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {pillar.items.map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border border-border/60 bg-card p-5"
                >
                  <h3 className="text-base font-medium">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="bg-muted/20">
        <div className="container py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-medium tracking-tight">Want the deep tour?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              The how-it-works page walks each layer end to end with real itechdata numbers.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/how-it-works"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              How it works
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/app"
              className="inline-flex h-10 items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
            >
              Open the dashboard
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
