<?php
/**
 * Fallback template.
 *
 * WordPress requires an index.php in every theme. This site is four static
 * marketing pages, so anything that lands here — a stray archive, a 404 —
 * gets the shared chrome and a short pointer back to the landing page.
 *
 * @package rynk-ai
 */

get_header();
?>

<section class="relative px-6 py-14 md:px-10 md:py-16">
	<div class="relative mx-auto max-w-screen-xl">
		<?php if ( have_posts() ) : ?>
			<?php while ( have_posts() ) : ?>
				<?php the_post(); ?>
				<article class="mb-10">
					<h1 class="font-serif text-4xl md:text-5xl font-medium tracking-tight text-brand-text">
						<?php the_title(); ?>
					</h1>
					<div class="mt-6 space-y-5 text-[15px] leading-[1.75] text-brand-textMute">
						<?php the_content(); ?>
					</div>
				</article>
			<?php endwhile; ?>
		<?php else : ?>
			<h1 class="font-serif text-4xl md:text-5xl font-medium tracking-tight text-brand-text">
				Nothing here.
			</h1>
			<p class="mt-4 text-[15px] leading-[1.75] text-brand-textMute">
				That page doesn&rsquo;t exist.
			</p>
			<a
				href="<?php echo esc_url( home_url( '/' ) ); ?>"
				class="group mt-8 inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-7 font-serif text-[16px] font-medium text-brand-ink transition-all hover:shadow-[0_14px_36px_-14px_rgba(255,255,255,0.4)]"
			>
				Back to rynk.ai
				<?php echo rynk_icon( 'arrow-right', 'h-4 w-4 transition-transform group-hover:translate-x-0.5' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</a>
		<?php endif; ?>
	</div>
</section>

<?php
get_footer();
