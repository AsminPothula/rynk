<?php
/**
 * Template Name: Rynk About
 *
 * /about - Why We Started Rynk + Meet the Founders.
 * Port of `(public)/about/page.tsx`.
 *
 * Same layout grid as the rest of the marketing site:
 *   - sections: px-6 md:px-10, py-14 md:py-16
 *   - content: mx-auto max-w-screen-xl
 *
 * The founder photos were static imports handled by next/image; here they are
 * plain <img> tags against the theme's assets directory. The aspect-[4/3]
 * wrapper reserves the layout box, so no intrinsic width/height is needed to
 * avoid a shift while the file loads.
 *
 * @package rynk-ai
 */

get_header();

$founder_styles = rynk_founder_styles();
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
      "name": "About",
      "item": "https://rynk.ai/about/"
    }
  ]
}
</script>

<div class="relative text-brand-text overflow-x-hidden">
	<?php // WHY WE STARTED RYNK. ?>
	<section class="relative px-6 py-14 md:px-10 md:py-20">
		<div class="pointer-events-none absolute inset-0 bg-grid-brand opacity-50" aria-hidden="true"></div>
		<div class="relative mx-auto max-w-screen-xl">
			<div class="max-w-3xl">
				<p class="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft animate-rise">
					About
				</p>
				<h1
					class="mt-4 font-serif text-5xl md:text-6xl font-medium leading-[1.05] tracking-tight animate-rise"
					style="animation-delay: 60ms;"
				>
					Our <span class="italic text-brand-blueSoft">story.</span>
				</h1>
				<div
					class="mt-8 space-y-5 text-[16px] leading-[1.8] text-brand-textMute animate-rise"
					style="animation-delay: 160ms;"
				>
					<p>
						Rynk began because of one problem: small and medium-sized
						businesses weren&rsquo;t visible online - not because they lacked
						quality products, but because they lacked quality online
						presence. Small restaurants, local businesses, and talented
						creators all have valuable products, but nobody could find them.
					</p>
					<p>
						We built Rynk to solve that: one platform that automates your
						visibility everywhere customers search, whether that&rsquo;s
						Google, AI platforms, maps, or local listings. That includes
						<a href="<?php echo esc_url( home_url( '/generative-engine-optimization/' ) ); ?>" class="text-brand-blueSoft underline underline-offset-