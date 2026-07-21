import { LanguageToggle as SharedLanguageToggle } from '@shared/components/common/language-toggle';
import { useLanguage } from '@/hooks/ui/useLanguage';

export function LanguageToggle() {
  const { changeLanguage } = useLanguage();
  return (
    <SharedLanguageToggle
      changeLanguage={changeLanguage as (lng: string) => void}
    />
  );
}
