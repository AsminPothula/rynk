import { TranslationTypeKeys } from '@/common/locales/en';
import { createUseLanguageTranslation } from 'shared';

export const useLanguageTranslation =
  createUseLanguageTranslation<TranslationTypeKeys>();
