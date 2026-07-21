/**
 * Authenticated shell — rynk dashboard layout.
 *
 * NOT the standard left-sidebar SaaS pattern: a top bar with logo + global
 * nav (Stripe/Vercel style), and page content in a centered max-width main.
 * (The client-context bar for /clients/:domain is rendered by that route.)
 */
import { TopBar } from '@/components/top-bar';
import { AnimatedOutlet } from '@shared/components/common/animated-outlet';

export function PrivateRoute() {
  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-screen-2xl px-6 py-8">
        <AnimatedOutlet />
      </main>
    </div>
  );
}
