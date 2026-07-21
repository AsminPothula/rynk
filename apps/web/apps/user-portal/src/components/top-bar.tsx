/**
 * Global top bar — rynk dashboard chrome (ported from apps/dashboard).
 * Replaces the starter's left sidebar. Logo + global nav on the left,
 * ⌘K hint + avatar on the right. Active state from the current route.
 */
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const GLOBAL_NAV = [
  {
    href: '/dashboard',
    label: 'Clients',
    match: (p: string) => p === '/dashboard' || p.startsWith('/clients'),
  },
  {
    href: '/integrations',
    label: 'Integrations',
    match: (p: string) => p.startsWith('/integrations'),
  },
  {
    href: '/settings',
    label: 'Settings',
    match: (p: string) => p.startsWith('/settings'),
  },
];

export function TopBar() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-12 max-w-screen-2xl items-center justify-between px-6">
        {/* LEFT: logo + global nav */}
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="text-[15px] font-medium tracking-tight">
            rynk<span className="text-primary">.</span>
          </Link>
          <nav className="flex items-center gap-5">
            {GLOBAL_NAV.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'text-[13px] transition-colors',
                  item.match(pathname)
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* RIGHT: ⌘K hint + avatar */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-1.5 rounded-md border border-border/60 bg-muted/30 px-2 py-0.5 font-mono text-[10px] text-muted-foreground md:flex">
            <span>⌘</span>
            <span>K</span>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-[11px] font-medium text-background">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
