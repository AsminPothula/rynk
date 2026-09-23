<?php
/**
 * Template Name: Rynk Blog Hub
 *
 * /blog/ - hub page listing all educational articles.
 *
 * @package rynk-ai
 */

get_header();

$articles = rynk_blog_articles();
?>

<div class="relative text-brand-text overflow-x-hidden">
	<section class="relative px-6 pt-16 pb-10 md:px-10 md:pt-20 md:pb-12">
		<div class="pointer-events-none absolute inset-0 bg-grid-brand opacity-50" aria-hidden="true"></div>
		<div class="relative mx-auto max-w-screen-xl">
			<div class="max-w-3xl">
				<p class="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft animate-rise">
					Resources
				</p>
				<h1
					class="mt-4 font-serif text-5xl md:text-6xl font-medium leading-[1.05] tracking-tight animate-rise"
					style="animation-delay: 60ms;"
				>
					The Rynk <span class="italic text-brand-blueSoft">blog.</span>
				</h1>
				<p
					class="mt-6 text-[16px] leading-[1.8] text-brand-textMute animate-rise"
					style="animation-delay: 160ms;"
				>
					Practical guides on SEO, AI search visibility, and getting more customers to find your business online.
				</p>
			</div>
		</div>
	</section>

	<section class="relative px-6 py-10 md:px-10 md:py-14">
		<div
			aria-hidden="true"
			class="pointer-events-none absolute -top-16 right-8 h-72 w-72 rounded-full bg-brand-violet/15 blur-3xl animate-float-slow"
		></div>
		<div
			aria-hidden="true"
			class="pointer-events-none absolute bottom-0 left-8 h-64 w-64 rounded-full bg-brand-blue/12 blur-3xl animate-float-slow"
			style="animation-delay: 4s;"
		></div>

		<div class="relative mx-auto max-w-screen-xl">
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				<?php foreach ( $articles as $article ) : ?>
					<a
						href="<?php echo esc_url( home_url( $article['path'] ) ); ?>"
						class="group relative flex flex-col overflow-hidden rounded-3xl bg-white/[0.03] ring-1 ring-white/10 p-7 transition-all duration-300 hover:-translate-y-1 hover:ring-brand-violet/30"
					>
						<div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-brand-violet/60 via-brand-blue/60 to-transparent" aria-hidden="true"></div>
						<?php if ( ! empty( $article['image'] ) ) : ?>
							<div class="mb-5 aspect-[16/9] w-full overflow-hidden rounded-2xl">
								<img
									src="<?php echo esc_url( get_theme_file_uri( 'assets/img/rynk/' . $article['image'] ) ); ?>"
									alt="<?php echo esc_attr( $article['imageAlt'] ?? $article['title'] ); ?>"
									class="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
									loading="lazy"
									decoding="async"
								/>
							</div>
						<?php endif; ?>
						<p class="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-violetSoft">
							<?php echo esc_html( $article['label'] ?? 'Guide' ); ?>
						</p>
						<h2 class="mt-2 font-serif text-xl font-medium leading-snug tracking-tight text-brand-text group-hover:text-brand-blueSoft transition-colors">
							<?php echo esc_html( $article['title'] ); ?>
						</h2>
						<p class="mt-3 flex-1 text-[13.5px] leading-relaxed text-brand-textMute">
							<?php echo esc_html( $article['intro'] ); ?>
						</p>
						<span class="mt-5 inline-flex items-center gap-1.5 font-serif text-[13px] text-brand-violetSoft">
							Read article
							<svg class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
						</span>
					</a>
				<?php endforeach; ?>
			</div>
		</div>
	</section>
</div>

<?php
get_footer();