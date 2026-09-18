<?php
/**
 * Template Name: Rynk Google Keyword Ranking Checker
 *
 * /google-keyword-ranking-checker/ - explains how Rynk's Monitor step tracks
 * keyword rankings automatically, and gets the free-scan CTA in front of
 * owners who are searching for a rank checker.
 *
 * Same layout grid as the rest of the marketing site:
 *   - sections: px-6 md:px-10, py-14 md:py-16
 *   - content: mx-auto max-w-screen-xl (mx-auto max-w-3xl for the long-form
 *     copy block, matching the About page's prose column)
 *
 * @package rynk-ai
 */

get_header();

$faqs = array(
	array(
		'q' => "How can I check my website's ranking on Google for a specific keyword?",
		'a' => 'Enter your website URL into Rynk and it runs an automated check on your target keywords, showing your current position and tracking it weekly so you can see movement over time instead of guessing.',
	),
	array(
		'q' => 'Why does my Google ranking change from search to search?',
		'a' => 'Personalization, location, and search history all affect what you personally see when you search. Rynk checks rankings from a neutral standpoint so the numbers reflect what real customers see, not what your own browser shows you.',
	),
	array(
		'q' => "What's the best SEO tool for small businesses that just need to know where they rank?",
		'a' => 'Small businesses generally need a tool that checks rankings and also explains what to fix, without requiring an SEO specialist to interpret the data. Rynk is built for that: it audits, fixes, generates content, and monitors rankings in one automated workflow.',
	),
	array(
		'q' => 'How often should I check my keyword position on Google?',
		'a' => 'Weekly is a reasonable cadence for most small and local businesses, since rankings can shift with algorithm updates, competitor activity, and seasonality. Rynk runs this check automatically every week so you never have to remember to do it.',
	),
);
?>

<div class="relative text-brand-text overflow-x-hidden">
	<?php // HERO. ?>
	<section class="relative px-6 pt-16 pb-6 md:px-10 md:pt-20 md:pb-8">
		<div class="pointer-events-none absolute inset-0 bg-grid-brand opacity-50" aria-hidden="true"></div>
		<div class="relative mx-auto w-full max-w-3xl text-center">
			<p class="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft animate-rise">
				Keyword Rank Checker
			</p>
			<h1
				class="mt-5 font-serif text-5xl md:text-6xl font-medium leading-[1.02] tracking-tight animate-rise"
				style="animation-delay: 60ms;"
			>
				Check my keyword ranking on <span class="italic text-brand-blueSoft">Google.</span>
			</h1>
			<p
				class="mt-6 text-[16px] leading-[1.75] text-brand-textMute animate-rise"
				style="animation-delay: 160ms;"
			>
				Find out exactly where your website sits on Google for the searches that actually bring you customers, and let Rynk keep watching so you never fall behind again.
			</p>
		</div>
	</section>

	<?php // LONG-FORM CONTENT. ?>
	<section class="relative px-6 py-10 md:px-10 md:py-12">
		<div class="relative mx-auto max-w-3xl">

			<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
				Why checking your keyword ranking matters for a local business
			</h2>
			<p class="mt-4 text-[15px] leading-[1.75] text-brand-textMute">
				If you do not know where your website ranks for the searches your customers actually type, you cannot know whether your SEO is working or whether you are losing leads to a competitor three spots above you. Most small business owners have never checked their keyword position, let alone tracked it over time.
			</p>

			<figure class="mt-8 overflow-hidden rounded-3xl ring-1 ring-white/8">
				<img
					src="<?php echo esc_url( get_theme_file_uri( 'assets/img/keyword-ranking-dashboard.png' ) ); ?>"
					alt="a clean modern illustration of a search results ranking dashboard showing a list of keyword rows with position numbers, small up and down trend arrows, and light-gray placeholder text bars, set against a soft blue and white background"
					class="block h-auto w-full object-cover"
					loading="lazy"
					decoding="async"
				/>
				<figcaption class="bg-white/[0.03] px-5 py-3 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-brand-textMute">
					Rynk tracks where your pages rank for the searches that matter to your business.
				</figcaption>
			</figure>

			<h2 class="mt-14 font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
				How Rynk checks your Google ranking automatically
			</h2>
			<p class="mt-4 text-[15px] leading-[1.75] text-brand-textMute">
				Rynk&rsquo;s Monitor step runs a weekly search check on your key terms so you catch changes before they cost you customers, then feeds a ranking tracker back into your dashboard so you can see exactly where you stand against competitors, all without opening a spreadsheet or hiring an agency.
			</p>

			<ul class="mt-6 space-y-3">
				<?php
				$rank_features = array(
					'Weekly automated checks on your target keywords',
					'A ranking tracker that shows your position over time',
					'Side-by-side comparison against local competitors',
					'Alerts when a page drops so you can act fast',
				);
				?>
				<?php foreach ( $rank_features as $feature ) : ?>
					<li class="flex items-start gap-2.5 text-[15px] leading-relaxed text-brand-text/90">
						<?php echo rynk_icon( 'check', 'mt-0.5 h-4 w-4 shrink-0 text-brand-emeraldSoft' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
						<span><?php echo esc_html( $feature ); ?></span>
					</li>
				<?php endforeach; ?>
			</ul>

			<h2 class="mt-14 font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
				What a manual ranking check misses
			</h2>
			<p class="mt-4 text-[15px] leading-[1.75] text-brand-textMute">
				A one-time search from your own browser gets skewed by your location, search history, and personalization, and it tells you nothing about why a page is ranking where it is. Rynk checks rankings the way a new customer would search, then connects the result back to the technical fixes and content that actually move the needle.
			</p>

			<figure class="mt-8 overflow-hidden rounded-3xl ring-1 ring-white/8">
				<img
					src="<?php echo esc_url( get_theme_file_uri( 'assets/img/business-owner-laptop.png' ) ); ?>"
					alt="a candid realistic photograph of a small restaurant owner standing behind the counter looking at a laptop screen with a satisfied expression, warm interior lighting, coffee cups and a menu visible on the counter"
					class="block h-auto w-full object-cover"
					loading="lazy"
					decoding="async"
				/>
				<figcaption class="bg-white/[0.03] px-5 py-3 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-brand-textMute">
					Small business owners can check their standing without any SEO background.
				</figcaption>
			</figure>

			<h2 class="mt-14 font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-text">
				Turn ranking data into action, automatically
			</h2>
			<p class="mt-4 text-[15px] leading-[1.75] text-brand-textMute">
				Knowing your rank is only useful if something happens next. Rynk closes the loop: it audits your site, deploys the technical fixes and new content that hold rankings back, then keeps monitoring so improvements stick and new opportunities get caught early.
			</p>
		</div>
	</section>

	<?php // CTA. ?>
	<section class="relative px-6 py-14 md:px-10 md:py-16">
		<div class="relative mx-auto max-w-screen-xl overflow-hidden rounded-[32px] bg-white/[0.02] ring-1 ring-white/8 px-8 py-12 md:px-14 md:py-14">
			<div
				aria-hidden="true"
				class="pointer-events-none absolute -top-20 right-24 h-72 w-72 rounded-full bg-brand-blue/15 blur-3xl animate-float-slow"
			></div>

			<div class="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
				<div>
					<h2 class="font-serif text-3xl md:text-4xl font-medium leading-[1.05] tracking-tight text-brand-text">
						Check my <span class="italic text-brand-blueSoft">ranking.</span>
					</h2>
					<p class="mt-2 text-[15px] leading-[1.7] text-brand-textMute">
						Enter your website URL and see exactly where you rank on Google right now.
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
							aria-label="Check my ranking"
							class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-brand-ink transition-all group-hover:scale-105"
						>
							<?php echo rynk_icon( 'arrow-right', 'h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
						</button>
					</form>
				</div>
			</div>
		</div>
	</section>

	<?php // FAQ. ?>
	<section class="relative px-6 py-14 md:px-10 md:py-16">
		<div class="relative mx-auto max-w-screen-xl">
			<div class="mb-12">
				<p class="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-emeraldSoft">
					FAQ
				</p>
				<h2 class="mt-3 font-serif text-4xl md:text-5xl font-medium tracking-tight text-brand-text">
					Common questions.
				</h2>
			</div>

			<div class="grid gap-4 md:grid-cols-2">
				<?php foreach ( $faqs as $faq ) : ?>
					<div class="rounded-3xl bg-white/[0.03] ring-1 ring-white/8 p-7">
						<h3 class="font-serif text-lg font-medium leading-snug tracking-tight text-brand-text">
							<?php echo esc_html( $faq['q'] ); ?>
						</h3>
						<p class="mt-3 text-[14px] leading-relaxed text-brand-textMute">
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
