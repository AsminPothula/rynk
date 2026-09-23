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
			class="pointer-events-none absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-brand-blue/15 blur-3xl animate-float-slow"
			style="animation-delay: 4s;"
		></div>

		<div class="relative mx-auto max-w-screen-xl">
			<div class="grid gap-5 lg:grid-cols-2">
				<?php foreach ( rynk_tiers() as $tier ) : ?>
					<?php $s = $tier_styles[ $tier['tint'] ]; ?>
					<div class="<?php echo esc_attr( 'relative flex flex-col overflow-hidden rounded-3xl bg-white/[0.03] p-5 md:p-6 ring-1 ' . $s['ring'] . ' transition-all duration-300 hover:-translate-y-1 ' . ( $tier['accent'] ? 'shadow-[0_18px_50px_-15px_rgba(156,140,240,0.45)]' : '' ) ); ?>">
						<div class="<?php echo esc_attr( 'absolute inset-x-0 top-0 h-[2px] ' . $s['topBar'] ); ?>" aria-hidden="true"></div>
						<?php // Tint blob so each card carries its color. ?>
						<div
							aria-hidden="true"
							class="<?php echo esc_attr( 'pointer-events-none absolute -top-14 -right-14 h-40 w-40 rounded-full ' . $s['ambient'] . ' blur-3xl opacity-80' ); ?>"
						></div>

						<?php if ( '' !== $tier['badge'] ) : ?>
							<span class="absolute right-6 top-5 rounded-full bg-brand-violet/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-brand-violetSoft ring-1 ring-brand-violet/40">
								<?php echo esc_html( $tier['badge'] ); ?>
							</span>
						<?php endif; ?>

						<div class="relative">
							<h2 class="font-serif text-2xl font-medium tracking-tight"><?php echo esc_html( $tier['name'] ); ?></h2>
							<p class="mt-1 text-[13px] text-brand-textMute"><?php echo esc_html( $tier['target'] ); ?></p>
							<div class="mt-4 flex items-baseline gap-1.5">
								<span class="<?php echo esc_attr( 'font-serif text-5xl font-medium tracking-tight ' . $s['price'] ); ?>">
									<?php echo esc_html( $tier['price'] ); ?>
								</span>
								<span class="font-mono text-sm text-brand-textMute"><?php echo esc_html( $tier['cadence'] ); ?></span>
							</div>
						</div>

						<a
							href="<?php echo esc_url( home_url( $tier['href'] ) ); ?>"
							class="<?php echo esc_attr( 'relative mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full font-serif text-[15px] font-medium transition-all ' . ( $tier['accent'] ? 'bg-white text-brand-ink hover:shadow-[0_14px_36px_-14px_rgba(255,255,255,0.4)]' : 'ring-1 ring-white/15 text-brand-text hover:bg-white/5' ) ); ?>"
						>
							<?php echo esc_html( $tier['cta'] ); ?>
							<?php echo rynk_icon( 'arrow-right', 'h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
						</a>

						<div class="relative mt-5 grid gap-5 border-t border-white/8 pt-4 sm:grid-cols-2 sm:gap-x-6">
							<?php foreach ( $tier['columns'] as $column ) : ?>
								<div>
									<p class="font-mono text-[10px] uppercase tracking-[0.15em] text-brand-textMute">
										<?php echo esc_html( $column['label'] ); ?>
									</p>
									<ul class="mt-3 space-y-1.5">
										<?php foreach ( $column['features'] as $feature ) : ?>
											<li class="flex items-start gap-2 text-[13px] leading-snug">
												<?php echo rynk_icon( 'check', 'mt-0.5 h-4 w-4 shrink-0 ' . $s['check'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
												<span class="text-brand-text/90"><?php echo esc_html( $feature ); ?></span>
											</li>
										<?php endforeach; ?>
									</ul>
								</div>
							<?php endforeach; ?>
						</div>
					</div>
				<?php endforeach; ?>
			</div>

			<?php // SITE-BUILD ONE-TIME OFFER — bottom banner (orange highlight). ?>
			<div class="relative mt-5 overflow-hidden rounded-3xl bg-white/[0.02] ring-1 ring-brand-highlight/30 px-8 py-7 md:px-10 md:py-8">
				<div
					class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-highlight to-transparent"
					aria-hidden="true"
				></div>
				<div
					aria-hidden="true"
					class="pointer-events-none absolute -top-16 right-16 h-56 w-56 rounded-full bg-brand-highlight/15 blur-3xl"
				></div>

				<div class="relative grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-center">
					<div>
						<h2 class="font-serif text-3xl md:text-4xl font-medium leading-[1.05] tracking-tight text-brand-text">
							Need a site first?
							<span class="italic text-brand-highlight">We build that too.</span>
						</h2>
						<p class="mt-4 text-[15px] leading-[1.7] text-brand-textMute">
							If your business does not yet have a website, or the one you have is not worth optimising, Rynk can build a clean WordPress site with two to three pages, SEO-optimised from day one, for a one-time fee of $499. That gives Rynk a proper foundation to grow from in the first month.
						</p>
					</div>

					<div class="flex flex-col items-start gap-4 md:items-end">
						<div class="flex items-baseline gap-1.5">
							<span class="font-serif text-5xl font-medium tracking-tight text-brand-highlight">$499</span>
							<span class="font-mono text-sm text-brand-textMute">one-time</span>
						</div>
						<a
							href="<?php echo esc_url( home_url( '/contact' ) ); ?>"
							class="group inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-7 font-serif text-[16px] font-medium text-brand-ink transition-all hover:shadow-[0_14px_36px_-14px_rgba(255,255,255,0.4)]"
						>
							Get my site built
							<?php echo rynk_icon( 'arrow-right', 'h-4 w-4 transition-transform group-hover:translate-x-0.5' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<?php // BLOG CALLOUT - internal links to blog articles. ?>
	<section class="px-6 pb-4 md:px-10 md:pb-6">
		<div class="mx-auto max-w-screen-xl">
			<div class="rounded-2xl bg-white/[0.03] ring-1 ring-white/10 px-7 py-6 md:px-8">
				<p class="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-violetSoft">From the blog</p>
				<p class="mt-2 font-serif text-xl font-medium tracking-tight text-brand-text">
					Want to understand what Rynk actually fixes?
				</p>
				<p class="mt-1.5 text-[14px] leading-relaxed text-brand-textMute">
					See how
					<a
						href="<?php echo esc_url( home_url( '/blog/ai-powered-content-generation-for-seo/' ) ); ?>"
						class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors"
					>AI-powered content generation</a>
					works in practice, or start with our guide on
					<a
						href="<?php echo esc_url( home_url( '/blog/how-to-search-for-a-keyword-on-a-web-page/' ) ); ?>"
						class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors"
					>how to search for a keyword on a web page</a>
					to see the gaps Rynk closes automatically.
				</p>
			</div>
		</div>
	</section>

	<?php // FAQ. ?>
	<section class="relative px-6 py-10 md:px-10 md:py-12">
		<div
			aria-hidden="true"
			class="pointer-events-none absolute -top-10 left-10 h-64 w-64 rounded-full bg-brand-violet/12 blur-3xl animate-float-slow"
		></div>
		<div class="relative mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl">
				<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
					Frequently asked questions
				</h2>
				<div class="mt-8 grid gap-4">

					<?php
					$faqs = array(
						array(
							'q' => 'What does the $149 Gold plan actually do each month?',
							'a' => 'Rynk audits your site, applies technical fixes directly to your WordPress installation, publishes five new hyperlocal pages, five keyword-targeted pages, and updates five existing pages. It also tracks your rankings and compares them to your local competitors. Everything is done for you.',
						),
						array(
							'q' => 'Do I need any SEO knowledge to use Rynk?',
							'a' => 'None at all. Rynk is built for local business owners who have no SEO background. You connect your site, and Rynk handles the auditing, fixing, writing, and publishing. There is no dashboard to master and no jargon to decode.',
						),
						array(
							'q' => 'What is the difference between the Gold and Platinum plans?',
							'a' => 'Platinum doubles the number of pages published and updated each month, switches tracking from monthly to bi-weekly, and adds priority support. If you want to close the gap on competitors faster, or if your site has a lot of ground to cover, Platinum gets you there in half the time.',
						),
						array(
							'q' => 'What local business SEO software actually works for small businesses?',
							'a' => 'The tools that produce real results for local businesses are the ones that combine technical SEO, content publishing, and local keyword targeting in one automated system, without requiring the owner to have SEO expertise. Rynk was built specifically for that: one platform, flat monthly pricing, everything applied directly to your site.',
						),
						array(
							'q' => 'Can I cancel if I am not happy?',
							'a' => 'Yes. Rynk is a monthly subscription with no long-term contract. If you are not seeing progress, you can cancel at any time.',
						),
					);
					foreach ( $faqs as $faq ) :
					?>
						<div class="rounded-2xl bg-white/[0.03] ring-1 ring-white/10 p-6">
							<h3 class="font-serif text-[18px] font-medium leading-snug tracking-tight text-brand-text">
								<?php echo esc_html( $faq['q'] ); ?>
							</h3>
							<p class="mt-3 text-[14.5px] leading-[1.75] text-brand-textMute">
								<?php echo esc_html( $faq['a'] ); ?>
							</p>
						</div>
					<?php endforeach; ?>

				</div>
			</div>
		</div>

		<?php // FAQPage JSON-LD. ?>
		<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "FAQPage",
			"mainEntity": [
				{
					"@type": "Question",
					"name": "What does the $149 Gold plan actually do each month?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "Rynk audits your site, applies technical fixes directly to your WordPress installation, publishes five new hyperlocal pages, five keyword-targeted pages, and updates five existing pages. It also tracks your rankings and compares them to your local competitors. Everything is done for you."
					}
				},
				{
					"@type": "Question",
					"name": "Do I need any SEO knowledge to use Rynk?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "None at all. Rynk is built for local business owners who have no SEO background. You connect your site, and Rynk handles the auditing, fixing, writing, and publishing. There is no dashboard to master and no jargon to decode."
					}
				},
				{
					"@type": "Question",
					"name": "What is the difference between the Gold and Platinum plans?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "Platinum doubles the number of pages published and updated each month, switches tracking from monthly to bi-weekly, and adds priority support. If you want to close the gap on competitors faster, or if your site has a lot of ground to cover, Platinum gets you there in half the time."
					}
				},
				{
					"@type": "Question",
					"name": "What local business SEO software actually works for small businesses?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "The tools that produce real results for local businesses are the ones that combine technical SEO, content publishing, and local keyword targeting in one automated system, without requiring the owner to have SEO expertise. Rynk was built specifically for that: one platform, flat monthly pricing, everything applied directly to your site."
					}
				},
				{
					"@type": "Question",
					"name": "Can I cancel if I am not happy?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "Yes. Rynk is a monthly subscription with no long-term contract. If you are not seeing progress, you can cancel at any time."
					}
				}
			]
		}
		</script>
	</section>

	<?php // WATCH RYNK WORK (free scan). ?>
	<section class="relative px-0 py-4 md:px-0 md:py-4">
		<div class="relative mx-auto max-w-screen-xl overflow-hidden rounded-[32px] ring-0 ring-white/8 px-2 py-12 md:px-2 md:py-14">
			<div
				aria-hidden="true"
				class="pointer-events-none absolute -top-20 right-24 h-72 w-72 rounded-full blur-3xl animate-float-slow"
			></div>

			<div class="relative grid gap-4 md:grid-cols-[.9fr_1fr] md:items-center">
				<div class="w-full">
					<h2 class="w-full font-serif text-3xl md:text-4xl font-medium leading-[1.05] tracking-tight text-brand-text">
						Watch Rynk live <span class="italic text-brand-blueSoft">on your site.</span>
					</h2>
					<p class="mt-3 w-full text-[15px] leading-[1.7] text-brand-textMute">
						Enter your website URL and see the immediate assessment. Find out exactly what is stopping your customers from finding you on Google or AI.
					</p>
				</div>

				<form
					action="<?php echo esc_url( rynk_app_url( '/try' ) ); ?>"
					class="group relative ml-auto min-w-0 flex w-[75%] items-center gap-2 rounded-full bg-white/[0.06] ring-1 ring-white/12 py-2 pl-6 pr-2 text-brand-text"
				>
					<?php echo rynk_icon( 'sparkles', 'h-4 w-4 text-brand-violetSoft' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					<input
						type="text"
						name="domain"
						placeholder="www.yoursite.com"
						aria-label="Your domain"
						class="flex-1 bg-transparent font-serif text-[16px] text-brand-text placeholder:text-brand-textMute focus:outline-none"
					/>
					<button
						type="submit"
						aria-label="Audit my site"
						class="flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-ink transition-all group-hover:scale-105"
					>
						<?php echo rynk_icon( 'arrow-right', 'h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					</button>
				</form>
			</div>
		</div>
	</section>
</div>

<?php
get_footer();