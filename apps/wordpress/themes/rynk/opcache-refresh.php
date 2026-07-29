<?php
/**
 * OPcache refresh for the rynk theme — deploy helper.
 *
 * WP Engine runs PHP OPcache with timestamp validation off, so newly deployed
 * theme files aren't picked up until the PHP workers restart. This endpoint
 * force-invalidates the cached bytecode for *this theme's own files only*
 * (via opcache_invalidate) — it does NOT call opcache_reset(), so nothing
 * outside this theme is touched.
 *
 * It is hit automatically by the deploy workflow (see
 * .github/workflows/deploy-wordpress.yml) right after files are synced, so a
 * deploy's changes go live without a manual PHP restart. It is a plain PHP
 * file (WordPress is not loaded) and needs no database or WP context.
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
	echo "opcache_invalidate() is unavailable here — a PHP restart from WP Engine is needed.\n";
	exit;
}

// Every PHP file this theme loads. Kept explicit so we only ever touch our own
// files (never anything else in the OPcache).
$files = array(
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

$invalidated = 0;
foreach ( $files as $rel ) {
	// Cover both the direct path and its realpath (WP Engine paths can be
	// symlinked, and OPcache keys on the resolved path).
	$candidates = array_unique(
		array_filter(
			array(
				__DIR__ . '/' . $rel,
				realpath( __DIR__ . '/' . $rel ),
			)
		)
	);

	foreach ( $candidates as $path ) {
		if ( is_file( $path ) && opcache_invalidate( $path, true ) ) {
			++$invalidated;
		}
	}
}

echo "Invalidated cached bytecode for {$invalidated} rynk theme file(s).\n";
echo "The site should now render the latest deploy.\n";
