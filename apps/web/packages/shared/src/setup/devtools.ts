import { useAuthStore } from '../state/useAuthStore';
import { useUIPreferencesStore } from '../state/useUIPreferencesStore';
import { useInactivityStore } from '../state/useInactivityStore';
import { useThemeStore } from '../state/useThemeStore';
import { useLanguageStore } from '../state/useLanguageStore';

/**
 * Exposes Zustand stores on `window.stores` for console debugging.
 * Controlled by STORE_DEVTOOLS env var per portal.
 *
 * Usage in browser console:
 *   stores.auth()          — current auth state
 *   stores.uiPreferences() — current UI preferences state
 *   stores.inactivity()    — current inactivity state
 *   stores.theme()         — current theme state
 *   stores.language()      — current language state
 */
export function mountStoreDevtools() {
  (window as unknown as Record<string, unknown>).stores = {
    auth: () => useAuthStore.getState(),
    uiPreferences: () => useUIPreferencesStore.getState(),
    inactivity: () => useInactivityStore.getState(),
    theme: () => useThemeStore.getState(),
    language: () => useLanguageStore.getState(),
  };
}
