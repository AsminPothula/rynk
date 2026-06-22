/**
 * Public layout — landing, about, team, features, contact, login, signup.
 * Header is minimal, no sidebar.
 */

import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="text-base font-semibold tracking-tight">
            rynk
          </Link>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/features" className="hover:text-foreground">Features</Link>
            <Link href="/about" className="hover:text-foreground">About</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
            <Link
              href="/app"
              className="ml-2 rounded-md bg-primary px-3 py-1.5 text-primary-foreground hover:bg-primary/90"
            >
              Dashboard →
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t">
        <div className="container flex h-14 items-center justify-between text-xs text-muted-foreground">
          <span>© rynk 2026</span>
          <span>AI-powered SEO</span>
        </div>
      </footer>
    </div>
  );
}
