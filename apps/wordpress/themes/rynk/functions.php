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
		'blog'           => array(
			'title'    => 'Blog',
			'template' => 'page-templates/blog-hub.php',
		),
		'why-isnt-my-business-showing-up-on-google' => array(
			'title'    => 'Why Your Business Is Not Showing Up on Google (And How to Fix It)',
			'template' => 'page-templates/blog-post-why-isnt-my-business-showing-up-on-google.php',
		),
		'how-to-check-keyword-ranking-google' => array(
			'title'    => 'How to Check Your Keyword Ranking on Google (And What to Do About It)',
			'template' => 'page-templates/blog-post-how-to-check-keyword-ranking-google.php',
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
		'blog'         => 'Blog',
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
	// Mark "Blog" as active for both the hub and any blog post pages.
	$is_active = is_page( $slug );
	if ( 'blog' === $slug && is_page_template( 'page-templates/blog-post-why-isnt-my-business-showing-up-on-google.php' ) ) {
		$is_active = true;
	}
	if ( 'blog' === $slug && is_page_template( 'page-templates/blog-post-how-to-check-keyword-ranking-google.php' ) ) {
		$is_active = true;
	}

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
 * URL into the rynk client app (the separate dashboard SPA) — e.g. the
 * "Try rynk" instant-scan page at /try.
 *
 * The dashboard lives on its own host. Defaults to the deployed app
 * (https://app.rynk.ai). Override with a RYNK_APP_URL constant for other
 * environments (e.g. define('RYNK_APP_URL','http://localhost:3021') for local
 * dev). We default in the theme because WP Engine doesn't allow editing
 * wp-config on the managed install.
 *
 * @param string $path Path within the app, e.g. "/try".
 * @return string
 */
function rynk_app_url( string $path = '' ): string {
	$base = defined( 'RYNK_APP_URL' ) ? (string) RYNK_APP_URL : 'https://app.rynk.ai';
	return rtrim( $base, '/' ) . '/' . ltrim( $path, '/' );
}

/**
 * Theme supports.
 *
 * @return void
 */
function rynk_theme_setup(): void {
	add_theme_support( 'title-tag' );

	// Browser-tab title uses a plain hyphen, e.g. "Pricing - Rynk AI".
	add_filter( 'document_title_separator', 'rynk_title_separator' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support(
		'html5',
		array( 'search-form', 'gallery', 'caption', 'style', 'script' )
	);
}
add_action( 'after_setup_theme', 'rynk_theme_setup' );

/**
 * Force a plain hyphen as the document-title separator.
 *
 * WordPress joins the page title and site name in the <title> tag (shown on the
 * browser tab and in Google results). This keeps that separator a normal
 * hyphen instead of a dash.
 *
 * @return string
 */
function rynk_title_separator(): string {
	return '-';
}

/**
 * Keyword-rich <title> for pages so they compete for category searches.
 * Returning a non-empty string here short-circuits WordPress' default title,
 * so this is the full tag.
 *
 * @param string $title Default document title.
 * @return string
 */
function rynk_about_document_title( string $title ): string {
	if ( is_page_template( 'page-templates/about.php' ) ) {
		return 'About Rynk - AI SEO Platform for Small Businesses';
	}
	if ( is_page_template( 'page-templates/pricing.php' ) ) {
		return 'Rynk AI Pricing: Automated SEO for Small Business from $149/month';
	}
	if ( is_page_template( 'page-templates/how-it-works.php' ) ) {
		return 'How Rynk AI Works: Automated SEO for Small Business in 4 Steps';
	}
	if ( is_page_template( 'page-templates/blog-post-why-isnt-my-business-showing-up-on-google.php' ) ) {
		return 'Why Your Business Is Not Showing Up on Google | Rynk AI';
	}
	if ( is_page_template( 'page-templates/blog-post-how-to-check-keyword-ranking-google.php' ) ) {
		return 'How to Check Keyword Ranking on Google for Your Local Business | Rynk AI';
	}
	if ( is_page_template( 'page-templates/blog-hub.php' ) ) {
		return 'Blog - SEO Insights for Local Businesses | Rynk AI';
	}
	return $title;
}
add_filter( 'pre_get_document_title', 'rynk_about_document_title' );

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
 * Emit the rynk favicon / browser-tab icon.
 *
 * Uses the theme's own icon assets (assets/img/favicon-*.png) so no WordPress
 * "Site Icon" needs to be set in the admin — the tab icon ships with the theme.
 * Each file is a navy rounded-square with the rynk "R" mark. Guarded so the
 * head stays clean if the assets are ever missing.
 *
 * @return void
 */
function rynk_favicon_links(): void {
	$icons = array(
		'32'  => 'assets/img/favicon-32.png',
		'180' => 'assets/img/favicon-180.png',
		'512' => 'assets/img/favicon-512.png',
	);
	if ( ! file_exists( get_theme_file_path( $icons['512'] ) ) ) {
		return;
	}
	printf(
		'<link rel="icon" type="image/png" sizes="32x32" href="%s" />' . "\n",
		esc_url( get_theme_file_uri( $icons['32'] ) )
	);
	printf(
		'<link rel="icon" type="image/png" sizes="512x512" href="%s" />' . "\n",
		esc_url( get_theme_file_uri( $icons['512'] ) )
	);
	printf(
		'<link rel="apple-touch-icon" sizes="180x180" href="%s" />' . "\n",
		esc_url( get_theme_file_uri( $icons['180'] ) )
	);
}
add_action( 'wp_head', 'rynk_favicon_links', 5 );

/**
 * Output a meta description (+ og:description) so search engines don't write
 * their own. Per-page copy for the pages that matter most.
 *
 * @return void
 */
function rynk_meta_description(): void {
	$desc = '';
	if ( is_front_page() ) {
		$desc = 'Rynk is an AI-powered SEO platform that audits your site, fixes what holds back your search visibility, and generates content automatically - so more customers find you.';
	} elseif ( is_page_template( 'page-templates/about.php' ) ) {
		$desc = 'Meet the team behind Rynk - the AI-powered SEO and AI-visibility platform helping local businesses get found in search.';
	} elseif ( is_page_template( 'page-templates/pricing.php' ) ) {
		$desc = 'Rynk AI starts at $149 per month. Automated SEO audits, technical fixes, new content pages, and AI-search optimization, all done for you. No agency needed.';
	} elseif ( is_page_template( 'page-templates/how-it-works.php' ) ) {
		$desc = 'Rynk audits your site, fixes the technical gaps, writes and publishes new pages, and tracks your rankings, all automatically. No SEO knowledge needed.';
	} elseif ( is_page_template( 'page-templates/blog-post-why-isnt-my-business-showing-up-on-google.php' ) ) {
		$desc = 'Not showing up on Google? Learn the real reasons local businesses stay invisible in search, and how automated SEO fixes it without any technical knowledge.';
	} elseif ( is_page_template( 'page-templates/blog-post-how-to-check-keyword-ranking-google.php' ) ) {
		$desc = 'Learn how to find your Google keyword rankings, what a good rank means for a local business, and how automated SEO keeps you moving up without manual work.';
	} elseif ( is_page_template( 'page-templates/blog-hub.php' ) ) {
		$desc = 'Practical SEO guides for local business owners. Learn how to get found on Google, AI assistants, and maps — without needing any technical expertise.';
	}
	if ( '' === $desc ) {
		return;
	}
	printf( '<meta name="description" content="%s" />' . "\n", esc_attr( $desc ) );
	printf( '<meta property="og:description" content="%s" />' . "\n", esc_attr( $desc ) );
}
add_action( 'wp_head', 'rynk_meta_description', 1 );

/**
 * Blog post data for the hub page and any sidebar listings.
 *
 * Keyed array so future posts can be added here without changing the template.
 *
 * @return array<int, array{title: string, url: string, excerpt: string, category: string, image: string, image_alt: string}>
 */
function rynk_blog_posts(): array {
	return array(
		array(
			'title'     => 'Why Your Business Is Not Showing Up on Google (And How to Fix It)',
			'url'       => home_url( '/blog/why-isnt-my-business-showing-up-on-google/' ),
			'excerpt'   => 'If customers search for what you do and your business is nowhere to be found, you are not alone. Here are the real reasons — and the fixes.',
			'category'  => 'SEO Basics',
			'image'     => 'assets/img/rynk/blog-why-isnt-my-business-showing-up-on-google-1.jpg',
			'image_alt' => 'A local hair salon owner looking at a phone with a puzzled expression',
		),
		array(
			'title'     => 'How to Check Your Keyword Ranking on Google (And What to Do About It)',
			'url'       => home_url( '/blog/how-to-check-keyword-ranking-google/' ),
			'excerpt'   => 'Knowing where you rank for the searches your customers make is the starting point for any real improvement in your online visibility.',
			'category'  => 'SEO Basics',
			'image'     => 'assets/img/rynk/blog-how-to-check-keyword-ranking-google-1.jpg',
			'image_alt' => 'A small business owner sitting at a wooden desk with a laptop open, natural light coming through a window',
		),
	);
}

/**
 * Create the marketing pages and point the front page at the landing template.
 *
 * Runs on activation, and is safe to run again — an existing page with the
 * same slug is reused rather than duplicated.
 *
 * @return void
 */
function rynk_scaffold_pages(): void {
	// The blog post page needs to be a child of the blog hub page.
	// First pass: create all top-level pages.
	$blog_parent_id = 0;

	$blog_child_slugs = array(
		'why-isnt-my-business-showing-up-on-google',
		'how-to-check-keyword-ranking-google',
	);

	foreach ( rynk_pages() as $slug => $page ) {
		// Skip blog child pages on the first pass; we need the blog hub ID first.
		if ( in_array( $slug, $blog_child_slugs, true ) ) {
			continue;
		}

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

		// Self-heal: an existing page might be a draft or have lost its template.
		if ( $existing instanceof WP_Post && 'publish' !== $existing->post_status ) {
			wp_update_post(
				array(
					'ID'          => $page_id,
					'post_status' => 'publish',
				)
			);
		}

		update_post_meta( $page_id, '_wp_page_template', $page['template'] );

		if ( 'blog' === $slug ) {
			$blog_parent_id = $page_id;
		}
	}

	// Second pass: create all blog child pages under the blog hub.
	foreach ( $blog_child_slugs as $blog_post_slug ) {
		$blog_post_page = rynk_pages()[ $blog_post_slug ];

		// WordPress resolves child pages by "parent-slug/child-slug" in get_page_by_path.
		$existing_post = get_page_by_path( 'blog/' . $blog_post_slug );
		if ( ! $existing_post instanceof WP_Post ) {
			// Also check without parent in case it was created flat previously.
			$existing_post = get_page_by_path( $blog_post_slug );
		}

		$blog_post_id = $existing_post instanceof WP_Post
			? $existing_post->ID
			: wp_insert_post(
				array(
					'post_type'    => 'page',
					'post_name'    => $blog_post_slug,
					'post_title'   => $blog_post_page['title'],
					'post_status'  => 'publish',
					'post_content' => '',
					'post_parent'  => $blog_parent_id,
				)
			);

		if ( ! is_wp_error( $blog_post_id ) && 0 !== $blog_post_id ) {
			if ( $existing_post instanceof WP_Post ) {
				// Ensure it is published and parented correctly.
				wp_update_post(
					array(
						'ID'          => $blog_post_id,
						'post_status' => 'publish',
						'post_parent' => $blog_parent_id,
					)
				);
			}
			update_post_meta( $blog_post_id, '_wp_page_template', $blog_post_page['template'] );
		}
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
const RYNK_SCAFFOLD_VERSION = '5';

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

	// A page created via wp_insert_post() before the rewrite rules were built
	// can 404 on its pretty permalink for the public until the rules are
	// regenerated. Flush once per version bump so /privacy-policy/ (and any
	// other scaffolded page) resolves for logged-out visitors.
	flush_rewrite_rules( false );

	update_option( 'rynk_scaffold_version', RYNK_SCAFFOLD_VERSION );
}
add_action( 'init', 'rynk_maybe_scaffold_pages' );