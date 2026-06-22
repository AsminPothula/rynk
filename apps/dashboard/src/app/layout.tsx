/**
 * Root layout — the only layout EVERY page passes through.
 * Sets up fonts, global CSS, and the html shell.
 */

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "rynk", template: "%s — rynk" },
  description: "AI-powered SEO platform — audit, strategize, execute.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">{children}</body>
    </html>
  );
}
