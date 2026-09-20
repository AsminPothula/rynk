<?php
/**
 * Template Name: Rynk Content Marketing For Link Building
 *
 * /content-marketing-for-link-building/ - explains how Rynk's content
 * generation and outreach drive backlinks and mentions. Standalone page,
 * reached through in-content links from the AI SEO guide, How it Works, and
 * Pricing rather than the primary nav.
 *
 * Same layout grid as the rest of the marketing site:
 *   - sections: px-6 md:px-10, py-14 md:py-16
 *   - content: mx-auto max-w-screen-xl
 *
 * FAQPage + BreadcrumbList JSON-LD for this page is emitted in functions.php
 * (rynk_content_marketing_schema()) and must be kept in sync with the FAQ
 * section below.
 *
 * @package rynk-ai
 */

get_header();
?>

<div class="relative text-brand-text overflow-x-hidden">
	<?php // HERO + breadcrumb. ?>
	<section class="relative px-6 pt-16 pb-6 md:px-10 md:pt-20 md:pb-8">
		<div class="pointer-events-none absolute inset-0 bg-grid-brand opacity-50" aria-hidden="true"></div>
		<div class="relative mx-auto w-full max-w-3xl text-center">
			<nav aria-label="Breadcrumb" class="mb-5 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-brand-textMute animate-rise">
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="transition-colors hover:text-brand-text">Home</a>
				<span aria-hidden="true">/</span>
				<span class="text-brand-text">Content Marketing for Link Building</span>
			</nav>

			<p class="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft animate-rise" style="animation-delay: 40ms;">
				Content &amp; Link Building
			</p>
			<h1
				class="mt-5 font-serif text-5xl md:text-6xl font-medium leading-[1.02] tracking-tight animate-rise"
				style="animation-delay: 80ms;"
			>
				Content marketing that <span class="italic text-brand-blueSoft">earns links.</span>
			</h1>
			<p
				class="mt-6 text-[16px] leading-[1.75] text-brand-textMute animate-rise"
				style="animation-delay: 160ms;"
			>
				Backlinks and mentions still tell Google and AI assistants your business is worth trusting, and Rynk writes the content and outreach that earns them automatically.
			</p>
		</div>
	</section>

	<?php // WHY LINK BUILDING STILL MATTERS. ?>
	<section class="relative px-6 py-14 md:px-10 md:py-16">
		<div class="relative mx-auto max-w-screen-xl">
			<div class="max-w-3xl">
				<h2 class="font-serif text-4xl md:text-5xl font-medium tracking-tight text-brand-text">
					Why link building still matters for small business SEO
				</h2>
				<p class="mt-6 text-[15px] leading-[1.75] text-brand-textMute">
					When another website links to yours, mentions your business, or references your content, it signals to Google and to AI assistants that real sources vouch for you. For a small business competing against bigger sites with bigger marketing budgets, a handful of relevant mentions can matter more than dozens of pages of on-site content alone.
				</p>
			</div>

			<div class="mt-10 overflow-hidden rounded-3xl ring-1 ring-white/10">
				<img
					src="<?php echo esc_url( get_theme_file_uri( 'assets/img/rynk/content-marketing-for-link-building-1.jpg' ) ); ?>"
					alt="A cozy coffee shop table with a closed laptop, an open notebook full of handwritten blog topic ideas, and a cup of coffee, lit by soft window light"
					class="block aspect-[16/9] w-full object-cover"
					loading="lazy"
					decoding="async"
				/>
			</div>
			<p class="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-brand-textMute">
				Every blog post starts as a plan for what will earn a mention.
			</p>
		</div>
	</section>

	<?php // Section divider. ?>
	<div class="px-6 md:px-10" aria-hidden="true">
		<div class="mx-auto max-w-screen-xl">
			<div class="h-px w-full bg-gradient-to-r from-transparent via-brand-hairline to-transparent"></div>
		</div>
	</div>

	<?php // HOW RYNK TURNS CONTENT INTO BACKLINKS. ?>
	<section class="relative px-6 py-14 md:px-10 md:py-16">
		<div
			aria-hidden="true"
			class="pointer-events-none absolute -top-10 left-1/4 h-72 w-72 rounded-full bg-brand-violet/15 blur-3xl animate-float-slow"
		></div>

		<div class="relative mx-auto max-w-screen-xl">
			<div class="grid gap-10 lg:grid-cols-2 lg:items-center">
				<div>
					<p class="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-emeraldSoft">
						Under the hood
					</p>
					<h2 class="mt-3 font-serif text-4xl md:text-5xl font-medium tracking-tight text-brand-text">
						How Rynk turns content into backlinks.
					</h2>
					<p class="mt-5 text-[15px] leading-[1.75] text-brand-textMute">
						Rynk doesn&rsquo;t just publish blog posts and hope someone links to them. It writes the outreach emails asking relevant sites to mention your business, drafts LinkedIn, Reddit, and Threads posts that put your name in front of new audiences, and builds credibility reports that reference your business by name, all of which make it more likely other sites, and AI tools, cite you.
					</p>

					<ul class="mt-6 space-y-2.5">
						<?php
						$link_building = array(
							'New blogs and pages built around what your customers actually search for',
							'Outreach emails drafted and ready to send to relevant sites',
							'Social media posts for LinkedIn, Reddit, and Threads that put your name where AI tools look',
							'Credibility reports that mention your business to strengthen trust signals',
						);
						?>
						<?php foreach ( $link_building as $feature ) : ?>
							<li class="flex items-start gap-2 text-[14px] leading-snug">
								<?php echo rynk_icon( 'check', 'mt-0.5 h-4 w-4 shrink-0 text-brand-blueSoft' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
								<span class="text-brand-text/90"><?php echo esc_html( $feature ); ?></span>
							</li>
						<?php endforeach; ?>
					</ul>
				</div>

				<div>
					<div class="overflow-hidden rounded-3xl ring-1 ring-white/10">
						<img
							src="<?php echo esc_url( get_theme_file_uri( 'assets/img/rynk/content-marketing-for-link-building-2.jpg' ) ); ?>"
							alt="Close-up of a hand writing content topic ideas in a spiral notebook with a pen, surrounded by loose printed pages on a wooden table"
							class="block aspect-[4/3] w-full object-cover"
							loading="lazy"
							decoding="async"
						/>
					</div>
					<p class="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-brand-textMute">
						Content ideas are matched to real keyword opportunity before they&rsquo;re written.
					</p>
				</div>
			</div>
		</div>
	</section>

	<?php // CONTENT THAT EARNS LINKS WITHOUT AN AGENCY. ?>
	<section class="relative px-6 py-14 md:px-10 md:py-16">
		<div class="relative mx-auto max-w-screen-xl">
			<div class="grid gap-10 lg:grid-cols-[1fr_300px] lg:items-center">
				<div>
					<p class="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-violetSoft">
						No agency required
					</p>
					<h2 class="mt-3 font-serif text-4xl md:text-5xl font-medium tracking-tight text-brand-text">
						Content that earns links without an agency.
					</h2>
					<p class="mt-5 text-[15px] leading-[1.75] text-brand-textMute">
						Most small businesses can&rsquo;t afford a content team or a link-building retainer. Rynk&rsquo;s platform researches what to write, produces the content and images, drafts the outreach, and publishes directly to your site as part of your monthly plan, so the work an agency would charge thousands for happens automatically.
					</p>
				</div>

				<div class="mx-auto w-full max-w-xs lg:max-w-none">
					<div class="overflow-hidden rounded-3xl ring-1 ring-white/10">
						<img
							src="<?php echo esc_url( get_theme_file_uri( 'assets/img/rynk/content-marketing-for-link-building-3.jpg' ) ); ?>"
							alt="A small stack of blank kraft paper notecards tied with twine next to a pen and a cup of coffee on a rustic wooden desk"
							class="block aspect-square w-full object-cover"
							loading="lazy"
							decoding="async"
						/>
					</div>
					<p class="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-brand-textMute">
						Outreach drafts are ready to send, not left half-finished.
					</p>
				</div>
			</div>
		</div>
	</section>

	<?php // CTA. ?>
	<section class="relative px-6 py-14 md:px-10 md:py-16">
		<div class="relative mx-auto max-w-screen-xl overflow-hidden rounded-[32px] bg-white/[0.02] px-8 py-12 md:px-14 md:py-14 ring-1 ring-white/8">
			<div
				aria-hidden="true"
				class="pointer-events-none absolute -top-20 right-24 h-72 w-72 rounded-full bg-brand-blue/15 blur-3xl animate-float-slow"
			></div>

			<div class="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
				<div>
					<h3 class="font-serif text-3xl md:text-4xl font-medium tracking-tight">
						Watch Rynk live <span class="italic text-brand-blueSoft">on your site.</span>
					</h3>
					<p class="mt-2 text-[15px] text-brand-textMute">
						Enter your website URL and see the immediate assessment - why your customers aren&rsquo;t finding your site on Google or AI. Ready to pick a plan? <a href="<?php echo esc_url( home_url( '/pricing/' ) ); ?>" class="text-brand-blueSoft underline underline-offset-2 transition-colors hover:text-brand-text">see Rynk&rsquo;s pricing</a>.
					</p>
				</div>
				<div class="w-full md:ml-10 md:flex-1">
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

	<?php // FAQ - mirrored in the FAQPage schema emitted in functions.php. ?>
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
						'q' => 'How can I use content generation for SEO?',
						'a' => 'Use content generation to consistently publish pages and blog posts built around what your customers are actually searching for, then pair that content with outreach so other sites have a reason to link to it. Rynk automates both steps and publishes directly to your site.',
					),
					array(
						'q' => 'What\'s a good SEO audit tool to check my website?',
						'a' => 'A good SEO audit tool should check your whole site the way a visitor and Google would, flag duplicate or thin pages, and tell you exactly what\'s missing. Rynk runs this audit automatically and shows you the results before making any changes.',
					),
					array(
						'q' => 'How can I improve my Google rankings quickly?',
						'a' => 'The fastest wins usually come from fixing technical issues, broken titles, missing meta descriptions, duplicate pages, and publishing content aligned to keywords your customers actually search. Rynk finds and fixes these issues and generates new content in the same automated workflow.',
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
</div>

<?php
get_footer();