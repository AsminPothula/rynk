<?php
/**
 * Theme bootstrap for rynk.ai.
 *
 * @package rynk-ai
 */

declare( strict_types = 1 );

require_once get_theme_file_path( 'inc/icons.php' );
require_once get_theme_file_path( 'inc/tints.php' );
require_once get_theme_file_path( 'inc/content.php' );
require_once get_theme_file_path( 'inc/components.php' );

/**
 * The marketing pages, keyed by slug.
 *
 * Slug => [ page title, page-template file ]. Used both by the nav and by
 * the one-time page scaffolding on theme activation, so the two can never
 * drift apart.
 *
 * @return array<string, array{title: string, template: string}>
 */
function rynk_pages(): array {
	return array(
		'how-it-works'   => array(
			'title'    => 'How it works',
			'template' => 'page-templates/how-it-works.php',
		),
		'pricing'        => array(
			'title'    => 'Pricing',
			'template' => 'page-templates/pricing.php',
		),
		'about'          => array(
			'title'    => 'About',
			'template' => 'page-templates/about.php',
		),
		// Placeholder pages — live until the real destinations ship. The app,
		// sign-in, and free-scan CTAs all land on a "Coming soon" screen rather
		// than a dead link.
		'app'            => array(
			'title'    => 'Dashboard',
			'template' => 'page-templates/coming-soon.php',
		),
		'sign-in'        => array(
			'title'    => 'Sign in',
			'template' => 'page-templates/coming-soon.php',
		),
		'privacy-policy' => array(
			'title'    => 'Privacy Policy and Agreement',
			'template' => 'page-templates/privacy-policy.php',
		),
	);
}

/**
 * Header nav links — slug => label. Mirrors `NAV_LINKS` in PublicHeader.
 *
 * @return array<string, string>
 */
function rynk_nav_links(): array {
	return array(
		'how-it-works' => 'How it works',
		'pricing'      => 'Pricing',
		'about'        => 'About',
	);
}

/**
 * Nav link classes, with the current page highlighted.
 *
 * The React version compared `usePathname()` to the href. WordPress knows
 * which page is being rendered, so the active state is resolved server-side
 * and needs no JavaScript.
 *
 * @param string $slug Page slug the link points at.
 * @return string Tailwind classes.
 */
function rynk_nav_link_class( string $slug ): string {
	$is_active = is_page( $slug );

	return 'font-serif text-[16px] transition-colors ' . (
		$is_active ? 'text-brand-text' : 'text-brand-textMute hover:text-brand-text'
	);
}

/**
 * Nav-link classes for the Home link, highlighted on the front page.
 *
 * Home is not one of the templated pages in rynk_nav_links(), so it gets its
 * own class helper keyed on is_front_page() rather than a page slug.
 *
 * @return string Tailwind classes.
 */
function rynk_home_link_class(): string {
	return 'font-serif text-[16px] transition-colors ' . (
		is_front_page() ? 'text-brand-text' : 'text-brand-textMute hover:text-brand-text'
	);
}

/**
 * Theme supports.
 *
 * @return void
 */
function rynk_theme_setup(): void {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support(
		'html5',
		array( 'search-form', 'gallery', 'caption', 'style', 'script' )
	);
}
add_action( 'after_setup_theme', 'rynk_theme_setup' );

/**
 * Version an asset by its mtime so a rebuilt stylesheet is never cached.
 *
 * @param string $relative Theme-relative path.
 * @return string
 */
function rynk_asset_version( string $relative ): string {
	$path = get_theme_file_path( $relative );

	return file_exists( $path ) ? (string) filemtime( $path ) : '1.0.0';
}

/**
 * Front-end styles and scripts.
 *
 * `fonts.css` carries the self-hosted @font-face rules (Fraunces, Geist,
 * Geist Mono) and must load before the Tailwind build, which references the
 * families through the same CSS variables the Next.js app used.
 *
 * @return void
 */
function rynk_enqueue_assets(): void {
	wp_enqueue_style(
		'rynk-fonts',
		get_theme_file_uri( 'assets/css/fonts.css' ),
		array(),
		rynk_asset_version( 'assets/css/fonts.css' )
	);

	wp_enqueue_style(
		'rynk-theme',
		get_theme_file_uri( 'assets/css/theme.css' ),
		array( 'rynk-fonts' ),
		rynk_asset_version( 'assets/css/theme.css' )
	);

	wp_enqueue_script(
		'rynk-nav',
		get_theme_file_uri( 'assets/js/nav.js' ),
		array(),
		rynk_asset_version( 'assets/js/nav.js' ),
		true
	);
}
add_action( 'wp_enqueue_scripts', 'rynk_enqueue_assets' );

/**
 * Drop WordPress's default block and emoji styles on the front end.
 *
 * These pages are hand-built templates with no block content, so the block
 * library CSS only adds weight and competes with Tailwind's reset.
 *
 * @return void
 */
function rynk_dequeue_default_styles(): void {
	wp_dequeue_style( 'wp-block-library' );
	wp_dequeue_style( 'wp-block-library-theme' );
	wp_dequeue_style( 'global-styles' );
	wp_dequeue_style( 'classic-theme-styles' );
}
add_action( 'wp_enqueue_scripts', 'rynk_dequeue_default_styles', 100 );

remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );

/**
 * Create the marketing pages and point the front page at the landing template.
 *
 * Runs on activation, and is safe to run again — an existing page with the
 * same slug is reused rather than duplicated.
 *
 * @return void
 */
function rynk_scaffold_pages(): void {
	foreach ( rynk_pages() as $slug => $page ) {
		$existing = get_page_by_path( $slug );

		$page_id = $existing instanceof WP_Post
			? $existing->ID
			: wp_insert_post(
				array(
					'post_type'    => 'page',
					'post_name'    => $slug,
					'post_title'   => $page['title'],
					'post_status'  => 'publish',
					'post_content' => '',
				)
			);

		if ( is_wp_error( $page_id ) || 0 === $page_id ) {
			continue;
		}

		update_post_meta( $page_id, '_wp_page_template', $page['template'] );
	}

	// Landing page — front-page.php renders it; the page exists so the site
	// has a real front page in Settings > Reading rather than a post list.
	$home = get_page_by_path( 'home' );

	$home_id = $home instanceof WP_Post
		? $home->ID
		: wp_insert_post(
			array(
				'post_type'    => 'page',
				'post_name'    => 'home',
				'post_title'   => 'Home',
				'post_status'  => 'publish',
				'post_content' => '',
			)
		);

	if ( ! is_wp_error( $home_id ) && 0 !== $home_id ) {
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $home_id );
	}
}
add_action( 'after_switch_theme', 'rynk_scaffold_pages' );

/**
 * Scaffold version. Bump whenever rynk_pages() gains a page so the new pages
 * are created on the next request without a manual theme re-activation.
 */
const RYNK_SCAFFOLD_VERSION = '2';

/**
 * Re-run scaffolding once after a deploy that changed the page set.
 *
 * On the live site the theme is already active, so `after_switch_theme` never
 * fires again — a freshly added page (privacy policy, the coming-soon pages)
 * would otherwise never be created. This runs `rynk_scaffold_pages()` a single
 * time per version bump, guarded by a stored option so it is a cheap no-op on
 * every other request. Scaffolding itself is idempotent (existing pages are
 * reused, never duplicated).
 *
 * @return void
 */
function rynk_maybe_scaffold_pages(): void {
	if ( get_option( 'rynk_scaffold_version' ) === RYNK_SCAFFOLD_VERSION ) {
		return;
	}

	rynk_scaffold_pages();
	update_option( 'rynk_scaffold_version', RYNK_SCAFFOLD_VERSION );
}
add_action( 'init', 'rynk_maybe_scaffold_pages' );
