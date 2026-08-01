import { z } from 'zod';
import { isValidPhoneNumber } from 'react-phone-number-input';
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
import { PhoneInputWithCountry } from '@shared/components/ui/phone-input-with-country';

// Extend the base schema with user-portal-specific fields
const UserSignupSchema = withPasswordMatch(
  SignupBaseSchema.extend({
    phone: z
      .string()
      .refine((val) => !val || isValidPhoneNumber(val), 'Invalid phone number')
      .optional(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  }),
);

export const Signup = () => {
  const { mutate, isPending, error, isError } = useSignup();
  const navigate = useNavigate();
  const { t } = useLanguageTranslation();

  return (
    <SignupForm
      schema={UserSignupSchema}
      defaultValues={{
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
      }}
      isPending={isPending}
      error={error}
      isError={isError}
      t={t as (key: string) => string}
      onSubmit={(data) => {
        // Map form data → mutation data (strip UI-only fields like acceptTerms)
        mutate(
          { email: data.email, password: data.password, phone: data.phone },
          {
            onSuccess: () => {
              toast.success(t('SIGNUP.TOAST.SUCCESS'));
              navigate(NavigationRoutes.Dashboard);
            },
          },
        );
      }}
      onSignIn={() => navigate(NavigationRoutes.SignIn)}
      // Extra field: phone number (between email and password)
      renderExtraFields={(form) => (
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('SIGNUP.PHONE')}</FormLabel>
              <FormControl>
                <PhoneInputWithCountry
                  defaultCountry="US"
                  placeholder="(555) 000-0000"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      // Extra content: terms checkbox (after passwords)
      renderAfterPasswords={(form) => (
        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </FormControl>
                <FormLabel className="!mt-0 text-sm font-normal">
                  I agree to the Terms of Service and Privacy Policy
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    />
  );
};
