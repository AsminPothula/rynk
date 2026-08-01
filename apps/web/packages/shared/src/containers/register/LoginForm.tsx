import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { simple_email, simple_password_login } from '../../lib/zod.validator';

const FormSchema = z.object({
  email: simple_email,
  password: simple_password_login,
});

export type LoginFormData = z.infer<typeof FormSchema>;

interface LoginFormProps {
  mutation: {
    mutate: (data: LoginFormData, options?: { onSuccess?: () => void }) => void;
    isPending: boolean;
    error: Error | null;
    isError: boolean;
  };
  t: (key: string) => string;
  onSuccess: () => void;
  onForgotPassword: () => void;
  onSignUp: () => void;
}

export function LoginForm({
  mutation,
  t,
  onSuccess,
  onForgotPassword,
  onSignUp,
}: LoginFormProps) {
  const { mutate, isPending, error, isError } = mutation;

  const form = useForm<LoginFormData>({
    resolver: zodResolver(FormSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: LoginFormData) {
    mutate(data, { onSuccess });
  }

  useEffect(() => {
    if (isError && error) {
      toast.error(t('COMMON.TOAST.ERROR_PREFIX') + ': ' + error?.message);
    }
  }, [t, error, isError]);

  const submitButtonDisabled = isPending;

  return (
    <div className="width-full flex h-full flex-col items-center justify-center">
      <Card className="w-full max-w-[600px] p-10 md:w-3/4">
        <CardHeader>
          <CardTitle>{t('LOGIN.TITLE')}</CardTitle>
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
                    <FormLabel>{t('LOGIN.EMAIL')}</FormLabel>
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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative h-0 w-full">
                      <Button
                        className="absolute -bottom-8 -right-3"
                        type="button"
                        variant={'link'}
                        tabIndex={-1}
                        onClick={onForgotPassword}>
                        {t('LOGIN.FORGOT_PASSWORD')}
                      </Button>
                    </div>

                    <FormLabel>{t('LOGIN.PASSWORD')}</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="password" {...field} />
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
              t('LOGIN.SUBMIT')
            ) : (
              <PleaseWaitLoadText text={t('COMMON.LOADING.PLEASE_WAIT')} />
            )}
          </Button>

          <div className="mt-6 flex w-full items-center justify-center">
            <span>
              <span className="text-gray-500">
                {t('LOGIN.NO_ACCOUNT')}&nbsp;
              </span>
              <Button
                variant={'link'}
                className="h-auto px-0 underline"
                onClick={onSignUp}>
                {t('LOGIN.SIGN_UP')}
              </Button>
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
