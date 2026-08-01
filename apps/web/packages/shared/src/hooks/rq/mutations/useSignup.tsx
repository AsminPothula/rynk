import { useMutation } from '@tanstack/react-query';
import { useApiContext } from '../../../providers/ApiProvider';
import { useAuthStore } from '../../../state/useAuthStore';

export const useSignup = () => {
  const api = useApiContext();

  const mutation = useMutation({
    mutationFn: async ({
      email,
      password,
      phone,
    }: {
      email: string;
      password: string;
      phone?: string;
    }) => {
      const { data: tokens } = await api.authApi.signUp({
        email,
        firstName: '',
        lastName: '',
        phone: phone || '',
        password,
      });

      useAuthStore.getState().setLoginInfo(tokens);
    },
  });

  return mutation;
};
