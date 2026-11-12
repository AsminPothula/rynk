<?php
/**
 * Template Name: Rynk SEO for Restaurants
 *
 * /seo-for-restaurants/ - vertical-specific landing page for restaurant owners
 * searching for SEO help without an agency.
 *
 * Reached via in-content links from /local-seo-software/, /ai-content-strategy/,
 * and /blog/. Not in the primary nav.
 *
 * @package rynk-ai
 */

get_header();

$image_base = get_theme_file_uri( 'assets/img/rynk/' );
?>

<script type="application/ld+json">
{
	"@context": "https://schema.org",
	"@type": "Article",
	"headline": "SEO for Restaurants: Get Found on Google and AI Search",
	"description": "Rynk automates SEO for restaurants - fixing technical issues, publishing optimized pages, and getting your business cited in ChatGPT and Google AI Overviews automatically.",
	"url": "<?php echo esc_url( home_url( '/seo-for-restaurants/' ) ); ?>",
	"publisher": {
		"@type": "Organization",
		"name": "Rynk",
		"url": "https://rynk.ai"
	}
}
</script>

<script type="application/ld+json">
{
	"@context": "https://schema.org",
	"@type": "FAQPage",
	"mainEntity": [
		{
			"@type": "Question",
			"name": "How do I get my restaurant to show up on Google?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "Google ranks restaurants based on the technical signals, content, and structured data on your website, plus your Google Business Profile. Rynk audits your site, fixes the technical gaps, publishes optimized pages targeting the searches your customers make, and reinforces your GBP signals - all automatically each month."
			}
		},
		{
			"@type": "Question",
			"name": "Why doesn't my restaurant show up when people ask ChatGPT for a recommendation?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "AI assistants need structured, clearly organized information to recommend a business confidently. Most restaurant websites lack the schema markup, FAQ content, and consistent business information that ChatGPT and Perplexity look for. Rynk adds these signals automatically."
			}
		},
		{
			"@type": "Question",
			"name": "How is Rynk different from paying an SEO agency?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "An SEO agency charges $500 to $2,000 or more per month and still requires your time for briefings and approvals. Rynk automates the same tasks - audit, fixes, content, publishing - for $149 per month with no involvement from you. It is built specifically for a single local business, not an enterprise client."
			}
		}
	]
}
</script>

<div class="relative text-brand-text overflow-x-hidden">

	<?php // HERO / BREADCRUMB. ?>
	<section class="relative px-6 pt-14 pb-6 md:px-10 md:pt-18 md:pb-8">
		<div class="pointer-events-none absolute inset-0 bg-grid-brand opacity-50" aria-hidden="true"></div>
		<div class="relative mx-auto max-w-screen-xl">

			<?php // Breadcrumb. ?>
			<nav class="mb-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-brand-textMute" aria-label="Breadcrumb">
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="transition-colors hover:text-brand-text">Home</a>
				<span aria-hidden="true">/</span>
				<span class="text-brand-violetSoft">SEO for Restaurants</span>
			</nav>

			<div class="max-w-3xl">
				<p class="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft animate-rise">
					Restaurant SEO
				</p>
				<h1
					class="mt-4 font-serif text-4xl md:text-5xl font-medium leading-[1.08] tracking-tight animate-rise"
					style="animation-delay: 60ms;"
				>
					SEO for Restaurants: Get Found When Customers Search
				</h1>
				<p
					class="mt-6 text-[17px] leading-[1.8] text-brand-textMute animate-rise"
					style="animation-delay: 160ms;"
				>
					For the restaurant owner with great food and genuine reviews who still never shows up when locals search for a place to eat.
				</p>
			</div>
		</div>
	</section>

	<?php // HERO IMAGE - wide. ?>
	<section class="px-6 pb-4 md:px-10 md:pb-6">
		<div class="mx-auto max-w-screen-xl">
			<figure class="m-0">
				<div class="aspect-[16/7] w-full overflow-hidden rounded-[20px]">
					<img
						src="<?php echo esc_url( $image_base . 'seo-for-restaurants-1.jpg' ); ?>"
						alt="A restaurant kitchen pass-through with two finished plates ready for service, garnished and plated neatly, warm overhead heat lamps, stainless steel surfaces, no people"
						class="block h-full w-full object-cover"
						loading="eager"
						decoding="async"
					/>
				</div>
				<figcaption class="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-brand-textMute">
					The quality is in the kitchen. Rynk makes sure Google and AI assistants can see it from the outside.
				</figcaption>
			</figure>
		</div>
	</section>

	<?php // INTRO PARA. ?>
	<section class="px-6 py-8 md:px-10 md:py-10">
		<div class="mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl">
				<p class="text-[16px] leading-[1.8] text-brand-textMute">
					Google does not know your food is excellent from a photo. It knows from the signals your website sends: the page titles, the structured data, the content that answers questions like "does this place have vegetarian options" or "is it good for a birthday dinner." Most restaurant websites have a homepage, a menu PDF, and a contact page - and that is not enough for Google to rank you above the competitor who hired an agency.
				</p>
			</div>
		</div>
	</section>

	<?php // H2: Why restaurants go unfound. ?>
	<section class="px-6 py-8 md:px-10 md:py-10">
		<div class="mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl">
				<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
					Why restaurants with great food still go unfound online
				</h2>
				<p class="mt-5 text-[16px] leading-[1.8] text-brand-textMute">
					The gap in AI search is especially wide. Research from the SOCi 2026 Local Visibility Index found that 83 percent of restaurants do not appear in AI-generated local recommendations at all. When a customer asks ChatGPT for the best Thai restaurant in their area, only a tiny fraction of restaurants have the structured signals that make them a confident recommendation.
				</p>
				<p class="mt-4 text-[16px] leading-[1.8] text-brand-textMute">
					The same gap exists on Google Maps. The restaurants that appear at the top of a local search are not necessarily better than yours. They have more pages, more structured information, and more consistent signals across their website and Google Business Profile. Rynk builds those signals automatically, every month, without you writing a single word or logging into a dashboard.
				</p>
				<p class="mt-4 text-[16px] leading-[1.8] text-brand-textMute">
					This is the same visibility problem that affects every local service business, and it is covered in depth in our guide on <a href="<?php echo esc_url( home_url( '/local-seo-software/' ) ); ?>" class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors">local SEO software for small businesses</a>. For restaurants specifically, the fastest path is an automated platform that handles the SEO work for you. If you run a salon or spa, we also have a dedicated guide on <a href="<?php echo esc_url( home_url( '/seo-for-salons/' ) ); ?>" class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors">SEO for salons and spas</a> that covers the same approach for beauty businesses.
				</p>
			</div>
		</div>
	</section>

	<?php // H2: What Rynk does. ?>
	<section class="px-6 py-8 md:px-10 md:py-10">
		<div class="mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl">
				<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
					What Rynk does for a restaurant's online visibility
				</h2>
				<p class="mt-5 text-[16px] leading-[1.8] text-brand-textMute">
					Every month, Rynk runs a complete cycle on your restaurant's site: audit, fix, generate, publish. Here is exactly what that covers.
				</p>
			</div>

			<div class="mx-auto mt-8 max-w-3xl">
				<ul class="grid gap-3 sm:grid-cols-2">
					<?php
					$items = array(
						array(
							'dot'  => 'bg-brand-violet/60',
							'ring' => 'ring-brand-violet/20',
							'text' => 'Publishes new pages targeting the searches your customers make: cuisine type, dietary options, occasion-specific queries.',
						),
						array(
							'dot'  => 'bg-brand-blue/60',
							'ring' => 'ring-brand-blue/20',
							'text' => 'Rewrites your page titles and meta descriptions so they match what people actually search for.',
						),
						array(
							'dot'  => 'bg-brand-emerald/60',
							'ring' => 'ring-brand-emerald/20',
							'text' => 'Adds schema markup including Restaurant, Menu, and FAQPage so Google can show rich results and AI assistants can cite your business.',
						),
						array(
							'dot'  => 'bg-brand-pink/60',
							'ring' => 'ring-brand-pink/20',
							'text' => 'Reinforces your Google Business Profile signals so you rank higher on Maps.',
						),
						array(
							'dot'  => 'bg-brand-cyan/60',
							'ring' => 'ring-brand-cyan/20',
							'text' => 'Creates FAQ content that answers the questions customers ask AI assistants before choosing a restaurant.',
						),
						array(
							'dot'  => 'bg-white/30',
							'ring' => 'ring-white/10',
							'text' => 'Tracks your rankings each month so you can see which searches you are winning.',
						),
					);
					foreach ( $items as $item ) :
					?>
						<li class="<?php echo esc_attr( 'flex items-start gap-3 rounded-2xl bg-white/[0.03] ring-1 ' . $item['ring'] . ' p-5' ); ?>">
							<span class="<?php echo esc_attr( 'mt-1.5 h-2 w-2 shrink-0 rounded-full ' . $item['dot'] ); ?>" aria-hidden="true"></span>
							<p class="text-[13.5px] leading-relaxed text-brand-textMute m-0">
								<?php echo esc_html( $item['text'] ); ?>
							</p>
						</li>
					<?php endforeach; ?>
				</ul>
			</div>
		</div>
	</section>

	<?php // H2: No marketing team required. ?>
	<section class="px-6 py-8 md:px-10 md:py-10">
		<div class="mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl">
				<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
					No marketing team required
				</h2>
				<p class="mt-5 text-[16px] leading-[1.8] text-brand-textMute">
					Running a restaurant is a full-time commitment. Rynk is built for owners who do not have a marketing team, cannot afford an agency, and have no time to learn SEO. You connect your site and Rynk handles everything: the audit, the fixes, the content, the publishing, every month on autopilot. The Gold plan starts at $149 per month, priced for a single location.
				</p>
				<p class="mt-4 text-[16px] leading-[1.8] text-brand-textMute">
					Rynk also optimizes for AI assistants like ChatGPT and Perplexity alongside traditional Google search. This is called <a href="<?php echo esc_url( home_url( '/blog/answer-engine-optimization/' ) ); ?>" class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors">answer engine optimization</a>, and it is built into every monthly cycle. As part of that, Rynk builds and executes a complete <a href="<?php echo esc_url( home_url( '/ai-content-strategy/' ) ); ?>" class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors">AI content strategy</a> for your restaurant, publishing pages that answer the questions customers ask before booking a table.
				</p>

				<?php // Comparison grid. ?>
				<div class="mt-8 grid gap-4 sm:grid-cols-2">
					<div class="rounded-2xl bg-white/[0.03] ring-1 ring-brand-blue/20 p-6">
						<div class="flex items-center gap-2 mb-3">
							<span class="h-2 w-2 shrink-0 rounded-full bg-brand-blue/60" aria-hidden="true"></span>
							<span class="font-serif text-[16px] font-medium text-brand-blueSoft">Hiring an SEO agency</span>
						</div>
						<ul class="space-y-2">
							<?php
							$agency_points = array(
								'$500 to $2,000 or more per month',
								'Requires briefings and approvals from you',
								'Often does not cover AI search visibility',
								'Built for many clients at once, not your restaurant',
							);
							foreach ( $agency_points as $pt ) :
							?>
								<li class="flex items-start gap-2 text-[13.5px] leading-relaxed text-brand-textMute">
									<?php echo rynk_icon( 'check', 'mt-0.5 h-4 w-4 shrink-0 text-brand-blueSoft' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
									<?php echo esc_html( $pt ); ?>
								</li>
							<?php endforeach; ?>
						</ul>
					</div>
					<div class="rounded-2xl bg-white/[0.03] ring-1 ring-brand-violet/20 p-6">
						<div class="flex items-center gap-2 mb-3">
							<span class="h-2 w-2 shrink-0 rounded-full bg-brand-violet/60" aria-hidden="true"></span>
							<span class="font-serif text-[16px] font-medium text-brand-violetSoft">Rynk</span>
						</div>
						<ul class="space-y-2">
							<?php
							$rynk_points = array(
								'$149 per month, one location',
								'Runs fully on autopilot, no input from you',
								'Optimizes for Google and AI assistants together',
								'Built specifically for a single local restaurant',
							);
							foreach ( $rynk_points as $pt ) :
							?>
								<li class="flex items-start gap-2 text-[13.5px] leading-relaxed text-brand-textMute">
									<?php echo rynk_icon( 'check', 'mt-0.5 h-4 w-4 shrink-0 text-brand-violetSoft' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
									<?php echo esc_html( $pt ); ?>
								</li>
							<?php endforeach; ?>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</section>

	<?php // CTA BANNER. ?>
	<section class="relative px-6 py-10 md:px-10 md:py-12">
		<div class="mx-auto max-w-screen-xl">
			<div class="relative overflow-hidden rounded-[28px] bg-white/[0.02] ring-1 ring-white/8 px-8 py-10 md:px-12 md:py-12">
				<div
					aria-hidden="true"
					class="pointer-events-none absolute -top-20 right-16 h-72 w-72 rounded-full bg-brand-violet/15 blur-3xl animate-float-slow"
				></div>
				<div class="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
					<div>
						<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
							See exactly what is keeping your restaurant off the first page.
						</h2>
						<p class="mt-2 text-[15px] leading-[1.7] text-brand-textMute">
							Enter your restaurant's website URL and get an immediate assessment, no expertise needed.
						</p>
					</div>
					<div class="shrink-0">
						<a
							href="<?php echo esc_url( rynk_app_url( '/sign-up' ) ); ?>"
							class="group inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-7 font-serif text-[16px] font-medium text-brand-ink transition-all hover:shadow-[0_14px_36px_-14px_rgba(255,255,255,0.4)]"
						>
							Get started
							<?php echo rynk_icon( 'arrow-right', 'h-4 w-4 transition-transform group-hover:translate-x-0.5' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<?php // FAQ. ?>
	<section class="relative px-6 py-10 md:px-10 md:py-12">
		<div
			aria-hidden="true"
			class="pointer-events-none absolute -top-10 left-10 h-64 w-64 rounded-full bg-brand-violet/12 blur-3xl animate-float-slow"
		></div>
		<div class="relative mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl">
				<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
					Frequently asked questions
				</h2>
				<div class="mt-8 grid gap-4">

					<?php
					$faqs = array(
						array(
							'q' => 'How do I get my restaurant to show up on Google?',
							'a' => 'Google ranks restaurants based on the technical signals, content, and structured data on your website, plus your Google Business Profile. Rynk audits your site, fixes the technical gaps, publishes optimized pages targeting the searches your customers make, and reinforces your GBP signals, all automatically each month.',
						),
						array(
							'q' => 'Why doesn\'t my restaurant show up when people ask ChatGPT for a recommendation?',
							'a' => 'AI assistants need structured, clearly organized information to recommend a business confidently. Most restaurant websites lack the schema markup, FAQ content, and consistent business information that ChatGPT and Perplexity look for. Rynk adds these signals automatically.',
						),
						array(
							'q' => 'How is Rynk different from paying an SEO agency?',
							'a' => 'An SEO agency charges $500 to $2,000 or more per month and still requires your time for briefings and approvals. Rynk automates the same tasks, audit, fixes, content, publishing, for $149 per month with no involvement from you. It is built specifically for a single local business, not an enterprise client.',
						),
						array(
							'q' => 'What schema markup does Rynk add for restaurants?',
							'a' => 'Rynk adds Restaurant, Menu, FAQPage, and LocalBusiness schema markup to your pages. This structured data tells Google and AI assistants exactly what your restaurant offers, where it is located, and what questions it answers - making you eligible for rich results in Google search and more likely to be cited in AI-generated recommendations.',
						),
						array(
							'q' => 'How long before my restaurant starts ranking higher on Google?',
							'a' => 'Local and neighbourhood keyword rankings typically begin moving within one to three months of new content being published. The key is consistency: Rynk publishes new and updated pages every month so your site compounds in visibility over time rather than stalling after one round of improvements.',
						),
					);
					foreach ( $faqs as $faq ) :
					?>
						<div class="rounded-2xl bg-white/[0.03] ring-1 ring-white/10 p-6">
							<h3 class="font-serif text-[18px] font-medium leading-snug tracking-tight text-brand-text">
								<?php echo esc_html( $faq['q'] ); ?>
							</h3>
							<p class="mt-3 text-[14.5px] leading-[1.75] text-brand-textMute">
								<?php echo esc_html( $faq['a'] ); ?>
							</p>
						</div>
					<?php endforeach; ?>

				</div>
			</div>
		</div>
	</section>

</div>

<?php
get_footer();