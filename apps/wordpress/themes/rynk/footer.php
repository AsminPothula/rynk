<?php
/**
 * Theme footer — the closing half of `(public)/layout.tsx`.
 *
 * Darker translucent overlay + stronger top hairline for visual separation
 * from the page body.
 *
 * @package rynk-ai
 */

?>
	</main>

	<footer class="relative mt-14 border-t border-white/10 bg-black/15 backdrop-blur-sm">
		<div class="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-6 text-xs text-brand-textMute">
			<span>&copy; rynk.ai 2026</span>
			<div class="flex items-center gap-6">
				<a
					href="<?php echo esc_url( home_url( '/privacy-policy/' ) ); ?>"
					class="transition-colors hover:text-brand-text"
				>
					Privacy Policy
				</a>
				<span class="hidden font-mono tracking-widest sm:inline">SEO . AEO . GEO</span>
			</div>
		</div>
	</footer>
</div>

<?php wp_footer(); ?>
</body>
</html>
