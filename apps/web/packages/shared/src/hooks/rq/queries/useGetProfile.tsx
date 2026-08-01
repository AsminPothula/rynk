import { ReactQueryKey } from '../../../common/constant';
import { useApiContext } from '../../../providers/ApiProvider';
import { useQuery } from '@tanstack/react-query';

export const useGetProfile = () => {
  const api = useApiContext();

  return useQuery({
    queryKey: [ReactQueryKey.User, 'profile'],
    queryFn: async () => {
      const { data } = await api.userApi.getMyProfile();
      return data;
    },
  });
};
