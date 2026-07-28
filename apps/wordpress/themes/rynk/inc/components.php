<?php
/**
 * Repeated card components.
 *
 * Ports of the small function components the Next.js pages declared beside
 * their default export — `ActionCard` and `OfferingTile` from the landing
 * page, `OutcomeCard` from how-it-works. They live here rather than inside
 * the templates so a template file can never redeclare them.
 *
 * @package rynk-ai
 */

declare( strict_types = 1 );

/**
 * Floating hero chip.
 *
 * Lives inside a structured column (no absolute positioning) so cards stack
 * cleanly at every viewport width. The bob animation delay is passed per card
 * so the group breathes out of sync.
 *
 * @param array<string, string> $card  One entry from rynk_hero_cards().
 * @param string                $delay CSS animation-delay, e.g. `1.3s`.
 * @return void
 */
function rynk_action_card( array $card, string $delay ): void {
	$s = rynk_card_styles()[ $card['tint'] ];
	?>
	<div class="relative animate-bob" style="animation-delay: <?php echo esc_attr( $delay ); ?>;">
		<?php // Colored ambient glow behind the card. ?>
		<div
			aria-hidden="true"
			class="<?php echo esc_attr( 'pointer-events-none absolute -inset-4 rounded-3xl ' . $s['ambient'] . ' blur-2xl opacity-70' ); ?>"
		></div>

		<div class="<?php echo esc_attr( 'relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-ink2/95 to-brand-surface/95 backdrop-blur-md ring-1 ' . $s['ring'] . ' ' . $s['glow'] ); ?>">
			<?php // Top accent bar. ?>
			<div class="<?php echo esc_attr( 'h-[2px] w-full ' . $s['topBar'] ); ?>" aria-hidden="true"></div>

			<div class="flex items-center gap-3 px-3.5 pt-3">
				<div class="<?php echo esc_attr( 'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ' . $s['iconBg'] . ' shadow-[0_6px_14px_-4px_rgba(0,0,0,0.5)]' ); ?>">
					<?php echo rynk_icon( $card['icon'], 'h-[18px] w-[18px] ' . $s['iconText'], 2.2 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</div>
				<div class="flex-1 min-w-0">
					<div class="font-serif text-[18px] leading-tight text-brand-text truncate">
						<?php echo esc_html( $card['label'] ); ?>
					</div>
					<div class="font-mono text-[10px] text-brand-textMute truncate"><?php echo esc_html( $card['target'] ); ?></div>
				</div>
			</div>
			<div class="mt-2.5 flex items-center gap-1.5 border-t border-white/8 bg-black/15 px-3.5 py-2">
				<span class="<?php echo esc_attr( trim( 'h-1.5 w-1.5 rounded-full ' . rynk_status_color( $card['status'] ) ) ); ?>"></span>
				<span class="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-textMute">
					<?php echo esc_html( $card['status'] ); ?>
				</span>
			</div>
		</div>
	</div>
	<?php
}

/**
 * Equal-sized offering card with icon, title and description always visible.
 *
 * Shares the rynk_card_styles() palette with the hero action cards so the
 * whole page has one consistent accent language.
 *
 * @param array<string, string> $item One entry from rynk_offerings().
 * @return void
 */
function rynk_offering_tile( array $item ): void {
	$s = rynk_card_styles()[ $item['tint'] ];
	?>
	<div class="<?php echo esc_attr( 'group relative overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ' . $s['ring'] . ' p-5 transition-all duration-300 hover:-translate-y-1' ); ?>">
		<div class="<?php echo esc_attr( 'absolute inset-x-0 top-0 h-[2px] ' . $s['topBar'] ); ?>" aria-hidden="true"></div>
		<div
			aria-hidden="true"
			class="<?php echo esc_attr( 'pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full ' . $s['ambient'] . ' blur-2xl opacity-60 transition-opacity duration-500 group-hover:opacity-100' ); ?>"
		></div>

		<div class="relative">
			<div class="<?php echo esc_attr( 'inline-flex h-11 w-11 items-center justify-center rounded-xl ' . $s['iconBg'] . ' shadow-[0_6px_16px_-4px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105' ); ?>">
				<?php echo rynk_icon( $item['icon'], 'h-5 w-5 ' . $s['iconText'], 2.2 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</div>
			<div class="mt-4 font-serif text-[18px] font-medium leading-tight tracking-tight text-brand-text">
				<?php echo esc_html( $item['label'] ); ?>
			</div>
			<p class="mt-2 text-[13px] leading-relaxed text-brand-textMute">
				<?php echo esc_html( $item['description'] ); ?>
			</p>
		</div>
	</div>
	<?php
}

/**
 * How-it-works outcome card.
 *
 * @param array<string, string> $outcome One entry from rynk_outcomes().
 * @return void
 */
function rynk_outcome_card( array $outcome ): void {
	$s = rynk_tint_styles()[ $outcome['tint'] ];
	?>
	<div class="<?php echo esc_attr( 'group relative overflow-hidden rounded-2xl bg-white/[0.03] ring-1 ' . $s['ring'] . ' p-6 transition-all duration-300 hover:-translate-y-1' ); ?>">
		<div class="<?php echo esc_attr( 'absolute inset-x-0 top-0 h-[2px] ' . $s['topBar'] ); ?>" aria-hidden="true"></div>
		<div
			aria-hidden="true"
			class="<?php echo esc_attr( 'pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full ' . $s['ambient'] . ' blur-2xl opacity-60 transition-opacity duration-500 group-hover:opacity-100' ); ?>"
		></div>

		<div class="relative">
			<div class="<?php echo esc_attr( 'inline-flex h-11 w-11 items-center justify-center rounded-xl ' . $s['iconBg'] . ' shadow-[0_6px_16px_-4px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105' ); ?>">
				<?php echo rynk_icon( $outcome['icon'], 'h-5 w-5 ' . $s['iconText'], 2.2 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</div>
			<div class="mt-4 font-serif text-[19px] font-medium leading-tight tracking-tight text-brand-text">
				<?php echo esc_html( $outcome['title'] ); ?>
			</div>
			<p class="mt-2 text-[13.5px] leading-relaxed text-brand-textMute">
				<?php echo esc_html( $outcome['body'] ); ?>
			</p>
		</div>
	</div>
	<?php
}
