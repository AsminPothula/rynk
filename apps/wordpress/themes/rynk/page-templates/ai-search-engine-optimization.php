<?php
/**
 * Template Name: Rynk AI Search Engine Optimization
 *
 * /ai-search-engine-optimization/ - educational guide explaining what AI
 * search engine optimization is and how Rynk automates it. Standalone page,
 * reached through in-content links from How it Works and Pricing rather than
 * the primary nav.
 *
 * Same layout grid as the rest of the marketing site:
 *   - sections: px-6 md:px-10, py-14 md:py-16
 *   - content: mx-auto max-w-screen-xl
 *
 * FAQPage + BreadcrumbList JSON-LD for this page is emitted in functions.php
 * (rynk_ai_seo_schema()) and must be kept in sync with the FAQ section below.
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
				<span class="text-brand-text">AI Search Engine Optimization</span>
			</nav>

			<p class="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft animate-rise" style="animation-delay: 40ms;">
				AI SEO Guide
			</p>
			<h1
				class="mt-5 font-serif text-5xl md:text-6xl font-medium leading-[1.02] tracking-tight animate-rise"
				style="animation-delay: 80ms;"
			>
				AI search engine optimization, <span class="italic text-brand-blueSoft">made automatic.</span>
			</h1>
			<p
				class="mt-6 text-[16px] leading-[1.75] text-brand-textMute animate-rise"
				style="animation-delay: 160ms;"
			>
				AI search engine optimization means making sure your business shows up not just on Google, but everywhere AI assistants answer customer questions - and Rynk automates the entire process for you.
			</p>
		</div>
	</section>

	<?php // WHAT IS AI SEO. ?>
	<section class="relative px-6 py-14 md:px-10 md:py-16">
		<div class="relative mx-auto max-w-screen-xl">
			<div class="max-w-3xl">
				<h2 class="font-serif text-4xl md:text-5xl font-medium tracking-tight text-brand-text">
					What is AI search engine optimization?
				</h2>
				<p class="mt-6 text-[15px] leading-[1.75] text-brand-textMute">
					AI search engine optimization is the practice of structuring your website so both traditional search engines and AI assistants like ChatGPT, Perplexity, Claude, and Google AI Overview can find, understand, and recommend your business. It builds on everything traditional SEO already does - page titles, technical fixes, quality content - and adds the formatting and credibility signals AI tools specifically look for before they cite a source in an answer.
				</p>
			</div>

			<div class="mt-10 overflow-hidden rounded-3xl ring-1 ring-white/10">
				<img
					src="<?php echo esc_url( get_theme_file_uri( 'assets/img/rynk/ai-search-engine-optimization-1.jpg' ) ); ?>"
					alt="An overhead shot of a small home office desk showing an open notebook filled with handwritten keyword lists, a closed laptop, a mug of coffee, and a small potted plant in soft morning light"
					class="block aspect-[16/9] w-full object-cover"
					loading="lazy"
					decoding="async"
				/>
			</div>
			<p class="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-brand-textMute">
				Turning a website audit into a clear, actionable plan.
			</p>
		</div>
	</section>

	<?php // WHY TRADITIONAL SEO ALONE ISN'T ENOUGH. ?>
	<section class="relative px-6 py-14 md:px-10 md:py-16">
		<div
			aria-hidden="true"
			class="pointer-events-none absolute -top-10 left-1/4 h-72 w-72 rounded-full bg-brand-violet/15 blur-3xl animate-float-slow"
		></div>

		<div class="relative mx-auto max-w-screen-xl">
			<div class="mb-10 max-w-3xl">
				<p class="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-emeraldSoft">
					Why it matters
				</p>
				<h2 class="mt-3 font-serif text-4xl md:text-5xl font-medium tracking-tight text-brand-text">
					Traditional SEO alone isn&rsquo;t enough anymore.
				</h2>
				<p class="mt-5 text-[15px] leading-[1.75] text-brand-textMute">
					Customers used to click through ten blue links to find a business. Now a growing share of searches end with an AI-generated answer that names two or three businesses and stops there. If your site isn&rsquo;t structured for AI to read, extract, and trust, you can rank on page one of Google and still never get mentioned in the answer a customer actually sees.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<?php
				$why_matters = array(
					'Clear, extractable answers near the top of each page instead of buried marketing copy',
					'Consistent business information across your site, listings, and directories',
					'Structured formatting AI tools can parse without guessing',
					'Outside mentions and reviews that back up what your site claims about itself',
				);
				?>
				<?php foreach ( $why_matters as $point ) : ?>
					<div class="flex items-start gap-3 rounded-2xl bg-white/[0.03] ring-1 ring-white/8 p-5">
						<?php echo rynk_icon( 'check', 'mt-0.5 h-4 w-4 shrink-0 text-brand-emeraldSoft' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
						<p class="text-[14px] leading-relaxed text-brand-text/90"><?php echo esc_html( $point ); ?></p>
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

	<?php // HOW RYNK AUTOMATES IT. ?>
	<section class="relative px-6 py-14 md:px-10 md:py-16">
		<div
			aria-hidden="true"
			class="pointer-events-none absolute bottom-0 right-8 h-80 w-80 rounded-full bg-brand-cyan/12 blur-3xl animate-float-slow"
			style="animation-delay: 3s;"
		></div>

		<div class="relative mx-auto max-w-screen-xl">
			<div class="grid gap-10 lg:grid-cols-2 lg:items-center">
				<div>
					<p class="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-violetSoft">
						Under the hood
					</p>
					<h2 class="mt-3 font-serif text-4xl md:text-5xl font-medium tracking-tight text-brand-text">
						How Rynk automates it.
					</h2>
					<p class="mt-5 text-[15px] leading-[1.75] text-brand-textMute">
						Rynk audits your site the way a visitor, Google, and an AI assistant would each see it, then fixes what&rsquo;s holding you back and generates what&rsquo;s missing. That includes rewriting titles and descriptions, reformatting pages for AI readability, cleaning up duplicate content, and building the credibility signals that make AI tools more likely to reference your business by name. See exactly how the pipeline runs in <a href="<?php echo esc_url( home_url( '/how-it-works/' ) ); ?>" class="text-brand-blueSoft underline underline-offset-2 transition-colors hover:text-brand-text">how Rynk works in 4 steps</a>.
					</p>

					<ul class="mt-6 space-y-2.5">
						<?php
						$how_it_works = array(
							'AI readability formatting so assistants describe your business accurately',
							'Credibility reports and outreach emails that earn outside mentions',
							'Page connections so Google and AI tools find your relevant content',
							'Weekly monitoring that adjusts as AI platforms change how they rank',
						);
						?>
						<?php foreach ( $how_it_works as $feature ) : ?>
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
							src="<?php echo esc_url( get_theme_file_uri( 'assets/img/rynk/ai-search-engine-optimization-2.jpg' ) ); ?>"
							alt="Close-up of hands typing on a laptop keyboard at a wooden desk, with a stack of printed reports marked up with a highlighter sitting beside the keyboard"
							class="block aspect-[4/3] w-full object-cover"
							loading="lazy"
							decoding="async"
						/>
					</div>
					<p class="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-brand-textMute">
						Fixes deploy straight to your site, no developer needed.
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
						'q' => 'What is AI search engine optimization and how does it work?',
						'a' => 'AI search engine optimization is the process of formatting and structuring your website so AI assistants like ChatGPT and Perplexity can accurately read, trust, and cite your business alongside traditional Google rankings. It works by combining technical SEO fixes with AI-readable content formatting and outside credibility signals.',
					),
					array(
						'q' => 'How does AI SEO automation work to improve my website?',
						'a' => 'Rynk automates the process by auditing your full site, fixing technical issues like titles, meta descriptions, and duplicate pages, generating new content and images, and then deploying everything directly to your website with no manual work required.',
					),
					array(
						'q' => 'What does AI-powered search visibility mean for my site?',
						'a' => 'AI-powered search visibility means your business shows up not only in Google\u2019s organic results but also when customers ask AI tools direct questions, because your site is formatted in a way those tools can confidently reference.',
					),
					array(
						'q' => 'What is technical SEO automation and how does it help?',
						'a' => 'Technical SEO automation means software finds and fixes the behind-the-scenes issues, broken links, missing meta descriptions, duplicate pages, slow-loading content, that quietly stop your site from ranking, without you needing an SEO background.',
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