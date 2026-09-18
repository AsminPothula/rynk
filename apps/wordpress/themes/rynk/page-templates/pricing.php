<?php
/**
 * Template Name: Rynk Pricing
 *
 * /pricing - port of `(public)/pricing/page.tsx`.
 *
 * Two tiers (Gold, Platinum) + a one-time site-build offer + an FAQ section
 * + the free-scan CTA. Same layout grid as the rest of the marketing site:
 *   - sections: px-6 md:px-10
 *   - content: mx-auto max-w-screen-xl
 *
 * Tier copy and pricing live in a local array rather than rynk_tiers() so
 * this page can carry its own Gold/Platinum plan definitions independent of
 * whatever tiers ship elsewhere; the card markup and tint-style shape match
 * the pattern used across the rest of the theme (see how-it-works.php's
 * rynk_tint_styles() usage).
 *
 * @package rynk-ai
 */

get_header();

$tiers = array(
	array(
		'tint'    => 'gold',
		'accent'  => false,
		'badge'   => '',
		'name'    => 'Gold',
		'target'  => 'For small businesses',
		'price'   => '$149',
		'cadence' => '/ month',
		'href'    => rynk_app_url( '/sign-up' ),
		'cta'     => 'Get started',
		'columns' => array(
			array(
				'label'    => 'Content',
				'features' => array(
					'5 hyperlocal pages per month',
					'5 target keyword pages per month',
					'5 pages updated per month',
				),
			),
			array(
				'label'    => 'Tracking',
				'features' => array(
					'Automatic WordPress website updates',
					'Monthly performance tracking',
					'Competitor ranking comparison',
				),
			),
		),
	),
	array(
		'tint'    => 'platinum',
		'accent'  => true,
		'badge'   => 'Most popular',
		'name'    => 'Platinum',
		'target'  => 'For scaling businesses',
		'price'   => '$299',
		'cadence' => '/ month',
		'href'    => rynk_app_url( '/sign-up' ),
		'cta'     => 'Get started',
		'columns' => array(
			array(
				'label'    => 'Content',
				'features' => array(
					'10 hyperlocal pages per month',
					'10 target keyword pages per month',
					'10 pages updated per month',
				),
			),
			array(
				'label'    => 'Tracking',
				'features' => array(
					'Automatic WordPress website updates',
					'Bi-weekly performance tracking',
					'Competitor ranking comparison',
					'Priority support',
				),
			),
		),
	),
);

$tier_styles = array(
	'gold'     => array(
		'ring'    => 'ring-brand-highlight/25',
		'topBar'  => 'bg-gradient-to-r from-transparent via-brand-highlight to-transparent',
		'ambient' => 'bg-brand-highlight/15',
		'price'   => 'text-brand-highlight',
		'check'   => 'text-brand-highlight',
	),
	'platinum' => array(
		'ring'    => 'ring-white/15',
		'topBar'  => 'bg-gradient-to-r from-transparent via-white/50 to-transparent',
		'ambient' => 'bg-white/10',
		'price'   => 'text-brand-text',
		'check'   => 'text-brand-blueSoft',
	),
);

$pricing_faq = array(
	array(
		'q' => "What's the best SEO tool for a small business on a tight budget?",
		'a' => "The best tool is one that automates the fix, not just the report. Rynk's Gold plan starts at $149 per month and includes automatic website updates plus new pages built to target the keywords your customers actually search.",
	),
	array(
		'q' => 'Do I need a developer to use Rynk?',
		'a' => 'No. Rynk deploys fixes and new content directly to your WordPress site automatically. If your site is custom-built, Rynk provides developer-friendly written suggestions instead.',
	),
	array(
		'q' => 'What is included in every plan?',
		'a' => 'Every plan includes a full site audit, technical fixes, new AI-optimized content, automatic WordPress updates, and ranking comparisons against your competitors, with the difference between Gold and Platinum being volume of pages and tracking frequency.',
	),
	array(
		'q' => "Can Rynk build my website if I don't have one yet?",
		'a' => 'Yes. Rynk offers a one-time $499 option to build a full WordPress website with 2 to 3 SEO-optimized pages, giving Rynk a foundation to grow from month to month.',
	),
);
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
				Built for hyperlocal businesses, not enterprise marketing budgets. Pick the tier that fits your business - both plans include automatic WordPress website updates and let you see how you rank against your competitors, so you always know where you stand.
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
				<?php foreach ( $tiers as $tier ) : ?>
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
							href="<?php echo esc_url( $tier['href'] ); ?>"
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

			<?php // Illustration - Gold vs Platinum at a glance. ?>
			<figure class="relative mt-5 overflow-hidden rounded-3xl bg-white/[0.02] ring-1 ring-white/8 p-4 md:p-6">
				<img
					src="<?php echo esc_url( get_theme_file_uri( 'assets/img/pricing-plans-illustration.png' ) ); ?>"
					alt="Gold and Platinum pricing plans compared side by side"
					class="mx-auto block w-full max-w-2xl rounded-2xl"
					loading="lazy"
					decoding="async"
				/>
				<figcaption class="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-brand-textMute">
					Gold and Platinum plans, built for different stages of growth.
				</figcaption>
			</figure>

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
							A full WordPress website with 2-3 pages, SEO-optimized from day one &mdash; so Rynk has a foundation to grow from.
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

	<?php // FAQ. ?>
	<section class="relative px-6 py-14 md:px-10 md:py-16">
		<div class="relative mx-auto max-w-screen-xl">
			<div class="mb-12">
				<p class="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-emeraldSoft">
					Questions
				</p>
				<h2 class="mt-3 font-serif text-4xl md:text-5xl font-medium tracking-tight text-brand-text">
					Pricing FAQ.
				</h2>
			</div>

			<div class="grid gap-4 md:grid-cols-2">
				<?php foreach ( $pricing_faq as $item ) : ?>
					<div class="rounded-2xl bg-white/[0.03] ring-1 ring-white/8 p-6">
						<h3 class="font-serif text-lg font-medium leading-snug tracking-tight text-brand-text">
							<?php echo esc_html( $item['q'] ); ?>
						</h3>
						<p class="mt-2.5 text-[14px] leading-relaxed text-brand-textMute">
							<?php echo esc_html( $item['a'] ); ?>
						</p>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<?php // WATCH RYNK WORK (free scan). ?>
	<section class="relative px-0 py-4 md:px-0 md:py-4">
		<div class="relative mx-auto max-w-screen-xl overflow-hidden rounded-[32px]  ring-0 ring-white/8 px-2 py-12 md:px-2 md:py-14">
			<div
				aria-hidden="true"
				class="pointer-events-none absolute -top-20 right-24 h-72 w-72 rounded-full  blur-3xl animate-float-slow"
			></div>

			<div class="relative grid gap-4 md:grid-cols-[.9fr_1fr] md:items-center">
				<div class="w-full">
					<h2 class="w-full font-serif text-3xl md:text-4xl font-medium leading-[1.05] tracking-tight text-brand-text">
						Watch Rynk live <span class="italic text-brand-blueSoft">on your site.</span>
					</h2>
					<p class="mt-3 w-full text-[15px] leading-[1.7] text-brand-textMute">
						Enter your website URL and see the immediate assessment - why your customers aren&rsquo;t finding your site on Google or AI.
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
