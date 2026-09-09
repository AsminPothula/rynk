<?php
/**
 * Standalone local preview for the rynk marketing pages.
 *
 * Renders the WordPress theme templates WITHOUT WordPress, a database, or
 * Docker — just enough of the WP API is stubbed to run the two marketing
 * pages. It includes the real theme files, so you see your actual edits.
 *
 * Run:
 *   php -S 127.0.0.1:8000 -t apps/wordpress/themes/rynk preview-server.php
 *
 * Then open:
 *   http://127.0.0.1:8000/               → home (front-page.php)
 *   http://127.0.0.1:8000/how-it-works/  → how-it-works template
 */

define( 'RYNK_THEME_DIR', __DIR__ . '/apps/wordpress/themes/rynk' );

$request_path = parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH );

// Let the built-in server serve real static assets (css, js, fonts, img).
if ( '/' !== $request_path && file_exists( RYNK_THEME_DIR . $request_path ) ) {
	return false;
}

/* ------------------------------------------------------------------ *
 * Minimal WordPress shims — only what the two templates + chrome use. *
 * ------------------------------------------------------------------ */

$GLOBALS['rynk_current'] = 'home'; // 'home' | page slug

function get_theme_file_path( string $rel = '' ): string {
	return rtrim( RYNK_THEME_DIR . '/' . ltrim( $rel, '/' ), '/' );
}
function get_theme_file_uri( string $rel = '' ): string {
	return '/' . ltrim( $rel, '/' );
}
function home_url( string $path = '' ): string {
	return '' === $path ? '/' : $path;
}
function esc_html( $s ): string {
	return htmlspecialchars( (string) $s, ENT_QUOTES, 'UTF-8' );
}
function esc_attr( $s ): string {
	return htmlspecialchars( (string) $s, ENT_QUOTES, 'UTF-8' );
}
function esc_url( $s ): string {
	return htmlspecialchars( (string) $s, ENT_QUOTES, 'UTF-8' );
}
function language_attributes(): void {
	echo 'lang="en-US"';
}
function bloginfo( string $key = '' ): void {
	if ( 'charset' === $key ) {
		echo 'UTF-8';
	}
}
function body_class( string $extra = '' ): void {
	echo 'class="' . esc_attr( $extra ) . '"';
}
function wp_body_open(): void {}
function wp_head(): void {
	echo '<link rel="stylesheet" href="/assets/css/fonts.css" />' . "\n";
	echo '<link rel="stylesheet" href="/assets/css/theme.css" />' . "\n";
	echo '<link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon-32.png" />' . "\n";
}
function wp_footer(): void {
	echo '<script src="/assets/js/nav.js"></script>' . "\n";
}
function is_page( string $slug ): bool {
	return $GLOBALS['rynk_current'] === $slug;
}
function is_front_page(): bool {
	return 'home' === $GLOBALS['rynk_current'];
}
function get_header(): void {
	require RYNK_THEME_DIR . '/header.php';
}
function get_footer(): void {
	require RYNK_THEME_DIR . '/footer.php';
}

// Real theme data + component helpers (these don't touch the DB).
require_once RYNK_THEME_DIR . '/inc/icons.php';
require_once RYNK_THEME_DIR . '/inc/tints.php';
require_once RYNK_THEME_DIR . '/inc/content.php';
require_once RYNK_THEME_DIR . '/inc/components.php';

// Nav helpers (from functions.php — copied here to avoid its WP hooks).
function rynk_nav_links(): array {
	return array(
		'how-it-works' => 'How it works',
		'pricing'      => 'Pricing',
		'about'        => 'About',
	);
}
function rynk_nav_link_class( string $slug ): string {
	return 'font-serif text-[16px] transition-colors ' . (
		is_page( $slug ) ? 'text-brand-text' : 'text-brand-textMute hover:text-brand-text'
	);
}
function rynk_home_link_class(): string {
	return 'font-serif text-[16px] transition-colors ' . (
		is_front_page() ? 'text-brand-text' : 'text-brand-textMute hover:text-brand-text'
	);
}
function rynk_app_url( string $path = '' ): string {
	return home_url( '/sign-in' );
}

/* ---------------------------------------------------------------- *
 * Route: only the two marketing pages you asked to preview.        *
 * ---------------------------------------------------------------- */

$path = rtrim( $request_path, '/' );

if ( '/how-it-works' === $path ) {
	$GLOBALS['rynk_current'] = 'how-it-works';
	require RYNK_THEME_DIR . '/page-templates/how-it-works.php';
	return;
}

// Default: home / landing page.
$GLOBALS['rynk_current'] = 'home';
require RYNK_THEME_DIR . '/front-page.php';
