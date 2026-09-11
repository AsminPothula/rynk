import { type LanguageType } from '@/type';
import en, { type TranslationType } from '@/common/locales/en';
import { initI18n } from 'shared';

// English-only for now. We still register a `de` key (required by the
// LanguageType), but point it at the English strings — so any stale stored 'de'
// preference renders English content instead of German.
const resources = {
  en: {
    translation: en,
  },
  de: {
    translation: en,
  },
};
const defaultLang: LanguageType = 'en';

initI18n<LanguageType, TranslationType>(defaultLang, resources);
