import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { PasswordInput } from '../../components/ui/password-input';
import { PleaseWaitLoadText } from '../../components/common/please-wait-load-text';
import { simple_email, simple_password } from '../../lib/zod.validator';

/** Base schema shared by all portals — email + password + confirmPassword */
export const SignupBaseSchema = z.object({
  email: simple_email,
  password: simple_password,
  confirmPassword: simple_password,
});

/** Helper to add password-match refinement to any extended schema */
export function withPasswordMatch<T extends typeof SignupBaseSchema>(
  schema: T,
) {
  return schema.refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });
}

export type SignupFormData = z.infer<typeof SignupBaseSchema>;

interface SignupFormProps {
  /** Called with validated form data — app maps this to mutation call */
  onSubmit: (data: FieldValues) => void;
  /** Whether the mutation is pending (disables submit, shows loader) */
  isPending: boolean;
  /** Mutation error to display as toast */
  error: Error | null;
  isError: boolean;
  t: (key: string) => string;
  onSignIn: () => void;
  /** Zod schema for the full form (base + extra fields + password match refinement) */
  schema: z.ZodTypeAny;
  /** Default values for all form fields */
  defaultValues: FieldValues;
  /** Render extra fields between email and password. Receives the form instance. */
  renderExtraFields?: (form: UseFormReturn<FieldValues>) => React.ReactNode;
  /** Render extra content below the password fields (e.g., terms checkbox). Receives the form instance. */
  renderAfterPasswords?: (form: UseFormReturn<FieldValues>) => React.ReactNode;
}

export function SignupForm({
  onSubmit,
  isPending,
  error,
  isError,
  t,
  onSignIn,
  schema,
  defaultValues,
  renderExtraFields,
  renderAfterPasswords,
}: SignupFormProps) {
  const form = useForm({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues,
  });

  function handlePasswordBlur() {
    form.trigger('confirmPassword');
  }

  useEffect(() => {
    if (isError && error) {
      toast.error(t('COMMON.TOAST.ERROR_PREFIX') + ': ' + error?.message);
    }
  }, [t, error, isError]);

  return (
    <div className="width-full flex h-full flex-col items-center justify-center">
      <Card className="w-full max-w-[600px] p-10 md:w-3/4">
        <CardHeader>
          <CardTitle>{t('SIGNUP.TITLE')}</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              id="form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('SIGNUP.EMAIL')}</FormLabel>
                    <FormControl>
                      <Input
                        autoFocus
                        placeholder="email"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slot: extra fields between email and password (e.g., phone, invite code) */}
              {renderExtraFields?.(form)}

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('SIGNUP.PASSWORD')}</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="password"
                        {...field}
                        onBlur={() => {
                          field.onBlur();
                          handlePasswordBlur();
                        }}
                        onChange={(e) => {
                          field.onChange(e);
                          if (form.formState.touchedFields.confirmPassword) {
                            handlePasswordBlur();
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('SIGNUP.CONFIRM_PASSWORD')}</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="confirm password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slot: content after passwords (e.g., terms checkbox) */}
              {renderAfterPasswords?.(form)}
            </form>
          </Form>
        </CardContent>

        <CardFooter className="mt-5 flex flex-col justify-between">
          <Button
            className="w-full"
            type="submit"
            form="form"
            disabled={isPending}>
            {!isPending ? (
              t('SIGNUP.SUBMIT')
            ) : (
              <PleaseWaitLoadText text={t('COMMON.LOADING.PLEASE_WAIT')} />
            )}
          </Button>

          <div className="mt-6 flex w-full items-center justify-center">
            <span>
              <span className="text-gray-500">
                {t('SIGNUP.ALREADY_HAVE_AN_ACCOUNT')}&nbsp;
              </span>
              <Button
                variant={'link'}
                className="h-auto px-0 underline"
                onClick={onSignIn}>
                {t('SIGNUP.SIGN_IN')}
              </Button>
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
