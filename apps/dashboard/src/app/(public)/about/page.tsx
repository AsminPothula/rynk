/**
 * /about - Why We Started Rynk + Meet the Founders.
 * Content from the design team.
 *
 * Same layout grid as the rest of the marketing site:
 *   - sections: px-6 md:px-10, py-14 md:py-16
 *   - content: mx-auto max-w-screen-xl
 *
 * Founder photos are placeholders until headshots / LinkedIn images
 * are delivered.
 */
import Image from "next/image";
import rk from "./rk.png";
import ak from "./ak-1.png";

import Link from "next/link";
import { ArrowRight, User } from "lucide-react";

const FOUNDERS = [
  {

    name: "Rishik Khandavalli",
    role: "Co-Founder",
    bio: "Rishik Khandavalli is a student at Greenhill School (Class of 2027) and leader of a $340K+ student-managed investment portfolio. He focuses on equity research, sector analysis, and business analytics.",
    tint: "blue",
    image: rk,
  },
  {
    name: "Ashwika Khandavalli",
    role: "Co-Founder",
    bio: "Ashwika Khandavalli is driven by a passion for entrepreneurship and community impact. She leads product strategy and go-to-market at Rynk — covering competitive positioning, pricing, and client segmentation across the SEO and AI-visibility space.",
    tint: "pink",
    image: ak,
  },
] as const;

const FOUNDER_STYLES: Record<
  (typeof FOUNDERS)[number]["tint"],
  { ring: string; topBar: string; ambient: string; role: string }
> = {
  blue: {
    ring: "ring-brand-blue/40",
    topBar: "bg-gradient-to-r from-transparent via-brand-blue to-transparent",
    ambient: "bg-brand-blue/20",
    role: "text-brand-blueSoft",
  },
  pink: {
    ring: "ring-brand-pink/40",
    topBar: "bg-gradient-to-r from-transparent via-brand-pink to-transparent",
    ambient: "bg-brand-pink/20",
    role: "text-brand-pinkSoft",
  },
};

export default function AboutPage(): React.JSX.Element {
  return (
    <div className="relative text-brand-text overflow-x-hidden">
      {/* ═════ WHY WE STARTED RYNK ═════ */}
      <section className="relative px-6 py-14 md:px-10 md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-grid-brand opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-screen-xl">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft animate-rise">
              About
            </p>
            <h1
              className="mt-4 font-serif text-5xl md:text-6xl font-medium leading-[1.05] tracking-tight animate-rise"
              style={{ animationDelay: "60ms" }}
            >
              Why we started <span className="italic text-brand-blueSoft">Rynk.</span>
            </h1>
            <div
              className="mt-8 space-y-5 text-[16px] leading-[1.8] text-brand-textMute animate-rise"
              style={{ animationDelay: "160ms" }}
            >


              <p>
                Rynk began because of one problem: small and medium-sized
                businesses weren&apos;t visible online - not because they lacked
                quality products, but because they lacked quality online
                presence. Small restaurants, local businesses, and talented
                creators all have valuable products, but nobody could find them.
              </p>
              <p>
                We built Rynk to solve that: one platform that automates your
                visibility everywhere customers search, whether that&apos;s
                Google, AI platforms, maps, or local listings. The best product
                shouldn&apos;t lose to better marketing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═════ MEET THE FOUNDERS ═════ */}
      <section className="relative px-6 py-14 md:px-10 md:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 right-10 h-72 w-72 rounded-full bg-brand-violet/15 blur-3xl animate-float-slow"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-brand-pink/12 blur-3xl animate-float-slow"
          style={{ animationDelay: "4s" }}
        />

        <div className="relative mx-auto max-w-screen-xl">
          <div className="mb-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-emeraldSoft">
              The team
            </p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl font-medium tracking-tight">
              Meet the founders.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {FOUNDERS.map((f) => {
              const s = FOUNDER_STYLES[f.tint];
              return (
                <div
                  key={f.name}
                  className={`group relative overflow-hidden rounded-3xl bg-white/[0.03] ring-1 ${s.ring} p-7 md:p-8 transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className={`absolute inset-x-0 top-0 h-[2px] ${s.topBar}`} aria-hidden />
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute -top-14 -right-14 h-44 w-44 rounded-full ${s.ambient} blur-3xl opacity-70`}
                  />



                  <div className="relative">
                    {/* Photo placeholder - swap for a real headshot / LinkedIn
                        image when the founders deliver one */}
<div className="aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-white/10">
  <Image
    src={f.image}
    alt={f.name}
    className="h-full w-full object-cover"
    sizes="(max-width: 768px) 100vw, 50vw"
  />
</div>

                    <h3 className="mt-6 font-serif text-2xl font-medium leading-tight tracking-tight">
                      {f.name}
                    </h3>
                    <p className={`mt-1 font-mono text-[11px] uppercase tracking-[0.15em] ${s.role}`}>
                      {f.role}
                    </p>
                    <p className="mt-4 text-[14px] leading-relaxed text-brand-textMute">
                      {f.bio}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═════ BOTTOM CTA ═════ */}
      <section className="relative px-6 py-14 md:px-10 md:py-16">
        <div className="relative mx-auto max-w-screen-xl overflow-hidden rounded-[32px] bg-white/[0.02] px-8 py-12 md:px-14 md:py-14 ring-1 ring-white/8">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 right-24 h-72 w-72 rounded-full bg-brand-blue/15 blur-3xl animate-float-slow"
          />

          <div className="relative flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">
                See it <span className="italic text-brand-blueSoft">running.</span>
              </h3>
              <p className="mt-2 text-[15px] text-brand-textMute">
                Five-minute setup. Rynk starts shipping the first fixes within the day.
              </p>
            </div>
            <Link
              href="/sign-in"
              className="group inline-flex h-12 shrink-0 items-center gap-2.5 rounded-full bg-white px-7 font-serif text-[16px] font-medium text-brand-ink transition-all hover:shadow-[0_14px_36px_-14px_rgba(255,255,255,0.4)]"
            >
              Get started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
