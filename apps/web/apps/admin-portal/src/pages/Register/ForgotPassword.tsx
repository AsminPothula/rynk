import { ForgotPasswordForm } from '@shared/containers/register/ForgotPasswordForm';
import { useForgot } from '@/hooks/rq/mutations/useForgot';
import { useNavigate } from 'react-router-dom';
import { NavigationRoutes } from '@/common/constant';
import { useLanguageTranslation } from '@/hooks/ui/useLanguageTranslation';
import { toast } from 'sonner';

export const ForgotPassword = () => {
  const mutation = useForgot();
  const navigate = useNavigate();
  const { t } = useLanguageTranslation();

  return (
    <ForgotPasswordForm
      mutation={mutation}
      t={t as (key: string) => string}
      onSuccess={() => {
        toast.success(t('COMMON.TOAST.SUBMIT_SUCCESS'));
        navigate(NavigationRoutes.SignIn);
      }}
      onBack={() => navigate(-1)}
    />
  );
};
