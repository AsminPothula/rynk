import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { PleaseWaitLoadText } from '../../components/common/please-wait-load-text';
import { simple_email } from '../../lib/zod.validator';

const FormSchema = z.object({
  email: simple_email,
});

export type ForgotPasswordFormData = z.infer<typeof FormSchema>;

interface ForgotPasswordFormProps {
  mutation: {
    mutate: (
      data: ForgotPasswordFormData,
      options?: { onSuccess?: () => void },
    ) => void;
    isPending: boolean;
    error: Error | null;
    isError: boolean;
  };
  t: (key: string) => string;
  onSuccess: () => void;
  onBack: () => void;
}

export function ForgotPasswordForm({
  mutation,
  t,
  onSuccess,
  onBack,
}: ForgotPasswordFormProps) {
  const { mutate, isPending, error, isError } = mutation;

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(FormSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(data: ForgotPasswordFormData) {
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
          <CardTitle>{t('FORGOT_PASSWORD.TITLE')}</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              id="form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6">
              <FormDescription>
                {t('FORGOT_PASSWORD.DESCRIPTION')}
              </FormDescription>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('FORGOT_PASSWORD.EMAIL')}</FormLabel>
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
              t('FORGOT_PASSWORD.SUBMIT')
            ) : (
              <PleaseWaitLoadText text={t('COMMON.LOADING.PLEASE_WAIT')} />
            )}
          </Button>

          <div className="mt-6 flex w-full items-center justify-center">
            <Button variant={'link'} className="underline" onClick={onBack}>
              {t('FORGOT_PASSWORD.BACK')}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
