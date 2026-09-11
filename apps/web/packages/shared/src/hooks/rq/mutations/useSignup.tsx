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
      firstName,
      lastName,
    }: {
      email: string;
      password: string;
      phone?: string;
      firstName?: string;
      lastName?: string;
    }) => {
      const { data: tokens } = await api.authApi.signUp({
        email,
        firstName: firstName || '',
        lastName: lastName || '',
        phone: phone || '',
        password,
      });

      useAuthStore.getState().setLoginInfo(tokens);
    },
  });

  return mutation;
};
