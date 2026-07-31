/**
 * Authenticated shell — rynk dashboard layout, navy vibe matching rynk.ai.
 *
 * Top bar with logo + global nav (no left sidebar), an ambient gradient wash,
 * and page content in a centered max-width main.
 */
import { Outlet } from 'react-router-dom';
import { TopBar } from '@/components/top-bar';

export function PrivateRoute() {
  return (
    <div className="relative min-h-screen bg-brand-ink text-brand-text">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 1200px 800px at 10% -8%, rgba(156,140,240,0.16), transparent 60%), radial-gradient(ellipse 1200px 800px at 90% -5%, rgba(109,141,255,0.16), transparent 60%)',
        }}
      />
      <TopBar />
      <main className="mx-auto max-w-screen-xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
