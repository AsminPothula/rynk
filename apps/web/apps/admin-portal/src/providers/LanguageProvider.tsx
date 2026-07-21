import { type LanguageType } from '@/type';
import en, { type TranslationType } from '@/common/locales/en';
import de from '@/common/locales/de';
import { initI18n } from 'shared';

const resources = {
  en: {
    translation: en,
  },
  de: {
    translation: de,
  },
};
const defaultLang: LanguageType = 'en';

initI18n<LanguageType, TranslationType>(defaultLang, resources);
