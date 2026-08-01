import { onAuthLogout } from './authTransitions';
import { useUIPreferencesStore } from '../state/useUIPreferencesStore';
import { useInactivityStore } from '../state/useInactivityStore';

/** Registers default cleanup callbacks for auth transitions. */
export function registerDefaultAuthCallbacks() {
  onAuthLogout(() => {
    useUIPreferencesStore.getState().removeSidebarPreference();
    useInactivityStore.getState().clear();
  });
}
