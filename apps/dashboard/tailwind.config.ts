import type { Config } from "tailwindcss";

/**
 * rynk dashboard Tailwind config.
 *
 * Color philosophy (Vercel-clean + Stripe-accent):
 *   - Neutral whites, blacks, grays as the visual base
 *   - A single primary accent (Stripe blue today, swap easily later)
 *   - Status colors: green / amber / red / gray — used on badges only
 *   - Channel colors: one per execution-manifest channel (cms, image,
 *     outreach, social, code-pr, document, offsite). Used on chips +
 *     small visual indicators.
 *
 * Every color is exposed as a CSS variable so the entire palette can
 * be re-skinned once business interns deliver the brand colors.
 */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        // Geist comes from `geist/font/sans` + `geist/font/mono` in the root
        // layout. They expose --font-geist-sans and --font-geist-mono.
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
