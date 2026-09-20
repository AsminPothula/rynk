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
					works. Ready to see the plans?
					<a href="<?php echo esc_url( home_url( '/pricing/' ) ); ?>" class="text-brand-blueSoft underline underline-offset-2 transition-colors hover:text-brand-text">pick the tier that fits your business</a>.
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
					Built around four jobs.
				</h2>
				<p class="mt-5 max-w-3xl text-[15px] leading-[1.75] text-brand-textMute">
					Every fix, every published page, and every outreach email traces back to one of four jobs Rynk runs on repeat: analyze, generate, publish, and monitor.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<?php
				$jobs = array(
					array(
						'tint'  => 'violet',
						'step'  => '01',
						'title' => 'Analyze',
						'copy'  => 'Rynk crawls your site the way a visitor, Google, and an AI assistant each would, then flags what\'s missing: broken titles, thin pages, duplicate content, and gaps against your competitors.',
					),
					array(
						'tint'  => 'blue',
						'step'  => '02',
						'title' => 'Generate',
						'copy'  => 'From that audit, Rynk drafts the fixes and new content your site needs - rewritten titles and meta descriptions, new landing pages, blog posts, and outreach emails.',
					),
					array(
						'tint'  => 'emerald',
						'step'  => '03',
						'title' => 'Publish',
						'copy'  => 'Approved changes deploy straight to your live site - no developer, no manual copy-paste, no waiting on an agency\'s queue.',
					),
					array(
						'tint'  => 'pink',
						'step'  => '04',
						'title' => 'Monitor',
						'copy'  => 'Rynk keeps watching rankings, AI citations, and technical health every week, and adjusts automatically as algorithms and AI platforms change.',
					),
				);
				?>
				<?php foreach ( $jobs as $job ) : ?>
					<?php $s = $tint_styles[ $job['tint'] ]; ?>
					<div class="<?php echo esc_attr( 'relative overflow-hidden rounded-3xl bg-white/[0.03] ring-1 ' . $s['ring'] . ' p-7 md:p-8' ); ?>">
						<div class="<?php echo esc_attr( 'absolute inset-x-0 top-0 h-[2px] ' . $s['topBar'] ); ?>" aria-hidden="true"></div>
						<div
							aria-hidden="true"
							class="<?php echo esc_attr( 'pointer-events-none absolute -top-14 -right-14 h-40 w-40 rounded-full ' . $s['ambient'] . ' blur-3xl opacity-70' ); ?>"
						></div>

						<div class="relative">
							<span class="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-violetSoft">
								<?php echo esc_html( $job['step'] ); ?>
							</span>
							<h3 class="mt-3 font-serif text-2xl font-medium tracking-tight text-brand-text">
								<?php echo esc_html( $job['title'] ); ?>
							</h3>
							<p class="mt-3 text-[14px] leading-relaxed text-brand-textMute">
								<?php echo esc_html( $job['copy'] ); ?>
							</p>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<?php // Section divider. ?>
	<div class="px-6 md:px-10" aria-hidden="true">
		<div class="mx-auto max-w-screen-xl">
			<div class="h-px w-full bg-gradient-to-r from-transparent via-brand-hairline to-transparent"></div>
		</div>
	</div>

	<?php // FAQ - common automation / technical-SEO questions. ?>
	<section class="relative px-6 py-14 md:px-10 md:py-16">
		<div class="relative mx-auto max-w-screen-xl">
			<div class="mb-12 max-w-2xl">
				<p class="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-emeraldSoft">
					Common questions
				</p>
				<h2 class="mt-3 font-serif text-4xl md:text-5xl font-medium tracking-tight text-brand-text">
					Frequently asked.
				</h2>
			</div>

			<div class="grid max-w-3xl gap-4">
				<?php
				$faqs = array(
					array(
						'q' => 'How much manual work does Rynk still require?',
						'a' => 'Very little. Rynk audits your site, drafts the fixes and content it recommends, and, once approved, publishes directly to your site. You review and approve; Rynk does the implementation.',
					),
					array(
						'q' => 'How long before I see results?',
						'a' => 'Technical fixes typically go live within days. Rankings and AI citations build over weeks as search engines and AI assistants re-crawl your site and register the changes.',
					),
					array(
						'q' => 'Does Rynk replace an SEO agency?',
						'a' => 'For most small and midsize businesses, yes. Rynk automates the audit, fix, content, and monitoring work an agency would otherwise do manually, at a fraction of the cost.',
					),
				);
				?>
				<?php foreach ( $faqs as $faq ) : ?>
					<div class="rounded-3xl bg-white/[0.03] ring-1 ring-white/8 p-7 md:p-8">
						<h3 class="font-serif text-xl md:text-[22px] font-medium leading-snug tracking-tight text-brand-text">
							<?php echo esc_html( $faq['q'] ); ?>
						</h3>
						<p class="mt-3 text-[15px] leading-[1.75] text-brand-textMute">
							<?php echo esc_html( $faq['a'] ); ?>
						</p>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<?php // BOTTOM CTA. ?>
	<section class="relative px-6 py-14 md:px-10 md:py-16">
		<div class="relative mx-auto max-w-screen-xl overflow-hidden rounded-[32px] bg-white/[0.02] px-8 py-12 md:px-14 md:py-14 ring-1 ring-white/8">
			<div
				aria-hidden="true"
				class="pointer-events-none absolute -top-20 right-24 h-72 w-72 rounded-full bg-brand-blue/15 blur-3xl animate-float-slow"
			></div>

			<div class="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
				<div>
					<h3 class="font-serif text-3xl md:text-4xl font-medium tracking-tight">
						Ready to put leads <span class="italic text-brand-blueSoft">on autopilot?</span>
					</h3>
					<p class="mt-2 text-[15px] text-brand-textMute">
						Sign in to your Rynk dashboard, or see the plans first.
					</p>
				</div>
				<div class="flex w-full flex-col gap-3 sm:flex-row md:ml-10 md:w-auto">
					<a
						href="<?php echo esc_url( rynk_app_url( '/sign-in' ) ); ?>"
						class="group inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-white px-7 font-serif text-[16px] font-medium text-brand-ink transition-all hover:shadow-[0_14px_36px_-14px_rgba(255,255,255,0.4)]"
					>
						Sign in
						<?php echo rynk_icon( 'arrow-right', 'h-4 w-4 transition-transform group-hover:translate-x-0.5' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					</a>
				</div>
			</div>
		</div>
	</section>
</div>

<?php
get_footer();