import { LoginForm } from '@shared/containers/register/LoginForm';
import { useLogin } from '@/hooks/rq/mutations/useLogin';
import { useNavigate } from 'react-router-dom';
import { NavigationRoutes } from '@/common/constant';
import { useLanguageTranslation } from '@/hooks/ui/useLanguageTranslation';
import { toast } from 'sonner';

export const Login = () => {
  const mutation = useLogin();
  const navigate = useNavigate();
  const { t } = useLanguageTranslation();

  return (
    <LoginForm
      mutation={mutation}
      t={t as (key: string) => string}
      onSuccess={() => {
        toast.success(t('LOGIN.TOAST.SUCCESS'));
        navigate(NavigationRoutes.Dashboard);
      }}
      onForgotPassword={() => navigate(NavigationRoutes.ForgotPassword)}
      onSignUp={() => navigate(NavigationRoutes.SignUp)}
    />
  );
};
