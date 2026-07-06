/**
 * Public layout - marketing pages (landing, features, about, contact).
 *
 * Redesign uses the "brand" palette from the design team - navy/sky/cream
 * with orange + green accents. Serif display font (Fraunces) for the
 * wordmark and section headings.
 *
 * Nav layout: logo left, page links center-right, "Login" text link plus
 * a "Get started" pill on the right.
 */

import Link from "next/link";

const NAV_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
] as const;

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-brand-cream text-brand-navy">
      <header className="sticky top-0 z-50 bg-brand-cream/85 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-6 md:px-10 lg:px-14">
          {/* Logo - pinned to the far left */}
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy">
              <LeafMark className="h-4 w-4 text-brand-cream" />
            </span>
            <span className="font-serif text-[19px] font-medium tracking-tight">
              rynk.ai
            </span>
          </Link>

          {/* Nav links + auth - pinned to the far right */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-serif text-[17px] text-brand-navy/80 transition-colors hover:text-brand-navy"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="font-serif text-[17px] text-brand-navy/80 transition-colors hover:text-brand-navy"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-10 items-center rounded-full bg-brand-cream px-6 font-serif text-[15px] font-medium text-brand-navy ring-1 ring-brand-navy/25 transition-all hover:bg-white hover:ring-brand-navy/50 hover:shadow-[0_2px_10px_rgba(47,65,86,0.08)]"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-24 border-t border-brand-navy/10 bg-brand-cream">
        <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-6 text-xs text-brand-navy/60">
          <span>© rynk.ai 2026</span>
          <span className="font-mono">SEO . AEO . GEO</span>
        </div>
      </footer>
    </div>
  );
}

/** Simple leaf mark used inside the logo bubble. */
function LeafMark({ className }: { className?: string }): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2c-1 4-4 6-6 7 0 5 2 8 6 8 2 0 3-1 4-2v6h2v-6l1-1c1-2 2-6 1-9 0-1-1-2-2-2-2 0-3 1-4 2-1-1-1-2-2-3z" />
    </svg>
  );
}
