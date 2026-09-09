/**
 * Global top bar — rynk dashboard chrome, navy vibe matching rynk.ai.
 * Logo + global nav on the left, avatar (with sign-out menu) on the right.
 */
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuthStore } from 'shared';
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
            <img src="/rynklogo.png" alt="rynk.ai" className="h-12 w-auto" />
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

        <AccountMenu />
      </div>
    </header>
  );
}

function AccountMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const logout = useAuthStore((s) => s.logout);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  function signOut() {
    setOpen(false);
    // Clearing tokens flips the router's isAuthenticated → redirects to sign-in.
    logout();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[12px] font-medium text-brand-text ring-1 ring-white/10 transition-colors hover:bg-white/15"
      >
        A
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-44 overflow-hidden rounded-xl border border-white/10 bg-brand-ink/95 py-1 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] text-brand-text transition-colors hover:bg-white/5"
          >
            <LogOut className="h-4 w-4 text-brand-textMute" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
