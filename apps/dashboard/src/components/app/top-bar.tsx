/**
 * Global top bar — replaces the left sidebar.
 *
 * Layout:
 *   [logo]   [Clients]   [Integrations]   [Settings] ......... [⌘K]  [avatar]
 *
 * Active state is computed against the current pathname so the right
 * top-nav item is highlighted as you move around.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const GLOBAL_NAV = [
  { href: "/app", label: "Clients", match: (p: string) => p === "/app" || p.startsWith("/app/clients") },
  { href: "/app/integrations", label: "Integrations", match: (p: string) => p.startsWith("/app/integrations") },
  { href: "/app/settings", label: "Settings", match: (p: string) => p.startsWith("/app/settings") },
];

export function TopBar(): React.JSX.Element {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-12 max-w-screen-2xl items-center justify-between px-6">
        {/* LEFT: logo + global nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-[15px] font-medium tracking-tight">
            rynk<span className="text-primary">.</span>
          </Link>
          <nav className="flex items-center gap-5">
            {GLOBAL_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-[13px] transition-colors",
                  item.match(pathname)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* RIGHT: ⌘K hint + avatar */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/30 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            <span>⌘</span>
            <span>K</span>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background text-[11px] font-medium">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
