import { ProfileInterceptor as SharedProfileInterceptor } from 'shared';
import type { ApiEndpoints } from 'shared';

// Admin portal uses its own profile endpoint.
// To switch to a different API, change the fetchProfile function below.
// e.g., (api) => api.adminApi.getMyAdminProfile()
const fetchAdminProfile = (api: ApiEndpoints) => api.userApi.getMyProfile();

export const ProfileInterceptor = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <SharedProfileInterceptor fetchProfile={fetchAdminProfile}>
      {children}
    </SharedProfileInterceptor>
  );
};
