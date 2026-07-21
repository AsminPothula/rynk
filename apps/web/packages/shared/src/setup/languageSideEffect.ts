import i18n from 'i18next';
import { useLanguageStore } from '../state/useLanguageStore';

export function registerLanguageSideEffect() {
  // Sync i18n with stored language on startup
  const stored = useLanguageStore.getState().language;
  if (i18n.language !== stored) {
    i18n.changeLanguage(stored);
  }

  // React to future changes
  useLanguageStore.subscribe((state, prev) => {
    if (state.language !== prev.language) {
      i18n.changeLanguage(state.language);
    }
  });
}
