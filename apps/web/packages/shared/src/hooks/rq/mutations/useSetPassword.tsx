import { useMutation } from '@tanstack/react-query';
import { useApiContext } from '../../../providers/ApiProvider';

export const useSetPassword = () => {
  const api = useApiContext();

  const mutation = useMutation({
    mutationFn: async ({
      token,
      password,
    }: {
      token: string;
      password: string;
    }) => {
      await api.authApi.setUserPassword({
        userId: '',
        token,
        password,
      });
    },
  });

  return mutation;
};
