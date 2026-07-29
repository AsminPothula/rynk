<?php
/**
 * Read-only probe: are the new theme files on disk, and what are their mtimes?
 * Temporary diagnostic — reads only, changes nothing. Token-guarded.
 *
 * @package rynk-ai
 */

if ( ( $_GET['token'] ?? '' ) !== 'rynk-diag' ) {
	http_response_code( 403 );
	exit( 'forbidden' );
}

header( 'Content-Type: text/plain; charset=utf-8' );

$dir = __DIR__;

/**
 * Report whether a file contains a "new deploy" marker, plus its mtime.
 */
function rynk_chk( string $path, string $needle ): string {
	if ( ! is_file( $path ) ) {
		return 'MISSING';
	}
	$mtime = date( 'Y-m-d H:i:s', (int) filemtime( $path ) );
	$has   = ( false !== strpos( (string) file_get_contents( $path ), $needle ) ) ? 'NEW' : 'OLD';
	return str_pad( $has, 5 ) . " mtime=$mtime";
}

echo 'now:            ' . date( 'Y-m-d H:i:s' ) . "  (server time)\n\n";
echo 'functions.php   ' . rynk_chk( "$dir/functions.php", 'rynk_maybe_scaffold_pages' ) . "\n";
echo 'inc/content.php ' . rynk_chk( "$dir/inc/content.php", "'Gold'" ) . "\n";
echo 'front-page.php  ' . rynk_chk( "$dir/front-page.php", 'Increase website visits' ) . "\n";
echo 'pricing.php     ' . rynk_chk( "$dir/page-templates/pricing.php", 'columns' ) . "\n";
echo 'about.php       ' . rynk_chk( "$dir/page-templates/about.php", 'aspect-square' ) . "\n";
echo 'theme.css       ' . rynk_chk( "$dir/assets/css/theme.css", 'via-brand-hairline' ) . "\n";
echo "\n__DIR__ = $dir\n";
echo 'realpath = ' . realpath( "$dir/functions.php" ) . "\n";
