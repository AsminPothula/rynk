<?php
/**
 * Template Name: Rynk Local SEO Software
 *
 * /local-seo-software/ - targeted landing page for local small business owners
 * searching for local SEO software that does the work for them.
 *
 * Reached via in-content links from /generative-engine-optimization/,
 * /how-it-works/, and /pricing/. Not in the primary nav.
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
	"headline": "Local SEO Software for Small Businesses",
	"description": "Rynk is local business SEO software that audits your site, fixes technical issues, and publishes optimized content automatically. No agency, no SEO knowledge needed.",
	"url": "<?php echo esc_url( home_url( '/local-seo-software/' ) ); ?>",
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
			"name": "What SEO software is built for local businesses?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "Rynk is an automated SEO platform built specifically for local small businesses. It audits your site, applies technical fixes, publishes optimized content, and handles local SEO signals - all automatically every month. Unlike tools built for agencies or large companies, Rynk is priced for a single local business and requires no SEO knowledge to use."
			}
		},
		{
			"@type": "Question",
			"name": "How is Rynk different from tools like Semrush or Ahrefs?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "Semrush, Ahrefs, and similar tools are research platforms that show you what to fix and leave the work to you. Rynk applies the fixes and publishes the content itself. It is a done-for-you platform, not a reporting tool - built for a local owner who does not have time to become an SEO expert."
			}
		},
		{
			"@type": "Question",
			"name": "Do I need to know SEO to use Rynk?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "No. Rynk is built for local business owners with no SEO background. You connect your website, and Rynk handles the auditing, fixing, writing, and publishing. There is nothing to configure and no reports to interpret."
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
				<span class="text-brand-violetSoft">Local SEO Software</span>
			</nav>

			<div class="max-w-3xl">
				<p class="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft animate-rise">
					Local SEO
				</p>
				<h1
					class="mt-4 font-serif text-4xl md:text-5xl font-medium leading-[1.08] tracking-tight animate-rise"
					style="animation-delay: 60ms;"
				>
					Local SEO Software for Small Businesses
				</h1>
				<p
					class="mt-6 text-[17px] leading-[1.8] text-brand-textMute animate-rise"
					style="animation-delay: 160ms;"
				>
					For the salon or spa owner losing bookings to competitors who rank higher on Google Maps, and who has no time or budget for an agency.
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
						src="<?php echo esc_url( $image_base . 'local-seo-software-1.jpg' ); ?>"
						alt="A hair salon interior with styling chairs, mirrors, shelves of product, warm overhead lighting, no clients, shot from behind the reception desk looking into the main floor"
						class="block h-full w-full object-cover"
						loading="eager"
						decoding="async"
					/>
				</div>
				<figcaption class="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-brand-textMute">
					A salon that ranks higher on Google Maps gets the booking. Rynk builds the SEO signals that put you above the competitors who hired an agency.
				</figcaption>
			</figure>
		</div>
	</section>

	<?php // INTRO PARA. ?>
	<section class="px-6 py-8 md:px-10 md:py-10">
		<div class="mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl">
				<p class="text-[16px] leading-[1.8] text-brand-textMute">
					Most local SEO tools show you a list of problems and leave you to fix them yourself. Rynk is different: it audits your site, applies the technical fixes directly to your WordPress installation, and publishes the new pages your site needs to rank, all automatically, every month. No dashboard to master, no jargon to decode, no agency to hire.
				</p>
				<p class="mt-4 text-[16px] leading-[1.8] text-brand-textMute">
					Rynk is built specifically for hyperlocal small businesses: salons, spas, restaurants, clinics, auto shops, cleaners, plumbers, and other local service providers with one or a few locations and 1 to 20 employees. If you do great work but your phone is not ringing enough, the gap is almost always online visibility, and Rynk closes it automatically.
				</p>
			</div>
		</div>
	</section>

	<?php // H2: What Rynk does. ?>
	<section class="px-6 py-8 md:px-10 md:py-10">
		<div class="mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl">
				<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
					What Rynk does for local search visibility
				</h2>
				<p class="mt-5 text-[16px] leading-[1.8] text-brand-textMute">
					Every month, Rynk runs a complete cycle on your site: audit, fix, generate, publish. Here is exactly what that covers for a local business.
				</p>
			</div>

			<div class="mx-auto mt-8 max-w-3xl">
				<ul class="grid gap-3 sm:grid-cols-2">
					<?php
					$items = array(
						array(
							'dot'  => 'bg-brand-violet/60',
							'ring' => 'ring-brand-violet/20',
							'text' => 'Full site audit every cycle to find what is holding your rankings back.',
						),
						array(
							'dot'  => 'bg-brand-blue/60',
							'ring' => 'ring-brand-blue/20',
							'text' => 'Technical SEO fixes applied directly to your site: page titles, meta descriptions, broken links, page speed signals.',
						),
						array(
							'dot'  => 'bg-brand-emerald/60',
							'ring' => 'ring-brand-emerald/20',
							'text' => 'Internal linking added so Google can find all your relevant pages easily.',
						),
						array(
							'dot'  => 'bg-brand-pink/60',
							'ring' => 'ring-brand-pink/20',
							'text' => 'New hyperlocal pages published each month targeting the searches your customers make.',
						),
						array(
							'dot'  => 'bg-brand-cyan/60',
							'ring' => 'ring-brand-cyan/20',
							'text' => 'Duplicate content cleanup so the right page always shows up in search.',
						),
						array(
							'dot'  => 'bg-white/30',
							'ring' => 'ring-white/10',
							'text' => 'Google Business Profile signals reinforced so you rank higher on Maps.',
						),
						array(
							'dot'  => 'bg-brand-violet/40',
							'ring' => 'ring-brand-violet/15',
							'text' => 'Keyword research and rank tracking so you can see the results each month.',
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

	<?php // H2: Priced for one location. ?>
	<section class="px-6 py-8 md:px-10 md:py-10">
		<div class="mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl lg:flex lg:items-start lg:gap-10">
				<div class="lg:flex-1">
					<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
						Built for local businesses, priced for one location
					</h2>
					<p class="mt-5 text-[16px] leading-[1.8] text-brand-textMute">
						Rynk is scoped and priced for a single local business, not an agency managing dozens of clients or an enterprise with a dedicated SEO team. The Gold plan at $149 per month covers everything a local business needs to compete on Google and AI search. The Platinum plan at $299 per month doubles the page output and adds bi-weekly tracking for businesses that want to close the gap on competitors faster.
					</p>
					<p class="mt-4 text-[16px] leading-[1.8] text-brand-textMute">
						Because Rynk automates both traditional SEO and <a href="<?php echo esc_url( home_url( '/generative-engine-optimization/' ) ); ?>" class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors">generative engine optimization</a>, your business gets found on Google and in AI-generated answers from ChatGPT and Perplexity, in a single platform at a single price. Rynk also handles your full <a href="<?php echo esc_url( home_url( '/ai-content-strategy/' ) ); ?>" class="text-brand-blueSoft underline underline-offset