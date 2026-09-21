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
		return 'About Rynk: AI Visibility for Local Businesses';
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
 * Mark non-critical front-end scripts as `defer` so they never block the
 * initial render of the page. `rynk-nav` is already loaded in the footer,
 * but the `defer` attribute additionally lets the browser parse it off the
 * main thread and keeps this future-proof if any script is later moved into
 * the head (e.g. an analytics snippet).
 *
 * @param string $tag    The `<script>` tag WordPress is about to print.
 * @param string $handle The script's registered handle.
 * @return string
 */
function rynk_defer_scripts( string $tag, string $handle ): string {
	$deferred = array( 'rynk-nav' );

	if ( in_array( $handle, $deferred, true ) && false === strpos( $tag, ' defer' ) ) {
		$tag = str_replace( ' src', ' defer src', $tag );
	}

	return $tag;
}
add_filter( 'script_loader_tag', 'rynk_defer_scripts', 10, 2 );

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
 * Keep default WordPress placeholder / low-value archives out of crawlers.
 *
 * Appends Disallow rules for category archives, the author archive, and
 * internal search-result URLs to the virtual robots.txt WordPress generates
 * (only when the site is set to be publicly indexable).
 *
 * @param string $output Default robots.txt body.
 * @param bool   $public Whether "Discourage search engines" is unchecked.
 * @return string
 */
function rynk_robots_txt( string $output, bool $public ): string {
	if ( ! $public ) {
		return $output;
	}

	$output .= "Disallow: /category/\n";
	$output .= "Disallow: /author/\n";
	$output .= "Disallow: /wp-admin/\n";
	$output .= "Allow: /wp-admin/admin-ajax.php\n";
	$output .= "Disallow: /?s=\n";
	$output .= "Disallow: /search/\n";

	return $output;
}
add_filter( 'robots_txt', 'rynk_robots_txt', 10, 2 );

/**
 * Exclude low-value default WordPress content from the XML sitemap.
 *
 * The core "uncategorized" category and the "author" archive add no value
 * for a four-page marketing site, so the whole taxonomy sitemap and the
 * users (author) sitemap provider are removed. The default "Hello world!"
 * post and "Sample Page" are also stripped out of the posts/pages sitemaps
 * if they still exist on an install.
 *
 * @return void
 */
function rynk_trim_sitemap(): void {
	// Removes the category/tag taxonomy sitemap entirely (nothing on this
	// theme relies on taxonomy archives).
	add_filter( 'wp_sitemaps_taxonomies', '__return_empty_array' );

	// Removes the /wp-sitemap-users-1.xml author sitemap.
	add_filter(
		'wp_sitemaps_add_provider',
		static function ( $provider, string $name ) {
			return 'users' === $name ? false : $provider;
		},
		10,
		2
	);

	// Strips the "Hello world!" sample post and "Sample Page" out of the
	// posts/pages sitemaps if a default install ever created them.
	add_filter(
		'wp_sitemaps_posts_query_args',
		static function ( array $args, string $post_type ) {
			if ( 'post' === $post_type ) {
				$hello = get_page_by_path( 'hello-world', OBJECT, 'post' );
				if ( $hello instanceof WP_Post ) {
					$args['post__not_in'][] = $hello->ID;
				}
			}

			if ( 'page' === $post_type ) {
				$sample = get_page_by_path( 'sample-page' );
				if ( $sample instanceof WP_Post ) {
					$args['post__not_in'][] = $sample->ID;
				}
			}

			return $args;
		},
		10,
		2
	);
}
add_action( 'init', 'rynk_trim_sitemap' );

/**
 * 301-redirect default WordPress placeholder content that a fresh install
 * creates automatically (the "Hello world!" sample post, and "Sample Page")
 * back to the home page. Neither is real marketing content, but both are
 * live and indexable unless removed or redirected. Runs early on
 * template_redirect, before any of the theme's templates render.
 *
 * Also covers the auto-generated "Uncategorized" category archive at
 * /category/uncategorized/, which every default install creates alongside
 * the "Hello world!" post and duplicates that same placeholder content
 * rather than offering anything unique.
 *
 * @return void
 */
function rynk_legacy_placeholder_redirects(): void {
	if ( is_singular( 'post' ) && is_single( 'hello-world' ) ) {
		wp_safe_redirect( home_url( '/' ), 301 );
		exit;
	}

	if ( is_page( 'sample-page' ) ) {
		wp_safe_redirect( home_url( '/' ), 301 );
		exit;
	}

	if ( is_category( 'uncategorized' ) ) {
		wp_safe_redirect( home_url( '/' ), 301 );
		exit;
	}
}
add_action( 'template_redirect', 'rynk_legacy_placeholder_redirects', 1 );

/**
 * 301-redirect /hello-world/ straight off the request path, independent of
 * whether the "Hello world!" sample post still exists in the database.
 *
 * rynk_legacy_placeholder_redirects() above already covers this via
 * is_single('hello-world') while the post is present, but if that post has
 * since been trashed or permanently deleted, WordPress has nothing left to
 * resolve /hello-world/ against and the URL 404s instead of 301ing. Since
 * the URL was previously live and indexable, this checks the literal
 * request path so the redirect keeps firing either way.
 *
 * @return void
 */
function rynk_hello_world_path_redirect(): void {
	$path = wp_parse_url( (string) ( $_SERVER['REQUEST_URI'] ?? '' ), PHP_URL_PATH );

	if ( is_string( $path ) && '/hello-world' === untrailingslashit( $path ) ) {
		wp_safe_redirect( home_url( '/' ), 301 );
		exit;
	}
}
add_action( 'template_redirect', 'rynk_hello_world_path_redirect', 1 );

/**
 * 301-redirect /sample-page/ straight off the request path, independent of
 * whether the "Sample Page" post still exists in the database.
 *
 * rynk_legacy_placeholder_redirects() above already covers this via
 * is_page('sample-page') while the page is present, but if that page has
 * since been trashed or permanently deleted, WordPress has nothing left to
 * resolve /sample-page/ against and the URL 404s instead of 301ing. Since
 * the URL was previously live and indexable (it's the boilerplate "bike
 * messenger" copy every default WordPress install ships with), this checks
 * the literal request path so the redirect keeps firing either way — the
 * same pattern rynk_hello_world_path_redirect() uses above.
 *
 * @return void
 */
function rynk_sample_page_path_redirect(): void {
	$path = wp_parse_url( (string) ( $_SERVER['REQUEST_URI'] ?? '' ), PHP_URL_PATH );

	if ( is_string( $path ) && '/sample-page' === untrailingslashit( $path ) ) {
		wp_safe_redirect( home_url( '/' ), 301 );
		exit;
	}
}
add_action( 'template_redirect', 'rynk_sample_page_path_redirect', 1 );

/**
 * Canonical URL for the default "rynkai" author archive.
 *
 * That archive is auto-generated by WordPress, duplicates the placeholder
 * "Hello world!" content, and offers nothing unique of its own, so it is
 * canonicalized back to the home page rather than left to compete with it
 * in search results. WordPress doesn't print a canonical for author
 * archives on its own, so this adds the tag rather than replacing one.
 *
 * @return void
 */
function rynk_author_canonical(): void {
	if ( is_author() && 'rynkai' === get_query_var( 'author_name' ) ) {
		printf( '<link rel="canonical" href="%s" />' . "\n", esc_url( home_url( '/' ) ) );
	}
}
add_action( 'wp_head', 'rynk_author_canonical', 1 );

/**
 * Plain-text summary of rynk.ai's core pages for AI assistants (ChatGPT,
 * Perplexity, etc.) that look for an /llms.txt file, mirroring what
 * robots.txt does for traditional crawlers.
 *
 * @return string
 */
function rynk_llms_txt_content(): string {
	$lines = array(
		'# rynk.ai',
		'',
		'> Rynk is an AI-powered SEO automation platform that audits websites, fixes what holds back search visibility, and generates content automatically so small and hyperlocal businesses get found on Google and AI search.',
		'',
		'## Pages',
		'',
		'- [Home](https://rynk.ai/): What Rynk does — auditing a site, generating fixes and content, and deploying changes automatically, with no SEO expertise required.',
		'- [How it works](https://rynk.ai/how-it-works/): The four-step pipeline Rynk runs — audit, fix and update, generate and publish, and monitor.',
		'- [Pricing](https://rynk.ai/pricing/): Rynk's Gold and Platinum monthly plans, plus a one-time website build offer.',
		'- [About](https://rynk.ai/about/): Why Rynk was built, and the team and mentors behind it.',
	);

	return implode( "\n", $lines ) . "\n";
}

/**
 * Serve /llms.txt as a plain-text file via a rewrite rule, the same pattern
 * WordPress itself uses to virtually serve /robots.txt — no static file
 * needs to exist on disk.
 *
 * @return void
 */
function rynk_llms_txt_rewrite(): void {
	add_rewrite_rule( '^llms\.txt$', 'index.php?rynk_llms_txt=1', 'top' );
}
add_action( 'init', 'rynk_llms_txt_rewrite' );

/**
 * Register the query var the llms.txt rewrite rule maps to.
 *
 * @param array<int, string> $vars Public query vars.
 * @return array<int, string>
 */
function rynk_llms_txt_query_vars( array $vars ): array {
	$vars[] = 'rynk_llms_txt';
	return $vars;
}
add_filter( 'query_vars', 'rynk_llms_txt_query_vars' );

/**
 * Output the llms.txt body and short-circuit template loading when the
 * rewrite rule matches.
 *
 * @return void
 */
function rynk_llms_txt_render(): void {
	if ( ! get_query_var( 'rynk_llms_txt' ) ) {
		return;
	}

	header( 'Content-Type: text/plain; charset=utf-8' );
	echo rynk_llms_txt_content(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	exit;
}
add_action( 'template_redirect', 'rynk_llms_txt_render' );

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
		$desc = 'Meet the team building Rynk, the AI SEO automation platform helping local restaurants and small businesses get found on Google and AI search.';
	}
	if ( '' === $desc ) {
		return;
	}
	printf( '<meta name="description" content="%s" />' . "\n", esc_attr( $desc ) );
	printf( '<meta property="og:description" content="%s" />' . "\n", esc_attr( $desc ) );
}
add_action( 'wp_head', 'rynk_meta_description', 1 );

/**
 * Site-wide structured data — Organization, WebSite, LocalBusiness, Person,
 * Service, SoftwareApplication, HowTo, and FAQPage JSON-LD, so search engines
 * and AI assistants can reliably identify rynk.ai as an entity, know who is
 * behind it, understand the services and product it offers, understand how
 * the product works step by step, and surface answers to common questions
 * about it, rather than inferring any of that from prose. Emitted on every
 * page (not just the front page) since the entity data doesn't change per
 * page.
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
			'description' => 'AI-powered SEO automation platform that audits websites, identifies search visibility issues, and deploys fixes and content automatically.',
		),
		array(
			'@context'       => 'https://schema.org',
			'@type'          => 'WebSite',
			'name'           => 'Rynk AI',
			'url'            => 'https://rynk.ai/',
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
			'additionalType' => 'Software / SaaS',
			'description'    => 'AI-powered SEO automation platform that audits websites, identifies search visibility issues, and deploys fixes and content automatically.',
		),
		array(
			'@context' => 'https://schema.org',
			'@type'    => 'Person',
			'name'     => 'Rishik Khandavalli and Ashwika Khandavalli',
			'worksFor' => array(
				'@type' => 'Organization',
				'name'  => 'Rynk AI',
				'url'   => 'https://rynk.ai/',
			),
		),
		array(
			'@context' => 'https://schema.org',
			'@type'    => 'Service',
			'name'     => 'Website SEO audit and analysis',
			'provider' => array(
				'@type' => 'Organization',
				'name'  => 'Rynk AI',
				'url'   => 'https://rynk.ai/',
			),
		),
		array(
			'@context' => 'https://schema.org',
			'@type'    => 'Service',
			'name'     => 'Technical SEO issue fixes',
			'provider' => array(
				'@type' => 'Organization',
				'name'  => 'Rynk AI',
				'url'   => 'https://rynk.ai/',
			),
		),
		array(
			'@context' => 'https://schema.org',
			'@type'    => 'Service',
			'name'     => 'AI-optimized content generation',
			'provider' => array(
				'@type' => 'Organization',
				'name'  => 'Rynk AI',
				'url'   => 'https://rynk.ai/',
			),
		),
		// Page title and meta description optimization — the theme sets a
		// per-page <title> / meta description via rynk_about_document_title()
		// and rynk_meta_description(); this Service entry names that
		// capability explicitly for search engines and AI assistants.
		array(
			'@context' => 'https://schema.org',
			'@type'    => 'Service',
			'name'     => 'Page title and meta description optimization',
			'provider' => array(
				'@type' => 'Organization',
				'name'  => 'Rynk AI',
				'url'   => 'https://rynk.ai/',
			),
		),
		// SoftwareApplication — describes the Rynk product itself (pricing
		// tiers, feature list) so search engines and AI assistants can surface
		// it as a distinct piece of software rather than just an organization.
		array(
			'@context'            => 'https://schema.org',
			'@type'               => 'SoftwareApplication',
			'name'                => 'Rynk AI',
			'applicationCategory' => 'BusinessApplication',
			'applicationSubCategory' => 'SEO Automation Software',
			'operatingSystem'     => 'Web',
			'description'         => 'AI-powered SEO automation platform that audits websites, identifies search visibility issues, and deploys fixes and content automatically for small and hyper local businesses.',
			'url'                 => 'https://rynk.ai/',
			'offers'              => array(
				array(
					'@type'           => 'Offer',
					'name'            => 'Gold',
					'price'           => '149',
					'priceCurrency'   => 'USD',
					'priceValidUntil' => '2027-12-31',
					'url'             => 'https://rynk.ai/pricing/',
				),
				array(
					'@type'           => 'Offer',
					'name'            => 'Platinum',
					'price'           => '299',
					'priceCurrency'   => 'USD',
					'priceValidUntil' => '2027-12-31',
					'url'             => 'https://rynk.ai/pricing/',
				),
			),
			'featureList'         => array(
				'Website SEO audit and analysis',
				'Technical SEO issue fixes',
				'AI-optimized content generation',
				'Page title and meta description optimization',
				'AI readability formatting',
				'Duplicate page cleanup',
				'Search engine visibility monitoring',
				'AEO and GEO optimization',
			),
		),
		// HowTo — spells out the four-step Analyze / Generate / Publish /
		// Monitor pipeline documented on /how-it-works/, so search engines and
		// AI assistants can surface the process itself, not just the outcome.
		array(
			'@context'    => 'https://schema.org',
			'@type'       => 'HowTo',
			'name'        => "How Rynk automates your website's SEO in 4 steps",
			'description' => "Rynk audits your site, updates what's broken, generates and publishes new content, and monitors results, all on autopilot without SEO expertise or manual work.",
			'step'        => array(
				array(
					'@type' => 'HowToStep',
					'name'  => 'Audit',
					'text'  => 'Rynk goes through every page of your website to identify technical issues, keyword and competitor insights, and duplicate content.',
				),
				array(
					'@type' => 'HowToStep',
					'name'  => 'Fix and Update',
					'text'  => 'Rynk fixes technical issues like page titles, meta descriptions, broken links, connects pages, and cleans up duplicates, then deploys changes live.',
				),
				array(
					'@type' => 'HowToStep',
					'name'  => 'Generate and Publish',
					'text'  => 'Rynk writes new blogs, pages, and images for your site and auto-publishes updates directly to WordPress.',
				),
				array(
					'@type' => 'HowToStep',
					'name'  => 'Monitor',
					'text'  => 'Rynk checks weekly search results and rankings for your key searches, feeding changes back into the plan.',
				),
			),
		),
		// FAQPage — common questions about AI SEO automation, so search
		// engines and AI assistants can surface direct answers about rynk.ai
		// and the category it competes in.
		array(
			'@context'   => 'https://schema.org',
			'@type'      => 'FAQPage',
			'mainEntity' => array(
				array(
					'@type'          => 'Question',
					'name'           => 'What is AI SEO automation and how does it work?',
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'AI SEO automation is software that audits a website, finds what is blocking search visibility, and deploys fixes and content without manual work. Rynk AI runs this as a continuous loop: it audits your site, fixes technical issues like titles and meta descriptions, generates new pages and blogs, then publishes updates directly to your website. Unlike traditional SEO tools that only report problems, Rynk closes the loop by making the fixes itself.',
					),
				),
				array(
					'@type'          => 'Question',
					'name'           => 'How can I automate website optimization for my business?',
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'You automate website optimization by connecting a platform that scans your site, identifies gaps like missing meta descriptions or duplicate pages, and pushes corrections live automatically. Rynk AI does this end to end for WordPress sites, updating page titles, cleaning up duplicate content, and adding new hyperlocal pages every month with no developer or SEO hire required.',
					),
				),
				array(
					'@type'          => 'Question',
					'name'           => 'What SEO strategies work best for small businesses?',
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'The strategies that work best for small businesses are fixing basic technical issues, writing unique page titles and meta descriptions, publishing hyperlocal content, and making pages easy for both Google and AI assistants to read. Rynk AI packages these into one automated workflow, targeting hyperlocal keywords and technical fixes that larger enterprise SEO tools often treat as manual, expert-only tasks.',
					),
				),
				array(
					'@type'          => 'Question',
					'name'           => 'How does AI-powered content generation improve my SEO?',
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'AI-powered content generation improves SEO by consistently publishing pages and blogs targeted at the exact searches your customers make, which traditional sites without a marketing team rarely keep up with. Rynk AI writes and auto-publishes new blogs, keyword pages, and hyperlocal landing pages directly to your site every month, building the page volume and relevance signals search engines reward.',
					),
				),
				array(
					'@type'          => 'Question',
					'name'           => 'What is a search visibility platform and do I need one?',
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'A search visibility platform monitors and improves how often your business appears across Google, AI assistants, and local listings, rather than tracking rankings alone. If you are a small or hyperlocal business without a marketing team, you likely need one because manual SEO across so many channels is time consuming; Rynk AI is built specifically as an automated search visibility platform for that gap.',
					),
				),
				array(
					'@type'          => 'Question',
					'name'           => 'How can I automate technical SEO fixes on my website?',
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'You automate technical SEO fixes by using a tool that scans for issues like missing meta descriptions, duplicate pages, and broken page titles, then applies corrections without you editing code. Rynk AI\'s technical SEO automation identifies these problems during its audit step and deploys the fixes straight to your WordPress site, no developer or manual intervention needed.',
					),
				),
				array(
					'@type'          => 'Question',
					'name'           => 'What is the best SEO tool for local businesses?',
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'The best SEO tool for local businesses is one built for hyperlocal keywords, requires no SEO expertise, and delivers results quickly rather than over weeks of manual work. Rynk AI is a local business SEO tool designed specifically for restaurants, retail shops, and service providers, generating hyperlocal pages and technical fixes automatically each month starting at $149 per month.',
					),
				),
				array(
					'@type'          => 'Question',
					'name'           => 'How do I optimize my business for visibility in ChatGPT?',
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'To optimize for visibility in ChatGPT and other AI assistants, your site needs clear, well-structured content, consistent business information, and credibility signals AI models look for when citing sources. Rynk AI builds this through AI readability formatting, credibility reports, and outreach that mentions your business elsewhere online, increasing the chance ChatGPT, Perplexity, and Google AI Overview reference you.',
					),
				),
				array(
					'@type'          => 'Question',
					'name'           => 'What is AI search engine optimization and why does it matter?',
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'AI search engine optimization, or AEO, is the practice of optimizing your online presence so AI assistants like ChatGPT, Perplexity, and Gemini cite and recommend your business, not just Google. It matters because customers increasingly ask AI tools for local recommendations instead of typing searches, and Rynk AI optimizes for both traditional Google search and AI search engines simultaneously so you are not invisible on either.',
					),
				),
				array(
					'@type'          => 'Question',
					'name'           => 'Can I improve my SEO without hiring an expert?',
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'Yes, you can improve your SEO without hiring an expert by using a platform that automates the audit, fixes, and content creation for you. Rynk AI was built for non-technical business owners: it requires no SEO expertise, needs no manual intervention, and delivers results in minutes instead of the weeks or months a hired SEO consultant typically takes.',
					),
				),
			),
		),
	);

	foreach ( $schemas as $schema ) {
		printf(
			'<script type="application/ld+json">%s</script>' . "\n",
			wp_json_encode( $schema ) // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		);
	}
}
add_action( 'wp_head', 'rynk_structured_data', 2 );

/**
 * Per-page BreadcrumbList JSON-LD.
 *
 * Emitted alongside the site-wide schemas in rynk_structured_data(), but
 * kept in its own hook since it depends on which page is being rendered
 * rather than being identical on every request. Covers the "rynkai" author
 * archive (matched via is_author()), since that archive isn't one of the
 * pages in rynk_pages().
 *
 * The /app page's breadcrumb is emitted separately by
 * rynk_app_breadcrumb_structured_data() below, the About page's breadcrumb
 * is emitted separately by rynk_about_breadcrumb_structured_data() below,
 * the Privacy Policy page's breadcrumb is emitted separately by
 * rynk_privacy_policy_breadcrumb_structured_data() below, and the /sign-in
 * page's breadcrumb is emitted separately by
 * rynk_sign_in_breadcrumb_structured_data() below, so none of those are
 * listed in $trails here (never emit the same BreadcrumbList twice for one
 * page).
 *
 * @return void
 */
function rynk_breadcrumb_structured_data(): void {
	$trails = array();

	foreach ( $trails as $slug => $label ) {
		if ( ! is_page( $slug ) ) {
			continue;
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
					'name'     => $label,
					'item'     => 'https://rynk.ai/' . $slug . '/',
				),
			),
		);

		printf(
			'<script type="application/ld+json">%s</script>' . "\n",
			wp_json_encode( $schema ) // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		);

		return;
	}

	// Author archive - /author/rynkai/. Not a templated marketing page, so it
	// isn't in $trails above; matched directly on the author slug instead.
	if ( is_author() && 'rynkai' === get_query_var( 'author_name' ) ) {
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
					'name'     => 'Author',
					'item'     => 'https://rynk.ai/author/',
				),
				array(
					'@type'    => 'ListItem',
					'position' => 3,
					'name'     => 'Rynkai',
					'item'     => 'https://rynk.ai/author/rynkai/',
				),
			),
		);

		printf(
			'<script type="application/ld+json">%s</script>' . "\n",
			wp_json_encode( $schema ) // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		);
	}
}
add_action( 'wp_head', 'rynk_breadcrumb_structured_data', 3 );

/**
 * BreadcrumbList JSON-LD for /app.
 *
 * Home -> App, matching the "app" slug rynk_pages() scaffolds onto the
 * coming-soon template. Kept as its own hook (rather than folded into the
 * generic $trails loop in rynk_breadcrumb_structured_data() above) so the
 * /app/ URL and "App" label are explicit and easy to audit, the same
 * pattern rynk_about_breadcrumb_structured_data(),
 * rynk_privacy_policy_breadcrumb_structured_data(), and
 * rynk_sign_in_breadcrumb_structured_data() use for their pages.
 *
 * @return void
 */
function rynk_app_breadcrumb_structured_data(): void {
	if ( ! is_page( 'app' ) ) {
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
				'name'     => 'App',
				'item'     => 'https://rynk.ai/app/',
			),
		),
	);

	printf(
		'<script type="application/ld+json">%s</script>' . "\n",
		wp_json_encode( $schema ) // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	);
}
add_action( 'wp_head', 'rynk_app_breadcrumb_structured_data', 3 );

/**
 * BreadcrumbList JSON-LD for /sign-in.
 *
 * Home -> Sign In, matching the "sign-in" slug rynk_pages() scaffolds onto
 * the coming-soon template. Kept as its own hook (rather than folded into
 * the generic $trails loop in rynk_breadcrumb_structured_data() above) so
 * the /sign-in/ URL and "Sign In" label are explicit and easy to audit, the
 * same pattern rynk_app_breadcrumb_structured_data(),
 * rynk_about_breadcrumb_structured_data(), and
 * rynk_privacy_policy_breadcrumb_structured_data() use for their pages.
 *
 * @return void
 */
function rynk_sign_in_breadcrumb_structured_data(): void {
	if ( ! is_page( 'sign-in' ) ) {
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
				'name'     => 'Sign In',
				'item'     => 'https://rynk.ai/sign-in/',
			),
		),
	);

	printf(
		'<script type="application/ld+json">%s</script>' . "\n",
		wp_json_encode( $schema ) // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	);
}
add_action( 'wp_head', 'rynk_sign_in_breadcrumb_structured_data', 3 );

/**
 * BreadcrumbList JSON-LD for /about.
 *
 * The About page previously had no structured data of its own; this adds a
 * dedicated Home -> About BreadcrumbList so search engines and AI assistants
 * can resolve /about/'s position in the site hierarchy, matching the same
 * `is_page_template()` gate rynk_about_document_title() and
 * rynk_meta_description() already use for this page.
 *
 * @return void
 */
function rynk_about_breadcrumb_structured_data(): void {
	if ( ! is_page_template( 'page-templates/about.php' ) ) {
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
				'name'     => 'About',
				'item'     => 'https://rynk.ai/about/',
			),
		),
	);

	printf(
		'<script type="application/ld+json">%s</script>' . "\n",
		wp_json_encode( $schema ) // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	);
}
add_action( 'wp_head', 'rynk_about_breadcrumb_structured_data', 3 );

/**
 * BreadcrumbList JSON-LD for /privacy-policy.
 *
 * Home -> Privacy Policy, matching the same `is_page_template()` gate the
 * privacy-policy template itself is served under. Kept as its own hook
 * (rather than folded into the generic $trails loop in
 * rynk_breadcrumb_structured_data() above) so the /privacy-policy/ URL and
 * "Privacy Policy" label live next to the page's own schema, the same
 * pattern rynk_about_breadcrumb_structured_data() uses for /about/.
 *
 * @return void
 */
function rynk_privacy_policy_breadcrumb_structured_data(): void {
	if ( ! is_page_template( 'page-templates/privacy-policy.php' ) ) {
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
				'name'     => 'Privacy Policy',
				'item'     => 'https://rynk.ai/privacy-policy/',
			),
		),
	);

	printf(
		'<script type="application/ld+json">%s</script>' . "\n",
		wp_json_encode( $schema ) // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	);
}
add_action( 'wp_head', 'rynk_privacy_policy_breadcrumb_structured_data', 3 );

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
 * Scaffold version. Bump whenever rynk_pages() gains a page, or whenever a
 * new rewrite rule (e.g. the /llms.txt route) needs its one-time flush, so
 * the change takes effect on the next request without a manual theme
 * re-activation.
 */
const RYNK_SCAFFOLD_VERSION = '4';

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
	// other scaffolded page, or route like /llms.txt) resolves for logged-out
	// visitors.
	flush_rewrite_rules( false );

	update_option( 'rynk_scaffold_version', RYNK_SCAFFOLD_VERSION );
}
add_action( 'init', 'rynk_maybe_scaffold_pages' );