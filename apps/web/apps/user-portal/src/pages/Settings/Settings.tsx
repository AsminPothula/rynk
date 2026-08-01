import { Settings as SharedSettings } from '@shared/pages/Settings';
import { useLanguageTranslation } from '@/hooks/ui/useLanguageTranslation';

export const Settings = () => {
  const { t } = useLanguageTranslation();
  return (
    <SharedSettings t={t as (key: string) => string} showDeleteAccount={true} />
  );
};
