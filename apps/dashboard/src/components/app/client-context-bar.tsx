/**
 * Client context bar — sticky bar that shows under the top nav whenever
 * the user is inside a specific client.
 *
 * Layout:
 *   ◇ itechdata.ai  ·  iTech Data Service   |   overview  audit  strategy  execution  content  offsite  ⟶
 *
 * Sub-tabs use horizontal scroll on narrow screens so we never break.
 * Each tab knows its own active state via pathname matching.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface ClientContextBarProps {
  domain: string;
  legalEntity: string | null;
}

const SUB_NAV = [
  { slug: "", label: "Overview" },
  { slug: "audit", label: "Audit" },
  { slug: "strategy", label: "Strategy" },
  { slug: "execution", label: "Execution" },
  { slug: "content", label: "Content" },
  { slug: "offsite", label: "Offsite" },
  { slug: "monitor", label: "Monitor" },
];

export function ClientContextBar({ domain, legalEntity }: ClientContextBarProps): React.JSX.Element {
  const pathname = usePathname();

  return (
    <div className="sticky top-12 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-screen-2xl items-center gap-6 px-6 h-12">
        {/* Client identity */}
        <Link
          href={`/app/clients/${domain}`}
          className="flex items-center gap-2 shrink-0 group"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-status-success" />
          <span className="font-mono text-[13px] text-foreground">{domain}</span>
          {legalEntity && (
            <span className="hidden sm:inline text-[13px] text-muted-foreground">
              · {legalEntity}
            </span>
          )}
        </Link>

        <span className="h-4 w-px bg-border" />

        {/* Sub-tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {SUB_NAV.map((tab) => {
            const href = tab.slug
              ? `/app/clients/${domain}/${tab.slug}`
              : `/app/clients/${domain}`;
            const isActive =
              tab.slug === ""
                ? pathname === `/app/clients/${domain}`
                : pathname.startsWith(href);
            return (
              <Link
                key={tab.slug}
                href={href}
                className={cn(
                  "relative inline-flex h-12 items-center px-3 text-[13px] transition-colors whitespace-nowrap",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-px h-px bg-foreground" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
