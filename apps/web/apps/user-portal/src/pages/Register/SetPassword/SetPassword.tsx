import { SetPasswordForm } from '@shared/containers/register/SetPasswordForm';
import { useSetPassword } from '@/hooks/rq/mutations/useSetPassword';
import { Navigate, useNavigate } from 'react-router-dom';
import { NavigationRoutes } from '@/common/constant';
import { useLanguageTranslation } from '@/hooks/ui/useLanguageTranslation';
import { toast } from 'sonner';

export const SetPassword = () => {
  const mutation = useSetPassword();
  const navigate = useNavigate();
  const { t } = useLanguageTranslation();

  return (
    <SetPasswordForm
      mutation={mutation}
      t={t as (key: string) => string}
      onSuccess={() => {
        toast.success(t('SET_PASSWORD.TOAST.SUCCESS'));
        navigate(NavigationRoutes.SignIn);
      }}
      onSignIn={() => navigate(NavigationRoutes.SignIn)}
      noTokenRedirect={<Navigate to={NavigationRoutes.SignIn} />}
    />
  );
};
