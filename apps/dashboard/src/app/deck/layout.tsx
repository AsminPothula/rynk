/**
 * Deck layout - bare wrapper, no top nav or footer. Presentation mode.
 *
 * The deck route bypasses both the public-marketing layout and the app
 * (logged-in) layout. It just inherits the root layout (fonts + base
 * styles) so the slide viewport gets the full browser canvas.
 */

export default function DeckLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return <div className="min-h-screen bg-background text-foreground">{children}</div>;
}
