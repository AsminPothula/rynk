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
 * Emit a canonical <link> tag for the author archive, pointing to the
 * homepage until real author pages with actual posts exist.
 *
 * @return void
 */
function rynk_author_canonical(): void {
	if ( ! is_author() ) {
		return;
	}
	printf(
		'<link rel="canonical" href="%s" />' . "\n",
		esc_url( 'https://rynk.ai/' )
	);
}
add_action( 'wp_head', 'rynk_author_canonical', 1 );

/**
 * Output site-wide structured data (JSON-LD) for Organization, WebSite,
 * LocalBusiness, Person, Service, SoftwareApplication, and FAQPage schema
 * types. Emitted on every page via wp_head so search engines and AI crawlers
 * can index the data regardless of which page they land on.
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
			'description' => "rynk is an AI-powered SEO, AEO and GEO platform that automatically audits a small local business's website, fixes the technical and on-page gaps, and writes and publishes optimized content, so the business gets found on Google and inside AI assistants like ChatGPT, Perplexity and Google's AI Overviews. No SEO knowledge, no agency, no manual work.",
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
			'@context'      => 'https://schema.org',
			'@type'         => 'LocalBusiness',
			'name'          => 'Rynk AI',
			'url'           => 'https://rynk.ai/',
			'additionalType' => 'Software as a Service (SaaS) / AI SEO software',
			'description'   => "rynk is an AI-powered SEO, AEO and GEO platform that automatically audits a small local business's website, fixes the technical and on-page gaps, and writes and publishes optimized content, so the business gets found on Google and inside AI assistants like ChatGPT, Perplexity and Google's AI Overviews. No SEO knowledge, no agency, no manual work.",
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
			'@context' => 'https://schema.org',
			'@type'    => 'Service',
			'name'     => 'AI-Powered SEO Platform',
			'provider' => array(
				'@type' => 'Organization',
				'name'  => 'Rynk AI',
				'url'   => 'https://rynk.ai/',
			),
			'description' => 'Rynk provides an end-to-end AI-powered SEO platform including automated site audits, technical SEO fixes applied directly to your website, on-page optimization (meta titles, descriptions, headings, internal linking), structured data and schema markup, AI content generation and publishing, and Answer Engine Optimization (AEO) to get your business cited in ChatGPT, Perplexity, and Google AI Overviews.',
			'serviceType'  => array(
				'AI-powered SEO audit',
				'Automated technical SEO fixes',
				'On-page optimization',
				'Meta titles and descriptions',
				'Heading optimization',
				'Internal linking',
				'Structured data and schema markup',
				'AI content generation and publishing',
				'Answer Engine Optimization',
				'Generative Engine Optimization',
			),
			'areaServed'   => 'Worldwide',
			'url'          => 'https://rynk.ai/',
		),
		array(
			'@context'           => 'https://schema.org',
			'@type'              => 'SoftwareApplication',
			'name'               => 'Rynk AI',
			'url'                => 'https://rynk.ai/',
			'applicationCategory' => 'BusinessApplication',
			'operatingSystem'    => 'Web',
			'description'        => 'Rynk is an AI-powered SEO, AEO and GEO platform that audits your website, applies technical and on-page fixes automatically, and generates and publishes optimized content so small local businesses get found on Google and inside AI assistants like ChatGPT, Perplexity, and Google AI Overviews.',
			'offers'             => array(
				array(
					'@type'          => 'Offer',
					'name'           => 'Gold',
					'price'          => '149.00',
					'priceCurrency'  => 'USD',
					'billingIncrement' => 'P1M',
					'description'    => 'Automated SEO for small businesses: 5 hyperlocal pages, 5 keyword pages, and 5 page updates every month.',
				),
				array(
					'@type'          => 'Offer',
					'name'           => 'Platinum',
					'price'          => '299.00',
					'priceCurrency'  => 'USD',
					'billingIncrement' => 'P1M',
					'description'    => 'Automated SEO for scaling businesses: 10 hyperlocal pages, 10 keyword pages, and 10 page updates every month plus priority support.',
				),
			),
			'featureList'        => array(
				'AI-powered SEO audit',
				'Automated technical SEO fixes',
				'On-page optimization',
				'Structured data and schema markup',
				'AI content generation and publishing',
				'Answer Engine Optimization',
				'Generative Engine Optimization',
				'Local SEO and Google Business Profile optimization',
				'Keyword research and rank tracking',
				'Continuous monitoring and re-optimization',
			),
			'audience'           => array(
				'@type'        => 'Audience',
				'audienceType' => 'Small local business owners including restaurants, salons, spas, clinics, auto shops, and local service providers',
			),
			'provider'           => array(
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
					'@type' => 'Question',
					'name'  => 'What is AI SEO automation and how can it help my business?',
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'AI SEO automation means software handles every step of improving your search visibility for you, from auditing your site to fixing technical problems to publishing new content. Rynk is an AI SEO automation platform built for small local businesses. Instead of hiring an agency or learning SEO yourself, you connect your site and Rynk does the work automatically, so more customers find you on Google and inside AI assistants like ChatGPT.',
					),
				),
				array(
					'@type' => 'Question',
					'name'  => 'What is an automated SEO platform and how does it work?',
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'An automated SEO platform audits your website, identifies what is holding back your rankings, applies the fixes, and publishes optimized content, all without you doing it manually. Rynk is an automated SEO platform that runs this process on a continuous cycle: it scans your site, deploys technical fixes directly to WordPress, writes and publishes new pages and blog posts, and monitors your rankings every week so results keep improving over time.',
					),
				),
				array(
					'@type' => 'Question',
					'name'  => 'What is automated SEO for small business?',
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'Automated SEO for small business is a done-for-you approach where software replaces the agency or consultant, handling audits, fixes, content, and monitoring on your behalf. Rynk was built specifically for this: it is scoped and priced for a single local business, starting at $149 per month, and requires zero SEO knowledge from the owner. You get the same results an agency delivers, without the cost or the learning curve.',
					),
				),
				array(
					'@type' => 'Question',
					'name'  => 'How do I do SEO for my small business?',
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'SEO for a small business involves fixing technical issues on your site, writing keyword-rich content, optimizing your Google Business Profile, and building credibility signals so search engines trust you. The fastest way to do all of this without hiring an agency is to use a platform like Rynk, which audits your site, applies every fix automatically, and publishes the content your site needs, so you can focus on running your business while Rynk handles the visibility.',
					),
				),
				array(
					'@type' => 'Question',
					'name'  => 'How can I get my business to show up in ChatGPT?',
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'To show up in ChatGPT and other AI assistants, your website needs clear, well-structured content that directly answers questions your customers ask, plus schema markup and credibility signals that AI crawlers can read and quote. Rynk builds all of this for you automatically, including FAQ content, structured data, and AI-readable page formatting, which is called Answer Engine Optimization or AEO. Businesses that use Rynk are continuously optimized to be cited by ChatGPT, Perplexity, Gemini, and Google AI Overviews.',
					),
				),
				array(
					'@type' => 'Question',
					'name'  => 'What is AI search engine optimization?',
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'AI search engine optimization, also called AEO or GEO, is the practice of structuring your website so AI-powered answer engines like ChatGPT, Perplexity, and Google AI Overviews can read, understand, and cite your business in their responses. Unlike traditional SEO which targets ranked links, AI search optimization targets direct citations inside AI-generated answers. Rynk handles both at once, making your site visible on Google search results and inside AI assistant answers, with no manual work required from you.',
					),
				),
				array(
					'@type' => 'Question',
					'name'  => 'What is the best local business SEO software?',
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'The best local business SEO software for a small owner is one that does the work for you, not just reports what is wrong. Rynk is built specifically for local businesses like restaurants, salons, spas, and service providers, and it is the only platform that automates both traditional Google SEO and AI assistant visibility in one tool. Plans start at $149 per month, with no SEO knowledge or agency required.',
					),
				),
				array(
					'@type' => 'Question',
					'name'  => 'How can AI content generation help with my SEO?',
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'AI content generation helps your SEO by producing keyword-targeted blog posts, landing pages, and FAQ content at a pace and volume that would otherwise require a full content team. Rynk uses AI content generation to write and publish pages directly to your WordPress site every month, targeting the exact searches your local customers make. More relevant pages means more opportunities to rank on Google and get cited by AI assistants.',
					),
				),
				array(
					'@type' => 'Question',
					'name'  => 'What is a website optimization tool and do I need one?',
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'A website optimization tool analyzes your site for technical issues, content gaps, and ranking opportunities, then helps you fix them so more customers find you online. If your business is not showing up when locals search for what you offer, yes, you need one. Rynk goes further than a standard website optimization tool by not just identifying problems but automatically applying the fixes and publishing new content, so you see real ranking improvements without touching a line of code.',
					),
				),
				array(
					'@type' => 'Question',
					'name'  => 'How do I rank on Google and AI assistants at the same time?',
					'acceptedAnswer' => array(
						'@type' => 'Answer',
						'text'  => 'Ranking on Google and getting cited by AI assistants requires overlapping but distinct strategies: technical SEO, quality content, structured data, and AI-readable formatting all working together. Most tools focus on only one side. Rynk is built to do both simultaneously, running a continuous optimization cycle that covers technical fixes, on-page content, schema markup, and AEO signals so your business ranks in Google search results and appears in answers from ChatGPT, Perplexity, and Gemini.',
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
add_action( 'wp_head', 'rynk_structured_data', 2 );

/**
 * Output BreadcrumbList structured data for the /author/rynkai/ archive page.
 *
 * WordPress author archives are not templated pages in this theme, so the
 * breadcrumb is emitted via wp_head rather than in a page template.
 *
 * @return void
 */
function rynk_author_breadcrumb_schema(): void {
	if ( ! is_author() ) {
		return;
	}

	$author = get_queried_object();
	if ( ! ( $author instanceof WP_User ) ) {
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
				'name'     => 'Author',
				'item'     => 'https://rynk.ai/author/',
			),
			array(
				'@type'    => 'ListItem',
				'position' => 3,
				'name'     => $author->display_name,
				'item'     => get_author_posts_url( $author->ID ),
			),
		),
	);

	printf(
		'<script type="application/ld+json">%s</script>' . "\n",
		wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT )
	);
}
add_action( 'wp_head', 'rynk_author_breadcrumb_schema', 3 );

/**
 * Programmatically generate robots.txt content via WordPress's robots_txt
 * filter, adding Disallow rules for thin archive and system pages and a
 * Sitemap directive.
 *
 * WordPress generates /robots.txt dynamically when no physical file exists.
 * This filter appends our rules to whatever WordPress already emits.
 *
 * @param string $output  Current robots.txt content.
 * @param bool   $public  Whether the site is set to public.
 * @return string
 */
function rynk_robots_txt( string $output, bool $public ): string {
	if ( ! $public ) {
		return $output;
	}

	$rules  = "\n";
	$rules .= "Disallow: /author/\n";
	$rules .= "Disallow: /category/\n";
	$rules .= "Disallow: /tag/\n";
	$rules .= "Disallow: /wp-admin/\n";
	$rules .= "Disallow: /wp-includes/\n";
	$rules .= "Disallow: /hello-world/\n";
	$rules .= "Disallow: /sample-page/\n";
	$rules .= "Disallow: /sign-in/\n";
	$rules .= "Disallow: /app/\n";
	$rules .= "\nSitemap: https://rynk.ai/sitemap.xml\n";

	return $output . $rules;
}
add_filter( 'robots_txt', 'rynk_robots_txt', 10, 2 );

/**
 * 301-redirect /hello-world/ to the homepage so the default WordPress
 * placeholder post does not waste crawl budget or dilute site quality.
 *
 * @return void
 */
function rynk_redirect_hello_world(): void {
	if ( is_singular() && 'hello-world' === get_post_field( 'post_name', get_queried_object_id() ) ) {
		wp_redirect( home_url( '/' ), 301 );
		exit;
	}
}
add_action( 'template_redirect', 'rynk_redirect_hello_world' );

/**
 * 301-redirect /sample-page/ to the homepage so the default WordPress
 * placeholder page does not waste crawl budget or appear in search results.
 *
 * @return void
 */
function rynk_redirect_sample_page(): void {
	if ( is_page( 'sample-page' ) ) {
		wp_redirect( home_url( '/' ), 301 );
		exit;
	}
}
add_action( 'template_redirect', 'rynk_redirect_sample_page' );

/**
 * 301-redirect /category/uncategorized/ to the homepage so the auto-generated
 * WordPress category archive does not surface thin placeholder content.
 *
 * @return void
 */
function rynk_redirect_uncategorized(): void {
	if ( is_category( 'uncategorized' ) ) {
		wp_redirect( home_url( '/' ), 301 );
		exit;
	}
}
add_action( 'template_redirect', 'rynk_redirect_uncategorized' );

/**
 * Serve /sitemap.xml with a hand-authored XML sitemap covering only the four
 * canonical marketing pages. WordPress's own sitemap (if enabled) is bypassed
 * for this URL so placeholder pages, archives, and sign-in pages are never
 * included.
 *
 * @return void
 */
function rynk_serve_sitemap(): void {
	// Only intercept the exact /sitemap.xml request.
	if ( ! isset( $_SERVER['REQUEST_URI'] ) ) {
		return;
	}
	$uri = strtok( (string) $_SERVER['REQUEST_URI'], '?' );
	if ( '/sitemap.xml' !== $uri ) {
		return;
	}

	$today = gmdate( 'Y-m-d' );

	$pages = array(
		array(
			'loc'        => 'https://rynk.ai/',
			'lastmod'    => $today,
			'changefreq' => 'weekly',
			'priority'   => '1.0',
		),
		array(
			'loc'        => 'https://rynk.ai/how-it-works/',
			'lastmod'    => $today,
			'changefreq' => 'monthly',
			'priority'   => '0.8',
		),
		array(
			'loc'        => 'https://rynk.ai/pricing/',
			'lastmod'    => $today,
			'changefreq' => 'monthly',
			'priority'   => '0.8',
		),
		array(
			'loc'        => 'https://rynk.ai/about/',
			'lastmod'    => $today,
			'changefreq' => 'monthly',
			'priority'   => '0.7',
		),
	);

	header( 'Content-Type: application/xml; charset=UTF-8', true, 200 );
	echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
	echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
	foreach ( $pages as $page ) {
		echo "\t<url>\n";
		echo "\t\t<loc>" . esc_url( $page['loc'] ) . "</loc>\n";
		echo "\t\t<lastmod>" . esc_html( $page['lastmod'] ) . "</lastmod>\n";
		echo "\t\t<changefreq>" . esc_html( $page['changefreq'] ) . "</changefreq>\n";
		echo "\t\t<priority>" . esc_html( $page['priority'] ) . "</priority>\n";
		echo "\t</url>\n";
	}
	echo '</urlset>';
	exit;
}
add_action( 'init', 'rynk_serve_sitemap', 1 );

/**
 * Serve /llms.txt — a plain-text file that gives AI crawlers (ChatGPT,
 * Perplexity, Claude, etc.) accurate context about what Rynk is, who it is
 * for, and where to find the key pages.
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
	echo rynk_llms_txt_content();
	exit;
}
add_action( 'init', 'rynk_serve_llms_txt', 1 );

/**
 * Returns the full text content of /llms.txt.
 *
 * Kept in a separate function so it is easy to update without touching the
 * routing logic above.
 *
 * @return string
 */
function rynk_llms_txt_content(): string {
	return <<<'LLMS'
# Rynk AI — llms.txt

Rynk AI (https://rynk.ai) is an end-to-end AI-powered SEO, AEO (Answer Engine Optimization), and GEO (Generative Engine Optimization) platform built for small and local businesses. It automatically audits a business's website, identifies and fixes technical and on-page SEO problems, generates keyword-targeted and hyperlocal content, and publishes that content directly to the client's WordPress site — with no SEO expertise or manual work required from the business owner. Rynk also optimizes websites to be cited by AI assistants such as ChatGPT, Perplexity, Google AI Overviews, Gemini, and Claude. Plans start at $149 per month.

## Key pages

- Homepage: https://rynk.ai/
- How it works: https://rynk.ai/how-it-works/
- Pricing: https://rynk.ai/pricing/
- About: https://rynk.ai/about/

## Core capabilities

- Automated website SEO audit (technical and on-page)
- Automated technical SEO fixes deployed directly to WordPress
- On-page optimization: meta titles, descriptions, headings, internal linking
- Structured data and schema markup generation
- AI content generation and publishing (blog posts, landing pages, FAQ pages)
- Hyperlocal page creation targeting city- and neighborhood-level searches
- Answer Engine Optimization (AEO) — formatting content to be cited by ChatGPT, Perplexity, and Google AI Overviews
- Generative Engine Optimization (GEO) — entity and credibility signals for AI crawlers
- Keyword research and rank tracking
- Continuous monitoring and re-optimization

## Intended audience

Small and local business owners — restaurants, salons, spas, dental and medical clinics, auto shops, contractors, and other local service providers — who want to be found on Google and inside AI assistants without hiring an SEO agency.

## Company

Rynk.ai, Inc.
16803 Dallas Parkway, Suite 300, Addison TX 75001
Contact: privacy@rynk.ai
Website: https://rynk.ai
LLMS;
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