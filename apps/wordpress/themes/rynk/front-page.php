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
							Rynk is the first end-to-end AI-powered SEO platform that makes your website generate more leads - effortlessly. It audits your site, identifies exactly what&rsquo;s stopping you from showing up in search, then deploys the fixes and generates content directly on your website - no SEO expertise or manual intervention needed.
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

	<?php // FAQ. ?>
	<section class="relative px-6 py-14 md:px-10 md:py-16" itemscope itemtype="https://schema.org/FAQPage">
		<div
			aria-hidden="true"
			class="pointer-events-none absolute -top-10 right-8 h-72 w-72 rounded-full bg-brand-blue/12 blur-3xl animate-float-slow"
		></div>
		<div
			aria-hidden="true"
			class="pointer-events-none absolute bottom-0 left-8 h-72 w-72 rounded-full bg-brand-violet/10 blur-3xl animate-float-slow"
			style="animation-delay: 5s;"
		></div>

		<div class="relative mx-auto max-w-screen-xl">
			<div class="mb-12">
				<p class="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-violetSoft">
					FAQ
				</p>
				<h2 class="mt-3.5 font-serif text-5xl md:text-6xl font-medium tracking-tight text-brand-text">
					Common <span class="italic text-brand-blueSoft">questions.</span>
				</h2>
				<p class="mt-6 text-[15px] leading-[1.75] text-brand-textMute">
					Everything you need to know about Rynk and AI-powered SEO automation.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<?php
				$faqs = array(
					array(
						'question' => 'What is AI SEO automation and how can it help my business?',
						'answer'   => 'AI SEO automation means software handles every step of improving your search visibility for you, from auditing your site to fixing technical problems to publishing new content. Rynk is an AI SEO automation platform built for small local businesses. Instead of hiring an agency or learning SEO yourself, you connect your site and Rynk does the work automatically, so more customers find you on Google and inside AI assistants like ChatGPT.',
					),
					array(
						'question' => 'What is an automated SEO platform and how does it work?',
						'answer'   => 'An automated SEO platform audits your website, identifies what is holding back your rankings, applies the fixes, and publishes optimized content, all without you doing it manually. Rynk is an automated SEO platform that runs this process on a continuous cycle: it scans your site, deploys technical fixes directly to WordPress, writes and publishes new pages and blog posts, and monitors your rankings every week so results keep improving over time.',
					),
					array(
						'question' => 'What is automated SEO for small business?',
						'answer'   => 'Automated SEO for small business is a done-for-you approach where software replaces the agency or consultant, handling audits, fixes, content, and monitoring on your behalf. Rynk was built specifically for this: it is scoped and priced for a single local business, starting at $149 per month, and requires zero SEO knowledge from the owner. You get the same results an agency delivers, without the cost or the learning curve.',
					),
					array(
						'question' => 'How do I do SEO for my small business?',
						'answer'   => 'SEO for a small business involves fixing technical issues on your site, writing keyword-rich content, optimizing your Google Business Profile, and building credibility signals so search engines trust you. The fastest way to do all of this without hiring an agency is to use a platform like Rynk, which audits your site, applies every fix automatically, and publishes the content your site needs, so you can focus on running your business while Rynk handles the visibility.',
					),
					array(
						'question' => 'How can I get my business to show up in ChatGPT?',
						'answer'   => 'To show up in ChatGPT and other AI assistants, your website needs clear, well-structured content that directly answers questions your customers ask, plus schema markup and credibility signals that AI crawlers can read and quote. Rynk builds all of this for you automatically, including FAQ content, structured data, and AI-readable page formatting, which is called Answer Engine Optimization or AEO. Businesses that use Rynk are continuously optimized to be cited by ChatGPT, Perplexity, Gemini, and Google AI Overviews.',
					),
					array(
						'question' => 'What is AI search engine optimization?',
						'answer'   => 'AI search engine optimization, also called AEO or GEO, is the practice of structuring your website so AI-powered answer engines like ChatGPT, Perplexity, and Google AI Overviews can read, understand, and cite your business in their responses. Unlike traditional SEO which targets ranked links, AI search optimization targets direct citations inside AI-generated answers. Rynk handles both at once, making your site visible on Google search results and inside AI assistant answers, with no manual work required from you.',
					),
					array(
						'question' => 'What is the best local business SEO software?',
						'answer'   => 'The best local business SEO software for a small owner is one that does the work for you, not just reports what is wrong. Rynk is built specifically for local businesses like restaurants, salons, spas, and service providers, and it is the only platform that automates both traditional Google SEO and AI assistant visibility in one tool. Plans start at $149 per month, with no SEO knowledge or agency required.',
					),
					array(
						'question' => 'How can AI content generation help with my SEO?',
						'answer'   => 'AI content generation helps your SEO by producing keyword-targeted blog posts, landing pages, and FAQ content at a pace and volume that would otherwise require a full content team. Rynk uses AI content generation to write and publish pages directly to your WordPress site every month, targeting the exact searches your local customers make. More relevant pages means more opportunities to rank on Google and get cited by AI assistants.',
					),
					array(
						'question' => 'What is a website optimization tool and do I need one?',
						'answer'   => 'A website optimization tool analyzes your site for technical issues, content gaps, and ranking opportunities, then helps you fix them so more customers find you online. If your business is not showing up when locals search for what you offer, yes, you need one. Rynk goes further than a standard website optimization tool by not just identifying problems but automatically applying the fixes and publishing new content, so you see real ranking improvements without touching a line of code.',
					),
					array(
						'question' => 'How do I rank on Google and AI assistants at the same time?',
						'answer'   => 'Ranking on Google and getting cited by AI assistants requires overlapping but distinct strategies: technical SEO, quality content, structured data, and AI-readable formatting all working together. Most tools focus on only one side. Rynk is built to do both simultaneously, running a continuous optimization cycle that covers technical fixes, on-page content, schema markup, and AEO signals so your business ranks in Google search results and appears in answers from ChatGPT, Perplexity, and Gemini.',
					),
				);
				foreach ( $faqs as $faq ) :
				?>
					<div
						class="group relative overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ring-white/8 p-6 transition-all duration-300 hover:-translate-y-0.5"
						itemscope
						itemprop="mainEntity"
						itemtype="https://schema.org/Question"
					>
						<div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-brand-violet/60 via-brand-blue/60 to-transparent" aria-hidden="true"></div>
						<div
							aria-hidden="true"
							class="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-brand-violet/10 blur-2xl opacity-70 transition-opacity duration-500 group-hover:opacity-100"
						></div>
						<div class="relative">
							<h3 class="font-serif text-[17px] font-medium leading-snug tracking-tight text-brand-text" itemprop="name">
								<?php echo esc_html( $faq['question'] ); ?>
							</h3>
							<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
								<p class="mt-3 text-[13.5px] leading-relaxed text-brand-textMute" itemprop="text">
									<?php echo esc_html( $faq['answer'] ); ?>
								</p>
							</div>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "FAQPage",
		"mainEntity": [
			{
				"@type": "Question",
				"name": "What is AI SEO automation and how can it help my business?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "AI SEO automation means software handles every step of improving your search visibility for you, from auditing your site to fixing technical problems to publishing new content. Rynk is an AI SEO automation platform built for small local businesses. Instead of hiring an agency or learning SEO yourself, you connect your site and Rynk does the work automatically, so more customers find you on Google and inside AI assistants like ChatGPT."
				}
			},
			{
				"@type": "Question",
				"name": "What is an automated SEO platform and how does it work?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "An automated SEO platform audits your website, identifies what is holding back your rankings, applies the fixes, and publishes optimized content, all without you doing it manually. Rynk is an automated SEO platform that runs this process on a continuous cycle: it scans your site, deploys technical fixes directly to WordPress, writes and publishes new pages and blog posts, and monitors your rankings every week so results keep improving over time."
				}
			},
			{
				"@type": "Question",
				"name": "What is automated SEO for small business?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Automated SEO for small business is a done-for-you approach where software replaces the agency or consultant, handling audits, fixes, content, and monitoring on your behalf. Rynk was built specifically for this: it is scoped and priced for a single local business, starting at $149 per month, and requires zero SEO knowledge from the owner. You get the same results an agency delivers, without the cost or the learning curve."
				}
			},
			{
				"@type": "Question",
				"name": "How do I do SEO for my small business?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "SEO for a small business involves fixing technical issues on your site, writing keyword-rich content, optimizing your Google Business Profile, and building credibility signals so search engines trust you. The fastest way to do all of this without hiring an agency is to use a platform like Rynk, which audits your site, applies every fix automatically, and publishes the content your site needs, so you can focus on running your business while Rynk handles the visibility."
				}
			},
			{
				"@type": "Question",
				"name": "How can I get my business to show up in ChatGPT?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "To show up in ChatGPT and other AI assistants, your website needs clear, well-structured content that directly answers questions your customers ask, plus schema markup and credibility signals that AI crawlers can read and quote. Rynk builds all of this for you automatically, including FAQ content, structured data, and AI-readable page formatting, which is called Answer Engine Optimization or AEO. Businesses that use Rynk are continuously optimized to be cited by ChatGPT, Perplexity, Gemini, and Google AI Overviews."
				}
			},
			{
				"@type": "Question",
				"name": "What is AI search engine optimization?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "AI search engine optimization, also called AEO or GEO, is the practice of structuring your website so AI-powered answer engines like ChatGPT, Perplexity, and Google AI Overviews can read, understand, and cite your business in their responses. Unlike traditional SEO which targets ranked links, AI search optimization targets direct citations inside AI-generated answers. Rynk handles both at once, making your site visible on Google search results and inside AI assistant answers, with no manual work required from you."
				}
			},
			{
				"@type": "Question",
				"name": "What is the best local business SEO software?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "The best local business SEO software for a small owner is one that does the work for you, not just reports what is wrong. Rynk is built specifically for local businesses like restaurants, salons, spas, and service providers, and it is the only platform that automates both traditional Google SEO and AI assistant visibility in one tool. Plans start at $149 per month, with no SEO knowledge or agency required."
				}
			},
			{
				"@type": "Question",
				"name": "How can AI content generation help with my SEO?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "AI content generation helps your SEO by producing keyword-targeted blog posts, landing pages, and FAQ content at a pace and volume that would otherwise require a full content team. Rynk uses AI content generation to write and publish pages directly to your WordPress site every month, targeting the exact searches your local customers make. More relevant pages means more opportunities to rank on Google and get cited by AI assistants."
				}
			},
			{
				"@type": "Question",
				"name": "What is a website optimization tool and do I need one?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "A website optimization tool analyzes your site for technical issues, content gaps, and ranking opportunities, then helps you fix them so more customers find you online. If your business is not showing up when locals search for what you offer, yes, you need one. Rynk goes further than a standard website optimization tool by not just identifying problems but automatically applying the fixes and publishing new content, so you see real ranking improvements without touching a line of code."
				}
			},
			{
				"@type": "Question",
				"name": "How do I rank on Google and AI assistants at the same time?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Ranking on Google and getting cited by AI assistants requires overlapping but distinct strategies: technical SEO, quality content, structured data, and AI-readable formatting all working together. Most tools focus on only one side. Rynk is built to do both simultaneously, running a continuous optimization cycle that covers technical fixes, on-page content, schema markup, and AEO signals so your business ranks in Google search results and appears in answers from ChatGPT, Perplexity, and Gemini."
				}
			}
		]
	}
	</script>
</div>

<?php
get_footer();