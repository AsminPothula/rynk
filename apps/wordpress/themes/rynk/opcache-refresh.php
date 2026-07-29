<?php
/**
 * OPcache refresh for the rynk theme — deploy helper.
 *
 * WP Engine runs PHP OPcache with timestamp validation off, so newly deployed
 * theme files aren't picked up until the PHP workers restart. This endpoint
 * force-invalidates the cached bytecode for *this theme's own files only* — it
 * does NOT call opcache_reset(), so nothing outside this theme is touched.
 *
 * It matches entries against OPcache's live script list (opcache_get_status),
 * which uses the real resolved paths WordPress loaded — robust to WP Engine's
 * symlinked docroot, where a naive __DIR__ path would miss the cache key.
 *
 * Hit automatically by the deploy workflow right after files sync, so a
 * deploy's changes go live without a manual PHP restart. Plain PHP — WordPress
 * is not loaded and no database is needed.
 *
 * @package rynk-ai
 */

// Light guard so this isn't a wide-open endpoint. Not a real secret (public
// repo) — it only clears this theme's compiled-code cache, which is harmless.
if ( ( $_GET['token'] ?? '' ) !== 'rynk-refresh' ) {
	http_response_code( 403 );
	exit( 'forbidden' );
}

header( 'Content-Type: text/plain; charset=utf-8' );

if ( ! function_exists( 'opcache_invalidate' ) ) {
	echo "opcache_invalidate() is unavailable — a PHP restart from WP Engine is needed.\n";
	exit;
}

// Only ever touch cached scripts under this theme's directory.
$needle  = '/themes/rynk/';
$targets = array();

// Preferred: enumerate OPcache's live script list and match by the real path
// WordPress actually loaded (handles symlinked docroots correctly).
if ( function_exists( 'opcache_get_status' ) ) {
	$status = @opcache_get_status( true );
	if ( is_array( $status ) && ! empty( $status['scripts'] ) ) {
		foreach ( array_keys( $status['scripts'] ) as $cached_path ) {
			if ( false !== strpos( $cached_path, $needle ) ) {
				$targets[ $cached_path ] = true;
			}
		}
	}
}

// Fallback: this theme's known files by their on-disk path.
$known = array(
	'functions.php',
	'header.php',
	'footer.php',
	'front-page.php',
	'index.php',
	'inc/components.php',
	'inc/content.php',
	'inc/icons.php',
	'inc/tints.php',
	'page-templates/about.php',
	'page-templates/how-it-works.php',
	'page-templates/pricing.php',
	'page-templates/coming-soon.php',
	'page-templates/privacy-policy.php',
);
foreach ( $known as $rel ) {
	$path = __DIR__ . '/' . $rel;
	$targets[ $path ] = true;
	$real = realpath( $path );
	if ( $real ) {
		$targets[ $real ] = true;
	}
}

$invalidated = 0;
foreach ( array_keys( $targets ) as $path ) {
	if ( opcache_invalidate( $path, true ) ) {
		++$invalidated;
	}
}

// Diagnostics — so the deploy log shows exactly what happened.
$enabled     = 'unknown';
$script_count = 'n/a';
if ( function_exists( 'opcache_get_status' ) ) {
	$s = @opcache_get_status( true );
	if ( is_array( $s ) ) {
		$enabled      = empty( $s['opcache_enabled'] ) ? 'no' : 'yes';
		$script_count = isset( $s['scripts'] ) ? (string) count( $s['scripts'] ) : '0';
	} else {
		$enabled = 'restricted-or-off';
	}
}
$restrict = ini_get( 'opcache.restrict_api' );

echo "matched paths: " . count( $targets ) . "\n";
echo "invalidated:   {$invalidated}\n";
echo "opcache:       {$enabled}\n";
echo "cached scripts:{$script_count}\n";
echo "restrict_api:  " . ( '' === (string) $restrict ? '(none)' : $restrict ) . "\n";
echo "theme __DIR__: " . __DIR__ . "\n";
