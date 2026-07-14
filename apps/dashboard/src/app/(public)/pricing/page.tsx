/**
 * /pricing — three tiers.
 *
 * Three columns, middle one highlighted as the recommended tier. Each
 * column shows: tier name, monthly price, target audience, feature list
 * with checkmarks, primary CTA. Footer note about API costs (Semrush /
 * Ahrefs / etc) being separate.
 */

import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    name: "Lite",
    price: "$99",
    cadence: "/ mo",
    target: "Solo operators & small agencies running 1–3 client sites",
    features: [
      "Up to 3 clients",
      "Monthly pipeline runs (audit + strategy + manifest)",
      "WordPress publishing",
      "Mock keyword data (real data via add-on)",
      "Outreach + brand-post drafts",
      "Email support",
    ],
    cta: "Start with Lite",
    accent: false,
  },
  {
    name: "Pro",
    price: "$399",
    cadence: "/ mo",
    target: "Boutique agencies + in-house SEO teams running 5–15 sites",
    features: [
      "Up to 15 clients",
      "Weekly pipeline runs + SERP monitoring",
      "WordPress + Webflow + Shopify adapters",
      "Real keyword data (BYO Semrush or use ours)",
      "Image generation (DALL-E / Flux)",
      "GitHub PR integration",
      "Approval queue + activity log",
      "Priority email + Slack support",
    ],
    cta: "Start with Pro",
    accent: true,
    badge: "Most teams pick this",
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    target: "Larger agencies, in-house teams managing 20+ properties",
    features: [
      "Unlimited clients",
      "Daily pipeline runs",
      "All CMS adapters + custom integrations",
      "BYO Semrush / Ahrefs / DataForSEO",
      "Dedicated review workflow + roles",
      "SSO + SCIM",
      "SLA + dedicated support",
      "Onboarding & training",
    ],
    cta: "Talk to sales",
    accent: false,
  },
];

export default function PricingPage(): React.JSX.Element {
  return (
    <>
      <section className="border-b border-border/60">
        <div className="container py-20 lg:py-24 text-center">
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            Pricing
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-medium tracking-tighter leading-[1.05]">
            Simple, per-team pricing.
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-base text-muted-foreground leading-relaxed">
            Pick the tier that fits how many sites you run. API costs for
            keyword data and image generation are pass-through — bring your
            own keys or use ours.
          </p>
        </div>
      </section>

      <section>
        <div className="container py-16 lg:py-20">
          <div className="grid gap-4 lg:grid-cols-3">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={cn(
                  "relative rounded-lg border bg-card p-6 flex flex-col",
                  tier.accent ? "border-foreground/40 shadow-sm" : "border-border/60",
                )}
              >
                {tier.badge && (
                  <span className="absolute -top-3 left-6 rounded-full bg-foreground text-background px-2.5 py-0.5 text-[10px] font-medium">
                    {tier.badge}
                  </span>
                )}
                <div>
                  <h3 className="text-lg font-medium">{tier.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="font-mono text-4xl font-medium tracking-tight">{tier.price}</span>
                    <span className="font-mono text-sm text-muted-foreground">{tier.cadence}</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {tier.target}
                  </p>
                </div>

                <ul className="mt-6 space-y-2.5 flex-1">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground/70" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.name === "Enterprise" ? "/contact" : "/signup"}
                  className={cn(
                    "mt-8 inline-flex h-10 items-center justify-center rounded-md px-5 text-sm font-medium transition-opacity",
                    tier.accent
                      ? "bg-foreground text-background hover:opacity-90"
                      : "border border-border bg-background text-foreground hover:bg-muted/50",
                  )}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Footnote on API costs */}
          <div className="mt-12 rounded-lg border border-border/60 bg-muted/20 p-6">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              API pass-through
            </p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-3xl">
              Keyword data (Semrush / Ahrefs / DataForSEO), image generation
              (DALL-E / Flux), and SERP queries (SerpAPI) are billed
              separately. You can connect your own provider accounts on Pro
              and above — we never markup. On Lite, costs are bundled into a
              monthly allowance.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
