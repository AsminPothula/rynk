<?php
/**
 * Inline Lucide icons.
 *
 * The Next.js pages used `lucide-react`. There is no React here, so each
 * icon the four pages reference is inlined as SVG. The path data is copied
 * verbatim from lucide 0.469.0 (the version the app pins), and the wrapper
 * attributes match what lucide-react renders — including the
 * `lucide lucide-<name>` class — so Tailwind sizing classes behave
 * identically.
 *
 * @package rynk-ai
 */

declare( strict_types = 1 );

/**
 * Inner SVG markup for every icon the marketing pages use.
 *
 * @return array<string, string>
 */
function rynk_icon_paths(): array {
	return array(
		'arrow-right'      => '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
		'arrow-up-right'   => '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
		'sparkles'         => '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
		'type'             => '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/>',
		'braces'           => '<path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/>',
		'message-square'   => '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
		'file-plus-2'      => '<path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M3 15h6"/><path d="M6 12v6"/>',
		'link-2'           => '<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" x2="16" y1="12" y2="12"/>',
		'repeat-2'         => '<path d="m2 9 3-3 3 3"/><path d="M13 18H7a2 2 0 0 1-2-2V6"/><path d="m22 15-3 3-3-3"/><path d="M11 6h6a2 2 0 0 1 2 2v10"/>',
		'image'            => '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
		'mail'             => '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
		'book-open'        => '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
		'git-pull-request' => '<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" x2="6" y1="9" y2="21"/>',
		'trending-up'      => '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
		'rocket'           => '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
		'check'            => '<path d="M20 6 9 17l-5-5"/>',
		'menu'             => '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
		'x'                => '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
	);
}

/**
 * Render a Lucide icon inline.
 *
 * @param string $name         Icon slug, e.g. `arrow-right`.
 * @param string $class        Extra classes (Tailwind sizing / color).
 * @param float  $stroke_width Stroke width; lucide-react defaults to 2.
 * @return string SVG markup, or an empty string for an unknown icon.
 */
function rynk_icon( string $name, string $class = '', float $stroke_width = 2 ): string {
	$paths = rynk_icon_paths();

	if ( ! isset( $paths[ $name ] ) ) {
		return '';
	}

	return sprintf(
		'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="%s" stroke-linecap="round" stroke-linejoin="round" class="%s" aria-hidden="true">%s</svg>',
		esc_attr( (string) $stroke_width ),
		esc_attr( trim( 'lucide lucide-' . $name . ' ' . $class ) ),
		$paths[ $name ]
	);
}

/**
 * The rynk leaf mark used in the header logo.
 *
 * @param string $class Extra classes.
 * @return string SVG markup.
 */
function rynk_leaf_mark( string $class = '' ): string {
	return sprintf(
		'<svg viewBox="0 0 24 24" fill="currentColor" class="%s" aria-hidden="true"><path d="M12 2c-1 4-4 6-6 7 0 5 2 8 6 8 2 0 3-1 4-2v6h2v-6l1-1c1-2 2-6 1-9 0-1-1-2-2-2-2 0-3 1-4 2-1-1-1-2-2-3z"/></svg>',
		esc_attr( $class )
	);
}
