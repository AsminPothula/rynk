<?php
/**
 * Read-only probe: boot WordPress and ask which theme code is actually loaded.
 * Cuts through HTTP/page caches — reports what the PHP runtime really sees.
 * Temporary diagnostic, token-guarded, changes nothing meaningful.
 *
 * @package rynk-ai
 */

if ( ( $_GET['token'] ?? '' ) !== 'rynk-diag' ) {
	http_response_code( 403 );
	exit( 'forbidden' );
}

// Boot WordPress (docroot is three levels up from wp-content/themes/rynk).
require dirname( __DIR__, 3 ) . '/wp-load.php';

if ( ! headers_sent() ) {
	header( 'Content-Type: text/plain; charset=utf-8' );
}

echo 'rynk_maybe_scaffold_pages(): ' . ( function_exists( 'rynk_maybe_scaffold_pages' ) ? 'EXISTS (new code)' : 'missing (old code)' ) . "\n";
echo 'rynk_logo():                 ' . ( function_exists( 'rynk_logo' ) ? 'EXISTS (new code)' : 'missing (old code)' ) . "\n";

if ( function_exists( 'rynk_tiers' ) ) {
	$t = rynk_tiers();
	echo 'rynk_tiers()[0]:             ' . ( $t[0]['name'] ?? '?' ) . ' ' . ( $t[0]['price'] ?? '?' ) . "  (new=Gold \$149 / old=Starter \$249)\n";
}

echo 'scaffold_version option:     ' . var_export( get_option( 'rynk_scaffold_version' ), true ) . "\n";
$app = get_page_by_path( 'app' );
echo "page 'app':                  " . ( $app ? 'exists id=' . $app->ID : 'none' ) . "\n";
echo 'active template dir:         ' . get_template_directory() . "\n";
echo 'active theme:                ' . wp_get_theme()->get( 'Name' ) . "\n";
