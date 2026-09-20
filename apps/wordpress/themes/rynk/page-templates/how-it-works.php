<?php
/**
 * Template Name: Rynk How It Works
 *
 * /how-it-works - port of `(public)/how-it-works/page.tsx`.
 *
 * Structure:
 *   1. Hero          - "Leads on autopilot" (fills the first screen)
 *   2. What you get  - outcome cards (value up front)
 *   3. Four jobs     - Analyze / Generate / Publish / Monitor, with the
 *                      capability cards under each
 *   4. FAQ           - common automation / technical-SEO questions, mirrored
 *                      in the FAQPage structured data emitted in functions.php
 *   5. Bottom CTA    -> /sign-in
 *
 * @package rynk-ai
 */

get_header();

$tint_styles = rynk_tint_styles();
?>

<div class="relative text-brand-text overflow-x-hidden">
	<?php // HERO - compact, so the outcomes below share the first screen. ?>
	<section class="relative px-6 pt-16 pb-6 md:px-10 md:pt-20 md:pb-8">
		<div class="pointer-events-none absolute inset-0 bg-grid-brand opacity-50" aria-hidden="true"></div>
		<div class="relative mx-auto w-full max-w-3xl text-center">
			<h1
				class="font-serif text-5xl md:text-6xl font-medium leading-[1.02] tracking-tight animate-rise"
			>
				Generate leads on <span class="italic text-brand-blueSoft">autopilot.</span>
			</h1>
			<p
				class="mt-6 text-[16px] leading-[1.75] text-brand-textMute animate-rise"
				style="animation-delay: 160ms;"
			>
				Rynk audits your site, generates the fixes and content it needs, and deploys
				those changes straight to your site - no manual intervention needed. As the
				tech keeps evolving, Rynk keeps watching and adjusting, so you consistently show
				up higher on search engines and get cited more when people
				ask AI assistants questions.
			</p>
		</div>
	</section>

	<?php // WHAT YOU GET. ?>
	<section class="relative px-6 pt-6 pb-24 md:px-10 md:pt-8 md:pb-28">
		<div class="relative mx-auto max-w-screen-xl">
			<div class="mb-8">
				<p class="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-emeraldSoft">
					What you get
				</p>
				<h2 class="mt-3 font-serif text-4xl md:text-5xl font-medium tracking-tight text-brand-text">
					The outcomes, up front.
				</h2>
				<p class="mt-5 text-[15px] leading-[1.75] text-brand-textMute">
					More customers reaching out to you - that&rsquo;s what Rynk delivers: more of
					your pages ranking on Google for the searches your customers actually make,
					stronger visibility on AI platforms like ChatGPT and Perplexity, and fixes
					deployed automatically, with no manual intervention needed. Want the deeper
					technical breakdown? Read our guide to
					<a href="<?php echo esc_url( home_url( '/ai-search-engine-optimization/' ) ); ?>" class="text-brand-blueSoft underline underline-offset-2 transition-colors hover:text-brand-text">AI search engine optimization</a>.
					Curious about earning backlinks along the way? See how
					<a href="<?php echo esc_url( home_url( '/content-marketing-for-link-building/' ) ); ?>" class="text-brand-blueSoft underline underline-offset-2 transition-colors hover:text-brand-text">content marketing for link building</a>
					works.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<?php foreach ( rynk_outcomes() as $outcome ) : ?>
					<?php rynk_outcome_card( $outcome ); ?>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<?php // Section divider — separates the outcomes from the pipeline breakdown. ?>
	<div class="px-6 md:px-10" aria-hidden="true">
		<div class="mx-auto max-w-screen-xl">
			<div class="h-px w-full bg-gradient-to-r from-transparent via-brand-hairline to-transparent"></div>
		</div>
	</div>

	<?php // BUILT AROUND FOUR JOBS. ?>
	<section class="relative px-6 pt-24 pb-14 md:px-10 md:pt-28 md:pb-16">
		<div
			aria-hidden="true"
			class="pointer-events-none absolute -top-16 right-8 h-80 w-80 rounded-full bg-brand-violet/15 blur-3xl animate-float-slow"
		></div>
		<div
			aria-hidden="true"
			class="pointer-events-none absolute bottom-20 left-8 h-80 w-80 rounded-full bg-brand-emerald/10 blur-3xl animate-float-slow"
			style="animation-delay: 4s;"
		></div>

		<div class="relative mx-auto max-w-screen-xl">
			<div class="mb-12">
				<p class="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-violetSoft">
					Under the hood
				</p>
				<h2 