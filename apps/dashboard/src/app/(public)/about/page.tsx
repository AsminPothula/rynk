/**
 * /about — simple narrative page about the product.
 *
 * No team headshots yet (business interns will deliver). Stays focused
 * on the "why" — what rynk exists to do and the design principles
 * behind it.
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const PRINCIPLES = [
  {
    title: "Automate the work, not the judgment",
    body:
      "Rynk drafts, generates, and queues — but humans always approve before live publishing. The point isn't to remove the SEO team, it's to make them 10× faster.",
  },
  {
    title: "Every change is traceable",
    body:
      "Each action carries a provenance record back to the audit issue or content brief that produced it. Nothing is mysterious; everything is auditable.",
  },
  {
    title: "Swap any provider, anytime",
    body:
      "Keyword data, image generation, CMS integration — every external service is behind an interface. Change vendors without rewriting the product.",
  },
  {
    title: "One pipeline per client",
    body:
      "Same code, same flow, whether the site is a 1-page greenfield or a 500-page established brand. The pipeline adapts; we don't fork it.",
  },
];

export default function AboutPage(): React.JSX.Element {
  return (
    <>
      <section className="border-b border-border/60">
        <div className="container py-20 lg:py-24 max-w-3xl">
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            About
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl font-medium tracking-tighter leading-[1.05]">
            SEO done by software, with humans where it matters.
          </h1>
          <div className="mt-8 space-y-5 text-base text-muted-foreground leading-relaxed">
            <p>
              Rynk started from a simple observation: SEO teams spend most
              of their time on mechanical work — auditing pages, writing
              meta descriptions, drafting outreach emails, restructuring
              URLs. The judgment calls are small. The execution is huge.
            </p>
            <p>
              That ratio is backwards. Mechanical work belongs to software.
              Judgment belongs to humans. Rynk is built to enforce that
              split — five layers of pipeline that handle every repeatable
              decision, with the human reviewing the outputs at exactly
              the right checkpoints.
            </p>
            <p>
              The result is the same SEO outcome, with 10× the throughput
              and a paper trail for every change. No more "what did we do
              for this client last quarter?" — it's all in the manifest.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="container py-16 lg:py-20 max-w-4xl">
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            Principles
          </p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight">How we built it</h2>

          <div className="mt-10 grid gap-3 md:grid-cols-2">
            {PRINCIPLES.map((p, i) => (
              <div key={p.title} className="rounded-lg border border-border/60 bg-card p-6">
                <span className="font-mono text-[10px] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-base font-medium">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-muted/20">
        <div className="container py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-medium tracking-tight">See it running.</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              The dashboard renders live output for our test client.
            </p>
          </div>
          <Link
            href="/app"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Open dashboard
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </>
  );
}
