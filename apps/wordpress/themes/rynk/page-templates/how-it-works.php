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
 *   4. Bottom CTA    -> /sign-in
 *
 * @package rynk-ai
 */

get_header();

$tint_styles = rynk_tint_styles();
?>

<div class="relative text-brand-text overflow-x-hidden">
	<?php // HERO - centered, fills the first screen exactly. ?>
	<section class="relative flex items-center px-6 py-14 md:px-10 lg:h-[max(calc(100dvh-4rem),560px)] lg:py-0">
		<div class="pointer-events-none absolute inset-0 bg-grid-brand opacity-50" aria-hidden="true"></div>
		<div class="relative mx-auto w-full max-w-3xl text-center">
			<p class="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft animate-rise">
			</p>
			<h1
				class="mt-4 font-serif text-5xl md:text-6xl lg:text-[72px] font-medium leading-[1.02] tracking-tight animate-rise"
				style="animation-delay: 60ms;"
			>
				Leads on <span class="italic text-brand-blueSoft">autopilot.</span>
			</h1>
			<p
				class="mt-7 text-[16px] leading-[1.75] text-brand-textMute animate-rise"
				style="animation-delay: 160ms;"
			>
				We scan your website, find every fix worth making, and ship those changes
				straight to your site and channels &mdash; no manual work on your end. As search
				keeps evolving, we keep watching and adjusting, so you consistently rank
				higher on Google and get cited more when people
				ask AI assistants questions.
			</p> <br /> <br />
		</div>
	</section>

	<?php // WHAT YOU GET. ?>
	<section class="relative px-6 py-14 md:px-10 md:py-16">
		<div class="relative mx-auto max-w-screen-xl">
			<div class="mb-12">
				<p class="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-emeraldSoft">
					What you get
				</p>
				<h2 class="mt-3 font-serif text-4xl md:text-5xl font-medium tracking-tight text-brand-text">
					The outcomes, up front.
				</h2>
			</div>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<?php foreach ( rynk_outcomes() as $outcome ) : ?>
					<?php rynk_outcome_card( $outcome ); ?>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<?php // BUILT AROUND FOUR JOBS. ?>
	<section class="relative px-6 py-14 md:px-10 md:py-16">
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
				<h2 class="mt-3 font-serif text-4xl md:text-5xl font-medium tracking-tight text-brand-text">
					Built around four jobs.
				</h2>
				<p class="mt-5 text-[15px] leading-[1.75] text-brand-textMute">
					Rynk analyzes what&rsquo;s there, generates every change it would
					make, publishes the result, and monitors what happens next. Each
					capability below is a real piece of the pipeline running today.
				</p>
			</div>

			<div class="space-y-16">
				<?php foreach ( rynk_jobs() as $job ) : ?>
					<?php $s = $tint_styles[ $job['tint'] ]; ?>
					<div>
						<?php // Job header - colored number chip + name. ?>
						<div class="flex items-center gap-4">
							<span class="<?php echo esc_attr( 'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ' . $s['iconBg'] . ' font-serif text-xl font-medium ' . $s['iconText'] . ' shadow-[0_6px_16px_-4px_rgba(0,0,0,0.5)]' ); ?>">
								<?php echo esc_html( $job['n'] ); ?>
							</span>
							<h3 class="<?php echo esc_attr( 'font-serif text-3xl md:text-4xl font-medium tracking-tight ' . $s['text'] ); ?>">
								<?php echo esc_html( $job['name'] ); ?>
							</h3>
						</div>
						<p class="mt-4 text-[15px] leading-[1.7] text-brand-textMute">
							<?php echo esc_html( $job['intro'] ); ?>
						</p>

						<?php // Capability cards - aligned grid. ?>
						<div class="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							<?php foreach ( $job['cards'] as $card ) : ?>
								<div class="<?php echo esc_attr( 'group relative overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ' . $s['ring'] . ' p-5 transition-all duration-300 hover:-translate-y-0.5' ); ?>">
									<div class="<?php echo esc_attr( 'absolute inset-x-0 top-0 h-[2px] ' . $s['topBar'] ); ?>" aria-hidden="true"></div>
									<?php // Two tint blobs per card so the color reads clearly. ?>
									<div
										aria-hidden="true"
										class="<?php echo esc_attr( 'pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full ' . $s['ambient'] . ' blur-2xl opacity-80 transition-opacity duration-500 group-hover:opacity-100' ); ?>"
									></div>
									<div
										aria-hidden="true"
										class="<?php echo esc_attr( 'pointer-events-none absolute -bottom-14 -left-14 h-32 w-32 rounded-full ' . $s['ambient'] . ' blur-2xl opacity-45' ); ?>"
									></div>
									<div class="relative">
										<div class="flex items-center gap-2.5">
											<span aria-hidden="true" class="<?php echo esc_attr( 'h-2 w-2 shrink-0 rounded-full ' . $s['iconBg'] ); ?>"></span>
											<div class="font-serif text-[17px] font-medium leading-tight tracking-tight text-brand-text">
												<?php echo esc_html( $card['title'] ); ?>
											</div>
										</div>
										<p class="mt-2.5 text-[13.5px] leading-relaxed text-brand-textMute">
											<?php echo esc_html( $card['body'] ); ?>
										</p>
									</div>
								</div>
							<?php endforeach; ?>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<?php // BOTTOM CTA. ?>
	<section class="relative px-6 py-14 md:px-10 md:py-16">
		<div class="relative mx-auto max-w-screen-xl overflow-hidden rounded-[32px] bg-white/[0.02] ring-1 ring-white/8 px-8 py-12 md:px-14 md:py-14">
			<div
				aria-hidden="true"
				class="pointer-events-none absolute -top-20 right-24 h-72 w-72 rounded-full bg-brand-violet/18 blur-3xl animate-float-slow"
			></div>

			<div class="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
				<div>
					<h2 class="font-serif text-3xl md:text-4xl font-medium leading-[1.05] tracking-tight text-brand-text">
						Watch Rynk work <span class="italic text-brand-blueSoft">on your site.</span>
					</h2>
					<p class="mt-2 text-[15px] leading-[1.7] text-brand-textMute">
						Enter your website URL and see what Rynk has to say.
					</p>
				</div>
				<div class="flex shrink-0 flex-wrap items-center gap-6">
					<a
						href="<?php echo esc_url( home_url( '/sign-in' ) ); ?>"
						class="group inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-7 font-serif text-[16px] font-medium text-brand-ink transition-all hover:shadow-[0_14px_36px_-14px_rgba(255,255,255,0.4)]"
					>
						Get started
						<?php echo rynk_icon( 'arrow-right', 'h-4 w-4 transition-transform group-hover:translate-x-0.5' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					</a>
					<a
						href="<?php echo esc_url( home_url( '/pricing/' ) ); ?>"
						class="group inline-flex items-center gap-2 font-serif text-[16px] text-brand-textMute transition-colors hover:text-brand-text"
					>
						See pricing
						<?php echo rynk_icon( 'arrow-up-right', 'h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					</a>
				</div>
			</div>
		</div>
	</section>
</div>

<?php
get_footer();
