import { useMutation } from '@tanstack/react-query';
import { useApiContext } from '../../../providers/ApiProvider';
import { useAuthStore } from '../../../state/useAuthStore';

export const useLogin = () => {
  const api = useApiContext();

  const mutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data: tokens } = await api.authApi.signIn({
        email,
        password,
      });

      useAuthStore.getState().setLoginInfo(tokens);
    },
  });

  return mutation;
};
