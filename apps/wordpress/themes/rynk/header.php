<?php
/**
 * Theme header.
 *
 * Combines what were two files in the Next.js app: the root layout's html /
 * body shell, and `(public)/layout.tsx` — the dark ink wrapper, the ambient
 * gradient wash, and `PublicHeader`.
 *
 * `PublicHeader` was a client component for two reasons: highlighting the
 * active nav link, and toggling the mobile menu. Here the active link comes
 * from WordPress's query (server-side), and the mobile menu is a small
 * progressive-enhancement script in assets/js/nav.js — so the markup is
 * complete before any JavaScript runs.
 *
 * @package rynk-ai
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<?php wp_head(); ?>
</head>
<body <?php body_class( 'min-h-screen bg-background font-sans antialiased' ); ?>>
<?php wp_body_open(); ?>

<div class="relative flex min-h-screen flex-col bg-brand-ink text-brand-text">
	<?php // Ambient gradient wash - keeps the lifted bg from feeling flat. ?>
	<div
		aria-hidden="true"
		class="pointer-events-none fixed inset-0 -z-10"
		style="background-image: radial-gradient(ellipse 1200px 800px at 10% -8%, rgba(156, 140, 240, 0.22), transparent 60%), radial-gradient(ellipse 1200px 800px at 90% -5%, rgba(109, 141, 255, 0.22), transparent 60%), radial-gradient(ellipse 900px 600px at 50% 45%, rgba(52, 211, 153, 0.06), transparent 70%), radial-gradient(ellipse 1000px 700px at 50% 110%, rgba(244, 114, 182, 0.10), transparent 70%);"
	></div>

	<header class="sticky top-0 z-50 border-b border-white/5 bg-brand-ink/70 backdrop-blur-xl" data-rynk-nav>
		<div class="flex h-16 items-center justify-between pl-4 pr-4 md:pl-6 md:pr-8 lg:pl-8 lg:pr-12">
			<?php // Logo - true left edge. ?>
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="group flex items-center gap-2.5">
				<span class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-violet shadow-[0_6px_16px_-6px_rgba(109,141,255,0.6)] transition-transform group-hover:scale-105">
					<?php echo rynk_leaf_mark( 'h-4 w-4 text-white' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</span>
				<span class="font-serif text-[19px] font-medium tracking-tight text-brand-text">
					rynk<span class="text-brand-violetSoft">.ai</span>
				</span>
			</a>

			<?php // Desktop nav - far right. ?>
			<nav class="hidden items-center gap-8 md:flex">
				<?php foreach ( rynk_nav_links() as $slug => $label ) : ?>
					<a href="<?php echo esc_url( home_url( '/' . $slug . '/' ) ); ?>" class="<?php echo esc_attr( rynk_nav_link_class( $slug ) ); ?>">
						<?php echo esc_html( $label ); ?>
					</a>
				<?php endforeach; ?>
				<?php // Dev shortcut until auth lands - direct door into the app. ?>
				<a
					href="<?php echo esc_url( home_url( '/app' ) ); ?>"
					class="font-serif text-[16px] text-brand-textMute transition-colors hover:text-brand-text"
				>
					Dashboard
				</a>
				<a
					href="<?php echo esc_url( home_url( '/sign-in' ) ); ?>"
					class="inline-flex h-10 items-center rounded-full bg-white px-5 font-serif text-[15px] font-medium text-brand-ink transition-all hover:shadow-[0_10px_28px_-10px_rgba(255,255,255,0.4)]"
				>
					Sign in
				</a>
			</nav>

			<?php // Mobile menu toggle. ?>
			<button
				type="button"
				aria-label="Open menu"
				aria-expanded="false"
				aria-controls="rynk-mobile-menu"
				data-rynk-nav-toggle
				class="flex h-10 w-10 items-center justify-center rounded-lg text-brand-text md:hidden"
			>
				<span data-rynk-nav-icon="open"><?php echo rynk_icon( 'menu', 'h-5 w-5' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
				<span data-rynk-nav-icon="close" hidden><?php echo rynk_icon( 'x', 'h-5 w-5' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
			</button>
		</div>

		<?php // Mobile menu panel - hidden until the toggle is pressed. ?>
		<nav
			id="rynk-mobile-menu"
			data-rynk-nav-panel
			hidden
			class="flex flex-col gap-1 border-t border-white/5 bg-brand-ink/95 px-6 py-4 backdrop-blur-xl md:hidden"
		>
			<?php foreach ( rynk_nav_links() as $slug => $label ) : ?>
				<a
					href="<?php echo esc_url( home_url( '/' . $slug . '/' ) ); ?>"
					class="<?php echo esc_attr( rynk_nav_link_class( $slug ) . ' rounded-lg px-3 py-3' ); ?>"
				>
					<?php echo esc_html( $label ); ?>
				</a>
			<?php endforeach; ?>
			<a
				href="<?php echo esc_url( home_url( '/app' ) ); ?>"
				class="rounded-lg px-3 py-3 font-serif text-[16px] text-brand-textMute transition-colors hover:text-brand-text"
			>
				Dashboard
			</a>
			<a
				href="<?php echo esc_url( home_url( '/sign-in' ) ); ?>"
				class="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 font-serif text-[15px] font-medium text-brand-ink"
			>
				Sign in
			</a>
		</nav>
	</header>

	<main class="flex-1">
