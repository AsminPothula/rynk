<?php
/**
 * Tint palettes.
 *
 * Direct ports of the `CARD_STYLES`, `TINT_STYLES`, `FOUNDER_STYLES` and
 * `TIER_STYLES` maps from the Next.js pages. They are kept as separate maps
 * rather than merged, because the originals differ in small ways (ambient
 * opacity, and only the how-it-works map carries a `text` channel) and the
 * class strings need to stay byte-identical for the compiled Tailwind build
 * to contain them.
 *
 * @package rynk-ai
 */

declare( strict_types = 1 );

/**
 * Landing-page palette — hero action cards + offering tiles.
 *
 * @return array<string, array<string, string>>
 */
function rynk_card_styles(): array {
	return array(
		'blue'      => array(
			'ring'     => 'ring-brand-blue/40',
			'glow'     => 'shadow-[0_18px_50px_-15px_rgba(109,141,255,0.55),0_0_0_1px_rgba(109,141,255,0.15)_inset]',
			'iconBg'   => 'bg-gradient-to-br from-[#8fa8ff] to-[#4b6bef]',
			'iconText' => 'text-white',
			'topBar'   => 'bg-gradient-to-r from-transparent via-brand-blue to-transparent',
			'ambient'  => 'bg-brand-blue/25',
		),
		'violet'    => array(
			'ring'     => 'ring-brand-violet/45',
			'glow'     => 'shadow-[0_18px_50px_-15px_rgba(156,140,240,0.55),0_0_0_1px_rgba(156,140,240,0.18)_inset]',
			'iconBg'   => 'bg-gradient-to-br from-[#c4b8ff] to-[#7a68d8]',
			'iconText' => 'text-white',
			'topBar'   => 'bg-gradient-to-r from-transparent via-brand-violet to-transparent',
			'ambient'  => 'bg-brand-violet/30',
		),
		'sky'       => array(
			'ring'     => 'ring-brand-sky/50',
			'glow'     => 'shadow-[0_18px_50px_-15px_rgba(201,213,255,0.4),0_0_0_1px_rgba(201,213,255,0.2)_inset]',
			'iconBg'   => 'bg-gradient-to-br from-[#e6ecff] to-[#7d94d8]',
			'iconText' => 'text-brand-ink',
			'topBar'   => 'bg-gradient-to-r from-transparent via-brand-sky to-transparent',
			'ambient'  => 'bg-brand-sky/25',
		),
		'highlight' => array(
			'ring'     => 'ring-brand-highlight/45',
			'glow'     => 'shadow-[0_18px_50px_-15px_rgba(247,160,114,0.5),0_0_0_1px_rgba(247,160,114,0.2)_inset]',
			'iconBg'   => 'bg-gradient-to-br from-[#ffc59a] to-[#e07648]',
			'iconText' => 'text-white',
			'topBar'   => 'bg-gradient-to-r from-transparent via-brand-highlight to-transparent',
			'ambient'  => 'bg-brand-highlight/25',
		),
		'emerald'   => array(
			'ring'     => 'ring-brand-emerald/45',
			'glow'     => 'shadow-[0_18px_50px_-15px_rgba(52,211,153,0.55),0_0_0_1px_rgba(52,211,153,0.2)_inset]',
			'iconBg'   => 'bg-gradient-to-br from-[#6ee7b7] to-[#059669]',
			'iconText' => 'text-white',
			'topBar'   => 'bg-gradient-to-r from-transparent via-brand-emerald to-transparent',
			'ambient'  => 'bg-brand-emerald/25',
		),
		'pink'      => array(
			'ring'     => 'ring-brand-pink/45',
			'glow'     => 'shadow-[0_18px_50px_-15px_rgba(244,114,182,0.55),0_0_0_1px_rgba(244,114,182,0.2)_inset]',
			'iconBg'   => 'bg-gradient-to-br from-[#f9a8d4] to-[#db2777]',
			'iconText' => 'text-white',
			'topBar'   => 'bg-gradient-to-r from-transparent via-brand-pink to-transparent',
			'ambient'  => 'bg-brand-pink/25',
		),
		'amber'     => array(
			'ring'     => 'ring-brand-amber/50',
			'glow'     => 'shadow-[0_18px_50px_-15px_rgba(251,191,36,0.55),0_0_0_1px_rgba(251,191,36,0.2)_inset]',
			'iconBg'   => 'bg-gradient-to-br from-[#fcd34d] to-[#d97706]',
			'iconText' => 'text-white',
			'topBar'   => 'bg-gradient-to-r from-transparent via-brand-amber to-transparent',
			'ambient'  => 'bg-brand-amber/22',
		),
		'cyan'      => array(
			'ring'     => 'ring-brand-cyan/50',
			'glow'     => 'shadow-[0_18px_50px_-15px_rgba(34,211,238,0.55),0_0_0_1px_rgba(34,211,238,0.2)_inset]',
			'iconBg'   => 'bg-gradient-to-br from-[#67e8f9] to-[#0891b2]',
			'iconText' => 'text-white',
			'topBar'   => 'bg-gradient-to-r from-transparent via-brand-cyan to-transparent',
			'ambient'  => 'bg-brand-cyan/25',
		),
	);
}

/**
 * Status-dot colors for the hero action cards.
 *
 * Note: the hero cards in the source carry descriptive statuses that are not
 * keys in this map, so the original renders those dots with no background —
 * that behaviour is preserved by returning an empty string for a miss.
 *
 * @param string $status Status label.
 * @return string Tailwind classes.
 */
function rynk_status_color( string $status ): string {
	$map = array(
		'shipped'   => 'bg-brand-blueSoft shadow-[0_0_8px_rgba(143,168,255,0.7)]',
		'in review' => 'bg-brand-violetSoft shadow-[0_0_8px_rgba(196,184,255,0.7)]',
		'queued'    => 'bg-brand-highlight shadow-[0_0_8px_rgba(247,160,114,0.7)]',
	);

	return $map[ $status ] ?? '';
}

/**
 * How-it-works palette — adds a `text` channel for the job headings.
 *
 * @return array<string, array<string, string>>
 */
function rynk_tint_styles(): array {
	return array(
		'blue'      => array(
			'ring'     => 'ring-brand-blue/40',
			'iconBg'   => 'bg-gradient-to-br from-[#8fa8ff] to-[#4b6bef]',
			'iconText' => 'text-white',
			'topBar'   => 'bg-gradient-to-r from-transparent via-brand-blue to-transparent',
			'ambient'  => 'bg-brand-blue/22',
			'text'     => 'text-brand-blueSoft',
		),
		'violet'    => array(
			'ring'     => 'ring-brand-violet/45',
			'iconBg'   => 'bg-gradient-to-br from-[#c4b8ff] to-[#7a68d8]',
			'iconText' => 'text-white',
			'topBar'   => 'bg-gradient-to-r from-transparent via-brand-violet to-transparent',
			'ambient'  => 'bg-brand-violet/25',
			'text'     => 'text-brand-violetSoft',
		),
		'sky'       => array(
			'ring'     => 'ring-brand-sky/50',
			'iconBg'   => 'bg-gradient-to-br from-[#e6ecff] to-[#7d94d8]',
			'iconText' => 'text-brand-ink',
			'topBar'   => 'bg-gradient-to-r from-transparent via-brand-sky to-transparent',
			'ambient'  => 'bg-brand-sky/22',
			'text'     => 'text-brand-sky',
		),
		'highlight' => array(
			'ring'     => 'ring-brand-highlight/45',
			'iconBg'   => 'bg-gradient-to-br from-[#ffc59a] to-[#e07648]',
			'iconText' => 'text-white',
			'topBar'   => 'bg-gradient-to-r from-transparent via-brand-highlight to-transparent',
			'ambient'  => 'bg-brand-highlight/22',
			'text'     => 'text-brand-highlight',
		),
		'emerald'   => array(
			'ring'     => 'ring-brand-emerald/45',
			'iconBg'   => 'bg-gradient-to-br from-[#6ee7b7] to-[#059669]',
			'iconText' => 'text-white',
			'topBar'   => 'bg-gradient-to-r from-transparent via-brand-emerald to-transparent',
			'ambient'  => 'bg-brand-emerald/22',
			'text'     => 'text-brand-emeraldSoft',
		),
		'pink'      => array(
			'ring'     => 'ring-brand-pink/45',
			'iconBg'   => 'bg-gradient-to-br from-[#f9a8d4] to-[#db2777]',
			'iconText' => 'text-white',
			'topBar'   => 'bg-gradient-to-r from-transparent via-brand-pink to-transparent',
			'ambient'  => 'bg-brand-pink/22',
			'text'     => 'text-brand-pinkSoft',
		),
		'amber'     => array(
			'ring'     => 'ring-brand-amber/50',
			'iconBg'   => 'bg-gradient-to-br from-[#fcd34d] to-[#d97706]',
			'iconText' => 'text-white',
			'topBar'   => 'bg-gradient-to-r from-transparent via-brand-amber to-transparent',
			'ambient'  => 'bg-brand-amber/20',
			'text'     => 'text-brand-amberSoft',
		),
		'cyan'      => array(
			'ring'     => 'ring-brand-cyan/50',
			'iconBg'   => 'bg-gradient-to-br from-[#67e8f9] to-[#0891b2]',
			'iconText' => 'text-white',
			'topBar'   => 'bg-gradient-to-r from-transparent via-brand-cyan to-transparent',
			'ambient'  => 'bg-brand-cyan/22',
			'text'     => 'text-brand-cyanSoft',
		),
	);
}

/**
 * About-page founder card palette.
 *
 * @return array<string, array<string, string>>
 */
function rynk_founder_styles(): array {
	return array(
		'blue' => array(
			'ring'    => 'ring-brand-blue/40',
			'topBar'  => 'bg-gradient-to-r from-transparent via-brand-blue to-transparent',
			'ambient' => 'bg-brand-blue/20',
			'role'    => 'text-brand-blueSoft',
		),
		'pink' => array(
			'ring'    => 'ring-brand-pink/40',
			'topBar'  => 'bg-gradient-to-r from-transparent via-brand-pink to-transparent',
			'ambient' => 'bg-brand-pink/20',
			'role'    => 'text-brand-pinkSoft',
		),
		'violet' => array(
			'ring'    => 'ring-brand-violet/40',
			'topBar'  => 'bg-gradient-to-r from-transparent via-brand-violet to-transparent',
			'ambient' => 'bg-brand-violet/20',
			'role'    => 'text-brand-violetSoft',
		),
		'emerald' => array(
			'ring'    => 'ring-brand-emerald/40',
			'topBar'  => 'bg-gradient-to-r from-transparent via-brand-emerald to-transparent',
			'ambient' => 'bg-brand-emerald/20',
			'role'    => 'text-brand-emeraldSoft',
		),
	);
}

/**
 * Pricing-tier palette.
 *
 * @return array<string, array<string, string>>
 */
function rynk_tier_styles(): array {
	return array(
		'emerald' => array(
			'ring'    => 'ring-brand-emerald/40',
			'topBar'  => 'bg-gradient-to-r from-transparent via-brand-emerald to-transparent',
			'check'   => 'text-brand-emeraldSoft',
			'price'   => 'text-brand-emeraldSoft',
			'ambient' => 'bg-brand-emerald/18',
		),
		'violet'  => array(
			'ring'    => 'ring-brand-violet/50',
			'topBar'  => 'bg-gradient-to-r from-transparent via-brand-violet to-transparent',
			'check'   => 'text-brand-violetSoft',
			'price'   => 'text-brand-violetSoft',
			'ambient' => 'bg-brand-violet/22',
		),
		'cyan'    => array(
			'ring'    => 'ring-brand-cyan/40',
			'topBar'  => 'bg-gradient-to-r from-transparent via-brand-cyan to-transparent',
			'check'   => 'text-brand-cyanSoft',
			'price'   => 'text-brand-cyanSoft',
			'ambient' => 'bg-brand-cyan/18',
		),
	);
}
