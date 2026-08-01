import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  CacheKey,
  DevtoolsName,
  LanguageAction,
  StoreName,
} from '../common/constant';

interface LanguageState {
  language: string;
  setLanguage: (language: string) => void;
}

export const useLanguageStore = create<LanguageState>()(
  devtools(
    persist(
      (set) =>
        ({
          language: 'en',

          setLanguage: (language) =>
            set({ language }, false, LanguageAction.SetLanguage),
        }) satisfies LanguageState,
      {
        name: CacheKey.LanguagePreference,
      },
    ),
    {
      name: DevtoolsName,
      store: StoreName.Language,
      enabled: import.meta.env.VITE_STORE_DEVTOOLS === 'true',
    },
  ),
);
