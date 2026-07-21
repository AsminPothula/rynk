import { PleaseWaitLoadText as SharedPleaseWaitLoadText } from '@shared/components/common/please-wait-load-text';
import { useLanguageTranslation } from '@/hooks/ui/useLanguageTranslation';

export function PleaseWaitLoadText() {
  const { t } = useLanguageTranslation();
  return <SharedPleaseWaitLoadText text={t('COMMON.LOADING.PLEASE_WAIT')} />;
}
