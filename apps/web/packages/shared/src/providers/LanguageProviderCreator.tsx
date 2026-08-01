import React, { useState, createContext, useEffect, useRef } from 'react';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const createLanguageProvider = <LType extends string>(
  defaultLang: LType,
  LContext: ReturnType<typeof createLanguageContext<LType>>,
) => {
  const LanguageProvider = ({
    children,
    defaultLanguage = defaultLang,
    storageKey = 'language-preference',
  }: {
    children: React.ReactNode;
    defaultLanguage?: LType;
    storageKey?: string;
  }) => {
    const [language, setLanguage] = useState<LType>(() => {
      const st = localStorage.getItem(storageKey) as LType;
      return st || defaultLanguage;
    });

    const initialRef = useRef(true);
    useEffect(() => {
      if (initialRef.current) {
        initialRef.current = false;
        // Sync i18n on mount (handles stored language different from default)
        if (i18n.language !== language) {
          i18n.changeLanguage(language);
        }
        return;
      }
      i18n.changeLanguage(language);
    }, [language]);

    const changeLanguage = (lng: LType) => {
      localStorage.setItem(storageKey, lng);
      setLanguage(lng);
    };

    return (
      <LContext.Provider value={{ language, changeLanguage }}>
        {children}
      </LContext.Provider>
    );
  };

  return LanguageProvider;
};

function createLanguageContext<LType extends string>(defaultLanguage: LType) {
  const LanguageContext = createContext<{
    language: LType;
    changeLanguage: (lng: LType) => void;
  }>({
    language: defaultLanguage,
    changeLanguage: () => {},
  });
  return LanguageContext;
}

export function LanguageProviderCreator<
  LType extends string,
  TType extends object,
>(
  defaultLanguage: LType,
  resources: { [key in LType]: { translation: TType } },
) {
  i18n
    .use(initReactI18next) // Integrates with React
    .init({
      resources,
      lng: defaultLanguage, // Default language
      fallbackLng: defaultLanguage, // Fallback language if the current language doesn't have a translation
      interpolation: {
        escapeValue: false,
      },
    });

  const LanguageContext = createLanguageContext<LType>(defaultLanguage);
  const LanguageProvider = createLanguageProvider<LType>(
    defaultLanguage,
    LanguageContext,
  );

  return {
    LanguageContext,
    LanguageProvider,
  };
}
