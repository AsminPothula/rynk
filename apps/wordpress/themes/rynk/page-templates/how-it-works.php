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
 *   4. FAQ           - common questions about automated SEO
 *   5. Bottom CTA    -> /try
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
				Rynk runs four steps on your site every month: audit, fix, publish, and monitor. You do not touch a thing.
			</p>
		</div>
	</section>

	<?php // WIDE INTRO IMAGE. ?>
	<section class="px-6 pb-6 md:px-10 md:pb-8">
		<div class="mx-auto max-w-screen-xl">
			<figure class="m-0">
				<img
					src="<?php echo esc_url( get_theme_file_uri( 'assets/img/rynk/how-it-works-wide-1.jpg' ) ); ?>"
					alt="A wide shot of a clean auto detailing bay with a freshly polished car, a technician inspecting the paint under bright workshop lighting, tools arranged on a rolling cart nearby"
					class="block w-full h-auto rounded-2xl ring-1 ring-white/8"
					loading="eager"
					decoding="async"
				/>
				<figcaption class="mt-3 font-mono text-[11px] text-brand-textMute/70 tracking-wide">
					Every great local business deserves the same shot at being found. Rynk makes it automatic.
				</figcaption>
			</figure>
		</div>
	</section>

	<?php // INTRO PARA. ?>
	<section class="relative px-6 py-4 md:px-10 md:py-6">
		<div class="relative mx-auto max-w-screen-xl">
			<p class="max-w-3xl text-[16px] leading-[1.8] text-brand-textMute">
				Every day, potential customers search Google, ChatGPT, and other AI tools for businesses exactly like yours. Whether your website shows up in those results comes down to dozens of technical and content signals that most small business owners have never had the time or budget to address. Rynk addresses all of them, automatically, every month.
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
					More customers reaching out to you &mdash; here&rsquo;s what Rynk delivers.
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
					publishes new content, and monitors what happens next &mdash; the same
					four steps, running on autopilot.
				</p>
			</div>

			<div class="space-y-20">

				<?php // Step 1: Audit. ?>
				<?php $s = $tint_styles['blue']; ?>
				<div>
					<div class="flex items-center gap-4">
						<span class="<?php echo esc_attr( 'inline-flex h-9 shrink-0 items-center justify-center rounded-full px-4 ' . $s['iconBg'] . ' font-serif text-[15px] font-medium ' . $s['iconText'] . ' shadow-[0_6px_16px_-4px_rgba(0,0,0,0.5)]' ); ?>">
							Step 1
						</span>
						<h3 class="<?php echo esc_attr( 'font-serif text-3xl md:text-4xl font-medium tracking-tight ' . $s['text'] ); ?>">
							Audit
						</h3>
					</div>
					<p class="mt-4 text-[15px] leading-[1.7] text-brand-textMute">
						We find every gap before it costs you a customer.
					</p>

					<?php // Beside image for Step 1. ?>
					<div class="mt-8 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10 md:items-start">
						<div>
							<p class="text-[15px] leading-[1.8] text-brand-textMute">
								Rynk crawls your entire website the same way Google does. It checks every page title, every meta description, every internal link, every piece of structured data, and every piece of content. It identifies duplicate pages that are splitting Google&rsquo;s attention, keywords you should be ranking for but are not, and technical errors that are quietly holding your site back. You get a clear picture of exactly what is working and what is not.
							</p>
						</div>
						<figure class="m-0 mt-6 md:mt-0">
							<img
								src="<?php echo esc_url( get_theme_file_uri( 'assets/img/rynk/how-it-works-beside-audit.jpg' ) ); ?>"
								alt="A close-up of a mechanic's hands examining an engine component under a bright workshop lamp, grease on the fingertips, tools on a workbench in soft focus behind"
								class="block w-full h-auto rounded-2xl ring-1 ring-white/8"
								loading="lazy"
								decoding="async"
							/>
							<figcaption class="mt-3 font-mono text-[11px] text-brand-textMute/70 tracking-wide">
								Rynk checks what Google checks, so nothing that matters is missed.
							</figcaption>
						</figure>
					</div>

					<?php // Capability cards for Audit. ?>
					<div class="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<?php foreach ( rynk_jobs()[0]['cards'] ?? array() as $card ) : ?>
							<div class="<?php echo esc_attr( 'group relative overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ' . $s['ring'] . ' p-5 transition-all duration-300 hover:-translate-y-0.5' ); ?>">
								<div class="<?php echo esc_attr( 'absolute inset-x-0 top-0 h-[2px] ' . $s['topBar'] ); ?>" aria-hidden="true"></div>
								<div aria-hidden="true" class="<?php echo esc_attr( 'pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full ' . $s['ambient'] . ' blur-2xl opacity-80 transition-opacity duration-500 group-hover:opacity-100' ); ?>"></div>
								<div aria-hidden="true" class="<?php echo esc_attr( 'pointer-events-none absolute -bottom-14 -left-14 h-32 w-32 rounded-full ' . $s['ambient'] . ' blur-2xl opacity-45' ); ?>"></div>
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

				<?php // Step 2: Fix. ?>
				<?php $s = $tint_styles['violet']; ?>
				<div>
					<div class="flex items-center gap-4">
						<span class="<?php echo esc_attr( 'inline-flex h-9 shrink-0 items-center justify-center rounded-full px-4 ' . $s['iconBg'] . ' font-serif text-[15px] font-medium ' . $s['iconText'] . ' shadow-[0_6px_16px_-4px_rgba(0,0,0,0.5)]' ); ?>">
							Step 2
						</span>
						<h3 class="<?php echo esc_attr( 'font-serif text-3xl md:text-4xl font-medium tracking-tight ' . $s['text'] ); ?>">
							Fix
						</h3>
					</div>
					<p class="mt-4 text-[15px] leading-[1.7] text-brand-textMute">
						We apply the changes directly. No action required from you.
					</p>
					<p class="mt-4 text-[15px] leading-[1.8] text-brand-textMute">
						Most SEO tools give you a report and leave you to figure out the fixes yourself. Rynk deploys the fixes. It rewrites page titles and meta descriptions with the keywords your customers search for, adds structured data so Google and AI assistants understand your business, connects your pages to each other so Google can navigate your site, and cleans up duplicate or thin pages. Every change is applied directly to your WordPress site.
					</p>

					<div class="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<?php foreach ( rynk_jobs()[1]['cards'] ?? array() as $card ) : ?>
							<div class="<?php echo esc_attr( 'group relative overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ' . $s['ring'] . ' p-5 transition-all duration-300 hover:-translate-y-0.5' ); ?>">
								<div class="<?php echo esc_attr( 'absolute inset-x-0 top-0 h-[2px] ' . $s['topBar'] ); ?>" aria-hidden="true"></div>
								<div aria-hidden="true" class="<?php echo esc_attr( 'pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full ' . $s['ambient'] . ' blur-2xl opacity-80 transition-opacity duration-500 group-hover:opacity-100' ); ?>"></div>
								<div aria-hidden="true" class="<?php echo esc_attr( 'pointer-events-none absolute -bottom-14 -left-14 h-32 w-32 rounded-full ' . $s['ambient'] . ' blur-2xl opacity-45' ); ?>"></div>
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

				<?php // Step 3: Publish. ?>
				<?php $s = $tint_styles['emerald']; ?>
				<div>
					<div class="flex items-center gap-4">
						<span class="<?php echo esc_attr( 'inline-flex h-9 shrink-0 items-center justify-center rounded-full px-4 ' . $s['iconBg'] . ' font-serif text-[15px] font-medium ' . $s['iconText'] . ' shadow-[0_6px_16px_-4px_rgba(0,0,0,0.5)]' ); ?>">
							Step 3
						</span>
						<h3 class="<?php echo esc_attr( 'font-serif text-3xl md:text-4xl font-medium tracking-tight ' . $s['text'] ); ?>">
							Publish
						</h3>
					</div>
					<p class="mt-4 text-[15px] leading-[1.7] text-brand-textMute">
						New pages, written and live, every month.
					</p>

					<div class="mt-8 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10 md:items-start">
						<div>
							<p class="text-[15px] leading-[1.8] text-brand-textMute">
								The businesses that rank highest on Google are not always the best businesses. They are the ones with the most relevant content. Rynk writes full blog posts and service pages targeting the exact searches your customers make, creates and uploads correctly sized images for every page, and publishes everything directly to your WordPress site. Over time, your site grows into a content library that covers every question a customer might search for before they call you.
							</p>
						</div>
						<figure class="m-0 mt-6 md:mt-0">
							<img
								src="<?php echo esc_url( get_theme_file_uri( 'assets/img/rynk/how-it-works-inset-publish.jpg' ) ); ?>"
								alt="A spa treatment room with folded white towels stacked on a shelf, essential oil bottles lined up on a wooden tray, soft natural light from a frosted window"
								class="block w-full h-auto rounded-2xl ring-1 ring-white/8"
								loading="lazy"
								decoding="async"
							/>
							<figcaption class="mt-3 font-mono text-[11px] text-brand-textMute/70 tracking-wide">
								New pages go live every month, building your visibility with every cycle.
							</figcaption>
						</figure>
					</div>

					<div class="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<?php foreach ( rynk_jobs()[2]['cards'] ?? array() as $card ) : ?>
							<div class="<?php echo esc_attr( 'group relative overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ' . $s['ring'] . ' p-5 transition-all duration-300 hover:-translate-y-0.5' ); ?>">
								<div class="<?php echo esc_attr( 'absolute inset-x-0 top-0 h-[2px] ' . $s['topBar'] ); ?>" aria-hidden="true"></div>
								<div aria-hidden="true" class="<?php echo esc_attr( 'pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full ' . $s['ambient'] . ' blur-2xl opacity-80 transition-opacity duration-500 group-hover:opacity-100' ); ?>"></div>
								<div aria-hidden="true" class="<?php echo esc_attr( 'pointer-events-none absolute -bottom-14 -left-14 h-32 w-32 rounded-full ' . $s['ambient'] . ' blur-2xl opacity-45' ); ?>"></div>
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

				<?php // Step 4: Monitor. ?>
				<?php $s = $tint_styles['pink']; ?>
				<div>
					<div class="flex items-center gap-4">
						<span class="<?php echo esc_attr( 'inline-flex h-9 shrink-0 items-center justify-center rounded-full px-4 ' . $s['iconBg'] . ' font-serif text-[15px] font-medium ' . $s['iconText'] . ' shadow-[0_6px_16px_-4px_rgba(0,0,0,0.5)]' ); ?>">
							Step 4
						</span>
						<h3 class="<?php echo esc_attr( 'font-serif text-3xl md:text-4xl font-medium tracking-tight ' . $s['text'] ); ?>">
							Monitor
						</h3>
					</div>
					<p class="mt-4 text-[15px] leading-[1.7] text-brand-textMute">
						Rankings shift. Rynk adjusts.
					</p>
					<p class="mt-4 text-[15px] leading-[1.8] text-brand-textMute">
						Google&rsquo;s algorithm updates constantly and your competitors are always making changes. Rynk tracks your keyword positions every week, watches how the top results change for your key searches, and feeds that information back into the next cycle. If a competitor makes a move, Rynk catches it early and responds before it costs you customers.
					</p>

					<div class="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<?php foreach ( rynk_jobs()[3]['cards'] ?? array() as $card ) : ?>
							<div class="<?php echo esc_attr( 'group relative overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ' . $s['ring'] . ' p-5 transition-all duration-300 hover:-translate-y-0.5' ); ?>">
								<div class="<?php echo esc_attr( 'absolute inset-x-0 top-0 h-[2px] ' . $s['topBar'] ); ?>" aria-hidden="true"></div>
								<div aria-hidden="true" class="<?php echo esc_attr( 'pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full ' . $s['ambient'] . ' blur-2xl opacity-80 transition-opacity duration-500 group-hover:opacity-100' ); ?>"></div>
								<div aria-hidden="true" class="<?php echo esc_attr( 'pointer-events-none absolute -bottom-14 -left-14 h-32 w-32 rounded-full ' . $s['ambient'] . ' blur-2xl opacity-45' ); ?>"></div>
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

			</div>
		</div>
	</section>

	<?php // GOOGLE AND AI ASSISTANTS. ?>
	<section class="relative px-6 py-14 md:px-10 md:py-16">
		<div
			aria-hidden="true"
			class="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-brand-cyan/10 blur-3xl animate-float-slow"
		></div>
		<div class="relative mx-auto max-w-screen-xl">
			<div class="relative overflow-hidden rounded-3xl bg-white/[0.03] ring-1 ring-white/8 px-8 py-10 md:px-12 md:py-12">
				<div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-blue/40 to-transparent" aria-hidden="true"></div>
				<div
					aria-hidden="true"
					class="pointer-events-none absolute -top-14 right-10 h-56 w-56 rounded-full bg-brand-blue/15 blur-3xl"
				></div>
				<div class="relative max-w-3xl">
					<p class="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-blueSoft mb-4">
						Beyond Google
					</p>
					<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
						Both Google and AI assistants. <span class="italic text-brand-blueSoft">Not just one.</span>
					</h2>
					<p class="mt-5 text-[15px] leading-[1.8] text-brand-textMute">
						Rynk is the only platform built to optimize for traditional Google search and AI answer engines at the same time. ChatGPT, Perplexity, Google AI Overviews, Gemini, and Copilot all pull answers from websites that write in clear, direct, quotable language. Rynk writes your content that way on purpose, so when someone asks an AI assistant for a recommendation in your category, your business has a real chance of being cited.
					</p>
				</div>
			</div>
		</div>
	</section>

	<?php // FAQ. ?>
	<section class="relative px-6 py-14 md:px-10 md:py-16">
		<div class="relative mx-auto max-w-screen-xl">
			<div class="mb-8">
				<p class="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-violetSoft">Common questions</p>
				<h2 class="mt-3 font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">Frequently asked questions.</h2>
			</div>
			<div class="space-y-4">
				<?php
				$faqs = array(
					array(
						'q' => 'What is an automated SEO platform and how does it work?',
						'a' => 'An automated SEO platform is a tool that handles search engine optimization tasks without requiring manual effort from the business owner. Instead of giving you a list of things to fix, it runs the audit, applies the technical fixes, generates the content, and publishes it directly to your website. Rynk runs this full cycle every month so your site continuously improves its visibility on Google and in AI search results.',
					),
					array(
						'q' => 'What is AI SEO automation and how can it help my business?',
						'a' => 'AI SEO automation uses artificial intelligence to identify the exact gaps between your website and the top-ranking competitors for your target searches, then generates and deploys the content and technical fixes needed to close those gaps. For a local business owner, it means getting the output of a full SEO team at a fraction of the cost, with no expertise required on your end.',
					),
					array(
						'q' => 'How can I get my business to show up in ChatGPT?',
						'a' => 'AI assistants like ChatGPT cite sources that directly answer questions in clear, well-structured language. To appear in those answers, your website needs content that matches the questions your customers ask, structured data that helps AI crawlers understand your business, and credibility signals like mentions on other sites. Rynk builds all of these as part of its standard monthly cycle.',
					),
					array(
						'q' => 'What is the best local business SEO software for a small business with no marketing team?',
						'a' => 'The best SEO software for a small local business is one that does the work for you rather than teaching you to do it yourself. Rynk is built specifically for this: it audits, fixes, writes, and publishes automatically, so a restaurant owner or salon owner gets professional SEO results without needing to hire anyone or learn anything.',
					),
					array(
						'q' => 'How do I rank on Google and AI assistants at the same time?',
						'a' => 'Google ranking depends on technical signals, keyword-focused content, and links. AI assistant citations depend on clear, direct, question-answering content and structured data. The good news is that most of what helps you rank on Google also helps you get cited by AI tools. Rynk optimizes for both simultaneously, which is what sets it apart from traditional SEO tools.',
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
	</section>

	<?php // FAQPage JSON-LD. ?>
	<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "FAQPage",
		"mainEntity": [
			{
				"@type": "Question",
				"name": "What is an automated SEO platform and how does it work?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "An automated SEO platform is a tool that handles search engine optimization tasks without requiring manual effort from the business owner. Instead of giving you a list of things to fix, it runs the audit, applies the technical fixes, generates the content, and publishes it directly to your website. Rynk runs this full cycle every month so your site continuously improves its visibility on Google and in AI search results."
				}
			},
			{
				"@type": "Question",
				"name": "What is AI SEO automation and how can it help my business?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "AI SEO automation uses artificial intelligence to identify the exact gaps between your website and the top-ranking competitors for your target searches, then generates and deploys the content and technical fixes needed to close those gaps. For a local business owner, it means getting the output of a full SEO team at a fraction of the cost, with no expertise required on your end."
				}
			},
			{
				"@type": "Question",
				"name": "How can I get my business to show up in ChatGPT?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "AI assistants like ChatGPT cite sources that directly answer questions in clear, well-structured language. To appear in those answers, your website needs content that matches the questions your customers ask, structured data that helps AI crawlers understand your business, and credibility signals like mentions on other sites. Rynk builds all of these as part of its standard monthly cycle."
				}
			},
			{
				"@type": "Question",
				"name": "What is the best local business SEO software for a small business with no marketing team?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "The best SEO software for a small local business is one that does the work for you rather than teaching you to do it yourself. Rynk is built specifically for this: it audits, fixes, writes, and publishes automatically, so a restaurant owner or salon owner gets professional SEO results without needing to hire anyone or learn anything."
				}
			},
			{
				"@type": "Question",
				"name": "How do I rank on Google and AI assistants at the same time?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Google ranking depends on technical signals, keyword-focused content, and links. AI assistant citations depend on clear, direct, question-answering content and structured data. The good news is that most of what helps you rank on Google also helps you get cited by AI tools. Rynk optimizes for both simultaneously, which is what sets it apart from traditional SEO tools."
				}
			}
		]
	}
	</script>

	<?php // INTERNAL LINKS TO BLOG. ?>
	<section class="relative px-6 pb-8 md:px-10 md:pb-10">
		<div class="relative mx-auto max-w-screen-xl space-y-4">
			<div class="relative overflow-hidden rounded-2xl bg-white/[0.02] ring-1 ring-white/8 px-7 py-6 md:flex md:items-center md:justify-between md:gap-10">
				<div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-violet/30 to-transparent" aria-hidden="true"></div>
				<p class="text-[15px] leading-[1.7] text-brand-textMute mb-4 md:mb-0">
					Wondering why your business isn&rsquo;t showing up on Google yet? We broke down the exact causes and fixes &mdash; from missing page titles to an incomplete Google Business Profile.
				</p>
				<a
					href="<?php echo esc_url( home_url( '/blog/why-isnt-my-business-showing-up-on-google/' ) ); ?>"
					class="group inline-flex shrink-0 items-center gap-2 font-serif text-[15px] text-brand-blueSoft transition-colors hover:text-brand-text"
				>
					Read the guide
					<?php echo rynk_icon( 'arrow-right', 'h-4 w-4 transition-transform group-hover:translate-x-0.5' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</a>
			</div>

			<div class="relative overflow-hidden rounded-2xl bg-white/[0.02] ring-1 ring-white/8 px-7 py-6 md:flex md:items-center md:justify-between md:gap-10">
				<div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-emerald/30 to-transparent" aria-hidden="true"></div>
				<p class="text-[15px] leading-[1.7] text-brand-textMute mb-4 md:mb-0">
					Want to know where your site currently ranks for your key search terms? Here&rsquo;s how to check your Google keyword positions.
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
						See Rynk run a live audit on your site. Enter your URL and get an instant look at what is holding your business back from showing up where customers are searching.
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
							aria-label="Run my free audit"
							class="flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 font-serif text-[14px] font-medium text-brand-ink transition-all group-hover:scale-105"
						>
							Run my free audit
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