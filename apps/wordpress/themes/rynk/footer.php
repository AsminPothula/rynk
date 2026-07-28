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
			<span class="font-mono tracking-widest">SEO . AEO . GEO</span>
		</div>
	</footer>
</div>

<?php wp_footer(); ?>
</body>
</html>
