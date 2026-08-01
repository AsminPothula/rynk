import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { PasswordInput } from '../../components/ui/password-input';
import { PleaseWaitLoadText } from '../../components/common/please-wait-load-text';
import { simple_password } from '../../lib/zod.validator';

const FormSchema = z
  .object({
    password: simple_password,
    confirmPassword: simple_password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type SetPasswordFormValues = z.infer<typeof FormSchema>;

export type SetPasswordMutationData = { token: string; password: string };

interface SetPasswordFormProps {
  mutation: {
    mutate: (
      data: SetPasswordMutationData,
      options?: { onSuccess?: () => void },
    ) => void;
    isPending: boolean;
    error: Error | null;
    isError: boolean;
  };
  t: (key: string) => string;
  onSuccess: () => void;
  onSignIn: () => void;
  noTokenRedirect: React.ReactNode;
}

export function SetPasswordForm({
  mutation,
  t,
  onSuccess,
  onSignIn,
  noTokenRedirect,
}: SetPasswordFormProps) {
  const { mutate, isPending, error, isError } = mutation;
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const form = useForm<SetPasswordFormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onTouched',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(data: SetPasswordFormValues) {
    mutate({ password: data.password, token }, { onSuccess });
  }

  function handlePasswordBlur() {
    form.trigger('confirmPassword');
  }

  useEffect(() => {
    if (isError && error) {
      toast.error(t('COMMON.TOAST.ERROR_PREFIX') + ': ' + error?.message);
    }
  }, [t, error, isError]);

  if (!token) {
    return <>{noTokenRedirect}</>;
  }

  const submitButtonDisabled = isPending;

  return (
    <div className="width-full flex h-full flex-col items-center justify-center">
      <Card className="w-full max-w-[600px] p-10 md:w-3/4">
        <CardHeader>
          <CardTitle>{t('SET_PASSWORD.TITLE')}</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              id="form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('SET_PASSWORD.PASSWORD')}</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="password"
                        autoFocus
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
                    <FormLabel>{t('SET_PASSWORD.CONFIRM_PASSWORD')}</FormLabel>
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
            </form>
          </Form>
        </CardContent>

        <CardFooter className="mt-5 flex flex-col justify-between">
          <Button
            className="w-full"
            type="submit"
            form="form"
            disabled={submitButtonDisabled}>
            {!isPending ? (
              t('SET_PASSWORD.SUBMIT')
            ) : (
              <PleaseWaitLoadText text={t('COMMON.LOADING.PLEASE_WAIT')} />
            )}
          </Button>

          <div className="mt-6 flex w-full items-center justify-center">
            <Button variant={'link'} className="underline" onClick={onSignIn}>
              {t('SET_PASSWORD.BACK_TO_LOGIN')}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
