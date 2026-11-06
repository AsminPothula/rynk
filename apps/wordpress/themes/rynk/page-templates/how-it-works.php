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
      "name": "How It Works",
      "item": "https://rynk.ai/how-it-works/"
    }
  ]
}
</script>

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
				Rynk runs four steps on autopilot: audit, fix, generate, and monitor. Every month, your site gets stronger on Google and more visible to AI assistants like ChatGPT and Perplexity.
				Ready to get started? <a href="<?php echo esc_url( home_url( '/pricing/' ) ); ?>" class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors">See Rynk pricing plans.</a>
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
					Most local businesses are invisible online not because their work is poor, but because their site is missing the technical signals, the content, and the structured information that Google and AI assistants look for. Rynk fixes all three automatically, every month, without you needing to understand any of it.
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
					Rynk audits your site, fixes what&rsquo;s broken, generates and publishes new content, and monitors what happens next. The same four steps, running on autopilot every month.
				</p>
			</div>

			<div class="space-y-16">
				<?php foreach ( rynk_jobs() as $job ) : ?>
					<?php $s = $tint_styles[ $job['tint'] ]; ?>
					<div>
						<?php // Job header - colored number chip + name. ?>
						<div class="flex items-center gap-4">
							<span class="<?php echo esc_attr( 'inline-flex h-9 shrink-0 items-center justify-center rounded-full px-4 ' . $s['iconBg'] . ' font-serif text-[15px] font-medium ' . $s['iconText'] . ' shadow-[0_6px_16px_-4px_rgba(0,0,0,0.5)]' ); ?>">
								Step <?php echo esc_html( $job['n'] ); ?>
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

	<?php // WHY GOOGLE AND AI ASSISTANTS BOTH MATTER. ?>
	<section class="relative px-6 py-14 md:px-10 md:py-16">
		<div class="relative mx-auto max-w-screen-xl">
			<div class="overflow-hidden rounded-3xl bg-white/[0.02] ring-1 ring-white/8 p-8 md:p-12">
				<div
					aria-hidden="true"
					class="pointer-events-none absolute -top-16 right-12 h-72 w-72 rounded-full bg-brand-blue/12 blur-3xl animate-float-slow"
				></div>
				<div class="relative grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-start">
					<div>
						<p class="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-violetSoft">
							Two audiences, one platform
						</p>
						<h2 class="mt-3 font-serif text-4xl md:text-5xl font-medium tracking-tight text-brand-text">
							Why Google and AI assistants both matter now.
						</h2>
						<p class="mt-5 text-[15px] leading-[1.75] text-brand-textMute">
							More customers are getting recommendations from ChatGPT, Perplexity, and Google AI Overviews before they ever click a search result. Most SEO tools optimise for one or the other. Rynk optimises for both in every cycle, building the trust signals AI assistants look for alongside the technical signals Google requires.
						</p>
					</div>
					<div class="grid gap-3 sm:grid-cols-2">
						<?php
						$signals = array(
							array(
								'label' => 'Google ranking signals',
								'body'  => 'Technical SEO, internal linking, page authority, and keyword-targeted content all feed into where Google places your pages.',
								'tint'  => 'text-brand-blueSoft',
								'dot'   => 'bg-brand-blue/60',
								'ring'  => 'ring-brand-blue/20',
							),
							array(
								'label' => 'AI assistant citations',
								'body'  => 'ChatGPT, Perplexity, and Google AI Overviews prefer clear question-and-answer structures, schema markup, and consistent local business information.',
								'tint'  => 'text-brand-violetSoft',
								'dot'   => 'bg-brand-violet/60',
								'ring'  => 'ring-brand-violet/20',
							),
							array(
								'label' => 'Local keyword coverage',
								'body'  => 'Your city, service area, and specific services woven into every page gives local search engines the signals they need.',
								'tint'  => 'text-brand-emeraldSoft',
								'dot'   => 'bg-brand-emerald/60',
								'ring'  => 'ring-brand-emerald/20',
							),
							array(
								'label' => 'Consistent monthly publishing',
								'body'  => 'Sites that add multiple optimised pages per month build search momentum far faster than those that update occasionally.',
								'tint'  => 'text-brand-pinkSoft',
								'dot'   => 'bg-brand-pink/60',
								'ring'  => 'ring-brand-pink/20',
							),
						);
						foreach ( $signals as $sig ) :
						?>
							<div class="<?php echo esc_attr( 'flex flex-col gap-2 rounded-2xl bg-white/[0.03] ring-1 ' . $sig['ring'] . ' p-5' ); ?>">
								<span class="flex items-center gap-2">
									<span class="<?php echo esc_attr( 'h-2 w-2 shrink-0 rounded-full ' . $sig['dot'] ); ?>" aria-hidden="true"></span>
									<span class="<?php echo esc_attr( 'font-serif text-[15px] font-medium ' . $sig['tint'] ); ?>">
										<?php echo esc_html( $sig['label'] ); ?>
									</span>
								</span>
								<p class="pl-4 text-[13.5px] leading-relaxed text-brand-textMute">
									<?php echo esc_html( $sig['body'] ); ?>
								</p>
							</div>
						<?php endforeach; ?>
					</div>
				</div>
			</div>
		</div>
	</section>

	<?php // BLOG CALLOUT - internal links to blog articles. ?>
	<section class="px-6 pb-6 md:px-10 md:pb-8">
		<div class="mx-auto max-w-screen-xl">
			<div class="rounded-2xl bg-white/[0.03] ring-1 ring-white/10 px-7 py-6 md:px-8">
				<p class="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-violetSoft">From the blog</p>
				<p class="mt-2 font-serif text-xl font-medium tracking-tight text-brand-text">
					Want to go deeper on how Rynk works?
				</p>
				<p class="mt-1.5 text-[14px] leading-relaxed text-brand-textMute">
					Read our guide on
					<a
						href="<?php echo esc_url( home_url( '/blog/answer-engine-optimization/' ) ); ?>"
						class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors"
					>answer engine optimization for small businesses</a>
					to understand how Rynk makes your site visible in ChatGPT and AI Overviews. Or dive into
					<a
						href="<?php echo esc_url( home_url( '/blog/how-to-search-for-a-keyword-on-a-web-page/' ) ); ?>"
						class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors"
					>how to search for a keyword on a web page</a>
					and see how
					<a
						href="<?php echo esc_url( home_url( '/blog/ai-powered-content-generation-for-seo/' ) ); ?>"
						class="text-brand-blueSoft underline underline-