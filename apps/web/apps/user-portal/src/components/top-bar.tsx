/**
 * Global top bar — rynk dashboard chrome, navy vibe matching rynk.ai.
 * Logo + global nav on the left, avatar on the right. Active state from route.
 */
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const GLOBAL_NAV = [
  { href: '/dashboard', label: 'Clients', match: (p: string) => p === '/dashboard' || p.startsWith('/clients') },
  { href: '/integrations', label: 'Integrations', match: (p: string) => p.startsWith('/integrations') },
  { href: '/settings', label: 'Settings', match: (p: string) => p.startsWith('/settings') },
];

export function TopBar() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-brand-ink/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center">
            <img src="/rynklogo.png" alt="rynk.ai" className="h-9 w-auto" />
          </Link>
          <nav className="flex items-center gap-6">
            {GLOBAL_NAV.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'font-serif text-[15px] transition-colors',
                  item.match(pathname) ? 'text-brand-text' : 'text-brand-textMute hover:text-brand-text',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[12px] font-medium text-brand-text ring-1 ring-white/10">
          A
        </div>
      </div>
    </header>
  );
}
