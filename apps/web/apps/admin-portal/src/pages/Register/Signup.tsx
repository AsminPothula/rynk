import { z } from 'zod';
import {
  SignupForm,
  SignupBaseSchema,
  withPasswordMatch,
} from '@shared/containers/register/SignupForm';
import { useSignup } from '@/hooks/rq/mutations/useSignup';
import { useNavigate } from 'react-router-dom';
import { NavigationRoutes } from '@/common/constant';
import { useLanguageTranslation } from '@/hooks/ui/useLanguageTranslation';
import { toast } from 'sonner';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shared/components/ui/form';
import { Input } from '@shared/components/ui/input';

// Extend the base schema with admin-portal-specific fields
const AdminSignupSchema = withPasswordMatch(
  SignupBaseSchema.extend({
    inviteCode: z.string().min(1, 'Invite code is required'),
  }),
);

export const Signup = () => {
  const { mutate, isPending, error, isError } = useSignup();
  const navigate = useNavigate();
  const { t } = useLanguageTranslation();

  return (
    <SignupForm
      schema={AdminSignupSchema}
      defaultValues={{
        email: '',
        inviteCode: '',
        password: '',
        confirmPassword: '',
      }}
      isPending={isPending}
      error={error}
      isError={isError}
      t={t as (key: string) => string}
      onSubmit={(data) => {
        // Map form data → mutation data (inviteCode could be sent separately)
        mutate(
          { email: data.email, password: data.password },
          {
            onSuccess: () => {
              toast.success(t('SIGNUP.TOAST.SUCCESS'));
              navigate(NavigationRoutes.Dashboard);
            },
          },
        );
      }}
      onSignIn={() => navigate(NavigationRoutes.SignIn)}
      // Extra field: admin invite code (between email and password)
      renderExtraFields={(form) => (
        <FormField
          control={form.control}
          name="inviteCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Admin Invite Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter invite code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    />
  );
};
