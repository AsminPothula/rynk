/**
 * Tailwind config for the rynk.ai WordPress theme.
 *
 * The `theme` block is a copy of apps/dashboard/tailwind.config.ts from the
 * Next.js repo — same brand palette, same font-family variables, same radius
 * scale — so the compiled CSS is the same design system rather than an
 * approximation of it. Only `content` differs: it scans the theme's PHP
 * templates instead of src/**\/*.tsx.
 *
 * Every class string the templates use is a literal in a .php file (including
 * the tint maps in inc/tints.php), so the JIT scanner sees all of them and no
 * safelist is required.
 */
module.exports = {
  darkMode: ["class"],
  content: [
    "../**/*.php",
    "../assets/js/**/*.js",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Warm-neutral accent surfaces — use sparingly for visual rhythm
        cream: "hsl(var(--cream))",
        tan: "hsl(var(--tan))",
        "brown-soft": "hsl(var(--brown-soft))",
        // Status colors — used on badges + dots.
        status: {
          success: "hsl(var(--status-success))",
          pending: "hsl(var(--status-pending))",
          failed: "hsl(var(--status-failed))",
          skipped: "hsl(var(--status-skipped))",
        },
        // Channel colors — one per execution-manifest channel.
        channel: {
          cms: "hsl(var(--channel-cms))",
          image: "hsl(var(--channel-image))",
          outreach: "hsl(var(--channel-outreach))",
          social: "hsl(var(--channel-social))",
          "code-pr": "hsl(var(--channel-code-pr))",
          document: "hsl(var(--channel-document))",
          offsite: "hsl(var(--channel-offsite))",
        },
        // Brand palette - dark-first, muted blues + violets.
        // Every hue is desaturated so nothing screams. The highlight coral is
        // the only warm note and is used sparingly as a real marker.
        brand: {
          ink: "#141d3d", // page bg - lifted mid-navy (was near-black)
          ink2: "#1c264f", // elevated surface (nav, cards)
          surface: "#252f60", // card/tile surface, one step brighter
          surface2: "#2f3b74", // hover / accent surface
          hairline: "#3a4680", // 1px borders on dark surfaces
          blue: "#6d8dff", // primary - soft periwinkle blue
          blueSoft: "#8fa8ff", // hover / secondary
          sky: "#c9d5ff", // very light blue for orbs + accents
          violet: "#9c8cf0", // muted violet, not neon
          violetSoft: "#c4b8ff", // pale mauve for chips + tags
          // Contrasting accents used for action-card variety.
          emerald: "#34d399",
          emeraldSoft: "#6ee7b7",
          pink: "#f472b6",
          pinkSoft: "#f9a8d4",
          amber: "#fbbf24",
          amberSoft: "#fcd34d",
          cyan: "#22d3ee",
          cyanSoft: "#67e8f9",
          cream: "#f4ecd8", // warm off-white - light-mode wash
          text: "#eeeaf6", // main body text on dark
          textMute: "#a5adc8", // muted body text
          highlight: "#f7a072", // warm coral - marker/underline accent
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        // Geist and Fraunces are self-hosted in assets/fonts and expose these
        // variables from assets/css/fonts.css, mirroring how next/font exposed
        // them in the Next.js root layout.
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        // Fraunces - display serif for marketing headings.
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
