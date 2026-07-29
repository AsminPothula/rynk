<?php
/**
 * Page content.
 *
 * Straight ports of the module-level constants from the four Next.js pages —
 * OFFERINGS / PLATFORMS / HERO_CARDS (landing), OUTCOMES / JOBS
 * (how-it-works), TIERS (pricing) and FOUNDERS (about). Cards that were
 * commented out in the source are omitted here for the same reason they
 * were omitted there: they do not render.
 *
 * Keeping copy in one file means editing text never means touching markup.
 *
 * @package rynk-ai
 */

declare( strict_types = 1 );

/**
 * Landing page — "What you get" offering tiles.
 *
 * @return array<int, array<string, string>>
 */
function rynk_offerings(): array {
	return array(
		array(
			'label'       => 'Better Website Text',
			'description' => 'We rewrite titles and descriptions so your pages come up when customers hit "search."',
			'icon'        => 'type',
			'tint'        => 'emerald',
		),
		array(
			'label'       => 'AI Readability',
			'description' => 'We reformat your pages so AI tools can describe your business accurately to customers.',
			'icon'        => 'braces',
			'tint'        => 'pink',
		),
		array(
			'label'       => 'Cleanup',
			'description' => 'We fix duplicate pages so that customers always find you where you expect them to.',
			'icon'        => 'repeat-2',
			'tint'        => 'amber',
		),
		array(
			'label'       => 'Page Connections',
			'description' => 'We connect your webpages to each other so Google easily finds relevant content.',
			'icon'        => 'link-2',
			'tint'        => 'cyan',
		),
		array(
			'label'       => 'New Pages',
			'description' => 'We build brand-new web pages for you based on what your site is missing.',
			'icon'        => 'file-plus-2',
			'tint'        => 'highlight',
		),
		array(
			'label'       => 'Custom images',
			'description' => 'We create polished images for every page, so Google knows your site is professional.',
			'icon'        => 'image',
			'tint'        => 'violet',
		),
		array(
			'label'       => 'Outreach Emails',
			'description' => 'We draft emails to other sites, asking them to include your business name on their website.',
			'icon'        => 'mail',
			'tint'        => 'blue',
		),
		array(
			'label'       => 'Social Media Posts',
			'description' => 'We draft LinkedIn, Reddit and Threads posts, so AI tools are more likely to mention you.',
			'icon'        => 'message-square',
			'tint'        => 'pink',
		),
		array(
			'label'       => 'Credibility Signals',
			'description' => 'We create reports that mention your business, increasing the chance AI references you.',
			'icon'        => 'book-open',
			'tint'        => 'sky',
		),
		array(
			'label'       => 'GitHub Fixes',
			'description' => 'If your site is custom-built, we write down developer-friendly SEO improvement suggestions.',
			'icon'        => 'git-pull-request',
			'tint'        => 'emerald',
		),
	);
}

/**
 * Landing page — trust-bar marquee names.
 *
 * @return array<int, string>
 */
function rynk_platforms(): array {
	return array(
		'Google',
		'ChatGPT',
		'Perplexity',
		'Claude',
		'Gemini',
		'AI Overview',
		'Bing',
		'Copilot',
		'DuckDuckGo',
	);
}

/**
 * Landing page — hero action cards.
 *
 * @return array<int, array<string, string>>
 */
function rynk_hero_cards(): array {
	return array(
		array(
			'icon'   => 'type',
			'tint'   => 'emerald',
			'label'  => 'Scans Your Site',
			'target' => '',
			'status' => 'Understand your site',
		),
		array(
			'icon'   => 'braces',
			'tint'   => 'pink',
			'label'  => 'Analyzes Competitors',
			'target' => '',
			'status' => 'Find what works in your industry',
		),
		array(
			'icon'   => 'link-2',
			'tint'   => 'cyan',
			'label'  => 'Updates Your Website',
			'target' => '',
			'status' => 'Changes Created For You',
		),
		array(
			'icon'   => 'file-plus-2',
			'tint'   => 'highlight',
			'label'  => 'Monitors the Results',
			'target' => '',
			'status' => 'See Rynk work and keep improving',
		),
	);
}

/**
 * How-it-works — "What you get" outcome cards.
 *
 * @return array<int, array<string, string>>
 */
function rynk_outcomes(): array {
	return array(
		array(
			'icon'  => 'trending-up',
			'title' => 'Higher rankings',
			'body'  => 'More of your pages on page one for the keywords your customers actually search.',
			'tint'  => 'emerald',
		),
		array(
			'icon'  => 'sparkles',
			'title' => 'More AI citations',
			'body'  => 'The trust signals ChatGPT, Perplexity, and Google AI Overview look for, continuously built.',
			'tint'  => 'violet',
		),
		array(
			'icon'  => 'rocket',
			'title' => 'Fixes shipped for you',
			'body'  => 'Rynk ships meta, schema, pages, links, images, and code changes directly to your site.',
			'tint'  => 'pink',
		),
	);
}

/**
 * How-it-works — the four pipeline jobs and their capability cards.
 *
 * @return array<int, array<string, mixed>>
 */
function rynk_jobs(): array {
	return array(
		array(
			'n'     => '1',
			'name'  => 'Analyze',
			'tint'  => 'emerald',
			'intro' => 'Crawl, score, and benchmark - Rynk understands the site as deeply as a human auditor.',
			'cards' => array(
				array(
					'title' => 'Full Site Scan',
					'body'  => 'We go through every page of your website — just like a visitor or Google would — to see what\'s working and what\'s missing.',
				),
				array(
					'title' => 'Keyword Insights',
					'body'  => 'We find out what people are searching for, how hard it is to rank for, and how you compare to your competitors.',
				),
				array(
					'title' => 'Duplicate Content Check',
					'body'  => 'We find pages on your site that are competing with each other and fix it so the right one shows up in search.',
				),
			),
		),
		array(
			'n'     => '2',
			'name'  => 'Generate',
			'tint'  => 'amber',
			'intro' => 'Eleven generators produce every change rynk plans - typed, validated, traceable.',
			'cards' => array(
				array(
					'title' => 'Site Updates',
					'body'  => 'We write the behind-the-scenes fixes your website needs — like updated page titles, working links, and consistent business info — ready to go live.',
				),
				array(
					'title' => 'New Web Pages',
					'body'  => 'We write full pages for your site, from the main content down to the small details that help you get found in search.',
				),
				array(
					'title' => 'Photos & Graphics',
					'body'  => 'We create the images your site and posts need — banners, simple graphics, and thumbnails — sized and labeled correctly.',
				),
			),
		),
		array(
			'n'     => '3',
			'name'  => 'Publish',
			'tint'  => 'pink',
			'intro' => 'Every action is dispatched to the right service - WordPress, GitHub, image generation, document rendering.',
			'cards' => array(
				array(
					'title' => 'Website Publishing',
					'body'  => 'If your site runs on WordPress, we publish updates directly — no need to copy and paste anything yourself.',
				),
				array(
					'title' => 'Image Publishing',
					'body'  => 'New images are automatically attached to the right page or post — no extra steps for you.',
				),
				array(
					'title' => 'See What\'s Done',
					'body'  => 'You can always check what\'s been published, what\'s waiting on you, and what\'s in progress.',
				),
			),
		),
		array(
			'n'     => '4',
			'name'  => 'Monitor',
			'tint'  => 'highlight',
			'intro' => 'Search shifts every week. Rynk watches the results and feeds what changed back into the plan.',
			'cards' => array(
				array(
					'title' => 'Weekly Search Check',
					'body'  => 'Every week, we check how the top results look for your key searches — so we catch changes before they cost you customers.',
				),
				array(
					'title' => 'Ranking Tracker',
					'body'  => 'See exactly where you stand — on Google and on AI tools — for every search that matters to your business.',
				),
				array(
					'title' => 'Competitor Watch',
					'body'  => 'If a competitor jumps ahead of you, we notice right away and adjust your plan to help you catch up.',
				),
			),
		),
	);
}

/**
 * Pricing — the tiers.
 *
 * Each tier renders as two feature columns: `columns[0]` is what the plan
 * includes, `columns[1]` is the per-month page allowance.
 *
 * @return array<int, array<string, mixed>>
 */
function rynk_tiers(): array {
	return array(
		array(
			'name'    => 'Gold',
			'price'   => '$149',
			'cadence' => '/ month',
			'target'  => 'For small businesses',
			'columns' => array(
				array(
					'label'    => 'Includes:',
					'features' => array(
						'Automatic WordPress website updates',
						'Monthly performance tracking',
						'See how you rank against your competitors',
					),
				),
				array(
					'label'    => 'Every month:',
					'features' => array(
						'5 hyperlocal pages / month',
						'5 target keyword pages / month',
						'5 pages updated / month',
					),
				),
			),
			'cta'     => 'Get Gold',
			'href'    => '/sign-in',
			'accent'  => true,
			'badge'   => '',
			'tint'    => 'amber',
		),
		array(
			'name'    => 'Platinum',
			'price'   => '$299',
			'cadence' => '/ month',
			'target'  => 'For scaling businesses',
			'columns' => array(
				array(
					'label'    => 'Includes:',
					'features' => array(
						'Automatic updates to WordPress website',
						'See how you rank against your competitors',
						'Bi-weekly performance tracking',
						'Priority support',
					),
				),
				array(
					'label'    => 'Every month:',
					'features' => array(
						'10 hyperlocal pages / month',
						'10 target keyword pages / month',
						'10 pages updated / month',
					),
				),
			),
			'cta'     => 'Get Platinum',
			'href'    => '/sign-in',
			'accent'  => true,
			'badge'   => 'Most teams pick this',
			'tint'    => 'violet',
		),
	);
}

/**
 * About — the founders.
 *
 * @return array<int, array<string, string>>
 */
function rynk_founders(): array {
	return array(
		array(
			'name'  => 'Rishik Khandavalli',
			'role'  => 'Co-Founder',
			'bio'   => 'Rishik Khandavalli is a student at Greenhill School (Class of 2027) and leader of a $340K+ student-managed investment portfolio. He focuses on equity research, sector analysis, and business analytics.',
			'tint'  => 'blue',
			'image' => 'rk.png',
		),
		array(
			'name'  => 'Ashwika Khandavalli',
			'role'  => 'Co-Founder',
			'bio'   => 'Ashwika Khandavalli is driven by a passion for entrepreneurship and community impact. She leads product strategy and go-to-market at Rynk — covering competitive positioning, pricing, and client segmentation across the SEO and AI-visibility space.',
			'tint'  => 'pink',
			'image' => 'ak.png',
		),
	);
}
