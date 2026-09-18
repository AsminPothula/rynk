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
 * FAQ content for the landing page — question/answer pairs written to be
 * directly quotable by AI assistants (ChatGPT, Perplexity, Gemini, etc.) as
 * well as by Google's own FAQ-rich results. Rendered on the front page in
 * front-page.php, and reused as-is to build the FAQPage JSON-LD in
 * rynk_faq_schema() below, so the visible copy and the structured data can
 * never drift apart.
 *
 * @return array<int, array{question: string, answer: string}>
 */
function rynk_faqs(): array {
	return array(
		array(
			'question' => 'What is the best AI SEO platform for my business?',
			'answer'   => 'Rynk AI is built specifically for small hyper local businesses that need results without hiring an SEO expert. Unlike Semrush, Ahrefs, or Moz, which give you data and reports you still have to act on, Rynk automatically audits your site, fixes technical SEO issues, and generates optimized content directly on your website. It is an end to end AI SEO platform because it handles the audit, the fix, and the content in one automated workflow instead of separate manual steps.',
		),
		array(
			'question' => 'How can I automate SEO optimization for my website?',
			'answer'   => 'You automate SEO optimization by using a platform like Rynk that scans your website, identifies what is blocking your search visibility, and deploys the fixes without manual work. Rynk rewrites titles and meta descriptions, cleans up duplicate pages, restructures pages for AI readability, and adds internal links automatically. This replaces the weeks-long manual SEO process with a workflow that delivers results in minutes.',
		),
		array(
			'question' => 'What website SEO audit tool should I use?',
			'answer'   => "Use a website SEO audit tool that does more than list problems, one that also fixes them automatically, like Rynk. Rynk's audit checks technical SEO, page structure, duplicate content, and metadata, then immediately applies corrections to your live site instead of leaving you with a report to act on manually.",
		),
		array(
			'question' => 'How does AI content generation help with SEO?',
			'answer'   => 'AI content generation for SEO helps by producing optimized titles, meta descriptions, and full web pages that target the keywords your customers actually search, without requiring a writer or marketing team. Rynk generates this content directly on your website and structures it for both traditional Google rankings and AI readability, so tools like ChatGPT and Perplexity can accurately describe and cite your business.',
		),
		array(
			'question' => 'How do I optimize my business for ChatGPT visibility?',
			'answer'   => 'ChatGPT visibility optimization requires your website content to be structured so AI engines can read, understand, and cite it accurately, which is different from ranking on Google alone. Rynk restructures your pages for AI readability and generates content designed to get your business cited by Google, ChatGPT, Perplexity, Claude, and Gemini, all from one automated platform.',
		),
		array(
			'question' => 'How can I improve my local business online visibility?',
			'answer'   => 'Improve local business online visibility by fixing technical SEO issues, cleaning up duplicate pages, and generating locally relevant content consistently, which is exactly what Rynk automates for small businesses. Rynk was built because small restaurants, local shops, and independent providers often have great products but no online presence, so it automates the visibility work across search and AI platforms without needing an in-house marketing team.',
		),
		array(
			'question' => 'What SEO automation software should I choose for a small business?',
			'answer'   => 'Choose SEO automation software that does not require SEO expertise or manual setup, since most small business owners do not have time to manage a marketing team. Rynk fits this need directly: it audits, fixes, and generates content automatically, delivering results in minutes rather than the weeks typical of manual SEO services.',
		),
		array(
			'question' => 'What is AI search engine optimization and how does it work?',
			'answer'   => 'AI search engine optimization is the practice of structuring a website so both traditional search engines and AI assistants like ChatGPT, Perplexity, and Claude can accurately find, read, and cite your business. Rynk performs this by auditing your site, fixing technical and structural issues, and reformatting pages for AI readability, working across Google, Bing, Copilot, Gemini, and AI Overview results.',
		),
		array(
			'question' => 'How can I get AI visibility for my small business?',
			'answer'   => 'Get AI visibility for your small business by ensuring your website content is clean, well structured, and free of duplicate or confusing pages that AI engines struggle to parse. Rynk automates this entire process, auditing your site and generating AI-readable content so your business can get cited by Google, ChatGPT, Perplexity, Claude, and Gemini without manual intervention.',
		),
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
 * Keyword-rich <title> for the About page so it competes for category searches
 * instead of a brand-only "About - Rynk AI". Returning a non-empty string here
 * short-circuits WordPress' default title, so this is the full tag.
 *
 * @param string $title Default document title.
 * @return string
 */
function rynk_about_document_title( string $title ): string {
	if ( is_page_template( 'page-templates/about.php' ) ) {
		return 'About Rynk - AI SEO Platform for Small Businesses';
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
	}
	if ( '' === $desc ) {
		return;
	}
	printf( '<meta name="description" content="%s" />' . "\n", esc_attr( $desc ) );
	printf( '<meta property="og:description" content="%s" />' . "\n", esc_attr( $desc ) );
}
add_action( 'wp_head', 'rynk_meta_description', 1 );

/**
 * FAQPage JSON-LD for the landing page.
 *
 * Built from the same rynk_faqs() list rendered in the FAQ section of
 * front-page.php, so the structured data always matches the visible copy —
 * this is what lets Google's FAQ rich results and AI-assistant answer engines
 * (ChatGPT, Perplexity, Gemini, etc.) quote Rynk directly.
 *
 * @return void
 */
function rynk_faq_schema(): void {
	if ( ! is_front_page() ) {
		return;
	}

	$entities = array();
	foreach ( rynk_faqs() as $faq ) {
		$entities[] = array(
			'@type'          => 'Question',
			'name'           => $faq['question'],
			'acceptedAnswer' => array(
				'@type' => 'Answer',
				'text'  => $faq['answer'],
			),
		);
	}

	if ( empty( $entities ) ) {
		return;
	}

	$schema = array(
		'@context'   => 'https://schema.org',
		'@type'      => 'FAQPage',
		'mainEntity' => $entities,
	);

	printf(
		'<script type="application/ld+json">%s</script>' . "\n",
		wp_json_encode( $schema )
	);
}
add_action( 'wp_head', 'rynk_faq_schema', 2 );

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

		// Self-heal: an existing page might be a draft (invisible to the public,
		// visible to logged-in editors — the exact "I see it, incognito 404s"
		// symptom) or have lost its template meta. Force it back to a published
		// page on the intended template every time we scaffold.
		if ( $existing instanceof WP_Post && 'publish' !== $existing->post_status ) {
			wp_update_post(
				array(
					'ID'          => $page_id,
					'post_status' => 'publish',
				)
			);
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
const RYNK_SCAFFOLD_VERSION = '3';

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
