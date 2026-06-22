/**
 * App layout — logged-in client view.
 *
 * Layout is intentionally NOT the standard left-sidebar SaaS pattern.
 * Instead:
 *   - Top bar with logo + global nav + avatar (Stripe / Plaid / Vercel pattern)
 *   - When inside a specific client, a client-context bar shows underneath
 *     the top bar with the client identity + sub-tabs. That bar is rendered
 *     by the [domain] segment's layout — not here.
 *
 * Why: standard left-sidebar is what every SaaS dashboard looks like,
 * including competitors we're trying to differentiate from. Top-bar
 * + contextual breadcrumb feels closer to Linear / Stripe Dashboard /
 * Plane and stands apart visually.
 */

import { TopBar } from "@/components/app/top-bar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-screen-2xl px-6 py-8">{children}</main>
    </div>
  );
}
