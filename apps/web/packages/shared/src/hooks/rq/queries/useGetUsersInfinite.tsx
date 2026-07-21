import { ReactQueryKey } from '../../../common/constant';
import { useApiContext } from '../../../providers/ApiProvider';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useGetUsersInfinite = (
  {
    refetchOnMount,
    refetchOnWindowFocus,
    refetchOnReconnect,
  }: {
    refetchOnMount?: boolean;
    refetchOnWindowFocus?: boolean;
    refetchOnReconnect?: boolean;
  } = {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  },
) => {
  const api = useApiContext();

  return useInfiniteQuery({
    queryKey: [ReactQueryKey.Users],
    initialPageParam: 0,
    refetchOnMount: !!refetchOnMount,
    refetchOnWindowFocus: !!refetchOnWindowFocus,
    refetchOnReconnect: !!refetchOnReconnect,
    queryFn: async ({ pageParam = 0 }) => {
      const { data } = await api.userApi.getUsers(20, pageParam);
      return data;
    },
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
    select(data) {
      return {
        pages: data.pages.map((page) => ({
          users: page.items,
          otherInfo: 'otherInfo',
        })),
        pageParams: data.pageParams,
      };
    },
  });
};
