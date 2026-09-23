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
		'blog/how-to-search-for-a-keyword-on-a-web-page' => array(
			'title'    => 'How to Search for a Keyword on a Web Page',
			'template' => 'page-templates/blog-post-how-to-search-keyword.php',
		),
		'blog/ai-powered-content-generation-for-seo' => array(
			'title'    => 'AI-Powered Content Generation for SEO: What It Is and How Small Businesses Use It',
			'template' => 'page-templates/blog-post-ai-powered-content-generation.php',
		),
		'blog/how-to-check-keyword-ranking-google' => array(
			'title'    => 'How to Check Keyword Ranking in Google',
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
	$is_active = is_page( $slug );

	// Also highlight "Blog" when viewing any blog child page.
	if ( 'blog' === $slug && (
		is_page_template( 'page-templates/blog-post-how-to-search-keyword.php' ) ||
		is_page_template( 'page-templates/blog-post-ai-powered-content-generation.php' ) ||
		is_page_template( 'page-templates/blog-post-how-to-check-keyword-ranking-google.php' )
	) ) {
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
 * Keyword-rich <title> overrides for specific page templates.
 *
 * @param string $title Default document title.
 * @return string
 */
function rynk_about_document_title( string $title ): string {
	if ( is_page_template( 'page-templates/about.php' ) ) {
		return 'About Rynk - AI SEO Platform for Small Businesses';
	}
	if ( is_page_template( 'page-templates/how-it-works.php' ) ) {
		return 'How Rynk Works: Automated SEO Platform for Local Businesses';
	}
	if ( is_page_template( 'page-templates/blog-post-how-to-search-keyword.php' ) ) {
		return 'How to Search for a Keyword on a Web Page | Rynk AI';
	}
	if ( is_page_template( 'page-templates/blog-hub.php' ) ) {
		return 'Blog - SEO and AI Search Guides | Rynk AI';
	}
	if ( is_page_template( 'page-templates/blog-post-ai-powered-content-generation.php' ) ) {
		return 'AI-Powered Content Generation for SEO | Rynk AI';
	}
	if ( is_page_template( 'page-templates/blog-post-how-to-check-keyword-ranking-google.php' ) ) {
		return 'How to Check Keyword Ranking in Google | Rynk AI';
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
	} elseif ( is_page_template( 'page-templates/how-it-works.php' ) ) {
		$desc = 'Rynk audits your site, fixes technical SEO issues, generates and publishes keyword-targeted content, and monitors your rankings automatically. No expertise needed.';
	} elseif ( is_page_template( 'page-templates/about.php' ) ) {
		$desc = 'Meet the team behind Rynk - the AI-powered SEO and AI-visibility platform helping local businesses get found in search.';
	} elseif ( is_page_template( 'page-templates/blog-post-how-to-search-keyword.php' ) ) {
		$desc = 'Learn how to search for a keyword on any web page in seconds, what the results mean for your SEO, and how Rynk automatically tracks every keyword across your site.';
	} elseif ( is_page_template( 'page-templates/blog-hub.php' ) ) {
		$desc = 'Practical guides on SEO, AI search visibility, and getting more customers to find your business online - from the team at Rynk.';
	} elseif ( is_page_template( 'page-templates/blog-post-ai-powered-content-generation.php' ) ) {
		$desc = 'AI-powered content generation helps small businesses publish SEO-optimized pages and blog posts automatically. See how Rynk writes and publishes content that ranks on Google and gets cited by AI assistants.';
	} elseif ( is_page_template( 'page-templates/blog-post-how-to-check-keyword-ranking-google.php' ) ) {
		$desc = 'Learn how to check your keyword rankings in Google for free, what the numbers mean, and how Rynk tracks and improves your rankings automatically every week.';
	}
	if ( '' === $desc ) {
		return;
	}
	printf( '<meta name="description" content="%s" />' . "\n", esc_attr( $desc ) );
	printf( '<meta property="og:description" content="%s" />' . "\n", esc_attr( $desc ) );
}
add_action( 'wp_head', 'rynk_meta_description', 1 );

/**
 * Emit a canonical <link> tag for thin or duplicate archive URLs.
 *
 * The uncategorized category archive and the machine author archive both
 * surface placeholder content under URLs that duplicate the blog index.
 * Pointing them at the real blog index prevents search engines indexing
 * thin duplicate pages.
 *
 * @return void
 */
function rynk_archive_canonical(): void {
	if ( is_category( 'uncategorized' ) || is_author( 'rynkai' ) ) {
		printf(
			'<link rel="canonical" href="%s" />' . "\n",
			esc_url( 'https://rynk.ai/blog/' )
		);
	}
}
add_action( 'wp_head', 'rynk_archive_canonical', 1 );

/**
 * Output site-wide JSON-LD structured data blocks.
 *
 * Emits Organization, WebSite, LocalBusiness, Person, Service, SoftwareApplication,
 * and FAQPage schema on every page so search engines and AI assistants have a
 * consistent, machine-readable description of Rynk and what it does.
 *
 * @return void
 */
function rynk_structured_data(): void {
	$schemas = array(
		array(
			'@context'    => 'https://schema.org',
			'@type'       => 'Organization',
			'name'        => 'Rynk AI',
			'url'         => 'https://rynk.ai/',
			'description' => 'rynk is an AI-powered SEO, AEO and GEO platform that automatically audits a small local business\'s website, fixes the technical and on-page gaps, and writes and publishes optimized content, so the business gets found on Google and inside AI assistants like ChatGPT, Perplexity and Google\'s AI Overviews. No SEO knowledge, no agency, no manual work.',
		),
		array(
			'@context'        => 'https://schema.org',
			'@type'           => 'WebSite',
			'name'            => 'Rynk AI',
			'url'             => 'https://rynk.ai/',
			'potentialAction' => array(
				'@type'       => 'SearchAction',
				'target'      => array(
					'@type'       => 'EntryPoint',
					'urlTemplate' => 'https://rynk.ai/?s={search_term_string}',
				),
				'query-input' => 'required name=search_term_string',
			),
		),
		array(
			'@context'       => 'https://schema.org',
			'@type'          => 'LocalBusiness',
			'name'           => 'Rynk AI',
			'url'            => 'https://rynk.ai/',
			'additionalType' => 'Software as a Service (SaaS) / AI SEO software',
			'description'    => 'rynk is an AI-powered SEO, AEO and GEO platform that automatically audits a small local business\'s website, fixes the technical and on-page gaps, and writes and publishes optimized content, so the business gets found on Google and inside AI assistants like ChatGPT, Perplexity and Google\'s AI Overviews. No SEO knowledge, no agency, no manual work.',
		),
		array(
			'@context'  => 'https://schema.org',
			'@type'     => 'Person',
			'name'      => 'Rishik Khandavalli, Ashwika Khandavalli',
			'worksFor'  => array(
				'@type' => 'Organization',
				'name'  => 'Rynk AI',
				'url'   => 'https://rynk.ai/',
			),
		),
		array(
			'@context'            => 'https://schema.org',
			'@type'               => 'SoftwareApplication',
			'name'                => 'Rynk AI',
			'url'                 => 'https://rynk.ai/',
			'description'         => 'Rynk is an AI-powered SEO, AEO and GEO platform that audits your website, applies technical and on-page fixes automatically, and generates and publishes optimized content so small local businesses rank on Google and get cited by ChatGPT, Perplexity, and Google AI Overviews.',
			'applicationCategory' => 'BusinessApplication',
			'operatingSystem'     => 'Web',
			'offers'              => array(
				array(
					'@type'              => 'Offer',
					'name'               => 'Gold',
					'price'              => '149',
					'priceCurrency'      => 'USD',
					'priceSpecification' => array(
						'@type'         => 'UnitPriceSpecification',
						'price'         => '149',
						'priceCurrency' => 'USD',
						'unitCode'      => 'MON',
					),
				),
				array(
					'@type'              => 'Offer',
					'name'               => 'Platinum',
					'price'              => '299',
					'priceCurrency'      => 'USD',
					'priceSpecification' => array(
						'@type'         => 'UnitPriceSpecification',
						'price'         => '299',
						'priceCurrency' => 'USD',
						'unitCode'      => 'MON',
					),
				),
			),
			'featureList'         => array(
				'Automated SEO audit',
				'Automated technical SEO fixes',
				'On-page optimization',
				'Structured data and schema markup',
				'AI content generation and publishing',
				'Answer Engine Optimization (AEO)',
				'Generative Engine Optimization (GEO)',
				'Local SEO and Google Business Profile optimization',
				'Keyword research and rank tracking',
				'Continuous monitoring and re-optimization',
			),
			'screenshot'          => 'https://rynk.ai/wp-content/themes/rynk/assets/img/logo.png',
			'publisher'           => array(
				'@type' => 'Organization',
				'name'  => 'Rynk AI',
				'url'   => 'https://rynk.ai/',
			),
		),
		array(
			'@context'    => 'https://schema.org',
			'@type'       => 'Service',
			'name'        => 'AI-Powered SEO Audit and Automated Technical SEO Fixes',
			'description' => 'Rynk performs an AI-powered SEO audit of your website and automatically applies technical SEO fixes - no manual intervention required. Fixes are deployed directly to your site, not just reported.',
			'provider'    => array(
				'@type' => 'Organization',
				'name'  => 'Rynk AI',
				'url'   => 'https://rynk.ai/',
			),
		),
		array(
			'@context'    => 'https://schema.org',
			'@type'       => 'Service',
			'name'        => 'On-Page SEO Optimization',
			'description' => 'Rynk optimizes meta titles, meta descriptions, headings, and internal linking across your website to improve search visibility and click-through rates.',
			'provider'    => array(
				'@type' => 'Organization',
				'name'  => 'Rynk AI',
				'url'   => 'https://rynk.ai/',
			),
		),
		array(
			'@context'    => 'https://schema.org',
			'@type'       => 'Service',
			'name'        => 'Structured Data, AI Content Generation, and Answer Engine Optimization',
			'description' => 'Rynk generates and publishes structured data schema markup, creates AI-optimized content, and implements Answer Engine Optimization (AEO) strategies so your business gets cited in ChatGPT, Perplexity, Google AI Overviews, and other AI assistants.',
			'provider'    => array(
				'@type' => 'Organization',
				'name'  => 'Rynk AI',
				'url'   => 'https://rynk.ai/',
			),
		),
		array(
			'@context'   => 'https://schema.org',
			'@type'      => 'FAQPage',
			'mainEntity' => array(
				array(
					'@type'          => 'Question',
					'name'           => 'How can I automate SEO for my small business?',
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'Rynk is an automated SEO platform built specifically for small local businesses. You connect your website, and Rynk audits it, applies technical fixes, and publishes optimized content directly to your site every month. No SEO knowledge, no agency, and no manual work required.',
					),
				),
				array(
					'@type'          => 'Question',
					'name'           => 'What is the best automated SEO platform for local businesses?',
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'Rynk is the automated SEO platform built for local small businesses, covering technical fixes, on-page optimization, local SEO, and AI content publishing in one place. Unlike tools built for agencies or enterprises, Rynk is scoped and priced for a single local business starting at $149 per month. It does the work for you rather than just reporting what is wrong.',
					),
				),
				array(
					'@type'          => 'Question',
					'name'           => 'Can AI generate SEO-optimized content for my website?',
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'Yes. Rynk uses AI-powered content generation to write and publish SEO-optimized blog posts and pages directly to your WordPress website each month. Every piece targets the keywords your local customers actually search, and is formatted so Google and AI assistants like ChatGPT and Perplexity can easily read and cite it.',
					),
				),
				array(
					'@type'          => 'Question',
					'name'           => 'How do I do SEO for my small business without hiring an agency?',
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'Rynk replaces the need for an SEO agency by automating the entire process for small business owners. It audits your site, fixes technical issues, optimizes your page titles and descriptions, and publishes new content every month, all without you needing any SEO expertise. Plans start at $149 per month, a fraction of typical agency costs.',
					),
				),
				array(
					'@type'          => 'Question',
					'name'           => 'How do I get my business to show up in ChatGPT search results?',
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'To get cited by ChatGPT, Perplexity, and Google AI Overviews, your website needs structured data, clearly written answer-style content, and strong authority signals. Rynk builds all of these automatically, adding schema markup, publishing quotable FAQ content, and creating credibility signals that AI assistants rely on when recommending local businesses.',
					),
				),
				array(
					'@type'          => 'Question',
					'name'           => 'How do I rank on both Google and AI assistants like ChatGPT?',
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'Rynk is one of the only platforms that optimizes for both traditional Google search and AI answer engines like ChatGPT, Perplexity, and Google AI Overviews in a single automated workflow. It handles technical SEO and keyword ranking for Google while also building the structured data, local signals, and AI-readable content that AI assistants need to confidently recommend your business.',
					),
				),
			),
		),
	);

	foreach ( $schemas as $schema ) {
		printf(
			'<script type="application/ld+json">%s</script>' . "\n",
			wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT )
		);
	}
}
add_action( 'wp_head', 'rynk_structured_data', 10 );

/**
 * Output BreadcrumbList JSON-LD for singular blog posts.
 *
 * Fires on every single post so individual blog articles each carry their
 * own breadcrumb trail: Home > Blog > Post Title.
 *
 * For specific posts, a canonical breadcrumb name is used to match the
 * action requirement.
 *
 * @return void
 */
function rynk_post_breadcrumb_schema(): void {
	if ( ! is_singular( 'post' ) ) {
		return;
	}

	$post  = get_queried_object();
	$title = ( $post instanceof WP_Post ) ? get_the_title( $post ) : '';
	$url   = ( $post instanceof WP_Post ) ? get_permalink( $post ) : '';
	$slug  = ( $post instanceof WP_Post ) ? $post->post_name : '';

	if ( ! $title || ! $url ) {
		return;
	}

	// Map specific post slugs to their canonical breadcrumb names.
	$breadcrumb_name_map = array(
		'why-isnt-my-business-showing-up-on-google' => 'Why Isnt My Business Showing Up On Google',
		'how-to-check-keyword-ranking-google'        => 'How To Check Keyword Ranking Google',
	);

	$breadcrumb_name = isset( $breadcrumb_name_map[ $slug ] )
		? $breadcrumb_name_map[ $slug ]
		: $title;

	$schema = array(
		'@context'        => 'https://schema.org',
		'@type'           => 'BreadcrumbList',
		'itemListElement' => array(
			array(
				'@type'    => 'ListItem',
				'position' => 1,
				'name'     => 'Home',
				'item'     => 'https://rynk.ai/',
			),
			array(
				'@type'    => 'ListItem',
				'position' => 2,
				'name'     => 'Blog',
				'item'     => 'https://rynk.ai/blog/',
			),
			array(
				'@type'    => 'ListItem',
				'position' => 3,
				'name'     => $breadcrumb_name,
				'item'     => $url,
			),
		),
	);

	printf(
		'<script type="application/ld+json">%s</script>' . "\n",
		wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT )
	);
}
add_action( 'wp_head', 'rynk_post_breadcrumb_schema', 10 );

/**
 * Output BreadcrumbList JSON-LD for category archive pages.
 *
 * Fires on category archives so pages like /category/uncategorized/ each
 * carry: Home > Category > Term Name.
 *
 * @return void
 */
function rynk_category_breadcrumb_schema(): void {
	if ( ! is_category() ) {
		return;
	}

	$term = get_queried_object();
	if ( ! ( $term instanceof WP_Term ) ) {
		return;
	}

	$term_url  = get_term_link( $term );
	$term_name = $term->name;

	if ( is_wp_error( $term_url ) ) {
		return;
	}

	$schema = array(
		'@context'        => 'https://schema.org',
		'@type'           => 'BreadcrumbList',
		'itemListElement' => array(
			array(
				'@type'    => 'ListItem',
				'position' => 1,
				'name'     => 'Home',
				'item'     => 'https://rynk.ai/',
			),
			array(
				'@type'    => 'ListItem',
				'position' => 2,
				'name'     => 'Category',
				'item'     => 'https://rynk.ai/category/',
			),
			array(
				'@type'    => 'ListItem',
				'position' => 3,
				'name'     => $term_name,
				'item'     => $term_url,
			),
		),
	);

	printf(
		'<script type="application/ld+json">%s</script>' . "\n",
		wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT )
	);
}
add_action( 'wp_head', 'rynk_category_breadcrumb_schema', 10 );

/**
 * Serve a static robots.txt via WordPress when no physical file exists.
 *
 * Blocks Googlebot from wasting crawl budget on thin WordPress default URLs
 * and points crawlers at the sitemap.
 *
 * @return void
 */
function rynk_robots_txt( string $output, bool $public ): string {
	if ( ! $public ) {
		return $output;
	}

	return "User-agent: *\n"
		. "Disallow: /wp-admin/\n"
		. "Disallow: /wp-login.php\n"
		. "Disallow: /xmlrpc.php\n"
		. "Disallow: /hello-world/\n"
		. "Disallow: /sample-page/\n"
		. "Disallow: /category/uncategorized/\n"
		. "Disallow: /author/rynkai/\n"
		. "Allow: /wp-admin/admin-ajax.php\n"
		. "\n"
		. "Sitemap: https://rynk.ai/sitemap.xml\n";
}
add_filter( 'robots_txt', 'rynk_robots_txt', 10, 2 );

/**
 * Serve a hand-crafted sitemap.xml that covers only canonical, indexable pages.
 *
 * Intercepts requests for /sitemap.xml before WordPress serves a 404, outputs
 * the XML directly, and exits. This keeps crawl budget focused on the pages
 * that matter: homepage, how-it-works, pricing, and about.
 *
 * To extend it with blog posts, add <url> entries in the $urls array below.
 *
 * @return void
 */
function rynk_serve_sitemap(): void {
	if ( ! isset( $_SERVER['REQUEST_URI'] ) ) {
		return;
	}

	$uri = strtok( (string) $_SERVER['REQUEST_URI'], '?' );

	if ( '/sitemap.xml' !== $uri ) {
		return;
	}

	$today = gmdate( 'Y-m-d' );

	$urls = array(
		array( 'loc' => 'https://rynk.ai/', 'priority' => '1.0', 'changefreq' => 'weekly' ),
		array( 'loc' => 'https://rynk.ai/how-it-works/', 'priority' => '0.9', 'changefreq' => 'monthly' ),
		array( 'loc' => 'https://rynk.ai/pricing/', 'priority' => '0.9', 'changefreq' => 'monthly' ),
		array( 'loc' => 'https://rynk.ai/about/', 'priority' => '0.8', 'changefreq' => 'monthly' ),
		array( 'loc' => 'https://rynk.ai/blog/', 'priority' => '0.8', 'changefreq' => 'weekly' ),
		array( 'loc' => 'https://rynk.ai/blog/how-to-search-for-a-keyword-on-a-web-page/', 'priority' => '0.7', 'changefreq' => 'monthly' ),
		array( 'loc' => 'https://rynk.ai/blog/ai-powered-content-generation-for-seo/', 'priority' => '0.7', 'changefreq' => 'monthly' ),
		array( 'loc' => 'https://rynk.ai/blog/how-to-check-keyword-ranking-google/', 'priority' => '0.7', 'changefreq' => 'monthly' ),
	);

	header( 'Content-Type: application/xml; charset=UTF-8', true, 200 );
	echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
	echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

	foreach ( $urls as $entry ) {
		echo "\t<url>\n";
		echo "\t\t<loc>" . esc_url( $entry['loc'] ) . "</loc>\n";
		echo "\t\t<lastmod>" . esc_html( $today ) . "</lastmod>\n";
		echo "\t\t<changefreq>" . esc_html( $entry['changefreq'] ) . "</changefreq>\n";
		echo "\t\t<priority>" . esc_html( $entry['priority'] ) . "</priority>\n";
		echo "\t</url>\n";
	}

	echo '</urlset>';
	exit;
}
add_action( 'init', 'rynk_serve_sitemap', 1 );

/**
 * Serve llms.txt for AI crawlers.
 *
 * Intercepts requests for /llms.txt and outputs a plain-text file that
 * describes Rynk, lists the canonical pages AI assistants should read, and
 * follows the llms.txt draft spec format.
 *
 * @return void
 */
function rynk_serve_llms_txt(): void {
	if ( ! isset( $_SERVER['REQUEST_URI'] ) ) {
		return;
	}

	$uri = strtok( (string) $_SERVER['REQUEST_URI'], '?' );

	if ( '/llms.txt' !== $uri ) {
		return;
	}

	header( 'Content-Type: text/plain; charset=UTF-8', true, 200 );

	echo "# Rynk AI\n\n";
	echo "> Rynk is an AI-powered SEO, AEO, and GEO platform for small and local businesses. It audits your website, automatically applies technical and on-page fixes, and generates and publishes optimized content so your business ranks on Google and gets cited by AI assistants like ChatGPT, Perplexity, and Google AI Overviews. No SEO expertise, no agency, and no manual work required. Plans start at \$149 per month.\n\n";
	echo "## Business category\n\n";
	echo "SaaS / AI-powered SEO software\n\n";
	echo "## Target audience\n\n";
	echo "Small and local business owners who want more customers from search without hiring an SEO agency.\n\n";
	echo "## Canonical pages\n\n";
	echo "- [Home](https://rynk.ai/)\n";
	echo "- [How it works](https://rynk.ai/how-it-works/)\n";
	echo "- [Pricing](https://rynk.ai/pricing/)\n";
	echo "- [About](https://rynk.ai/about/)\n\n";
	echo "## Optional\n\n";
	echo "- [Privacy Policy](https://rynk.ai/privacy-policy/)\n";

	exit;
}
add_action( 'init', 'rynk_serve_llms_txt', 1 );

/**
 * 301 redirect /hello-world/ to /blog/ to reclaim crawl budget from the
 * default WordPress placeholder post.
 *
 * @return void
 */
function rynk_redirect_hello_world(): void {
	if ( ! isset( $_SERVER['REQUEST_URI'] ) ) {
		return;
	}

	$uri = strtok( (string) $_SERVER['REQUEST_URI'], '?' );

	if ( '/hello-world/' === $uri ) {
		wp_redirect( 'https://rynk.ai/blog/', 301 );
		exit;
	}
}
add_action( 'template_redirect', 'rynk_redirect_hello_world' );

/**
 * 301 redirect /sample-page/ to the homepage.
 *
 * The default WordPress sample page contains thin placeholder content with no
 * value for visitors or search engines. Redirecting it to the homepage
 * reclaims any crawl budget spent on it and eliminates the unprofessional URL.
 *
 * @return void
 */
function rynk_redirect_sample_page(): void {
	if ( ! isset( $_SERVER['REQUEST_URI'] ) ) {
		return;
	}

	$uri = strtok( (string) $_SERVER['REQUEST_URI'], '?' );

	if ( '/sample-page/' === $uri ) {
		wp_redirect( 'https://rynk.ai/', 301 );
		exit;
	}
}
add_action( 'template_redirect', 'rynk_redirect_sample_page' );

/**
 * Inject internal links into blog post content at render time.
 *
 * For the two target posts we add a natural in-content anchor by filtering
 * the_content. Each filter fires only on the specific post slug so no other
 * content is affected.
 *
 * @param string $content Post content.
 * @return string
 */
function rynk_inject_internal_links( string $content ): string {
	if ( ! is_singular( 'post' ) ) {
		return $content;
	}

	$post = get_post();
	if ( ! ( $post instanceof WP_Post ) ) {
		return $content;
	}

	$slug = $post->post_name;

	// /blog/why-isnt-my-business-showing-up-on-google/ -> link to /how-it-works/.
	if ( 'why-isnt-my-business-showing-up-on-google' === $slug ) {
		$anchor      = 'how Rynk fixes it automatically';
		$linked      = '<a href="' . esc_url( home_url( '/how-it-works/' ) ) . '" class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors">' . $anchor . '</a>';
		$new_content = str_replace( $anchor, $linked, $content );
		if ( $new_content !== $content ) {
			return $new_content;
		}
		// Anchor text not found verbatim: append a contextual sentence before the closing paragraph.
		$append = '<p>See <a href="' . esc_url( home_url( '/how-it-works/' ) ) . '" class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors">how Rynk fixes it automatically</a> - no manual intervention needed.</p>';
		return $content . $append;
	}

	// /blog/how-to-check-keyword-ranking-google/ -> link to /pricing/.
	if ( 'how-to-check-keyword-ranking-google' === $slug ) {
		$anchor      = 'automated rank tracking with Rynk';
		$linked      = '<a href="' . esc_url( home_url( '/pricing/' ) ) . '" class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors">' . $anchor . '</a>';
		$new_content = str_replace( $anchor, $linked, $content );
		if ( $new_content !== $content ) {
			return $new_content;
		}
		// Anchor text not found verbatim: append a contextual sentence.
		$append = '<p>Get started with <a href="' . esc_url( home_url( '/pricing/' ) ) . '" class="text-brand-blueSoft underline underline-offset-2 hover:text-brand-text transition-colors">automated rank tracking with Rynk</a> - plans start at $149/month.</p>';
		return $content . $append;
	}

	return $content;
}
add_filter( 'the_content', 'rynk_inject_internal_links' );

/**
 * Create the marketing pages and point the front page at the landing template.
 *
 * Runs on activation, and is safe to run again — an existing page with the
 * same slug is reused rather than duplicated.
 *
 * @return void
 */
function rynk_scaffold_pages(): void {
	// Track parent IDs so child pages can be nested correctly.
	$parent_ids = array();

	foreach ( rynk_pages() as $slug => $page ) {
		// Determine parent slug for nested pages (e.g. "blog/some-post" -> parent "blog").
		$parent_id  = 0;
		$page_slug  = $slug;
		$slash_pos  = strpos( $slug, '/' );

		if ( false !== $slash_pos ) {
			$parent_slug = substr( $slug, 0, $slash_pos );
			$page_slug   = substr( $slug, $slash_pos + 1 );
			$parent_id   = $parent_ids[ $parent_slug ] ?? 0;
		}

		$existing = get_page_by_path( $slug );

		$page_id = $existing instanceof WP_Post
			? $existing->ID
			: wp_insert_post(
				array(
					'post_type'    => 'page',
					'post_name'    => $page_slug,
					'post_title'   => $page['title'],
					'post_status'  => 'publish',
					'post_content' => '',
					'post_parent'  => $parent_id,
				)
			);

		if ( is_wp_error( $page_id ) || 0 === $page_id ) {
			continue;
		}

		// Self-heal: force back to published on the intended template.
		if ( $existing instanceof WP_Post && 'publish' !== $existing->post_status ) {
			wp_update_post(
				array(
					'ID'          => $page_id,
					'post_status' => 'publish',
				)
			);
		}

		update_post_meta( $page_id, '_wp_page_template', $page['template'] );

		// Store ID so child pages can reference this as a parent.
		$parent_ids[ $slug ] = $page_id;
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
const RYNK_SCAFFOLD_VERSION = '6';

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

/**
 * Blog articles registry — the single source of truth for the blog hub card grid.
 *
 * @return array<int, array<string, string>>
 */
function rynk_blog_articles(): array {
	return array(
		array(
			'path'     => '/blog/how-to-search-for-a-keyword-on-a-web-page/',
			'title'    => 'How to Search for a Keyword on a Web Page (And What It Tells You About Your SEO)',
			'intro'    => 'Finding out whether a keyword actually appears on your page takes about five seconds. Knowing what to do with that information is where most small business owners get stuck.',
			'label'    => 'Guide',
			'image'    => 'blog-how-to-search-for-a-keyword-on-a-web-page-1.jpg',
			'imageAlt' => 'Close-up of a laptop keyboard, a single finger pressing the F key, warm natural side light',
		),
		array(
			'path'     => '/blog/ai-powered-content-generation-for-seo/',
			'title'    => 'AI-Powered Content Generation for SEO: What It Is and How Small Businesses Use It',
			'intro'    => 'Most small businesses know they need more content. Almost none of them have the time to write it. AI-powered content generation closes that gap, but only when it is built around the right keywords and published to the right pages.',
			'label'    => 'Guide',
			'image'    => 'blog-ai-powered-content-generation-for-seo-1.jpg',
			'imageAlt' => 'A tidy home office desk with a laptop, a small succulent plant, and a ceramic mug, warm afternoon light through a window, no screens or writing visible, clean and calm atmosphere',
		),
		array(
			'path'     => '/blog/how-to-check-keyword-ranking-google/',
			'title'    => 'How to Check Keyword Ranking in Google (Free Methods and Automated Tracking)',
			'intro'    => 'Knowing where your pages rank for the keywords your customers search is the starting point for any SEO improvement. Here is how to find your rankings for free and what to do with the information.',
			'label'    => 'Guide',
			'image'    => 'blog-how-to-search-for-a-keyword-on-a-web-page-1.jpg',
			'imageAlt' => 'Close-up of a laptop keyboard on a wooden desk, soft natural light, no screen visible',
		),
	);
}