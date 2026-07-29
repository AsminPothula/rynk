<?php
/**
 * Template Name: Rynk Coming Soon
 *
 * A placeholder for pages that are not live yet — the dashboard, sign-in, and
 * the free-scan / "try rynk" flow all point here until the app ships. It keeps
 * the marketing shell (header + footer) so a visitor who clicks through never
 * lands on a broken or empty page.
 *
 * @package rynk-ai
 */

get_header();
?>

<div class="relative text-brand-text overflow-x-hidden">
	<section class="relative flex items-center px-6 py-20 md:px-10 lg:min-h-[max(calc(100dvh-8rem),480px)]">
		<div class="pointer-events-none absolute inset-0 bg-grid-brand opacity-50" aria-hidden="true"></div>
		<div
			aria-hidden="true"
			class="pointer-events-none absolute -top-10 left-1/4 h-72 w-72 rounded-full bg-brand-violet/15 blur-3xl animate-float-slow"
		></div>
		<div
			aria-hidden="true"
			class="pointer-events-none absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-brand-blue/15 blur-3xl animate-float-slow"
			style="animation-delay: 4s;"
		></div>

		<div class="relative mx-auto w-full max-w-2xl text-center">
			<p class="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft animate-rise">
				<?php echo esc_html( get_the_title() ); ?>
			</p>
			<h1
				class="mt-5 font-serif text-5xl md:text-6xl font-medium leading-[1.02] tracking-tight animate-rise"
				style="animation-delay: 60ms;"
			>
				Coming <span class="italic text-brand-blueSoft">soon.</span>
			</h1>
			<p
				class="mt-6 text-[16px] leading-[1.75] text-brand-textMute animate-rise"
				style="animation-delay: 160ms;"
			>
				We&rsquo;re putting the finishing touches on this. Check back shortly.
			</p>

			<div class="mt-9 animate-rise" style="animation-delay: 260ms;">
				<a
					href="<?php echo esc_url( home_url( '/' ) ); ?>"
					class="group inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-7 font-serif text-[16px] font-medium text-brand-ink transition-all hover:shadow-[0_14px_36px_-14px_rgba(255,255,255,0.4)]"
				>
					Back home
					<?php echo rynk_icon( 'arrow-right', 'h-4 w-4 transition-transform group-hover:translate-x-0.5' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</a>
			</div>
		</div>
	</section>
</div>

<?php
get_footer();
