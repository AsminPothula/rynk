<?php
/**
 * Template Name: Rynk Automated SEO for Small Business
 *
 * /automated-seo-for-small-business/ - targeted landing page for local small
 * business owners searching for automated SEO that does the work for them.
 *
 * Reached via in-content links from /local-seo-software/, /how-it-works/,
 * and /pricing/. Not in the primary nav.
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
	"headline": "Automated SEO for Small Business",
	"description": "Rynk is an automated SEO platform for small businesses. It audits your site, fixes issues, and publishes content automatically every month. No expertise or agency needed.",
	"url": "<?php echo esc_url( home_url( '/automated-seo-for-small-business/' ) ); ?>",
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
			"name": "Is there automated SEO for small businesses?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "Yes. Rynk is an automated SEO platform built specifically for small local businesses. It audits your site, applies technical fixes, generates optimized content, and publishes it directly to your WordPress site every month - no manual work, no SEO knowledge, and no agency required."
			}
		},
		{
			"@type": "Question",
			"name": "How can AI automate my SEO work?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "Rynk uses AI to research keywords, identify technical gaps, write optimized page content, and publish it to your site automatically. It also adds schema markup, fixes meta descriptions, and builds internal links - all the tasks an SEO agency would charge hundreds of dollars a month to do manually."
			}
		},
		{
			"@type": "Question",
			"name": "What is an automated SEO platform and how does it work?",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "An automated SEO platform connects to your website, audits it for every type of visibility gap, and then applies fixes and publishes new content without you doing anything. Rynk does this on a monthly cycle: audit in week one, fixes and new pages throughout the month, rank tracking and reporting at the end."
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
				<span class="text-brand-violetSoft">Automated SEO for Small Business</span>
			</nav>

			<div class="max-w-3xl">
				<p class="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft animate-rise">
					Automated SEO
				</p>
				<h1
					class="mt-4 font-serif text-4xl md:text-5xl font-medium leading-[1.08] tracking-tight animate-rise"
					style="animation-delay: 60ms;"
				>
					Automated SEO for Small Business
				</h1>
				<p
					class="mt-6 text-[17px] leading-[1.8] text-brand-textMute animate-rise"
					style="animation-delay: 160ms;"
				>
					For the local service provider with no marketing help who is not sure why the phone is not ringing, and does not have hours each week to spend on SEO.
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
						src="<?php echo esc_url( $image_base . 'automated-seo-for-small-business-1.jpg' ); ?>"
						alt="A clean plumbing workshop with copper pipes, fittings, and tools laid out on a metal workbench under fluorescent lighting, no people, organized and professional"
						class="block h-full w-full object-cover"
						loading="eager"
						decoding="async"
					/>
				</div>
				<figcaption class="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-brand-textMute">
					A local service provider's work speaks for itself. Rynk makes sure Google and AI assistants speak for it too.
				</figcaption>
			</figure>
		</div>
	</section>

	<?php // INTRO PARA. ?>
	<section class="px-6 py-8 md:px-10 md:py-10">
		<div class="mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl">
				<p class="text-[16px] leading-[1.8] text-brand-textMute">
					When a potential customer searches for a plumber, salon, or restaurant near them, the businesses that show up are not necessarily the best ones. They are the ones whose websites send the right signals to Google. Automated SEO is how a small business closes that gap without hiring an agency or learning a new skill.
				</p>
			</div>
		</div>
	</section>

	<?php // H2: What automated SEO actually means. ?>
	<section class="px-6 py-8 md:px-10 md:py-10">
		<div class="mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl">
				<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
					What automated SEO for small business actually means
				</h2>
				<p class="mt-5 text-[16px] leading-[1.8] text-brand-textMute">
					Automated SEO means the platform does the work, not you. It audits your site on a schedule, identifies what is hurting your visibility, applies the technical fixes directly to your site, and publishes new pages built around what your customers are searching for. No monthly to-do list. No agency check-in call. No jargon report to decode.
				</p>
				<p class="mt-4 text-[16px] leading-[1.8] text-brand-textMute">
					Rynk runs four steps on autopilot every month: audit, fix, generate, and monitor. Each cycle, your site gets stronger on Google and more visible to AI assistants like ChatGPT and Perplexity. The first time you notice is usually when the phone rings more.
				</p>
				<p class="mt-4 text-[16px] leading-[1.8] text-brand-textMute">
					This is the same approach described in detail on the <a href="<?php echo esc_url( home_url( '/how-it-works/' ) ); ?>" class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors">how it works page</a>. If you are comparing <a href="<?php echo esc_url( home_url( '/local-seo-software/' ) ); ?>" class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors">local SEO software</a> options, see how Rynk stacks up against tools that only report problems rather than fixing them.
				</p>
			</div>
		</div>
	</section>

	<?php // H2: What Rynk automates. ?>
	<section class="px-6 py-8 md:px-10 md:py-10">
		<div class="mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl">
				<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
					What Rynk automates every month
				</h2>
				<p class="mt-5 text-[16px] leading-[1.8] text-brand-textMute">
					Every monthly cycle covers the full range of SEO work that an agency would charge hundreds or thousands of dollars to perform manually.
				</p>
			</div>

			<div class="mx-auto mt-8 max-w-3xl">
				<ul class="grid gap-3 sm:grid-cols-2">
					<?php
					$items = array(
						array(
							'dot'  => 'bg-brand-violet/60',
							'ring' => 'ring-brand-violet/20',
							'text' => 'Site audit: every page checked for technical issues, keyword gaps, and missing content signals.',
						),
						array(
							'dot'  => 'bg-brand-blue/60',
							'ring' => 'ring-brand-blue/20',
							'text' => 'Technical fixes deployed directly to your WordPress site, no developer needed.',
						),
						array(
							'dot'  => 'bg-brand-emerald/60',
							'ring' => 'ring-brand-emerald/20',
							'text' => 'Meta titles and descriptions rewritten on every page that needs them.',
						),
						array(
							'dot'  => 'bg-brand-pink/60',
							'ring' => 'ring-brand-pink/20',
							'text' => 'Schema markup added so Google and AI assistants understand your business type, services, and location.',
						),
						array(
							'dot'  => 'bg-brand-cyan/60',
							'ring' => 'ring-brand-cyan/20',
							'text' => 'Five to ten new pages published targeting the searches and questions your customers are making.',
						),
						array(
							'dot'  => 'bg-white/30',
							'ring' => 'ring-white/10',
							'text' => 'Five to ten existing pages updated with stronger content, keywords, and internal links.',
						),
						array(
							'dot'  => 'bg-brand-violet/40',
							'ring' => 'ring-brand-violet/15',
							'text' => 'Rank tracking to show you which keywords are moving and which competitors you are passing.',
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

	<?php // H2: Built for owners, not experts. ?>
	<section class="px-6 py-8 md:px-10 md:py-10">
		<div class="mx-auto max-w-screen-xl">
			<div class="mx-auto max-w-3xl">
				<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
					Is there automated SEO for small businesses? Yes, this is it.
				</h2>
				<p class="mt-5 text-[16px] leading-[1.8] text-brand-textMute">
					Most SEO tools are built for in-house marketing teams or agencies with dedicated SEO staff. They require hours of learning, weekly attention, and an understanding of search mechanics that most local business owners do not have and should not need. Rynk is built for the opposite situation: a business owner who is excellent at their trade, has no spare hours, and wants their site to bring in customers without becoming another job.
				</p>
				<p class="mt-4 text-[16px] leading-[1.8] text-brand-textMute">
					Rynk also optimizes for AI assistants like ChatGPT and Perplexity alongside traditional Google search, using <a href="<?php echo esc_url( home_url( '/generative-engine-optimization/' ) ); ?>" class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors">generative engine optimization</a> and <a href="<?php echo esc_url( home_url( '/blog/answer-engine-optimization/' ) ); ?>" class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors">answer engine optimization</a> as part of every monthly cycle. One platform, one price, no coordination needed.
				</p>
			</div>

			<?php // Comparison grid. ?>
			<div class="mx-auto mt-8 max-w-3xl grid gap-4 sm:grid-cols-2">
				<div class="rounded-2xl bg-white/[0.03] ring-1 ring-brand-blue/20 p-6">
					<div class="flex items-center gap-2 mb-3">
						<span class="h-2 w-2 shrink-0 rounded-full bg-brand-blue/60" aria-hidden="true"></span>
						<span class="font-serif text-[16px] font-medium text-brand-blueSoft">Traditional SEO tools</span>
					</div>
					<ul class="space-y-2">
						<?php
						$traditional = array(
							'Show you a report of problems',
							'Leave the fixing and writing to you',
							'Require SEO knowledge to interpret',
							'Built for agencies and professionals',
							'Only optimize for Google, not AI assistants',
						);
						foreach ( $traditional as $pt ) :
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
							'Applies the fixes and publishes content automatically',
							'Requires no SEO knowledge at all',
							'Built for one local business owner',
							'Flat monthly price starting at $149',
							'Optimizes for Google and AI assistants together',
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
							Connect your site and Rynk starts immediately.
						</h2>
						<p class="mt-2 text-[15px] leading-[1.7] text-brand-textMute">
							No setup calls, no contracts, no waiting. The first audit begins the moment you connect.
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
							'q' => 'Is there automated SEO for small businesses?',
							'a' => 'Yes. Rynk is an automated SEO platform built specifically for small local businesses. It audits your site, applies technical fixes, generates optimized content, and publishes it directly to your WordPress site every month. No manual work, no SEO knowledge, and no agency required.',
						),
						array(
							'q' => 'How can AI automate my SEO work?',
							'a' => 'Rynk uses AI to research keywords, identify technical gaps, write optimized page content, and publish it to your site automatically. It also adds schema markup, fixes meta descriptions, and builds internal links, all the tasks an SEO agency would charge hundreds of dollars a month to do manually.',
						),
						array(
							'q' => 'What is an automated SEO platform and how does it work?',
							'a' => 'An automated SEO platform connects to your website, audits it for every type of visibility gap, and then applies fixes and publishes new content without you doing anything. Rynk does this on a monthly cycle: audit in week one, fixes and new pages throughout the month, rank tracking and reporting at the end.',
						),
						array(
							'q' => 'What does automated SEO cost for a small business?',
							'a' => 'Rynk\'s Gold plan starts at $149 per month, covering the full automated SEO cycle: audit, technical fixes, content publishing, and rank tracking. The Platinum plan at $299 per month doubles the page output and adds more frequent tracking for businesses that want faster results.',
						),
						array(
							'q' => 'How is automated SEO different from hiring an SEO agency?',
							'a' => 'An agency requires a monthly retainer, often $1,000 or more, plus regular communication and approvals from you. Automated SEO through Rynk runs without any input from you once your site is connected. Rynk handles the audit, fixes, writing, and publishing on a set monthly schedule at a fraction of agency cost.',
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