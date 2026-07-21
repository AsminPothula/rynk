import { useQuery } from '@tanstack/react-query';
import { ReactQueryKey } from '../../../common/constant';
import { useApiContext } from '../../../providers/ApiProvider';
import { fromAuth, useAuthStore } from '../../../state/useAuthStore';
import type { UserProfileRole } from '../../../_api';
import type { AxiosResponse } from 'axios';
import type { GetProfileResponse } from '../../../_api';

export const useProfile = (
  fetchProfile?: (
    api: ReturnType<typeof useApiContext>,
  ) => Promise<AxiosResponse<GetProfileResponse>>,
) => {
  const api = useApiContext();
  const isAuthenticated = useAuthStore(fromAuth.isAuthenticated);

  return useQuery({
    queryKey: [ReactQueryKey.User, 'profile'],
    queryFn: async () => {
      const fetcher =
        fetchProfile ?? ((a: typeof api) => a.userApi.getMyProfile());
      const { data } = await fetcher(api);
      return data;
    },
    enabled: isAuthenticated,
  });
};

export const useCanAccess = (allowedRoles: readonly UserProfileRole[]) => {
  const { data: profile } = useProfile();
  return profile?.roles?.some((r) => allowedRoles.includes(r.role)) ?? false;
};
