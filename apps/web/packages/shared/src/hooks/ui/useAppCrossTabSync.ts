import { useCrossTabSync } from './useCrossTabSync';
import { useAuthStore } from '../../state/useAuthStore';
import { useInactivityStore } from '../../state/useInactivityStore';
import { useUIPreferencesStore } from '../../state/useUIPreferencesStore';
import { useThemeStore } from '../../state/useThemeStore';
import { useLanguageStore } from '../../state/useLanguageStore';
import { CacheKey } from '../../common/constant';

const ENTRIES = [
  { key: CacheKey.Auth, store: useAuthStore },
  { key: CacheKey.InactivityStore, store: useInactivityStore },
  { key: CacheKey.PreferSidebarOpen, store: useUIPreferencesStore },
  { key: CacheKey.Theme, store: useThemeStore },
  { key: CacheKey.LanguagePreference, store: useLanguageStore },
];

const handleStorageCleared = () => {
  useAuthStore.getState().logout();
};

/** Syncs all persisted Zustand stores across browser tabs via storage events. */
export function useAppCrossTabSync() {
  useCrossTabSync(ENTRIES, handleStorageCleared);
}
