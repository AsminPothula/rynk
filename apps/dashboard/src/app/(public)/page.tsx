/**
 * Landing page — public-facing homepage.
 *
 * Tone: confident, data-forward, no fluff. Echoes Vercel's hero
 * structure (big claim → short subhead → CTA) with Stripe-style
 * generous spacing.
 */

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, BarChart3, FileText, Sparkles } from "lucide-react";

export default function LandingPage(): React.JSX.Element {
  return (
    <>
      {/* Hero */}
      <section className="bg-dotted relative">
        <div className="container py-24 sm:py-32 lg:py-40 text-center">
          <p className="mb-4 inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            AI-powered SEO, AEO &amp; GEO
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
            SEO, automated end to end.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            Rynk audits your site, plans the strategy, generates the content
            and metadata, and pushes it live. One pipeline, every change
            tracked.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3">
            <Link href="/app" className={buttonVariants({ size: "lg" })}>
              Open the dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/features" className={buttonVariants({ size: "lg", variant: "outline" })}>
              See features
            </Link>
          </div>
        </div>
      </section>

      {/* Three feature blocks */}
      <section className="border-t">
        <div className="container py-20 grid gap-12 md:grid-cols-3">
          <FeatureBlock
            icon={<BarChart3 className="h-5 w-5" />}
            title="Audit + Strategy"
            text="Every page crawled, every keyword scored. Rynk identifies what's broken and prioritises what to fix."
          />
          <FeatureBlock
            icon={<FileText className="h-5 w-5" />}
            title="Generate Everything"
            text="Pages, metadata, schema, redirects, outreach drafts, social posts, even hero images — produced as a single execution plan."
          />
          <FeatureBlock
            icon={<Sparkles className="h-5 w-5" />}
            title="Publish & Monitor"
            text="Rynk pushes the changes to your CMS automatically, then keeps watching how the SERP shifts."
          />
        </div>
      </section>
    </>
  );
}

function FeatureBlock({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}): React.JSX.Element {
  return (
    <div>
      <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-md border bg-card text-foreground">
        {icon}
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
