"use client";

/**
 * Public marketing header. Client component so we can:
 *   - highlight the current page (active link = plain white text, same
 *     tone as hover, no underline)
 *   - toggle the mobile menu on small screens
 */

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
] as const;

export function PublicHeader(): React.JSX.Element {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass = (href: string): string =>
    `font-serif text-[16px] transition-colors ${
      pathname === href ? "text-brand-text" : "text-brand-textMute hover:text-brand-text"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-brand-ink/70 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between pl-4 pr-4 md:pl-6 md:pr-8 lg:pl-8 lg:pr-12">
        {/* Logo - true left edge */}
        <Link href="/" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-violet shadow-[0_6px_16px_-6px_rgba(109,141,255,0.6)] transition-transform group-hover:scale-105">
            <LeafMark className="h-4 w-4 text-white" />
          </span>
          <span className="font-serif text-[19px] font-medium tracking-tight text-brand-text">
            rynk<span className="text-brand-violetSoft">.ai</span>
          </span>
        </Link>

        {/* Desktop nav - far right */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)}>
              {item.label}
            </Link>
          ))}
          {/* Dev shortcut until auth lands - direct door into the app */}
          <Link
            href="/app"
            className="font-serif text-[16px] text-brand-textMute transition-colors hover:text-brand-text"
          >
            Dashboard
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex h-10 items-center rounded-full bg-white px-5 font-serif text-[15px] font-medium text-brand-ink transition-all hover:shadow-[0_10px_28px_-10px_rgba(255,255,255,0.4)]"
          >
            Sign in
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-brand-text md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <nav className="flex flex-col gap-1 border-t border-white/5 bg-brand-ink/95 px-6 py-4 backdrop-blur-xl md:hidden">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`${linkClass(item.href)} rounded-lg px-3 py-3`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/app"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-3 font-serif text-[16px] text-brand-textMute transition-colors hover:text-brand-text"
          >
            Dashboard
          </Link>
          <Link
            href="/sign-in"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 font-serif text-[15px] font-medium text-brand-ink"
          >
            Sign in
          </Link>
        </nav>
      )}
    </header>
  );
}

function LeafMark({ className }: { className?: string }): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2c-1 4-4 6-6 7 0 5 2 8 6 8 2 0 3-1 4-2v6h2v-6l1-1c1-2 2-6 1-9 0-1-1-2-2-2-2 0-3 1-4 2-1-1-1-2-2-3z" />
    </svg>
  );
}
