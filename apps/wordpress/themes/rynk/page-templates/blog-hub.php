<?php
/**
 * Template Name: Rynk Blog Hub
 *
 * /blog/ — index of all content posts.
 *
 * @package rynk-ai
 */

get_header();

$posts = rynk_blog_posts();
?>

<div class="relative text-brand-text overflow-x-hidden">

	<?php // HERO. ?>
	<section class="relative px-6 pt-16 pb-10 md:px-10 md:pt-20 md:pb-12">
		<div class="pointer-events-none absolute inset-0 bg-grid-brand opacity-50" aria-hidden="true"></div>
		<div
			aria-hidden="true"
			class="pointer-events-none absolute -top-10 left-1/3 h-72 w-72 rounded-full bg-brand-violet/15 blur-3xl animate-float-slow"
		></div>
		<div class="relative mx-auto max-w-screen-xl text-center">
			<p class="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft animate-rise">
				Blog
			</p>
			<h1
				class="mt-4 font-serif text-5xl md:text-6xl font-medium leading-[1.02] tracking-tight animate-rise"
				style="animation-delay: 60ms;"
			>
				SEO insights for <span class="italic text-brand-blueSoft">local businesses.</span>
			</h1>
			<p
				class="mt-6 max-w-2xl mx-auto text-[16px] leading-[1.75] text-brand-textMute animate-rise"
				style="animation-delay: 160ms;"
			>
				Practical guides on getting found on Google and AI assistants — written for business owners, not developers.
			</p>
		</div>
	</section>

	<?php // POST GRID. ?>
	<section class="relative px-6 py-10 md:px-10 md:py-12">
		<div class="relative mx-auto max-w-screen-xl">
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				<?php foreach ( $posts as $post ) : ?>
					<a
						href="<?php echo esc_url( $post['url'] ); ?>"
						class="group relative flex flex-col overflow-hidden rounded-3xl bg-white/[0.03] ring-1 ring-white/8 transition-all duration-300 hover:-translate-y-1"
					>
						<div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-violet/40 to-transparent" aria-hidden="true"></div>
						<?php if ( ! empty( $post['image'] ) ) : ?>
							<div class="aspect-[16/9] overflow-hidden">
								<img
									src="<?php echo esc_url( get_theme_file_uri( $post['image'] ) ); ?>"
									alt="<?php echo esc_attr( $post['image_alt'] ); ?>"
									class="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
									loading="lazy"
									decoding="async"
								/>
							</div>
						<?php endif; ?>
						<div class="flex flex-1 flex-col p-7">
							<p class="font-mono text-[10px] uppercase tracking-[0.15em] text-brand-violetSoft mb-3">
								<?php echo esc_html( $post['category'] ); ?>
							</p>
							<h2 class="font-serif text-xl font-medium leading-snug tracking-tight text-brand-text mb-3 group-hover:text-brand-blueSoft transition-colors">
								<?php echo esc_html( $post['title'] ); ?>
							</h2>
							<p class="text-[13.5px] leading-relaxed text-brand-textMute flex-1">
								<?php echo esc_html( $post['excerpt'] ); ?>
							</p>
							<div class="mt-5 flex items-center gap-1.5 font-serif text-[13px] text-brand-textMute group-hover:text-brand-text transition-colors">
								Read article
								<?php echo rynk_icon( 'arrow-right', 'h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
							</div>
						</div>
					</a>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<?php // BOTTOM CTA. ?>
	<section class="relative px-6 py-14 md:px-10 md:py-16">
		<div class="relative mx-auto max-w-screen-xl overflow-hidden rounded-[32px] bg-white/[0.02] ring-1 ring-white/8 px-8 py-12 md:px-14 md:py-14">
			<div
				aria-hidden="true"
				class="pointer-events-none absolute -top-20 right-24 h-72 w-72 rounded-full bg-brand-blue/15 blur-3xl animate-float-slow"
			></div>
			<div class="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
				<div>
					<h2 class="font-serif text-3xl md:text-4xl font-medium tracking-tight">
						See what&rsquo;s holding your site back.
					</h2>
					<p class="mt-2 text-[15px] text-brand-textMute">
						Enter your URL and get a free instant assessment of why customers can&rsquo;t find you.
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

</div>

<?php
get_footer();