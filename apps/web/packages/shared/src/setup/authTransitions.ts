import { useAuthStore } from '../state/useAuthStore';

type AuthTransitionCallback = () => void;

const onLogoutCallbacks = new Set<AuthTransitionCallback>();
const onLoginCallbacks = new Set<AuthTransitionCallback>();
let registered = false;

/**
 * Register a callback to run when the user logs out (authData → null).
 * Duplicate registrations are ignored. Can be called before or after
 * registerAuthTransitions().
 */
export function onAuthLogout(cb: AuthTransitionCallback) {
  onLogoutCallbacks.add(cb);
}

/**
 * Register a callback to run when the user logs in (null → authData).
 * Duplicate registrations are ignored. Can be called before or after
 * registerAuthTransitions().
 */
export function onAuthLogin(cb: AuthTransitionCallback) {
  onLoginCallbacks.add(cb);
}

/**
 * Activates auth state transition listeners.
 *
 * Watches for authData changes and fires registered callbacks regardless
 * of how the transition was triggered (direct logout, cross-tab
 * rehydration, token exchange failure, etc.).
 *
 * Call once at app startup (e.g. in App.tsx). Idempotent.
 */
export function registerAuthTransitions() {
  if (registered) return;
  registered = true;

  useAuthStore.subscribe((state, prev) => {
    if (prev.authData && !state.authData) {
      for (const cb of onLogoutCallbacks) cb();
    }
    if (!prev.authData && state.authData) {
      for (const cb of onLoginCallbacks) cb();
    }
  });
}
