<?php
/**
 * Template Name: Rynk About
 *
 * /about - Why We Started Rynk + Meet the Founders.
 * Port of `(public)/about/page.tsx`.
 *
 * Same layout grid as the rest of the marketing site:
 *   - sections: px-6 md:px-10, py-14 md:py-16
 *   - content: mx-auto max-w-screen-xl
 *
 * The founder photos were static imports handled by next/image; here they are
 * plain <img> tags against the theme's assets directory. The aspect-[4/3]
 * wrapper reserves the layout box, so no intrinsic width/height is needed to
 * avoid a shift while the file loads.
 *
 * @package rynk-ai
 */

get_header();

$founder_styles = rynk_founder_styles();
?>

<div class="relative text-brand-text overflow-x-hidden">
	<?php // WHY WE STARTED RYNK. ?>
	<section class="relative px-6 py-14 md:px-10 md:py-20">
		<div class="pointer-events-none absolute inset-0 bg-grid-brand opacity-50" aria-hidden="true"></div>
		<div class="relative mx-auto max-w-screen-xl">
			<div class="max-w-3xl">
				<p class="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft animate-rise">
					About
				</p>
				<h1
					class="mt-4 font-serif text-5xl md:text-6xl font-medium leading-[1.05] tracking-tight animate-rise"
					style="animation-delay: 60ms;"
				>
					Our <span class="italic text-brand-blueSoft">story.</span>
				</h1>
				<div
					class="mt-8 space-y-5 text-[16px] leading-[1.8] text-brand-textMute animate-rise"
					style="animation-delay: 160ms;"
				>
					<p>
						Rynk began because of one problem: small and medium-sized
						businesses weren&rsquo;t visible online - not because they lacked
						quality products, but because they lacked quality online
						presence. Small restaurants, local businesses, and talented
						creators all have valuable products, but nobody could find them.
					</p>
					<p>
						We built Rynk to solve that: one platform that automates your
						visibility everywhere customers search, whether that&rsquo;s
						Google, AI platforms, maps, or local listings. The best product
						shouldn&rsquo;t lose to better marketing.
					</p>
				</div>
			</div>
		</div>
	</section>

	<?php // MEET THE FOUNDERS. ?>
	<section class="relative px-6 py-14 md:px-10 md:py-16">
		<div
			aria-hidden="true"
			class="pointer-events-none absolute -top-10 right-10 h-72 w-72 rounded-full bg-brand-violet/15 blur-3xl animate-float-slow"
		></div>
		<div
			aria-hidden="true"
			class="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-brand-pink/12 blur-3xl animate-float-slow"
			style="animation-delay: 4s;"
		></div>

		<div class="relative mx-auto max-w-screen-xl">
			<div class="mb-12">
				<p class="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-emeraldSoft">
					The team
				</p>
				<h2 class="mt-3 font-serif text-4xl md:text-5xl font-medium tracking-tight">
					Meet the team.
				</h2>
			</div>

			<div class="grid gap-6 md:grid-cols-3">
				<?php foreach ( rynk_founders() as $founder ) : ?>
					<?php $s = $founder_styles[ $founder['tint'] ]; ?>
					<div class="<?php echo esc_attr( 'group relative overflow-hidden rounded-3xl bg-white/[0.03] ring-1 ' . $s['ring'] . ' p-7 md:p-8 transition-all duration-300 hover:-translate-y-1' ); ?>">
						<div class="<?php echo esc_attr( 'absolute inset-x-0 top-0 h-[2px] ' . $s['topBar'] ); ?>" aria-hidden="true"></div>
						<div
							aria-hidden="true"
							class="<?php echo esc_attr( 'pointer-events-none absolute -top-14 -right-14 h-44 w-44 rounded-full ' . $s['ambient'] . ' blur-3xl opacity-70' ); ?>"
						></div>

						<div class="relative">
							<div class="aspect-square w-full overflow-hidden rounded-2xl ring-1 ring-white/10">
								<img
									src="<?php echo esc_url( get_theme_file_uri( 'assets/img/' . $founder['image'] ) ); ?>"
									alt="<?php echo esc_attr( $founder['name'] ); ?>"
									class="<?php echo esc_attr( 'block h-full w-full object-cover ' . ( $founder['img_class'] ?? '' ) ); ?>"
									sizes="(max-width: 768px) 100vw, 50vw"
									loading="lazy"
									decoding="async"
								/>
							</div>

							<h3 class="mt-6 font-serif text-2xl font-medium leading-tight tracking-tight">
								<?php echo esc_html( $founder['name'] ); ?>
							</h3>
							<p class="<?php echo esc_attr( 'mt-1 font-mono text-[11px] uppercase tracking-[0.15em] ' . $s['role'] ); ?>">
								<?php echo esc_html( $founder['role'] ); ?>
							</p>
							<p class="mt-4 text-[14px] leading-relaxed text-brand-textMute">
								<?php echo esc_html( $founder['bio'] ); ?>
							</p>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<?php // MENTORS. ?>
	<section class="relative px-6 py-14 md:px-10 md:py-16">
		<div class="relative mx-auto max-w-screen-xl">
			<div class="mb-12">
				<p class="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-emeraldSoft">
					Guidance
				</p>
				<h2 class="mt-3 font-serif text-4xl md:text-5xl font-medium tracking-tight">
					Mentors.
				</h2>
			</div>

			<div class="grid gap-6 md:grid-cols-3">
				<?php foreach ( rynk_mentors() as $mentor ) : ?>
					<?php $s = $founder_styles[ $mentor['tint'] ]; ?>
					<div class="<?php echo esc_attr( 'group relative overflow-hidden rounded-3xl bg-white/[0.03] ring-1 ' . $s['ring'] . ' p-7 md:p-8 transition-all duration-300 hover:-translate-y-1' ); ?>">
						<div class="<?php echo esc_attr( 'absolute inset-x-0 top-0 h-[2px] ' . $s['topBar'] ); ?>" aria-hidden="true"></div>
						<div
							aria-hidden="true"
							class="<?php echo esc_attr( 'pointer-events-none absolute -top-14 -right-14 h-44 w-44 rounded-full ' . $s['ambient'] . ' blur-3xl opacity-70' ); ?>"
						></div>

						<div class="relative">
							<div class="aspect-square w-full overflow-hidden rounded-2xl ring-1 ring-white/10">
								<img
									src="<?php echo esc_url( get_theme_file_uri( 'assets/img/' . $mentor['image'] ) ); ?>"
									alt="<?php echo esc_attr( $mentor['name'] ); ?>"
									class="block h-full w-full object-cover"
									sizes="(max-width: 768px) 100vw, 33vw"
									loading="lazy"
									decoding="async"
								/>
							</div>

							<h3 class="mt-6 font-serif text-2xl font-medium leading-tight tracking-tight">
								<?php echo esc_html( $mentor['name'] ); ?>
							</h3>
							<p class="<?php echo esc_attr( 'mt-1 font-mono text-[11px] uppercase tracking-[0.15em] ' . $s['role'] ); ?>">
								<?php echo esc_html( $mentor['role'] ); ?>
							</p>
							<p class="mt-4 text-[14px] leading-relaxed text-brand-textMute">
								<?php echo esc_html( $mentor['bio'] ); ?>
							</p>
						</div>
					</div>
				<?php endforeach; ?>
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
						Watch Rynk live <span class="italic text-brand-blueSoft">on your site.</span>
					</h3>
					<p class="mt-2 text-[15px] text-brand-textMute">
						Enter your website URL and see the immediate assessment - why your customers aren&rsquo;t finding your site on Google or AI.
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
