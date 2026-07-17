/**
 * Public layout - marketing pages.
 *
 * Palette: dark ink base with muted blue + violet accents. Ambient
 * gradient washes behind everything to keep the dark bg from feeling flat.
 *
 * Header is split into a small client component so we can highlight the
 * active nav link. Footer has a subtle darker overlay + stronger top
 * hairline to separate it from the page body.
 */

import { PublicHeader } from "./_components/PublicHeader";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="relative flex min-h-screen flex-col bg-brand-ink text-brand-text">
      {/* Ambient gradient wash - keeps the lifted bg from feeling flat */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 1200px 800px at 10% -8%, rgba(156, 140, 240, 0.22), transparent 60%), radial-gradient(ellipse 1200px 800px at 90% -5%, rgba(109, 141, 255, 0.22), transparent 60%), radial-gradient(ellipse 900px 600px at 50% 45%, rgba(52, 211, 153, 0.06), transparent 70%), radial-gradient(ellipse 1000px 700px at 50% 110%, rgba(244, 114, 182, 0.10), transparent 70%)",
        }}
      />

      <PublicHeader />

      <main className="flex-1">{children}</main>

      {/* Footer - darker translucent overlay + stronger top hairline for
          visual separation from the page body. Content is a copyright
          strip for now; expand to real 3-col footer content later. */}
      <footer className="relative mt-14 border-t border-white/10 bg-black/15 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-6 text-xs text-brand-textMute">
          <span>© rynk.ai 2026</span>
          <span className="font-mono tracking-widest">SEO . AEO . GEO</span>
        </div>
      </footer>
    </div>
  );
}
