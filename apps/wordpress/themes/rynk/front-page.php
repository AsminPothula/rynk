<?php
/**
 * Landing page — port of `(public)/page.tsx`.
 *
 * Layout system:
 *   - Every section's content sits in the same `mx-auto max-w-screen-xl`
 *     container so all edges align down the page.
 *   - The hero fits above the fold on a typical laptop viewport.
 *   - Hero action cards use a structured 2-column staggered grid (no
 *     absolute positioning), so they can never overlap at any width.
 *
 * All motion is pure CSS from the compiled stylesheet.
 * `prefers-reduced-motion: reduce` disables everything automatically.
 *
 * @package rynk-ai
 */

get_header();

$hero_cards = rynk_hero_cards();
$platforms  = rynk_platforms();
?>

<div class="relative text-brand-text overflow-x-hidden">
	<?php
	/*
	 * HERO - fills the first screen. The card stretches to the viewport
	 * bottom and its content is vertically centered, so there is never dead
	 * space below it and the next section starts exactly at the fold.
	 */
	?>
	<section class="relative px-6 pt-16 pb-6 md:px-10 md:pt-20 md:pb-6 lg:min-h-[700px]">
		<div class="pointer-events-none absolute inset-0 bg-grid-brand opacity-60" aria-hidden="true"></div>

		<div class="relative mx-auto h-full max-w-screen-xl">
			<div class="flex h-full items-center overflow-hidden rounded-[32px] bg-white/[0.02] ring-1 ring-white/8 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_30px_80px_-40px_rgba(0,0,0,0.7)]">

				<div class="grid w-full gap-12 p-8 md:p-12 lg:grid-cols-2 lg:items-right lg:gap-10 lg:px-14 lg:py-10">

					<?php // LEFT - copy + CTAs. ?>
					<div>
						<h1 class="font-serif text-5xl md:text-6xl font-medium leading-[0.98] tracking-tight animate-rise text-brand-text">
							Want more sales?
							<span class="block mt-2 italic text-brand-blueSoft">
								Generate more leads.
							</span>
						</h1>
						<p
							class="mt-6 max-w-xl text-[15.5px] leading-[1.75] text-brand-textMute animate-rise"
							style="animation-delay: 160ms;"
						>
							Rynk is the first end-to-end AI-powered SEO platform that makes your website generate more leads&mdash;effortlessly. It audits your site, identifies exactly what&rsquo;s stopping you from showing up in search, then deploys the fixes and generates content directly on your website&mdash;no SEO expertise or manual intervention needed.
						</p>

						<div
							class="mt-20 flex w-full flex-col items-stretch gap-8 animate-rise"
							style="animation-delay: 260ms;"
						>
							<div class="w-full">
								<h2 class="w-full font-serif text-10xl md:text-10xl lg:text-[24px] font-medium leading-[1.02] tracking-tight text-brand-text">
									Watch Rynk live
									on <span class="italic text-brand-blueSoft">your site.</span>
								</h2>
								<p class="mt-2 w-full text-[15.5px] leading-[1.7] text-brand-textMute">
									Enter your website URL and see the immediate assessment.
								</p>
							</div>

							<form
								action="<?php echo esc_url( rynk_app_url( '/try' ) ); ?>"
								class="group relative flex w-full items-center gap-2 rounded-full bg-white/[0.06] ring-1 ring-white/12 py-2 pl-6 pr-2 text-brand-text shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]"
							>
								<?php echo rynk_icon( 'sparkles', 'h-4 w-4 text-brand-violetSoft' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
								<input
									type="text"
									name="domain"
									placeholder="www.yoursite.com"
									aria-label="Your domain"
									class="min-w-0 flex-1 bg-transparent font-serif text-[16px] text-brand-text placeholder:text-brand-textMute focus:outline-none"
								/>
								<button
									type="submit"
									aria-label="Audit my site"
									class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-brand-ink transition-all group-hover:scale-105"
								>
									<?php echo rynk_icon( 'arrow-right', 'h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
								</button>
							</form>
						</div>
					</div>

					<?php // RIGHT - "rynk at work" action cards in a staggered grid. ?>
					<div class="relative">
						<?php // Ambient orbs behind the cards. ?>
						<div class="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
							<div class="h-80 w-80 rounded-full bg-brand-blue/14 blur-3xl animate-float-slow"></div>
						</div>
						<div class="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
							<div
								class="h-56 w-56 rounded-full bg-brand-violet/18 blur-3xl animate-float-slow"
								style="animation-delay: 3s;"
							></div>
						</div>

						<p class="mb-12 font-serif text-xl md:text-2xl leading-tight tracking-tight text-brand-text text-center">
							AI-Powered SEO Automation
						</p>

						<?php
						/*
						 * Criss-cross cascade - cards alternate left/right down the
						 * column. Normal document flow (no absolute positioning), so
						 * they can never hide each other at any viewport width.
						 */
						?>
						<div class="relative mx-auto flex w-full max-w-md flex-col gap-4">
							<?php foreach ( $hero_cards as $i => $card ) : ?>
								<div class="<?php echo esc_attr( 'w-[72%] sm:w-[68%] ' . ( 1 === $i % 2 ? 'self-end' : 'self-start' ) ); ?>">
									<?php rynk_action_card( $card, ( $i * 1.3 ) . 's' ); ?>
								</div>
							<?php endforeach; ?>
						</div>

					</div>
				</div>
			</div>
		</div>
	</section>

	<?php // TRUST BAR (marquee). ?>
	<section class="px-6 py-10 md:px-10 md:py-10">
		<div class="mx-auto max-w-screen-xl border-y border-brand-blue/30">
			<div class="py-4">
				<div class="flex items-center gap-4">
					<span class="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-brand-textMute md:block">
						Get cited by
					</span>
					<span class="h-px flex-1 bg-white/8"></span>
				</div>
			</div>

			<div
				class="mt-3 mb-7 overflow-hidden"
				style="mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%); -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);"
			>
				<div class="flex w-max animate-marquee gap-0">
					<?php // The list is duplicated so the marquee loops seamlessly at -50%. ?>
					<?php foreach ( array_merge( $platforms, $platforms ) as $name ) : ?>
						<span class="font-serif text-2xl md:text-3xl text-brand-textMute">
							<?php echo esc_html( $name ); ?>
							<span class="mx-8 text-brand-violet/40">&bull;</span>
						</span>
					<?php endforeach; ?>
				</div>
			</div>

		</div>

	</section>

	<?php // WHAT WE OFFER. ?>
	<section class="relative px-6 py-5 md:px-10 md:py-5">
		<div
			aria-hidden="true"
			class="pointer-events-none absolute -top-16 left-8 h-72 w-72 rounded-full bg-brand-violet/20 blur-3xl animate-float-slow"
		></div>
		<div
			aria-hidden="true"
			class="pointer-events-none absolute bottom-0 right-4 h-80 w-80 rounded-full bg-brand-cyan/15 blur-3xl animate-float-slow"
			style="animation-delay: 4s;"
		></div>

		<div class="relative mx-auto max-w-screen-xl">
			<div class="mb-12">
				<p class="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-violetSoft">
					The full package.
				</p>
				<h2 class="mt-3.5 font-serif text-5xl md:text-6xl font-medium tracking-tight text-brand-text">
					What you <span class="italic text-brand-violetSoft">get.</span>
				</h2>
				<p class="mt-6 text-[15px] leading-[1.75] text-brand-textMute">
					Rynk optimizes your whole site and does the work of a team of SEO experts and web developers, in minutes. <br />
					Every day, potential customers search Google, ChatGPT, and other AI search engines for businesses like yours. Rynk makes sure your website is the one they find.
				</p>
			</div>

			<?php // Aligned 5x2 grid on desktop, 2 cols on tablet, 1 on mobile. ?>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
				<?php foreach ( rynk_offerings() as $item ) : ?>
					<?php rynk_offering_tile( $item ); ?>
				<?php endforeach; ?>
			</div>
		</div>
	</section>
</div>

<?php
get_footer();
