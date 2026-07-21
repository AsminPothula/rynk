import { registerAuthTransitions } from './authTransitions';
import { registerDefaultAuthCallbacks } from './defaultAuthCallbacks';
import { registerThemeSideEffect } from './themeSideEffect';
import { registerLanguageSideEffect } from './languageSideEffect';
import { mountStoreDevtools } from './devtools';

interface InitAppOptions {
  storeDevtools?: boolean;
}

let initialized = false;

/**
 * One-time app initialization. Registers auth transition callbacks,
 * activates transition listeners, and optionally mounts store devtools.
 *
 * Call once at module scope in App.tsx. Idempotent.
 */
export function initApp(options: InitAppOptions = {}) {
  if (initialized) return;
  initialized = true;

  registerDefaultAuthCallbacks();
  registerAuthTransitions();
  registerThemeSideEffect();
  registerLanguageSideEffect();
  if (options.storeDevtools) mountStoreDevtools();
}
