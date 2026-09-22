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
				Simple, <span class="italic text-brand-blueSoft">per-business</span> pricing.
			</h1>
			<p
				class="mt-4 mb-5 text-[16px] leading-[1.75] text-brand-textMute animate-rise"
				style="animation-delay: 160ms;"
			>
				One flat monthly price. Rynk audits your site, fixes the technical issues, writes and publishes new pages, and keeps you ranking on Google and cited by AI assistants &mdash; every month, automatically.
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
							<h3 class="font-serif text-2xl font-medium tracking-tight"><?php echo esc_html( $tier['name'] ); ?></h3>
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

			<?php // WHAT EVERY PLAN INCLUDES. ?>
			<div class="relative mt-8 overflow-hidden rounded-3xl bg-white/[0.02] ring-1 ring-white/8 px-8 py-8 md:px-10 md:py-10">
				<div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-violet/30 to-transparent" aria-hidden="true"></div>
				<div
					aria-hidden="true"
					class="pointer-events-none absolute -top-10 right-10 h-48 w-48 rounded-full bg-brand-violet/12 blur-3xl"
				></div>
				<div class="relative grid gap-8 md:grid-cols-2 md:gap-12">
					<div>
						<p class="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-violetSoft mb-4">What every plan includes</p>
						<ul class="space-y-2.5">
							<?php
							$plan_features = array(
								'Full site audit every cycle, checking every page the way Google does.',
								'Automated technical fixes: page titles, meta descriptions, internal links, and structured data applied directly to your site.',
								'New content pages written and published targeting the keywords your customers search for.',
								'AI readability optimization so ChatGPT, Perplexity, and Google AI Overviews can accurately describe your business.',
								'Duplicate page cleanup and redirect management.',
							);
							foreach ( $plan_features as $feature ) :
							?>
								<li class="flex items-start gap-2.5 text-[13.5px] leading-snug text-brand-textMute">
									<?php echo rynk_icon( 'check', 'mt-0.5 h-4 w-4 shrink-0 text-brand-violetSoft' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
									<?php echo esc_html( $feature ); ?>
								</li>
							<?php endforeach; ?>
						</ul>
					</div>
					<div>
						<p class="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-violetSoft mb-4 md:opacity-0" aria-hidden="true">_</p>
						<ul class="space-y-2.5">
							<?php
							$plan_features_2 = array(
								'Custom images created and uploaded for every new page.',
								'Weekly ranking checks and automated re-optimization each cycle.',
								'Outreach email drafts and social posts to build citations across the web.',
								'No retainers, no account managers, no jargon. Just more customers finding you.',
							);
							foreach ( $plan_features_2 as $feature ) :
							?>
								<li class="flex items-start gap-2.5 text-[13.5px] leading-snug text-brand-textMute">
									<?php echo rynk_icon( 'check', 'mt-0.5 h-4 w-4 shrink-0 text-brand-violetSoft' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
									<?php echo esc_html( $feature ); ?>
								</li>
							<?php endforeach; ?>
						</ul>
					</div>
				</div>
			</div>

			<?php // WHO EACH PLAN IS FOR. ?>
			<div class="relative mt-5 grid gap-5 md:grid-cols-2">
				<div class="relative overflow-hidden rounded-2xl bg-white/[0.02] ring-1 ring-white/8 px-7 py-7">
					<div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-blue/40 to-transparent" aria-hidden="true"></div>
					<p class="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-blueSoft mb-3">Who Gold is for</p>
					<p class="text-[14.5px] leading-[1.75] text-brand-textMute">
						Gold is the right choice for most local businesses: a restaurant, salon, spa, auto shop, plumber, or any single-location service provider that wants to show up on Google and in AI answers without managing an SEO strategy themselves. Five new pages per month compounds quickly &mdash; after six months you have dozens of keyword-targeted pages working for you around the clock.
					</p>
				</div>
				<div class="relative overflow-hidden rounded-2xl bg-white/[0.02] ring-1 ring-white/8 px-7 py-7">
					<div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-violet/40 to-transparent" aria-hidden="true"></div>
					<p class="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-violetSoft mb-3">When Platinum makes sense</p>
					<p class="text-[14.5px] leading-[1.75] text-brand-textMute">
						Platinum is for businesses in competitive markets, businesses with multiple service lines, or any owner who wants faster results and bi-weekly visibility into what is shifting. Double the page output means double the keyword coverage, and priority support means any question you have is answered first.
					</p>
				</div>
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
							Getting started?
							<span class="italic text-brand-highlight">We can build the site too.</span>
						</h2>
						<p class="mt-4 text-[15px] leading-[1.7] text-brand-textMute">
							A full WordPress website with 2&ndash;3 pages, SEO-optimized from day one &mdash; structured correctly so Rynk has a strong foundation to build from.
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

			<?php // FAQ. ?>
			<div class="relative mt-8">
				<div class="mb-6">
					<p class="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-violetSoft">Common questions</p>
					<h2 class="mt-3 font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">Pricing FAQ.</h2>
				</div>
				<div class="space-y-4">
					<?php
					$faqs = array(
						array(
							'q' => 'Is Rynk cheaper than hiring an SEO agency?',
							'a' => 'Yes, significantly. A freelance SEO consultant typically charges $75 to $150 per hour. An agency retainer starts at $1,500 per month and often exceeds $3,000. Rynk delivers automated audits, technical fixes, and new content pages for $149 per month on the Gold plan, with no contract and no hidden fees.',
						),
						array(
							'q' => 'Do I need to know anything about SEO to use Rynk?',
							'a' => 'No. Rynk is built specifically for business owners who have no SEO knowledge and no time to learn. You connect your website, and Rynk handles every part of the process from audit to publishing.',
						),
						array(
							'q' => 'What if my website is not on WordPress?',
							'a' => 'Rynk publishes content automatically to WordPress sites. For custom-built sites, Rynk produces developer-friendly SEO recommendations and drafts the content so your developer can apply it. The Gold and Platinum plans cover both scenarios.',
						),
						array(
							'q' => 'Can I cancel any time?',
							'a' => 'Yes. There is no long-term contract. You can cancel your plan at any time and the pages and fixes already published on your site remain in place.',
						),
						array(
							'q' => 'What does the one-time $499 site build include?',
							'a' => 'Rynk builds a complete WordPress website with two to three pages, structured correctly for SEO from day one. It is the right starting point if you do not yet have a site or your current site is too outdated to build on. Once the site is live, your monthly Rynk plan takes over and keeps growing it.',
						),
					);
					foreach ( $faqs as $faq ) :
					?>
						<div class="group relative overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ring-white/8 p-6 transition-all duration-300 hover:-translate-y-0.5">
							<div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-violet/40 to-transparent" aria-hidden="true"></div>
							<h3 class="font-serif text-[17px] font-medium leading-snug tracking-tight text-brand-text mb-2">
								<?php echo esc_html( $faq['q'] ); ?>
							</h3>
							<p class="text-[14.5px] leading-[1.75] text-brand-textMute m-0">
								<?php echo esc_html( $faq['a'] ); ?>
							</p>
						</div>
					<?php endforeach; ?>
				</div>
			</div>

			<?php // INTERNAL LINKS TO BLOG. ?>
			<div class="relative mt-5 overflow-hidden rounded-2xl bg-white/[0.02] ring-1 ring-white/8 px-7 py-6 md:flex md:items-center md:justify-between md:gap-10">
				<div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-blue/30 to-transparent" aria-hidden="true"></div>
				<p class="text-[15px] leading-[1.7] text-brand-textMute mb-4 md:mb-0">
					Not sure if Rynk is right for you? Read our guide on why businesses stay invisible on Google and how automated SEO changes that.
				</p>
				<a
					href="<?php echo esc_url( home_url( '/blog/why-isnt-my-business-showing-up-on-google/' ) ); ?>"
					class="group inline-flex shrink-0 items-center gap-2 font-serif text-[15px] text-brand-blueSoft transition-colors hover:text-brand-text"
				>
					Read the guide
					<?php echo rynk_icon( 'arrow-right', 'h-4 w-4 transition-transform group-hover:translate-x-0.5' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</a>
			</div>

			<div class="relative mt-4 overflow-hidden rounded-2xl bg-white/[0.02] ring-1 ring-white/8 px-7 py-6 md:flex md:items-center md:justify-between md:gap-10">
				<div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-emerald/30 to-transparent" aria-hidden="true"></div>
				<p class="text-[15px] leading-[1.7] text-brand-textMute mb-4 md:mb-0">
					Want to know where your site currently ranks before you sign up? Here&rsquo;s a simple guide to checking your Google keyword positions.
				</p>
				<a
					href="<?php echo esc_url( home_url( '/blog/how-to-check-keyword-ranking-google/' ) ); ?>"
					class="group inline-flex shrink-0 items-center gap-2 font-serif text-[15px] text-brand-blueSoft transition-colors hover:text-brand-text"
				>
					Check your rankings
					<?php echo rynk_icon( 'arrow-right', 'h-4 w-4 transition-transform group-hover:translate-x-0.5' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</a>
			</div>
		</div>
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
						Start your free audit &mdash; <span class="italic text-brand-blueSoft">see what&rsquo;s holding you back.</span>
					</h2>
					<p class="mt-3 w-full text-[15px] leading-[1.7] text-brand-textMute">
						Enter your website URL and see the immediate assessment &mdash; why your customers aren&rsquo;t finding your site on Google or AI. Most business owners are surprised by how many fixable issues they find.
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
						aria-label="Start my free audit"
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