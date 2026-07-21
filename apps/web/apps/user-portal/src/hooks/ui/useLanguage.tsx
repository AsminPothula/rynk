import { useLanguageStore } from 'shared';

export const useLanguage = () => {
  const language = useLanguageStore((s) => s.language);
  const changeLanguage = useLanguageStore((s) => s.setLanguage);
  return { language, changeLanguage };
};
