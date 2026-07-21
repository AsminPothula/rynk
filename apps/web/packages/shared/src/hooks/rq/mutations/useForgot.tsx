import { useMutation } from '@tanstack/react-query';
import { useApiContext } from '../../../providers/ApiProvider';

export const useForgot = () => {
  const api = useApiContext();

  const mutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      await api.authApi.forgotPassword({ email });
    },
  });

  return mutation;
};
