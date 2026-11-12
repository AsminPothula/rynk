<?php
/**
 * Template Name: Rynk - Why Isn't My Business Showing Up on Google?
 *
 * /why-isnt-my-business-showing-up-on-google/
 *
 * Targeted landing page for local business owners who do solid work but
 * cannot figure out why Google is not sending them customers. Reached via
 * in-content links from /local-seo-software/, /how-it-works/, and
 * /blog/answer-engine-optimization/. Not in the primary nav.
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
	"headline": "Why Isn't My Business Showing Up on Google?",
	"description": "If your business isn't showing up on Google, here are the most common reasons why - and how Rynk fixes them automatically for small local businesses.",
	"url": "<?php echo esc_url( home_url( '/why-isnt-my-business-showing-up-on-google/' ) ); ?>",
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
			"name": "Why isn't my business showing up on Google?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "The most common reasons are missing meta descriptions, no schema markup, thin content with too few pages, an incomplete Google Business Profile, and no new content being published. All of these are technical signals that Google uses to decide which businesses to rank. Rynk audits your site for these gaps and fixes them automatically every month."
			}
		},
		{
			"@type": "Question",
			"name": "How do I get my small local business found on Google?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "Getting found on Google requires a combination of technical SEO (meta tags, schema, page speed), local SEO (Google Business Profile, consistent business information), and content (pages that answer the questions your customers search for). Rynk automates all three for a single flat monthly price, with no SEO expertise required."
			}
		},
		{
			"@type": "Question",
			"name": "How long does it take to start showing up on Google after fixing these issues?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "Technical fixes and schema markup can be indexed within days. New content pages typically begin ranking within four to eight weeks, with rankings continuing to improve each month as more content is published and existing pages are strengthened. Rynk tracks your rankings each cycle so you can see the progress."
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
				<span class="text-brand-violetSoft">Why Isn't My Business Showing Up on Google?</span>
			</nav>

			<div class="max-w-3xl">
				<p class="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft animate-rise">
					Guide
				</p>
				<h1
					class="mt-4 font-serif text-4xl md:text-5xl font-medium leading-[1.08] tracking-tight animate-rise"
					style="animation-delay: 60ms;"
				>
					Why Isn't My Business Showing Up on Google?
				</h1>
				<p
					class="mt-6 text-[17px] leading-[1.8] text-brand-textMute animate-rise"
					style="animation-delay: 160ms;"
				>
					For the local service provider who does solid work, has a website, and still cannot understand why Google is not sending customers their way.
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
						src="<?php echo esc_url( $image_base . 'why-isnt-my-business-showing-up-on-google-1.jpg' ); ?>"
						alt="A residential cleaning kit with a mop, bucket, and spray bottles organized neatly on a tiled floor, bright natural light from a window, no people"
						class="block h-full w-full object-cover"
						loading="eager"
						decoding="async"
					/>
				</div>
				<figcaption class="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-brand-textMute">
					A cleaner who does excellent work but has a thin website with no structured data gives Google no reason to rank them above a competitor.
				</figcaption>
			</figure>
		</div>
	</section>

	<?php // INTRO PARA. ?>
	<section class="px-6 py-8 md:px-10 md:py-10">
		<div class="mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl">
				<p class="text-[16px] leading-[1.8] text-brand-textMute">
					If your business is not showing up on Google, the problem is almost never that you are doing bad work. It is that your website is missing the signals Google needs to rank it confidently. Most local business websites have the same set of gaps, and all of them are fixable.
				</p>
			</div>
		</div>
	</section>

	<?php // H2: Most common reasons. ?>
	<section class="px-6 py-8 md:px-10 md:py-10">
		<div class="mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl">
				<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
					The most common reasons your business is invisible on Google
				</h2>
				<p class="mt-5 text-[16px] leading-[1.8] text-brand-textMute">
					Google decides which businesses to show by reading the signals your website sends. When those signals are weak or missing, your business drops below competitors whose sites send clearer ones, even if your work is better. Here are the gaps that cause this most often.
				</p>
			</div>

			<div class="mx-auto mt-8 max-w-3xl">
				<ul class="grid gap-3 sm:grid-cols-2">
					<?php
					$reasons = array(
						array(
							'dot'  => 'bg-brand-violet/60',
							'ring' => 'ring-brand-violet/20',
							'text' => 'Missing or weak meta titles and descriptions: Google uses these to understand what each page is about and decide whether to show it.',
						),
						array(
							'dot'  => 'bg-brand-blue/60',
							'ring' => 'ring-brand-blue/20',
							'text' => 'No schema markup: without structured data, Google cannot identify your business type, services, or location with confidence.',
						),
						array(
							'dot'  => 'bg-brand-emerald/60',
							'ring' => 'ring-brand-emerald/20',
							'text' => 'Thin content: a homepage and contact page give Google almost nothing to match to a local search query.',
						),
						array(
							'dot'  => 'bg-brand-pink/60',
							'ring' => 'ring-brand-pink/20',
							'text' => 'Duplicate pages: when multiple pages cover the same topic, Google is not sure which one to rank and may choose neither.',
						),
						array(
							'dot'  => 'bg-brand-cyan/60',
							'ring' => 'ring-brand-cyan/20',
							'text' => 'No internal linking: Google cannot easily find all your pages if none of them point to each other.',
						),
						array(
							'dot'  => 'bg-white/30',
							'ring' => 'ring-white/10',
							'text' => 'Google Business Profile gaps: an incomplete or unoptimized GBP is one of the most common reasons businesses do not show up in Maps results.',
						),
						array(
							'dot'  => 'bg-brand-violet/40',
							'ring' => 'ring-brand-violet/15',
							'text' => 'No new content: Google rewards sites that add relevant pages regularly and deprioritizes sites that never change.',
						),
					);
					foreach ( $reasons as $reason ) :
					?>
						<li class="<?php echo esc_attr( 'flex items-start gap-3 rounded-2xl bg-white/[0.03] ring-1 ' . $reason['ring'] . ' p-5' ); ?>">
							<span class="<?php echo esc_attr( 'mt-1.5 h-2 w-2 shrink-0 rounded-full ' . $reason['dot'] ); ?>" aria-hidden="true"></span>
							<p class="text-[13.5px] leading-relaxed text-brand-textMute m-0">
								<?php echo esc_html( $reason['text'] ); ?>
							</p>
						</li>
					<?php endforeach; ?>
				</ul>
			</div>
		</div>
	</section>

	<?php // H2: How Rynk fixes all of these. ?>
	<section class="px-6 py-8 md:px-10 md:py-10">
		<div class="mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl">
				<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
					How Rynk fixes all of these automatically
				</h2>
				<p class="mt-5 text-[16px] leading-[1.8] text-brand-textMute">
					Rynk audits your site for every one of these gaps and then applies the fixes itself, directly to your WordPress installation. It rewrites meta titles and descriptions, adds schema markup sitewide, publishes new content pages each month, cleans up duplicate pages, and builds internal links between your pages. It also reinforces your Google Business Profile signals. Every fix is applied for you; there is nothing to configure or approve.
				</p>
				<p class="mt-4 text-[16px] leading-[1.8] text-brand-textMute">
					This is the same approach described in detail on the <a href="<?php echo esc_url( home_url( '/how-it-works/' ) ); ?>" class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors">how it works page</a>. If you are looking for a comparison of <a href="<?php echo esc_url( home_url( '/local-seo-software/' ) ); ?>" class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors">local SEO software</a> options, Rynk is one of the few that applies fixes automatically rather than just reporting what is wrong. And if you want your business to show up not just on Google but also in AI assistants like ChatGPT and Perplexity, read our guide on <a href="<?php echo esc_url( home_url( '/blog/answer-engine-optimization/' ) ); ?>" class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors">answer engine optimization for small businesses</a>.
				</p>
			</div>
		</div>
	</section>

	<?php // H2: What Google actually checks. ?>
	<section class="px-6 py-8 md:px-10 md:py-10">
		<div class="mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl">
				<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
					What Google actually checks when deciding whether to show your business
				</h2>
				<p class="mt-5 text-[16px] leading-[1.8] text-brand-textMute">
					Google uses hundreds of signals to rank local businesses, but for a small local business, the most impactful ones come down to four categories.
				</p>
				<div class="mt-6 grid gap-4 sm:grid-cols-2">
					<?php
					$categories = array(
						array(
							'label' => 'Technical signals',
							'body'  => 'Page speed, mobile-friendliness, correct status codes, clean URL structure, and no broken links. These tell Google your site is safe and reliable to send users to.',
							'ring'  => 'ring-brand-blue/20',
							'tint'  => 'text-brand-blueSoft',
						),
						array(
							'label' => 'On-page signals',
							'body'  => 'Title tags, meta descriptions, heading structure, and keyword placement. These tell Google what each page is specifically about.',
							'ring'  => 'ring-brand-violet/20',
							'tint'  => 'text-brand-violetSoft',
						),
						array(
							'label' => 'Local signals',
							'body'  => 'Google Business Profile completeness, consistent name and address across the web, and local keyword use on your pages. These tell Google where you operate and who you serve.',
							'ring'  => 'ring-brand-emerald/20',
							'tint'  => 'text-brand-emeraldSoft',
						),
						array(
							'label' => 'Content signals',
							'body'  => 'The number of pages you have, how often you publish, and whether your pages answer the specific questions your customers search. These tell Google you are an active, relevant resource.',
							'ring'  => 'ring-brand-pink/20',
							'tint'  => 'text-brand-pinkSoft',
						),
					);
					foreach ( $categories as $cat ) :
					?>
						<div class="<?php echo esc_attr( 'rounded-2xl bg-white/[0.03] ring-1 ' . $cat['ring'] . ' p-5' ); ?>">
							<p class="<?php echo esc_attr( 'font-serif text-[15px] font-medium ' . $cat['tint'] ); ?>"><?php echo esc_html( $cat['label'] ); ?></p>
							<p class="mt-1.5 text-[13.5px] leading-relaxed text-brand-textMute"><?php echo esc_html( $cat['body'] ); ?></p>
						</div>
					<?php endforeach; ?>
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
							See exactly why your site is not showing up, and fix it.
						</h2>
						<p class="mt-2 text-[15px] leading-[1.7] text-brand-textMute">
							Enter your website URL and Rynk shows you exactly what is holding your rankings back, then starts fixing it automatically.
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
							'q' => 'Why isn\'t my business showing up on Google?',
							'a' => 'The most common reasons are missing meta descriptions, no schema markup, thin content with too few pages, an incomplete Google Business Profile, and no new content being published. All of these are technical signals that Google uses to decide which businesses to rank. Rynk audits your site for these gaps and fixes them automatically every month.',
						),
						array(
							'q' => 'How do I get my small local business found on Google?',
							'a' => 'Getting found on Google requires a combination of technical SEO (meta tags, schema, page speed), local SEO (Google Business Profile, consistent business information), and content (pages that answer the questions your customers search for). Rynk automates all three for a single flat monthly price, with no SEO expertise required.',
						),
						array(
							'q' => 'How long does it take to start showing up on Google after fixing these issues?',
							'a' => 'Technical fixes and schema markup can be indexed within days. New content pages typically begin ranking within four to eight weeks, with rankings continuing to improve each month as more content is published and existing pages are strengthened. Rynk tracks your rankings each cycle so you can see the progress.',
						),
						array(
							'q' => 'My competitor has a worse website than mine. Why do they rank higher?',
							'a' => 'Google does not rank the best business. It ranks the business whose website sends the clearest signals. A competitor with a worse-looking site may still have better meta tags, more content pages, a more complete Google Business Profile, and consistent local keyword use. Rynk fixes every one of those signal gaps automatically.',
						),
						array(
							'q' => 'Do I need to hire an SEO agency to fix this?',
							'a' => 'No. Rynk does the same work an SEO agency would charge hundreds or thousands of dollars a month to do, but automatically and at a flat monthly price starting at $149. It audits your site, applies technical fixes, publishes new optimized pages, and monitors your rankings without any manual work from you.',
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