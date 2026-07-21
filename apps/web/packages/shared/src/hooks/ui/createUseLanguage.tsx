import { useContext, Context } from 'react';

export function createUseLanguage<LType extends string>(
  LanguageContext: Context<{
    language: LType;
    changeLanguage: (lng: LType) => void;
  }>,
) {
  return () => useContext(LanguageContext);
}
