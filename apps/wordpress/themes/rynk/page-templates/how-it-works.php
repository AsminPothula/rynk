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
				We audit your site, generate the fixes and content it needs, and deploy those
				changes straight to your site - no manual intervention needed. As the
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
					More customers reaching out to you - here&rsquo;s what Rynk delivers.
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
				<h2 class="mt-3 font-serif text-4xl md:text-5xl font-medium tracking-tight text-brand-text">
					Built in 4 steps.
				</h2>
				<p class="mt-5 text-[15px] leading-[1.75] text-brand-textMute">
					Rynk audits your site, updates what&rsquo;s broken, generates and
					publishes new content, and monitors what happens next - the same
					four steps, running on autopilot.
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
						Watch Rynk live <span class="italic text-brand-blueSoft">on your site.</span>
					</h2>
					<p class="mt-2 text-[15px] leading-[1.7] text-brand-textMute">
						Enter your website URL and see the immediate assessment.
					</p>
				</div>
				<div class="w-full shrink-0 md:w-auto md:min-w-[360px]">
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
		</div>
	</section>
</div>

<?php
get_footer();
