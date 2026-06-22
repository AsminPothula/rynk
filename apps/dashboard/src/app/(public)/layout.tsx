/**
 * Public layout — landing, features, about, contact.
 *
 * Nav split: page links on the LEFT (next to the logo), auth actions on
 * the RIGHT. Mirrors the patterns at vercel.com, stripe.com, linear.app.
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
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container flex h-14 items-center justify-between">
          {/* LEFT: logo + page links */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-[15px] font-medium tracking-tight">
              rynk<span className="text-primary">.</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* RIGHT: auth actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-8 items-center rounded-md bg-foreground px-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/60">
        <div className="container flex h-14 items-center justify-between text-xs text-muted-foreground">
          <span>© rynk 2026</span>
          <span className="font-mono">AI-powered SEO</span>
        </div>
      </footer>
    </div>
  );
}
