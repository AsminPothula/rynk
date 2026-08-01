import type { AxiosResponse } from 'axios';
import type { GetProfileResponse } from '../_api';
import { useApiContext } from '../providers/ApiProvider';
import { useProfile } from '../hooks/rq/queries/useProfile';

interface ProfileInterceptorProps {
  children: React.ReactNode;
  fetchProfile?: (
    api: ReturnType<typeof useApiContext>,
  ) => Promise<AxiosResponse<GetProfileResponse>>;
}

export function ProfileInterceptor({
  children,
  fetchProfile,
}: ProfileInterceptorProps) {
  const { isLoading } = useProfile(fetchProfile);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
