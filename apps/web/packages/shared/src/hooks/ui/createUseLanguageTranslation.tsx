import { useTranslation } from 'react-i18next';

export function createUseLanguageTranslation<TTypeKeys extends string>() {
  return function useLanguageTranslation(
    ...params: Parameters<typeof useTranslation>
  ) {
    const { t, ...rest } = useTranslation(...params);
    return {
      t: (p: TTypeKeys, options?: Omit<Parameters<typeof t>[1], string>) =>
        t(p, options),
      ...rest,
    };
  };
}
