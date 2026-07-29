# rynk.ai — WordPress theme

The four public marketing pages from the Next.js dashboard app
(`apps/dashboard/src/app/(public)/`), ported to a classic WordPress theme.

| Page         | Next.js source            | Theme template                        | URL             |
| ------------ | ------------------------- | ------------------------------------- | --------------- |
| Landing      | `page.tsx`                | `front-page.php`                      | `/`             |
| How it works | `how-it-works/page.tsx`   | `page-templates/how-it-works.php`     | `/how-it-works/`|
| Pricing      | `pricing/page.tsx`        | `page-templates/pricing.php`          | `/pricing/`     |
| About        | `about/page.tsx`          | `page-templates/about.php`            | `/about/`       |

`(public)/layout.tsx` and `_components/PublicHeader.tsx` became `header.php` +
`footer.php`.

## Layout

```
style.css                 theme header only — real CSS is the Tailwind build
functions.php             asset enqueue, nav helpers, page scaffolding
header.php / footer.php   the shared chrome (ink wrapper, nav, footer)
front-page.php            landing page
page-templates/           the three assignable page templates
index.php                 fallback / 404
inc/icons.php             inline Lucide SVGs (replaces lucide-react)
inc/tints.php             the CARD_STYLES / TINT_STYLES / TIER_STYLES maps
inc/content.php           all page copy, as PHP arrays
inc/components.php        ActionCard / OfferingTile / OutcomeCard
assets/css/theme.css      compiled Tailwind — do not edit by hand
assets/css/fonts.css      self-hosted @font-face rules
assets/fonts/             Fraunces, Geist, Geist Mono (woff2, 458 KB)
assets/img/               founder photos
assets/js/nav.js          mobile menu toggle
build/                    Tailwind sources (see below)
```

## Rebuilding the CSS

`assets/css/theme.css` is generated. Editing it directly will be overwritten.

```sh
cd build
npm install
npm run build     # or: npm run dev  (watch mode)
```

`build/tailwind.config.js` is a copy of the app's
`apps/dashboard/tailwind.config.ts` theme block, and `build/input.css` is a copy
of `apps/dashboard/src/app/globals.css`. Keeping them as copies means the theme
compiles the same design system as the app rather than an approximation. If the
palette changes in the app, copy both files across and re-run the build.

Every class string lives in a `.php` file as a literal (including the tint maps
in `inc/tints.php`), so Tailwind's scanner finds them all and no safelist is
needed.

### The one deliberate addition

`build/input.css` adds a rule that is not in the app's `globals.css`:

```css
[hidden] { display: none !important; }
```

React unmounted the mobile menu when closed. This theme ships the panel in the
markup with the `hidden` attribute and toggles it in JS, which keeps it present
for assistive tech. But the panel is a `flex` container, and `.flex` is an
*author* style — it outranks the browser's `[hidden] { display: none }`
regardless of specificity. Without this rule the mobile menu renders open before
`nav.js` runs.

## Known issues carried over from the source

These are pre-existing in the Next.js app and were left as-is so the two stay
in sync. Each was verified to compile identically in both projects.

**Opacity values outside Tailwind's scale generate no CSS.** Tailwind's default
opacity scale moves in steps of 5, so these silently do nothing in both
codebases:

| Class                 | Where                                     | Actual result |
| --------------------- | ----------------------------------------- | ------------- |
| `ring-white/8`        | hero panel, CTA panels (all four pages)   | ring falls back to Tailwind's default ring color (blue-500/50) |
| `ring-white/12`       | both domain-input forms                   | same |
| `border-white/8`      | action-card footer, pricing feature divider | border falls back to `--border` (warm tan) |
| `bg-white/8`          | trust-bar hairline                        | no background |
| `bg-brand-blue/14`, `bg-brand-violet/18`, `bg-brand-pink/12`, `bg-brand-emerald/18`, `bg-brand-emerald/22`, `bg-brand-highlight/22`, `bg-brand-pink/22`, `bg-brand-amber/22`, `bg-brand-violet/22` | ambient glow blobs | those specific blobs don't render |

Rounding each to the nearest 5 (`/10`, `/20`…) or using bracket syntax
(`ring-white/[0.08]`) fixes them — but that is a visual design change, so it
belongs in the app first.

**Other source oddities:**

- `text-10xl` / `md:text-10xl` (landing, "Watch Rynk work" heading) — the
  fontSize scale stops at `9xl`, so only the `lg:text-[24px]` on that element
  takes effect.
- `lg:items-right` (landing hero grid) — not a Tailwind utility; `align-items`
  has no `right` value.
- The how-it-works hero eyebrow `<p>` is empty in the source. Kept, because
  removing it changes the vertical rhythm.
- Pricing free-scan copy reads "Rynk's will find out…" — left verbatim; it is
  copy, not markup.

**Three source typos were dropped** rather than reproduced, because they would
have shipped as visible text. All three are on how-it-works:

1. A stray `a` opening the hero paragraph.
2. The bottom-CTA heading read "Watch Rynk work on your site. your site." — now
   matches the identical CTA on the pricing page.
3. A stray `.` on its own line after "…see what Rynk has to say."

## Links that don't resolve yet

The header's **Sign in** / **Dashboard** links, both domain-input form actions,
and the pricing **Get my site built** button point at `/sign-in`, `/app` and
`/contact`. Those routes exist in the Next.js app but not as WordPress pages, so
they 404 here. The hrefs were kept so they light up automatically once those
pages exist.
