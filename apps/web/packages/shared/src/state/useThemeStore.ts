import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  CacheKey,
  DevtoolsName,
  StoreName,
  ThemeAction,
} from '../common/constant';

export type Theme = 'dark' | 'light' | 'system';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      (set) =>
        ({
          theme: 'dark',

          setTheme: (theme) => set({ theme }, false, ThemeAction.SetTheme),
        }) satisfies ThemeState,
      {
        name: CacheKey.Theme,
      },
    ),
    {
      name: DevtoolsName,
      store: StoreName.Theme,
      enabled: import.meta.env.VITE_STORE_DEVTOOLS === 'true',
    },
  ),
);
