import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

/**
 * Initializes i18next with the given resources. Call once at module scope
 * in each app, before `initApp()`.
 */
export function initI18n<LType extends string, TType extends object>(
  defaultLanguage: LType,
  resources: { [key in LType]: { translation: TType } },
) {
  i18n.use(initReactI18next).init({
    resources,
    lng: defaultLanguage,
    fallbackLng: defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
  });
}
