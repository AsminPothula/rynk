/**
 * App layout — logged-in client view.
 *
 * Today there's no auth — every visitor sees this. When auth lands,
 * this layout becomes the protected boundary.
 */

import Link from "next/link";
import { Home, FileSearch, Compass, ListChecks, FileText, Activity, Send, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/app", label: "Overview", icon: Home },
  { href: "/app/audit", label: "Audit", icon: FileSearch },
  { href: "/app/strategy", label: "Strategy", icon: Compass },
  { href: "/app/execution", label: "Execution", icon: ListChecks },
  { href: "/app/content", label: "Content", icon: FileText },
  { href: "/app/monitor", label: "Monitor", icon: Activity },
  { href: "/app/offsite", label: "Offsite", icon: Send },
  { href: "/app/settings", label: "Settings", icon: Settings },
] as const;

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r bg-muted/30">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="text-base font-semibold tracking-tight">
            rynk
          </Link>
        </div>
        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1">
        <div className="container max-w-6xl py-8">{children}</div>
      </main>
    </div>
  );
}
