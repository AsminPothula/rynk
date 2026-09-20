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
		'how-it-works'                 => array(
			'title'    => 'How it works',
			'template' => 'page-templates/how-it-works.php',
		),
		'pricing'                      => array(
			'title'    => 'Pricing',
			'template' => 'page-templates/pricing.php',
		),
		'about'                        => array(
			'title'    => 'About',
			'template' => 'page-templates/about.php',
		),
		// Educational guide page — linked in-content from How it Works and
		// Pricing rather than added to the primary nav.
		'ai-search-engine-optimization' => array(
			'title'    => 'AI Search Engine Optimization',
			'template' => 'page-templates/ai-search-engine-optimization.php',
		),
		// Feature explainer — linked in-content from the AI SEO guide, How it
		// Works, and Pricing rather than added to the primary nav.
		'content-marketing-for-link-building' => array(
			'title'    => 'Content Marketing for Link Building',
			'template' => 'page-templates/content-marketing-for-link-building.php',
		),
		// Placeholder pages — live until the real destinations ship. The app,
		// sign-in, and free-scan CTAs all land on a "Coming soon" screen rather
		// than a dead link.
		'app'                          => array(
			'title'    => 'Dashboard',
			'template' => 'page-templates/coming-soon.php',
		),
		'sign-in'                      => array(
			'title'    => 'Sign in',
			'template' => 'page-templates/coming-soon.php',
		),
		'privacy-policy'               => array(
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
		return 'About Rynk - AI SEO Platform for Small Businesses';
	}
	return $title;
}
add_filter( 'pre_get_document_title', 'rynk_about_document_title' );

/**
 * Keyword-rich <title> for the AI Search Engine Optimization guide.
 *
 * @param string $title Default document title.
 * @return string
 */
function rynk_ai_seo_document_title( string $title ): string {
	if ( is_page_template( 'page-templates/ai-search-engine-optimization.php' ) ) {
		return 'AI Search Engine Optimization - Rynk AI SEO Automation';
	}
	return $title;
}
add_filter( 'pre_get_document_title', 'rynk_ai_seo_document_title' );

/**
 * Keyword-rich <title> for the Content Marketing for Link Building page.
 *
 * @param string $title Default document title.
 * @return string
 */
function rynk_content_marketing_document_title( string $title ): string {
	if ( is_page_template( 'page-templates/content-marketing-for-link-building.php' ) ) {
		return 'Content Marketing for Link Building - Rynk AI SEO Automation';
	}
	return $title;
}
add_filter( 'pre_get_document_title', 'rynk_content_marketing_document_title' );

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
	} elseif ( is_page_template( 'page-templates/ai-search-engine-optimization.php' ) ) {
		$desc = 'Learn how AI search engine optimization works and how Rynk automates AEO, technical SEO, and content so your business gets found on Google, ChatGPT, and Perplexity.';
	} elseif ( is_page_template( 'page-templates/content-marketing-for-link-building.php' ) ) {
		$desc = 'See how Rynk generates blog content, outreach emails, and social posts that earn backlinks and mentions, without hiring an agency or a writer.';
	}
	if ( '' === $desc ) {
		return;
	}
	printf( '<meta name="description" content="%s" />' . "\n", esc_attr( $desc ) );
	printf( '<meta property="og:description" content="%s" />' . "\n", esc_attr( $desc ) );
}
add_action( 'wp_head', 'rynk_meta_description', 1 );

/**
 * FAQPage + BreadcrumbList structured data for the AI Search Engine
 * Optimization guide, so the FAQ section rendered in the template is
 * mirrored in schema.org markup for search and AI-assistant crawlers.
 *
 * @return void
 */
function rynk_ai_seo_schema(): void {
	if ( ! is_page_template( 'page-templates/ai-search-engine-optimization.php' ) ) {
		return;
	}

	$page_url = home_url( '/ai-search-engine-optimization/' );

	$breadcrumb = array(
		'@context'        => 'https://schema.org',
		'@type'           => 'BreadcrumbList',
		'itemListElement' => array(
			array(
				'@type'    => 'ListItem',
				'position' => 1,
				'name'     => 'Home',
				'item'     => home_url( '/' ),
			),
			array(
				'@type'    => 'ListItem',
				'position' => 2,
				'name'     => 'AI Search Engine Optimization',
				'item'     => $page_url,
			),
		),
	);

	$faq = array(
		'@context'   => 'https://schema.org',
		'@type'      => 'FAQPage',
		'mainEntity' => array(
			array(
				'@type'          => 'Question',
				'name'           => 'What is AI search engine optimization and how does it work?',
				'acceptedAnswer' => array(
					'@type' => 'Answer',
					'text'  => 'AI search engine optimization is the process of formatting and structuring your website so AI assistants like ChatGPT and Perplexity can accurately read, trust, and cite your business alongside traditional Google rankings. It works by combining technical SEO fixes with AI-readable content formatting and outside credibility signals.',
				),
			),
			array(
				'@type'          => 'Question',
				'name'           => 'How does AI SEO automation work to improve my website?',
				'acceptedAnswer' => array(
					'@type' => 'Answer',
					'text'  => 'Rynk automates the process by auditing your full site, fixing technical issues like titles, meta descriptions, and duplicate pages, generating new content and images, and then deploying everything directly to your website with no manual work required.',
				),
			),
			array(
				'@type'          => 'Question',
				'name'           => 'What does AI-powered search visibility mean for my site?',
				'acceptedAnswer' => array(
					'@type' => 'Answer',
					'text'  => "AI-powered search visibility means your business shows up not only in Google's organic results but also when customers ask AI tools direct questions, because your site is formatted in a way those tools can confidently reference.",
				),
			),
			array(
				'@type'          => 'Question',
				'name'           => 'What is technical SEO automation and how does it help?',
				'acceptedAnswer' => array(
					'@type' => 'Answer',
					'text'  => 'Technical SEO automation means software finds and fixes the behind-the-scenes issues, broken links, missing meta descriptions, duplicate pages, slow-loading content, that quietly stop your site from ranking, without you needing an SEO background.',
				),
			),
		),
	);

	echo '<script type="application/ld+json">' . wp_json_encode( $breadcrumb ) . '</script>' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	echo '<script type="application/ld+json">' . wp_json_encode( $faq ) . '</script>' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}
add_action( 'wp_head', 'rynk_ai_seo_schema', 2 );

/**
 * FAQPage + BreadcrumbList structured data for the Content Marketing for
 * Link Building page, mirroring the FAQ section rendered in the template.
 *
 * @return void
 */
function rynk_content_marketing_schema(): void {
	if ( ! is_page_template( 'page-templates/content-marketing-for-link-building.php' ) ) {
		return;
	}

	$page_url = home_url( '/content-marketing-for-link-building/' );

	$breadcrumb = array(
		'@context'        => 'https://schema.org',
		'@type'           => 'BreadcrumbList',
		'itemListElement' => array(
			array(
				'@type'    => 'ListItem',
				'position' => 1,
				'name'     => 'Home',
				'item'     => home_url( '/' ),
			),
			array(
				'@type'    => 'ListItem',
				'position' => 2,
				'name'     => 'Content Marketing for Link Building',
				'item'     => $page_url,
			),
		),
	);

	$faq = array(
		'@context'   => 'https://schema.org',
		'@type'      => 'FAQPage',
		'mainEntity' => array(
			array(
				'@type'          => 'Question',
				'name'           => 'How can I use content generation for SEO?',
				'acceptedAnswer' => array(
					'@type' => 'Answer',
					'text'  => 'Use content generation to consistently publish pages and blog posts built around what your customers are actually searching for, then pair that content with outreach so other sites have a reason to link to it. Rynk automates both steps and publishes directly to your site.',
				),
			),
			array(
				'@type'          => 'Question',
				'name'           => "What's a good SEO audit tool to check my website?",
				'acceptedAnswer' => array(
					'@type' => 'Answer',
					'text'  => "A good SEO audit tool should check your whole site the way a visitor and Google would, flag duplicate or thin pages, and tell you exactly what's missing. Rynk runs this audit automatically and shows you the results before making any changes.",
				),
			),
			array(
				'@type'          => 'Question',
				'name'           => 'How can I improve my Google rankings quickly?',
				'acceptedAnswer' => array(
					'@type' => 'Answer',
					'text'  => 'The fastest wins usually come from fixing technical issues, broken titles, missing meta descriptions, duplicate pages, and publishing content aligned to keywords your customers actually search. Rynk finds and fixes these issues and generates new content in the same automated workflow.',
				),
			),
		),
	);

	echo '<script type="application/ld+json">' . wp_json_encode( $breadcrumb ) . '</script>' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	echo '<script type="application/ld+json">' . wp_json_encode( $faq ) . '</script>' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}
add_action( 'wp_head', 'rynk_content_marketing_schema', 2 );

/**
 * BreadcrumbList structured data for the Pricing page.
 *
 * Pricing has no FAQ section, so unlike the AI SEO guide and content
 * marketing pages this only emits the breadcrumb trail, not a FAQPage block.
 *
 * @return void
 */
function rynk_pricing_schema(): void {
	if ( ! is_page_template( 'page-templates/pricing.php' ) ) {
		return;
	}

	$breadcrumb = array(
		'@context'        => 'https://schema.org',
		'@type'           => 'BreadcrumbList',
		'itemListElement' => array(
			array(
				'@type'    => 'ListItem',
				'position' => 1,
				'name'     => 'Home',
				'item'     => home_url( '/' ),
			),
			array(
				'@type'    => 'ListItem',
				'position' => 2,
				'name'     => 'Pricing',
				'item'     => home_url( '/pricing/' ),
			),
		),
	);

	echo '<script type="application/ld+json">' . wp_json_encode( $breadcrumb ) . '</script>' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}
add_action( 'wp_head', 'rynk_pricing_schema', 2 );

/**
 * BreadcrumbList structured data for the How it Works page.
 *
 * How it Works has its own FAQ section but no dedicated FAQPage schema
 * emitter yet, so — matching the Pricing page — this only emits the
 * breadcrumb trail.
 *
 * @return void
 */
function rynk_how_it_works_schema(): void {
	if ( ! is_page_template( 'page-templates/how-it-works.php' ) ) {
		return;
	}

	$breadcrumb = array(
		'@context'        => 'https://schema.org',
		'@type'           => 'BreadcrumbList',
		'itemListElement' => array(
			array(
				'@type'    => 'ListItem',
				'position' => 1,
				'name'     => 'Home',
				'item'     => home_url( '/' ),
			),
			array(
				'@type'    => 'ListItem',
				'position' => 2,
				'name'     => 'How It Works',
				'item'     => home_url( '/how-it-works/' ),
			),
		),
	);

	echo '<script type="application/ld+json">' . wp_json_encode( $breadcrumb ) . '</script>' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}
add_action( 'wp_head', 'rynk_how_it_works_schema', 2 );

/**
 * HowTo structured data for the How it Works page, mirroring the "Built
 * around four jobs" (Analyze / Generate / Publish / Monitor) section
 * rendered in the template.
 *
 * @return void
 */
function rynk_how_it_works_howto_schema(): void {
	if ( ! is_page_template( 'page-templates/how-it-works.php' ) ) {
		return;
	}

	$howto = array(
		'@context'    => 'https://schema.org',
		'@type'       => 'HowTo',
		'name'        => 'How Rynk Automates Your SEO in 4 Steps',
		'description' => 'Rynk audits your site, fixes technical issues, generates optimized content, and monitors search rankings automatically with no manual intervention.',
		'step'        => array(
			array(
				'@type' => 'HowToStep',
				'name'  => 'Audit Your Site',
				'text'  => 'Rynk performs a full site audit, keyword and competitor analysis, and duplicate content check to identify what is holding back your search visibility.',
			),
			array(
				'@type' => 'HowToStep',
				'name'  => 'Fix and Update',
				'text'  => 'Rynk fixes technical SEO issues like page titles, meta descriptions, broken links, connects pages together, and cleans up duplicate content.',
			),
			array(
				'@type' => 'HowToStep',
				'name'  => 'Generate and Publish',
				'text'  => 'Rynk writes new blogs and pages, creates custom images, and auto-publishes updates directly to your WordPress website.',
			),
			array(
				'@type' => 'HowToStep',
				'name'  => 'Monitor Results',
				'text'  => 'Rynk runs weekly search checks and tracks your rankings, feeding results back into ongoing optimization.',
			),
		),
	);

	echo '<script type="application/ld+json">' . wp_json_encode( $howto ) . '</script>' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}
add_action( 'wp_head', 'rynk_how_it_works_howto_schema', 2 );

/**
 * SoftwareApplication structured data for the landing page, describing Rynk
 * itself and mirroring the tier pricing shown on the Pricing page.
 *
 * @return void
 */
function rynk_software_application_schema(): void {
	if ( ! is_front_page() ) {
		return;
	}

	$software = array(
		'@context'            => 'https://schema.org',
		'@type'               => 'SoftwareApplication',
		'name'                => 'Rynk',
		'applicationCategory' => 'BusinessApplication',
		'applicationSubCategory' => 'SEO Software',
		'operatingSystem'     => 'Web',
		'description'         => 'AI-powered SEO automation platform that audits websites, fixes technical issues, and generates optimized content to increase search visibility on Google and AI platforms like ChatGPT and Perplexity.',
		'offers'              => array(
			array(
				'@type'               => 'Offer',
				'name'                => 'Gold',
				'price'               => '149',
				'priceCurrency'       => 'USD',
				'priceSpecification'  => array(
					'@type'         => 'UnitPriceSpecification',
					'price'         => '149',
					'priceCurrency' => 'USD',
					'unitCode'      => 'MON',
				),
			),
			array(
				'@type'               => 'Offer',
				'name'                => 'Platinum',
				'price'               => '299',
				'priceCurrency'       => 'USD',
				'priceSpecification'  => array(
					'@type'         => 'UnitPriceSpecification',
					'price'         => '299',
					'priceCurrency' => 'USD',
					'unitCode'      => 'MON',
				),
			),
		),
	);

	echo '<script type="application/ld+json">' . wp_json_encode( $software ) . '</script>' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}
add_action( 'wp_head', 'rynk_software_application_schema', 2 );

/**
 * BreadcrumbList structured data for the Privacy Policy page.
 *
 * @return void
 */
function rynk_privacy_policy_schema(): void {
	if ( ! is_page_template( 'page-templates/privacy-policy.php' ) ) {
		return;
	}

	$breadcrumb = array(
		'@context'        => 'https://schema.org',
		'@type'           => 'BreadcrumbList',
		'itemListElement' => array(
			array(
				'@type'    => 'ListItem',
				'position' => 1,
				'name'     => 'Home',
				'item'     => home_url( '/' ),
			),
			array(
				'@type'    => 'ListItem',
				'position' => 2,
				'name'     => 'Privacy Policy',
				'item'     => home_url( '/privacy-policy/' ),
			),
		),
	);

	echo '<script type="application/ld+json">' . wp_json_encode( $breadcrumb ) . '</script>' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}
add_action( 'wp_head', 'rynk_privacy_policy_schema', 2 );

/**
 * BreadcrumbList structured data for the default WordPress "Hello World"
 * sample post.
 *
 * `rynk_legacy_redirects()` below 301s this URL to the home page, so this
 * schema is effectively dormant on the live site; it's kept in sync with the
 * other schema emitters here in case the redirect is ever relaxed for a
 * specific environment.
 *
 * @return void
 */
function rynk_hello_world_schema(): void {
	if ( ! is_singular( 'post' ) || 'hello-world' !== get_post_field( 'post_name', get_queried_object_id() ) ) {
		return;
	}

	$breadcrumb = array(
		'@context'        => 'https://schema.org',
		'@type'           => 'BreadcrumbList',
		'itemListElement' => array(
			array(
				'@type'    => 'ListItem',
				'position' => 1,
				'name'     => 'Home',
				'item'     => home_url( '/' ),
			),
		),
	);

	echo '<script type="application/ld+json">' . wp_json_encode( $breadcrumb ) . '</script>' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}
add_action( 'wp_head', 'rynk_hello_world_schema', 2 );

/**
 * 301 redirect the default WordPress "Hello World" sample post to the home
 * page. WordPress ships this post on every fresh install; there's no reason
 * for it to be indexable on a four-page marketing site.
 *
 * @return void
 */
function rynk_legacy_redirects(): void {
	if ( is_singular( 'post' ) && 'hello-world' === get_post_field( 'post_name', get_queried_object_id() ) ) {
		wp_safe_redirect( home_url( '/' ), 301 );
		exit;
	}
}
add_action( 'template_redirect', 'rynk_legacy_redirects' );

/**
 * Organization structured data — sitewide, describing Rynk itself. Anchors
 * the site's other schema (SoftwareApplication, BreadcrumbList, FAQPage) to
 * a single canonical entity for search engines and AI crawlers.
 *
 * @return void
 */
function rynk_organization_schema(): void {
	$organization = array(
		'@context'    => 'https://schema.org',
		'@type'       => 'Organization',
		'name'        => 'Rynk',
		'url'         => home_url( '/' ),
		'description' => 'AI-powered SEO automation platform that audits websites, fixes technical issues, and generates optimized content to increase search visibility and leads.',
	);

	echo '<script type="application/ld+json">' . wp_json_encode( $organization ) . '</script>' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}
add_action( 'wp_head', 'rynk_organization_schema', 2 );

/**
 * WebSite structured data — sitewide, with a SearchAction pointing at the
 * default WordPress search endpoint.
 *
 * @return void
 */
function rynk_website_schema(): void {
	$website = array(
		'@context'        => 'https://schema.org',
		'@type'           => 'WebSite',
		'name'            => 'Rynk',
		'url'             => home_url( '/' ),
		'potentialAction' => array(
			'@type'       => 'SearchAction',
			'target'      => array(
				'@type'       => 'EntryPoint',
				'urlTemplate' => home_url( '/?s={search_term_string}' ),
			),
			'query-input' => 'required name=search_term_string',
		),
	);

	echo '<script type="application/ld+json">' . wp_json_encode( $website ) . '</script>' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}
add_action( 'wp_head', 'rynk_website_schema', 2 );

/**
 * LocalBusiness structured data — sitewide, describing Rynk as a SaaS
 * business alongside the Organization schema above.
 *
 * @return void
 */
function rynk_local_business_schema(): void {
	$local_business = array(
		'@context'       => 'https://schema.org',
		'@type'          => 'LocalBusiness',
		'name'           => 'Rynk',
		'url'            => home_url( '/' ),
		'additionalType' => 'Software / SaaS',
		'description'    => 'AI-powered SEO automation platform that audits websites, fixes technical issues, and generates optimized content to increase search visibility and leads.',
	);

	echo '<script type="application/ld+json">' . wp_json_encode( $local_business ) . '</script>' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}
add_action( 'wp_head', 'rynk_local_business_schema', 2 );

/**
 * Service structured data — sitewide, one Service block per core offering
 * Rynk provides. Each is scoped as a distinct schema.org Service entity
 * provided by the Organization schema above, so search and AI crawlers can
 * resolve exactly what Rynk sells rather than inferring it from prose alone.
 *
 * @return void
 */
function rynk_services_schema(): void {
	$provider = array(
		'@type' => 'Organization',
		'name'  => 'Rynk',
		'url'   => home_url( '/' ),
	);

	$services = array(
		'Website SEO audits',
		'Technical SEO fixes',
		'AI-optimized content generation',
		'Page title and meta description optimization',
	);

	foreach ( $services as $service_name ) {
		$service = array(
			'@context' => 'https://schema.org',
			'@type'    => 'Service',
			'name'     => $service_name,
			'provider' => $provider,
		);

		echo '<script type="application/ld+json">' . wp_json_encode( $service ) . '</script>' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
add_action( 'wp_head', 'rynk_services_schema', 2 );

/**
 * Person structured data for the Rynk founders — sitewide, one Person block
 * per founder so each is a distinct schema.org entity linked to the
 * Organization schema above. Mirrors the founder names surfaced in
 * rynk_founders() on the About page.
 *
 * @return void
 */
function rynk_person_schema(): void {
	$works_for = array(
		'@type' => 'Organization',
		'name'  => 'Rynk',
		'url'   => home_url( '/' ),
	);

	$founders = array( 'Rishik Khandavalli', 'Ashwika Khandavalli' );

	foreach ( $founders as $founder_name ) {
		$person = array(
			'@context' => 'https://schema.org',
			'@type'    => 'Person',
			'name'     => $founder_name,
			'worksFor' => $works_for,
		);

		echo '<script type="application/ld+json">' . wp_json_encode( $person ) . '</script>' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
add_action( 'wp_head', 'rynk_person_schema', 2 );