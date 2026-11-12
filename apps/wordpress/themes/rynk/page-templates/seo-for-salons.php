<?php
/**
 * Template Name: Rynk SEO for Salons and Spas
 *
 * /seo-for-salons/ - vertical-specific landing page for salon and spa owners
 * searching for SEO help without an agency.
 *
 * Reached via in-content links from /seo-for-restaurants/, /local-seo-software/,
 * and /why-isnt-my-business-showing-up-on-google/. Not in the primary nav.
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
	"headline": "SEO for Salons and Spas: Rank Higher, Book More",
	"description": "Rynk automates SEO for salons and spas - fixing technical gaps, publishing optimized pages, and getting your business found on Google Maps and AI search automatically.",
	"url": "<?php echo esc_url( home_url( '/seo-for-salons/' ) ); ?>",
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
			"name": "How do I get my salon to rank higher on Google Maps?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "Google Maps rankings are driven by your Google Business Profile signals and your website's local SEO: consistent business information, service-specific pages, schema markup, and reviews. Rynk reinforces all of these automatically each month without you needing to manage any of it."
			}
		},
		{
			"@type": "Question",
			"name": "Will Rynk write service pages for each of my treatments?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "Yes. Rynk publishes new pages each month targeting the specific services you offer. Each page is written around the keywords customers use to find that service and structured so Google and AI assistants understand what you offer and who it is for."
			}
		},
		{
			"@type": "Question",
			"name": "How do I get more bookings from people who discover me online?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "More bookings from search starts with ranking higher for the searches your customers make. Rynk builds that visibility by fixing your site's technical gaps, publishing service-specific content, and reinforcing your Google Business Profile signals - the combination that moves you above competitors in Maps and organic search."
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
				<span class="text-brand-violetSoft">SEO for Salons and Spas</span>
			</nav>

			<div class="max-w-3xl">
				<p class="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft animate-rise">
					Salon and Spa SEO
				</p>
				<h1
					class="mt-4 font-serif text-4xl md:text-5xl font-medium leading-[1.08] tracking-tight animate-rise"
					style="animation-delay: 60ms;"
				>
					SEO for Salons and Spas: Rank Higher, Book More
				</h1>
				<p
					class="mt-6 text-[17px] leading-[1.8] text-brand-textMute animate-rise"
					style="animation-delay: 160ms;"
				>
					For the salon or spa owner who is excellent at their craft but losing bookings to competitors who rank higher on Google Maps.
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
						src="<?php echo esc_url( $image_base . 'seo-for-salons-1.jpg' ); ?>"
						alt="A tidy nail salon station with organized tools, nail polish display, and a clean white surface under bright salon lighting, no clients present, professional and welcoming"
						class="block h-full w-full object-cover"
						loading="eager"
						decoding="async"
					/>
				</div>
				<figcaption class="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-brand-textMute">
					The best nail technician in the area will not get the booking if the salon three doors down ranks higher on Google Maps.
				</figcaption>
			</figure>
		</div>
	</section>

	<?php // INTRO PARA. ?>
	<section class="px-6 py-8 md:px-10 md:py-10">
		<div class="mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl">
				<p class="text-[16px] leading-[1.8] text-brand-textMute">
					When a potential customer searches for a hair salon or spa, Google ranks results based on signals from your website and your Google Business Profile, not on how good your work actually is. A competitor with more content, stronger technical SEO, and better-structured information ranks above you even if your reviews are better. The gap is not quality. It is visibility.
				</p>
			</div>
		</div>
	</section>

	<?php // H2: Why some salons rank above yours. ?>
	<section class="px-6 py-8 md:px-10 md:py-10">
		<div class="mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl">
				<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
					Why some salons rank above yours even when yours is better
				</h2>
				<p class="mt-5 text-[16px] leading-[1.8] text-brand-textMute">
					Google does not walk through your door. It reads your website. When a customer searches "hair salon near me" or "spa with deep tissue massage in [city]," the businesses that appear at the top have pages that answer those exact queries. They have service-specific pages for each treatment, properly structured headings, schema markup that tells Google what they offer, and a fully optimized Google Business Profile. Most salons have a homepage and a contact page, and that is not enough to compete.
				</p>
				<p class="mt-4 text-[16px] leading-[1.8] text-brand-textMute">
					The same gap exists in AI search. When a customer asks ChatGPT or Perplexity for a salon recommendation, businesses with structured FAQ content and consistent local signals get cited. Businesses without them are invisible. Rynk builds both sets of signals automatically, every month, without you writing a word or logging into a dashboard. This is the same visibility gap covered in our guide on <a href="<?php echo esc_url( home_url( '/why-isnt-my-business-showing-up-on-google/' ) ); ?>" class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors">why your business is not showing up on Google</a>.
				</p>
			</div>
		</div>
	</section>

	<?php // H2: What Rynk fixes and publishes. ?>
	<section class="px-6 py-8 md:px-10 md:py-10">
		<div class="mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl">
				<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
					What Rynk fixes and publishes for salons and spas
				</h2>
				<p class="mt-5 text-[16px] leading-[1.8] text-brand-textMute">
					Every month, Rynk runs a complete cycle on your salon's site: audit, fix, generate, publish. Here is exactly what that covers.
				</p>
			</div>

			<div class="mx-auto mt-8 max-w-3xl">
				<ul class="grid gap-3 sm:grid-cols-2">
					<?php
					$items = array(
						array(
							'dot'  => 'bg-brand-violet/60',
							'ring' => 'ring-brand-violet/20',
							'text' => 'Service-specific pages for each treatment you offer, targeting the searches customers use to find them.',
						),
						array(
							'dot'  => 'bg-brand-blue/60',
							'ring' => 'ring-brand-blue/20',
							'text' => 'Meta titles and descriptions rewritten on every page so your salon appears for the right searches.',
						),
						array(
							'dot'  => 'bg-brand-emerald/60',
							'ring' => 'ring-brand-emerald/20',
							'text' => 'LocalBusiness and Service schema added so Google Maps and AI assistants understand exactly what you offer.',
						),
						array(
							'dot'  => 'bg-brand-pink/60',
							'ring' => 'ring-brand-pink/20',
							'text' => 'Google Business Profile signals reinforced so you rank in the local map pack.',
						),
						array(
							'dot'  => 'bg-brand-cyan/60',
							'ring' => 'ring-brand-cyan/20',
							'text' => 'FAQ content built around the questions customers ask before booking: price, duration, preparation, what to expect.',
						),
						array(
							'dot'  => 'bg-white/30',
							'ring' => 'ring-white/10',
							'text' => 'Monthly rank tracking to see which services and keywords are bringing in new bookings.',
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

	<?php // H2: One platform for Google and AI visibility. ?>
	<section class="px-6 py-8 md:px-10 md:py-10">
		<div class="mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl">
				<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
					One platform for Google and AI visibility
				</h2>
				<p class="mt-5 text-[16px] leading-[1.8] text-brand-textMute">
					Customers who search for a salon now use both Google and AI assistants. Rynk handles both: traditional SEO signals for Google Maps and organic rankings, and AEO and GEO signals for ChatGPT, Perplexity, and Google AI Overviews. Most tools do one or the other. Rynk does both in a single automated monthly workflow, priced at $149 per month for a single location.
				</p>
				<p class="mt-4 text-[16px] leading-[1.8] text-brand-textMute">
					Running a salon or spa is a full-time commitment with no spare hours for marketing. Rynk is built for exactly that situation: you connect your site and it handles everything, the audit, the fixes, the content, the publishing, every month on autopilot. No SEO knowledge, no agency, no briefings. For a broader look at how this works across all local service businesses, see our guide on <a href="<?php echo esc_url( home_url( '/local-seo-software/' ) ); ?>" class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors">local SEO software for small businesses</a>.
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
								'Built for many clients at once, not your salon',
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
								'Built specifically for a single local salon or spa',
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
							See what is holding your salon back on Google Maps.
						</h2>
						<p class="mt-2 text-[15px] leading-[1.7] text-brand-textMute">
							Enter your website URL and Rynk shows you the gaps right away, then starts fixing them automatically.
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
							'q' => 'How do I get my salon to rank higher on Google Maps?',
							'a' => 'Google Maps rankings are driven by your Google Business Profile signals and your website\'s local SEO: consistent business information, service-specific pages, schema markup, and reviews. Rynk reinforces all of these automatically each month without you needing to manage any of it.',
						),
						array(
							'q' => 'Will Rynk write service pages for each of my treatments?',
							'a' => 'Yes. Rynk publishes new pages each month targeting the specific services you offer. Each page is written around the keywords customers use to find that service and structured so Google and AI assistants understand what you offer and who it is for.',
						),
						array(
							'q' => 'How do I get more bookings from people who discover me online?',
							'a' => 'More bookings from search starts with ranking higher for the searches your customers make. Rynk builds that visibility by fixing your site\'s technical gaps, publishing service-specific content, and reinforcing your Google Business Profile signals, the combination that moves you above competitors in Maps and organic search.',
						),
						array(
							'q' => 'Do I need to know SEO to use Rynk for my salon?',
							'a' => 'No. Rynk is built for local business owners with no SEO background. You connect your website and Rynk handles the auditing, fixing, writing, and publishing. There is nothing to configure and no reports to interpret.',
						),
						array(
							'q' => 'What schema markup does Rynk add for salons?',
							'a' => 'Rynk adds LocalBusiness, Service, and FAQPage schema markup to your pages. This tells Google and AI assistants exactly what treatments you offer, where your salon is located, and what questions your pages answer, making you eligible for rich results in Google search and more likely to be cited in AI-generated recommendations.',
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