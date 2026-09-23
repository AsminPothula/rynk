<?php
/**
 * Template Name: Rynk Blog - How to Check Keyword Ranking in Google
 *
 * /blog/how-to-check-keyword-ranking-google/
 *
 * @package rynk-ai
 */

get_header();

$image_base = get_theme_file_uri( 'assets/img/rynk/' );
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
      "name": "Blog",
      "item": "https://rynk.ai/blog/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "How To Check Keyword Ranking Google",
      "item": "https://rynk.ai/blog/how-to-check-keyword-ranking-google/"
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
				<a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>" class="transition-colors hover:text-brand-text">Blog</a>
				<span aria-hidden="true">/</span>
				<span class="text-brand-violetSoft">How to Check Keyword Ranking in Google</span>
			</nav>

			<div class="max-w-3xl">
				<p class="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft animate-rise">
					Guide
				</p>
				<h1
					class="mt-4 font-serif text-4xl md:text-5xl font-medium leading-[1.08] tracking-tight animate-rise"
					style="animation-delay: 60ms;"
				>
					How to Check Keyword Ranking in Google (Free Methods and Automated Tracking)
				</h1>
				<p
					class="mt-6 text-[17px] leading-[1.8] text-brand-textMute animate-rise"
					style="animation-delay: 160ms;"
				>
					Knowing where your pages rank for the keywords your customers search is the starting point for any SEO improvement. Here is how to find your rankings for free and what to do with the information.
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
						src="<?php echo esc_url( $image_base . 'blog-how-to-search-for-a-keyword-on-a-web-page-1.jpg' ); ?>"
						alt="Close-up of a laptop keyboard on a wooden desk, a single finger resting on the keys, warm natural side light, no screen visible"
						class="block h-full w-full object-cover"
						loading="eager"
						decoding="async"
					/>
				</div>
				<figcaption class="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-brand-textMute">
					Checking your keyword rankings takes minutes and tells you exactly where Google places your pages right now.
				</figcaption>
			</figure>
		</div>
	</section>

	<?php // INTRO PARA. ?>
	<section class="px-6 py-8 md:px-10 md:py-10">
		<div class="mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl">
				<p class="text-[16px] leading-[1.8] text-brand-textMute">
					Most small business owners have a rough sense that their site is not ranking well. Very few know which specific pages are ranking for which keywords, where those rankings sit, and which ones are close enough to a first-page result to be worth targeting first. That information changes what you should do next, and it is available for free if you know where to look.
				</p>
			</div>
		</div>
	</section>

	<?php // H2: Google Search Console - the free baseline. ?>
	<section class="px-6 py-8 md:px-10 md:py-10">
		<div class="mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl">
				<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
					Google Search Console: the free baseline every site should use
				</h2>
				<p class="mt-5 text-[16px] leading-[1.8] text-brand-textMute">
					Google Search Console is the most reliable free tool for checking your keyword rankings because the data comes directly from Google. Once your site is verified, open the Performance report and you will see every keyword your pages have appeared for in Google search results over the last three months, along with the average position for each one.
				</p>
				<p class="mt-4 text-[16px] leading-[1.8] text-brand-textMute">
					To filter to a specific keyword, click the plus icon next to the search bar at the top of the report and select Query. Type your keyword and the report updates to show which pages rank for that term and at what average position. A position of 1 to 10 means you are on the first page. Positions 11 to 20 are on the second page, and so on.
				</p>
				<p class="mt-4 text-[16px] leading-[1.8] text-brand-textMute">
					The most useful column to watch is average position combined with impressions. A keyword where you appear at position 14 with high impressions is a strong candidate for improvement: you are already indexed for the term, you just need to move up a few places to reach the first page and capture real traffic.
				</p>
			</div>
		</div>
	</section>

	<?php // H2: Quick manual check. ?>
	<section class="px-6 py-8 md:px-10 md:py-10">
		<div class="mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl lg:flex lg:items-start lg:gap-10">
				<div class="lg:flex-1">
					<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
						How to do a quick manual ranking check without any tools
					</h2>
					<p class="mt-5 text-[16px] leading-[1.8] text-brand-textMute">
						Open a private or incognito browser window. This removes your personal search history and logged-in Google account from the results so you see closer to what a new customer would see. Type your keyword into Google and scroll through the results, counting which position your page appears at.
					</p>
					<p class="mt-4 text-[16px] leading-[1.8] text-brand-textMute">
						The limitation of this method is that Google personalises results by location. If you are searching from a different city than your customers, the position you see may not match what they see. For local keywords like "plumber near me" or "best Italian restaurant in Austin," use Search Console rather than a manual check for the most accurate data.
					</p>
				</div>
				<figure class="mt-6 w-full max-w-sm shrink-0 lg:mt-0 lg:w-64 xl:w-72">
					<div class="aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-white/10">
						<img
							src="<?php echo esc_url( $image_base . 'blog-how-to-search-for-a-keyword-on-a-web-page-2.jpg' ); ?>"
							alt="A hand holding a smartphone showing a browser search bar, finger hovering near the screen, warm indoor light, close crop"
							class="block h-full w-full object-cover"
							loading="lazy"
							decoding="async"
						/>
					</div>
					<figcaption class="mt-2 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-brand-textMute">
						Incognito mode removes personalisation for a more accurate manual ranking check.
					</figcaption>
				</figure>
			</div>
		</div>
	</section>

	<?php // H2: What the position numbers mean. ?>
	<section class="px-6 py-8 md:px-10 md:py-10">
		<div class="mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl">
				<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
					What the position numbers actually mean for your traffic
				</h2>
				<p class="mt-5 text-[16px] leading-[1.8] text-brand-textMute">
					Google search results follow a steep click curve. The first result gets roughly a third of all clicks. By position five, click-through rates drop to around five percent. By position ten, they are below two percent. Everything beyond page one receives a fraction of a percent. This means that the difference between position eight and position three is often ten times the traffic, from a single keyword.
				</p>
			</div>

			<div class="mx-auto mt-8 max-w-3xl">
				<ul class="grid gap-3 sm:grid-cols-2">
					<?php
					$positions = array(
						array(
							'tint' => 'text-brand-emeraldSoft',
							'ring' => 'ring-brand-emerald/20',
							'dot'  => 'bg-brand-emerald/60',
							'label' => 'Position 1 to 3',
							'body'  => 'The top three results capture the majority of clicks for most keywords. This is where sustained SEO work aims to place your most important pages.',
						),
						array(
							'tint' => 'text-brand-blueSoft',
							'ring' => 'ring-brand-blue/20',
							'dot'  => 'bg-brand-blue/60',
							'label' => 'Position 4 to 10',
							'body'  => 'Still on the first page and receiving meaningful traffic. Pages here are often the best candidates for improvement because they are already indexed and trusted.',
						),
						array(
							'tint' => 'text-brand-violetSoft',
							'ring' => 'ring-brand-violet/20',
							'dot'  => 'bg-brand-violet/60',
							'label' => 'Position 11 to 20',
							'body'  => 'Second page. Virtually no organic traffic at these positions, but pages here can move to the first page with targeted content improvements.',
						),
						array(
							'tint' => 'text-brand-pinkSoft',
							'ring' => 'ring-brand-pink/20',
							'dot'  => 'bg-brand-pink/60',
							'label' => 'Position 21 and beyond',
							'body'  => 'Deep pages. These need substantial content work or a different keyword strategy before they can realistically drive traffic.',
						),
					);
					foreach ( $positions as $pos ) :
					?>
						<li class="<?php echo esc_attr( 'flex flex-col gap-1.5 rounded-2xl bg-white/[0.03] ring-1 ' . $pos['ring'] . ' p-5' ); ?>">
							<span class="flex items-center gap-2">
								<span class="<?php echo esc_attr( 'h-2 w-2 shrink-0 rounded-full ' . $pos['dot'] ); ?>" aria-hidden="true"></span>
								<span class="<?php echo esc_attr( 'font-serif text-[15px] font-medium ' . $pos['tint'] ); ?>">
									<?php echo esc_html( $pos['label'] ); ?>
								</span>
							</span>
							<p class="pl-4 text-[13.5px] leading-relaxed text-brand-textMute">
								<?php echo esc_html( $pos['body'] ); ?>
							</p>
						</li>
					<?php endforeach; ?>
				</ul>
			</div>
		</div>
	</section>

	<?php // H2: Other free tools. ?>
	<section class="px-6 py-8 md:px-10 md:py-10">
		<div class="mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl lg:flex lg:items-start lg:gap-10">
				<div class="lg:flex-1">
					<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
						Other free tools for checking keyword rankings
					</h2>
					<p class="mt-5 text-[16px] leading-[1.8] text-brand-textMute">
						Beyond Google Search Console, a few other free tools give you ranking data without a paid subscription. Bing Webmaster Tools works the same way as Search Console but for Bing results. Ubersuggest offers a limited number of free keyword lookups per day and shows estimated ranking positions. Google's own Keyword Planner shows search volume but not your current ranking positions.
					</p>
					<p class="mt-4 text-[16px] leading-[1.8] text-brand-textMute">
						For a small business checking a handful of keywords occasionally, the combination of Search Console and an incognito browser search covers most of what you need. The limitation is that you are checking one keyword at a time, manually, and the data is historical rather than real-time. You can also learn more about related fundamentals in our guide on <a href="<?php echo esc_url( home_url( '/blog/how-to-search-for-a-keyword-on-a-web-page/' ) ); ?>" class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors">how to search for a keyword on a web page</a>.
					</p>
				</div>
				<figure class="mt-6 w-full max-w-sm shrink-0 lg:mt-0 lg:w-64 xl:w-72">
					<div class="aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-white/10">
						<img
							src="<?php echo esc_url( $image_base . 'blog-how-to-search-for-a-keyword-on-a-web-page-3.jpg' ); ?>"
							alt="A small business owner at a tidy wooden desk with a laptop and a notepad, focused expression, morning light from a nearby window, coffee cup to the side"
							class="block h-full w-full object-cover"
							loading="lazy"
							decoding="async"
						/>
					</div>
					<figcaption class="mt-2 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-brand-textMute">
						Google Search Console gives you the most accurate ranking data available for free.
					</figcaption>
				</figure>
			</div>
		</div>
	</section>

	<?php // H2: What to do with the data. ?>
	<section class="px-6 py-8 md:px-10 md:py-10">
		<div class="mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl">
				<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
					What to do once you know your rankings
				</h2>
				<p class="mt-5 text-[16px] leading-[1.8] text-brand-textMute">
					The goal of checking your rankings is not to watch the numbers. It is to identify which pages are closest to a result that drives real traffic and focus your work there first. A page at position 12 for a high-volume keyword is a better investment than a page at position 45 for the same term: it is closer, it is already indexed, and a few targeted changes can move it onto the first page.
				</p>
				<div class="mt-6 grid gap-3 sm:grid-cols-2">
					<?php
					$actions = array(
						array( 'label' => 'Find your page 2 keywords', 'body' => 'Filter Search Console to positions 11 to 20. These are your highest-priority pages: already indexed, just off the first page.' ),
						array( 'label' => 'Check keyword placement', 'body' => 'Use Ctrl + F to confirm the target keyword appears in the page title, first heading, and opening paragraph. Missing keywords at these positions are easy wins.' ),
						array( 'label' => 'Look for thin content', 'body' => 'Pages ranking below position 20 often have too little content. Google rewards pages that answer questions thoroughly over pages with a paragraph or two.' ),
						array( 'label' => 'Watch for cannibalization', 'body' => 'If two pages on your site compete for the same keyword, Google splits its attention between them. Consolidate or differentiate the pages.' ),
						array( 'label' => 'Add internal links', 'body' => 'Linking to a page from other pages on your site passes authority to it and helps Google find and index it faster.' ),
						array( 'label' => 'Track changes over time', 'body' => 'Rankings move slowly. Check your positions once a month and note which pages improved or dropped after you made changes.' ),
					);
					foreach ( $actions as $act ) :
					?>
						<div class="rounded-2xl bg-white/[0.03] ring-1 ring-white/10 p-5">
							<p class="font-serif text-[15px] font-medium text-brand-text"><?php echo esc_html( $act['label'] ); ?></p>
							<p class="mt-1.5 text-[13.5px] leading-relaxed text-brand-textMute"><?php echo esc_html( $act['body'] ); ?></p>
						</div>
					<?php endforeach; ?>
				</div>
			</div>
		</div>
	</section>

	<?php // H2: Automated tracking with Rynk. ?>
	<section class="px-6 py-8 md:px-10 md:py-10">
		<div class="mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl lg:flex lg:items-start lg:gap-10">
				<div class="lg:flex-1">
					<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
						How Rynk tracks and improves your keyword rankings automatically
					</h2>
					<p class="mt-5 text-[16px] leading-[1.8] text-brand-textMute">
						Checking rankings manually tells you where you are. It does not fix the underlying reasons your pages are not ranking higher, and it does not scale to a site with dozens of pages and hundreds of target keywords. Rynk monitors your keyword positions every week across your whole site, flags pages that have dropped, and publishes updated content and technical fixes to move those pages back up.
					</p>
					<p class="mt-4 text-[16px] leading-[1.8] text-brand-textMute">
						Every month, Rynk also identifies new keyword opportunities your site is not yet targeting and creates pages for them, so your site covers more searches over time without you needing to plan or write anything. See <a href="<?php echo esc_url( home_url( '/how-it-works/' ) ); ?>" class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors">how the full process works</a>, or go straight to <a href="<?php echo esc_url( home_url( '/pricing/' ) ); ?>" class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors">pricing</a> to see what automated rank tracking with Rynk costs each month.
					</p>
				</div>
				<figure class="mt-6 w-full max-w-xs shrink-0 lg:mt-0 lg:w-52 xl:w-60">
					<div class="aspect-[1/1] w-full overflow-hidden rounded-2xl ring-1 ring-white/10">
						<img
							src="<?php echo esc_url( $image_base . 'blog-how-to-search-for-a-keyword-on-a-web-page-4.jpg' ); ?>"
							alt="Close-up of a laptop keyboard with a small potted plant to the right and a ceramic coffee cup to the left, clean desk surface, soft natural light, no screen or text visible"
							class="block h-full w-full object-cover"
							loading="lazy"
							decoding="async"
						/>
					</div>
					<figcaption class="mt-2 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-brand-textMute">
						Rynk tracks your keyword positions weekly and acts on drops automatically.
					</figcaption>
				</figure>
			</div>
		</div>
	</section>

	<?php // CTA BANNER. ?>
	<section class="relative px-6 py-10 md:px-10 md:py-12">
		<div class="mx-auto max-w-screen-xl">
			<div class="relative overflow-hidden rounded-[28px] bg-white/[0.02] ring-1 ring-white/8 px-8 py-10 md:px-12 md:py-12">
				<div
					aria-hidden="true"
					class="pointer-events-none absolute -top-20 right-16 h-72 w-72 rounded-full bg-brand-blue/15 blur-3xl animate-float-slow"
				></div>
				<div class="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
					<div>
						<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
							See where your pages rank right now.
						</h2>
						<p class="mt-2 text-[15px] leading-[1.7] text-brand-textMute">
							Enter your URL and Rynk shows you the gaps immediately, then fixes them automatically.
						</p>
					</div>
					<div class="shrink-0">
						<a
							href="<?php echo esc_url( rynk_app_url( '/try' ) ); ?>"
							class="group inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-7 font-serif text-[16px] font-medium text-brand-ink transition-all hover:shadow-[0_14px_36px_-14px_rgba(255,255,255,0.4)]"
						>
							Audit my site
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
							'q' => 'How do I check my keyword ranking in Google for free?',
							'a' => 'The most reliable free method is Google Search Console. Once your site is verified, open the Performance report and filter by query to see the average position for any keyword your pages appear for. You can also do a manual check by searching in an incognito browser window and counting your position in the results.',
						),
						array(
							'q' => 'How accurate is Google Search Console for keyword ranking data?',
							'a' => 'Search Console data comes directly from Google, making it the most accurate free source available. The position shown is an average across all searches for that query over the selected period, so it may differ from a single manual search, which is also affected by your location and browsing history.',
						),
						array(
							'q' => 'How often should I check my keyword rankings?',
							'a' => 'For most small businesses, once a month is enough to spot meaningful trends without spending too much time on reporting. Rankings move slowly, so daily or weekly manual checks rarely show useful differences. Automated tools like Rynk track positions weekly and alert you to significant drops without any manual effort.',
						),
						array(
							'q' => 'What should I do if my keyword ranking drops?',
							'a' => 'First, check whether the page content is still accurate and comprehensive compared to the pages currently outranking you. Then verify that the target keyword appears in the page title, first heading, and opening paragraph. If competitors have published more detailed content, update your page to match or exceed their depth. Rynk monitors for drops and publishes updated content automatically when rankings slip.',
						),
						array(
							'q' => 'Can I track keyword rankings without using paid tools?',
							'a' => 'Yes. Google Search Console is free and covers the most important data: which keywords trigger your pages, your average position, and your click-through rate. For a small business monitoring a few dozen keywords, Search Console combined with occasional manual searches in incognito mode is sufficient.',
						),
						array(
							'q' => 'How long does it take to improve a keyword ranking?',
							'a' => 'Local and long-tail keywords can move within four to eight weeks of a targeted content update. More competitive terms take three to six months of consistent work. Pages that are already on the second page of Google, positions 11 to 20, tend to respond fastest because they are already indexed and trusted by Google.',
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

		<?php // FAQPage JSON-LD. ?>
		<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "FAQPage",
			"mainEntity": [
				{
					"@type": "Question",
					"name": "How do I check my keyword ranking in Google for free?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "The most reliable free method is Google Search Console. Once your site is verified, open the Performance report and filter by query to see the average position for any keyword your pages appear for. You can also do a manual check by searching in an incognito browser window and counting your position in the results."
					}
				},
				{
					"@type": "Question",
					"name": "How accurate is Google Search Console for keyword ranking data?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "Search Console data comes directly from Google, making it the most accurate free source available. The position shown is an average across all searches for that query over the selected period, so it may differ from a single manual search, which is also affected by your location and browsing history."
					}
				},
				{
					"@type": "Question",
					"name": "How often should I check my keyword rankings?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "For most small businesses, once a month is enough to spot meaningful trends without spending too much time on reporting. Rankings move slowly, so daily or weekly manual checks rarely show useful differences. Automated tools like Rynk track positions weekly and alert you to significant drops without any manual effort."
					}
				},
				{
					"@type": "Question",
					"name": "What should I do if my keyword ranking drops?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "First, check whether the page content is still accurate and comprehensive compared to the pages currently outranking you. Then verify that the target keyword appears in the page title, first heading, and opening paragraph. If competitors have published more detailed content, update your page to match or exceed their depth. Rynk monitors for drops and publishes updated content automatically when rankings slip."
					}
				},
				{
					"@type": "Question",
					"name": "Can I track keyword rankings without using paid tools?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "Yes. Google Search Console is free and covers the most important data: which keywords trigger your pages, your average position, and your click-through rate. For a small business monitoring a few dozen keywords, Search Console combined with occasional manual searches in incognito mode is sufficient."
					}
				},
				{
					"@type": "Question",
					"name": "How long does it take to improve a keyword ranking?",
					"acceptedAnswer": {
						"@type": "Answer",
						"text": "Local and long-tail keywords can move within four to eight weeks of a targeted content update. More competitive terms take three to six months of consistent work. Pages that are already on the second page of Google, positions 11 to 20, tend to respond fastest because they are already indexed and trusted by Google."
					}
				}
			]
		}
		</script>

		<?php // Article + BreadcrumbList JSON-LD. ?>
		<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Article",
			"headline": "How to Check Keyword Ranking in Google (Free Methods and Automated Tracking)",
			"description": "Learn how to check your keyword rankings in Google for free, what the numbers mean, and how Rynk tracks and improves your rankings automatically every week.",
			"url": "<?php echo esc_url( home_url( '/blog/how-to-check-keyword-ranking-google/' ) ); ?>",
			"publisher": {
				"@type": "Organization",
				"name": "Rynk",
				"url": "https://rynk.ai"
			},
			"breadcrumb": {
				"@type": "BreadcrumbList",
				"itemListElement": [
					{
						"@type": "ListItem",
						"position": 1,
						"name": "Home",
						"item": "<?php echo esc_url( home_url( '/' ) ); ?>"
					},
					{
						"@type": "ListItem",
						"position": 2,
						"name": "Blog",
						"item": "<?php echo esc_url( home_url( '/blog/' ) ); ?>"
					},
					{
						"@type": "ListItem",
						"position": 3,
						"name": "How To Check Keyword Ranking Google",
						"item": "<?php echo esc_url( home_url( '/blog/how-to-check-keyword-ranking-google/' ) ); ?>"
					}
				]
			}
		}
		</script>
	</section>

</div>

<?php
get_footer();