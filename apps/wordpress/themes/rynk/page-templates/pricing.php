<?php
/**
 * Template Name: Rynk Pricing
 *
 * /pricing - port of `(public)/pricing/page.tsx`.
 *
 * Two tiers + a one-time site-build offer + the free-scan CTA. Same layout
 * grid as the rest of the marketing site:
 *   - sections: px-6 md:px-10
 *   - content: mx-auto max-w-screen-xl
 *
 * @package rynk-ai
 */

get_header();

$tier_styles = rynk_tier_styles();
?>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://rynk.ai/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Pricing",
      "item": "https://rynk.ai/pricing/"
    }
  ]
}
</script>

<div class="relative text-brand-text overflow-x-hidden">
	<?php // HERO. ?>
	<section class="relative px-6 py-5 md:px-10 md:py-5">
		<div class="pointer-events-none absolute inset-0 bg-grid-brand opacity-50" aria-hidden="true"></div>
		<div class="relative mx-auto max-w-3xl text-center">
			<p class="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft animate-rise">
				Pricing
			</p>
			<h1
				class="mt-5 font-serif text-4xl md:text-5xl font-medium leading-[1.02] tracking-tight animate-rise"
				style="animation-delay: 60ms;"
			>
				Simple, <span class="italic text-brand-blueSoft">per-team</span> pricing.
			</h1>
			<p
				class="mt-4 mb-5 text-[16px] leading-[1.75] text-brand-textMute animate-rise"
				style="animation-delay: 160ms;"
			>
				One flat monthly price. Rynk audits your site, publishes new pages, and keeps your rankings moving, without you doing any of the work.
				Not sure where to start? Read about
				<a href="<?php echo esc_url( home_url( '/blog/why-isnt-my-business-showing-up-on-google/' ) ); ?>" class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors">why local businesses stay invisible on Google</a>
				and what Rynk does about it. Looking for a comparison of
				<a href="<?php echo esc_url( home_url( '/local-seo-software/' ) ); ?>" class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors">local SEO software options</a>?
				See how Rynk stacks up.
			</p>
		</div>
	</section>

	<?php // TIERS. ?>
	<section class="relative px-6 py-2 md:px-10 md:py-2">
		<div
			aria-hidden="true"
			class="pointer-events-none absolute -top-10 left-1/4 h-72 w-72 rounded-full bg-brand-violet/15 blur-3xl animate-float-slow"
		></div>
		<div
			aria-hidden="true"
			