import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '../../packages/shared/src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      minHeight: {
        '536': '33.5rem',
        '460': '28.75rem',
      },
      width: {
        '322': '20.125rem',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        'template-card': {
          DEFAULT: 'hsl(var(--template-card))',
          foreground: 'hsl(var(--template-card-foreground))',
          'head-bg': 'hsl(var(--template-card-head-bg))',
          'head-fg': 'hsl(var(--template-card-head-fg))',
          'price-fg': 'hsl(var(--template-card-price-fg))',
        },
        example: {
          DEFAULT: 'rgb(var(--example))',
          foreground: 'rgb(var(--example-foreground))',
        },
        // rynk warm-neutral accents
        cream: 'hsl(var(--cream))',
        tan: 'hsl(var(--tan))',
        'brown-soft': 'hsl(var(--brown-soft))',
        // rynk status colors — badges + dots
        status: {
          success: 'hsl(var(--status-success))',
          pending: 'hsl(var(--status-pending))',
          failed: 'hsl(var(--status-failed))',
          skipped: 'hsl(var(--status-skipped))',
        },
        // rynk channel colors — one per execution-manifest channel
        channel: {
          cms: 'hsl(var(--channel-cms))',
          image: 'hsl(var(--channel-image))',
          outreach: 'hsl(var(--channel-outreach))',
          social: 'hsl(var(--channel-social))',
          'code-pr': 'hsl(var(--channel-code-pr))',
          document: 'hsl(var(--channel-document))',
          offsite: 'hsl(var(--channel-offsite))',
        },
        // rynk brand palette — dark-first navy + violet (ported from apps/dashboard)
        brand: {
          ink: '#141d3d',
          ink2: '#1c264f',
          surface: '#252f60',
          surface2: '#2f3b74',
          hairline: '#3a4680',
          blue: '#6d8dff',
          blueSoft: '#8fa8ff',
          sky: '#c9d5ff',
          violet: '#9c8cf0',
          violetSoft: '#c4b8ff',
          emerald: '#34d399',
          emeraldSoft: '#6ee7b7',
          pink: '#f472b6',
          pinkSoft: '#f9a8d4',
          amber: '#fbbf24',
          amberSoft: '#fcd34d',
          cyan: '#22d3ee',
          cyanSoft: '#67e8f9',
          cream: '#f4ecd8',
          text: '#eeeaf6',
          textMute: '#a5adc8',
          highlight: '#f7a072',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [animate],
} satisfies Config;
