import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  CacheKey,
  DevtoolsName,
  StoreName,
  UIPreferencesAction,
} from '../common/constant';

interface UIPreferencesState {
  preferSidebarOpen: boolean;
  savePreferSidebarOpen: (open: boolean) => void;
  removeSidebarPreference: () => void;
}

export const useUIPreferencesStore = create<UIPreferencesState>()(
  devtools(
    persist(
      (set) =>
        ({
          preferSidebarOpen: false,

          savePreferSidebarOpen: (open) =>
            set(
              { preferSidebarOpen: open },
              false,
              UIPreferencesAction.SavePreferSidebarOpen,
            ),

          removeSidebarPreference: () =>
            set(
              { preferSidebarOpen: false },
              false,
              UIPreferencesAction.RemoveSidebarPreference,
            ),
        }) satisfies UIPreferencesState,
      {
        name: CacheKey.PreferSidebarOpen,
      },
    ),
    {
      name: DevtoolsName,
      store: StoreName.UIPreferences,
      enabled: import.meta.env.VITE_STORE_DEVTOOLS === 'true',
    },
  ),
);
