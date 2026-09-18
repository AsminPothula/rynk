<?php
/**
 * Template Name: Rynk Compare SEO Tools
 *
 * /rynk-vs-semrush-ahrefs-moz-small-business-seo - comparison / long-tail
 * content page: Rynk vs Semrush, Ahrefs, and Moz for hyperlocal small
 * businesses that don't have an in-house marketing team.
 *
 * Same layout grid as the rest of the marketing site:
 *   - sections: px-6 md:px-10, py-14 md:py-16
 *   - content: mx-auto max-w-screen-xl
 *
 * The document <title>, meta description, and the FAQPage JSON-LD for the
 * FAQ section below are wired up in functions.php (rynk_compare_document_title,
 * rynk_meta_description, rynk_compare_faq_schema) — same pattern as the About
 * page's title override.
 *
 * @package rynk-ai
 */

get_header();
?>

<div class="relative text-brand-text overflow-x-hidden">
	<?php // HERO. ?>
	<section class="relative px-6 py-14 md:px-10 md:py-20">
		<div class="pointer-events-none absolute inset-0 bg-grid-brand opacity-50" aria-hidden="true"></div>
		<div class="relative mx-auto max-w-screen-xl">
			<div class="max-w-3xl">
				<p class="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft animate-rise">
					Comparison
				</p>
				<h1
					class="mt-4 font-serif text-4xl md:text-5xl font-medium leading-[1.05] tracking-tight animate-rise"
					style="animation-delay: 60ms;"
				>
					Rynk vs Semrush, Ahrefs, and Moz: Best SEO Tool for
					<span class="italic text-brand-blueSoft">Small Local Businesses.</span>
				</h1>
				<p
					class="mt-8 text-[16px] leading-[1.8] text-brand-textMute animate-rise"
					style="animation-delay: 160ms;"
				>
					Semrush, Ahrefs, and Moz were built for marketing teams. Here&rsquo;s how Rynk
					compares for the hyperlocal business owner who needs results without hiring an
					SEO specialist.
				</p>
			</div>
		</div>
	</section>

	<?php // BUILT FOR HYPERLOCAL BUSINESSES. ?>
	<section class="relative px-6 py-10 md:px-10 md:py-12">
		<div class="relative mx-auto max-w-screen-xl">
			<div class="grid gap-10 md:grid-cols-2 md:items-center">
				<div>
					<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
						Built for hyperlocal businesses, not enterprise marketing teams.
					</h2>
					<p class="mt-5 text-[15px] leading-[1.75] text-brand-textMute">
						Semrush, Ahrefs, and Moz are established platforms that give agencies and
						marketing teams deep data on keywords, backlinks, and competitors. That depth
						is valuable, but it usually assumes someone on staff knows how to read a
						keyword difficulty score and turn it into an actual fix on the website.
					</p>
				</div>
				<figure class="relative">
					<div class="aspect-video w-full overflow-hidden rounded-2xl ring-1 ring-white/10">
						<img
							src="<?php echo esc_url( get_theme_file_uri( 'assets/img/compare-dashboards.png' ) ); ?>"
							alt="Complex enterprise SEO dashboard next to a simple, automated progress view"
							class="block h-full w-full object-cover"
							loading="lazy"
							decoding="async"
						/>
					</div>
					<figcaption class="mt-3 text-[13px] text-brand-textMute">
						Enterprise SEO suites versus an automated, hands-off workflow.
					</figcaption>
				</figure>
			</div>
		</div>
	</section>

	<?php // WHAT THEY DO WELL / WHERE RYNK FITS. ?>
	<section class="relative px-6 py-10 md:px-10 md:py-12">
		<div
			aria-hidden="true"
			class="pointer-events-none absolute -top-10 right-10 h-72 w-72 rounded-full bg-brand-violet/15 blur-3xl animate-float-slow"
		></div>

		<div class="relative mx-auto max-w-screen-xl">
			<div class="max-w-3xl">
				<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
					What Semrush, Ahrefs, and Moz do well.
				</h2>
				<p class="mt-5 text-[15px] leading-[1.75] text-brand-textMute">
					These platforms are strong at raw data: keyword volume, backlink profiles, site
					audits, and rank tracking across huge datasets. They are widely used by
					agencies and larger companies that have the time and staff to interpret
					reports and manually implement changes on their website.
				</p>
			</div>

			<div class="mt-12">
				<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
					Where Rynk fits differently.
				</h2>
				<ul class="mt-6 grid gap-3 sm:grid-cols-2">
					<?php
					$rynk_fits = array(
						'Generates and publishes AI-optimized content directly on your website, not just a report',
						'Optimizes for traditional Google search and AI platforms like ChatGPT, Perplexity, and Google AI Overview at the same time',
						'Requires no SEO knowledge, no developer, and no agency to interpret the data',
						'Runs the full workflow, audit, fix, generate, and monitor, in minutes instead of weeks',
					);
					foreach ( $rynk_fits as $feature ) :
						?>
						<li class="flex items-start gap-2.5 rounded-2xl bg-white/[0.03] ring-1 ring-white/8 p-4 text-[14px] leading-relaxed text-brand-text/90">
							<?php echo rynk_icon( 'check', 'mt-0.5 h-4 w-4 shrink-0 text-brand-emeraldSoft' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
							<span><?php echo esc_html( $feature ); ?></span>
						</li>
					<?php endforeach; ?>
				</ul>
			</div>
		</div>
	</section>

	<?php // SIDE-BY-SIDE LOOK. ?>
	<section class="relative px-6 py-10 md:px-10 md:py-12">
		<div class="relative mx-auto max-w-screen-xl">
			<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
				A side-by-side look.
			</h2>
			<ul class="mt-6 grid gap-3 sm:grid-cols-2">
				<?php
				$comparisons = array(
					'Data-heavy dashboards vs. a plain-language audit built for non-technical owners',
					'Manual implementation of fixes vs. Rynk deploying fixes directly to your live site',
					'Google-only optimization focus vs. Rynk optimizing for Google and AI assistants together',
					'Enterprise pricing and seats vs. flat per-business pricing built for small teams',
				);
				foreach ( $comparisons as $point ) :
					?>
					<li class="flex items-start gap-2.5 rounded-2xl bg-white/[0.03] ring-1 ring-white/8 p-4 text-[14px] leading-relaxed text-brand-text/90">
						<?php echo rynk_icon( 'check', 'mt-0.5 h-4 w-4 shrink-0 text-brand-blueSoft' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
						<span><?php echo esc_html( $point ); ?></span>
					</li>
				<?php endforeach; ?>
			</ul>
		</div>
	</section>

	<?php // WHICH SHOULD YOU CHOOSE. ?>
	<section class="relative px-6 py-10 md:px-10 md:py-12">
		<div
			aria-hidden="true"
			class="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-brand-pink/12 blur-3xl animate-float-slow"
			style="animation-delay: 4s;"
		></div>

		<div class="relative mx-auto max-w-screen-xl">
			<div class="grid gap-10 md:grid-cols-2 md:items-center">
				<figure class="relative order-last md:order-first">
					<div class="aspect-video w-full overflow-hidden rounded-2xl ring-1 ring-white/10">
						<img
							src="<?php echo esc_url( get_theme_file_uri( 'assets/img/salon-owner-tablet.png' ) ); ?>"
							alt="A hair salon owner reviewing a tablet at the front desk of her salon"
							class="block h-full w-full object-cover"
							loading="lazy"
							decoding="async"
						/>
					</div>
					<figcaption class="mt-3 text-[13px] text-brand-textMute">
						Local service businesses need results, not another dashboard to learn.
					</figcaption>
				</figure>
				<div>
					<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
						Which should you choose?
					</h2>
					<p class="mt-5 text-[15px] leading-[1.75] text-brand-textMute">
						If you have an in-house marketing team or an agency retainer, a data platform
						like Semrush, Ahrefs, or Moz can be a strong addition to that workflow. If
						you are a hyperlocal business, a salon, a restaurant, or a solo service
						provider without marketing staff, Rynk is built to do the audit, the fixes,
						and the content work for you automatically.
					</p>
				</div>
			</div>
		</div>
	</section>

	<?php // BOTTOM CTA. ?>
	<section class="relative px-6 py-14 md:px-10 md:py-16">
		<div class="relative mx-auto max-w-screen-xl overflow-hidden rounded-[32px] bg-white/[0.02] px-8 py-12 md:px-14 md:py-14 ring-1 ring-white/8">
			<div
				aria-hidden="true"
				class="pointer-events-none absolute -top-20 right-24 h-72 w-72 rounded-full bg-brand-blue/15 blur-3xl animate-float-slow"
			></div>

			<div class="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
				<div>
					<h3 class="font-serif text-3xl md:text-4xl font-medium tracking-tight">
						See how Rynk compares <span class="italic text-brand-blueSoft">on your own site.</span>
					</h3>
					<p class="mt-2 text-[15px] text-brand-textMute">
						Enter your website URL for an immediate assessment - no SEO expertise needed.
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

	<?php // FAQ. Kept in sync with the FAQPage JSON-LD emitted in functions.php. ?>
	<section class="relative px-6 py-10 md:px-10 md:py-14">
		<div class="relative mx-auto max-w-screen-xl">
			<div class="mb-10">
				<p class="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-emeraldSoft">
					FAQ
				</p>
				<h2 class="mt-3 font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
					Common questions.
				</h2>
			</div>

			<div class="grid gap-4 md:grid-cols-2">
				<?php
				$faqs = array(
					array(
						'q' => 'Is Rynk a replacement for Semrush, Ahrefs, or Moz?',
						'a' => 'For hyperlocal businesses without a dedicated marketing team, yes, Rynk is designed to be the whole solution, auditing your site and deploying fixes and content automatically rather than just reporting data for someone else to act on.',
					),
					array(
						'q' => 'Do I need SEO experience to use Rynk instead of Semrush or Ahrefs?',
						'a' => 'No. Rynk is built specifically so business owners without any SEO or developer background can get an audit, have the fixes deployed, and have new content generated without manually interpreting reports.',
					),
					array(
						'q' => 'Does Rynk help with AI search engines like ChatGPT, not just Google?',
						'a' => 'Yes. Rynk optimizes for traditional Google search and reformats pages for AI readability so tools like ChatGPT, Perplexity, and Google AI Overview can describe your business accurately and cite it more often.',
					),
					array(
						'q' => 'What local business SEO software should I use if I have no marketing budget?',
						'a' => 'Look for a tool that automates the fix, not just the diagnosis. Rynk audits your site, deploys technical and content fixes directly, and monitors results, which removes the need for a separate developer or SEO hire.',
					),
				);
				foreach ( $faqs as $faq ) :
					?>
					<div class="rounded-2xl bg-white/[0.03] ring-1 ring-white/8 p-6">
						<h3 class="font-serif text-[17px] font-medium leading-tight tracking-tight text-brand-text">
							<?php echo esc_html( $faq['q'] ); ?>
						</h3>
						<p class="mt-2.5 text-[14px] leading-relaxed text-brand-textMute">
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
