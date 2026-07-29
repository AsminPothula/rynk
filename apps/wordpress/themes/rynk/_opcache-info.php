<?php
/**
 * Read-only OPcache config probe (temporary diagnostic).
 *
 * Prints the OPcache ini settings the *web* PHP process is running, so we can
 * confirm whether timestamp validation is on or off for this environment.
 * Reads settings only — changes nothing, exposes no secrets. Token-guarded.
 * Safe to remove any time.
 *
 * @package rynk-ai
 */

if ( ( $_GET['token'] ?? '' ) !== 'rynk-diag' ) {
	http_response_code( 403 );
	exit( 'forbidden' );
}

header( 'Content-Type: text/plain; charset=utf-8' );

$keys = array(
	'opcache.enable',
	'opcache.enable_cli',
	'opcache.validate_timestamps',
	'opcache.revalidate_freq',
	'opcache.revalidate_path',
	'opcache.restrict_api',
	'opcache.max_accelerated_files',
	'opcache.file_cache',
);

foreach ( $keys as $k ) {
	echo str_pad( $k, 34 ) . var_export( ini_get( $k ), true ) . "\n";
}

echo str_pad( 'php_sapi_name()', 34 ) . php_sapi_name() . "\n";
echo str_pad( 'PHP version', 34 ) . PHP_VERSION . "\n";
