import { UserProfileRole } from 'shared';

export { NavigationRoutes, CacheKey, ReactQueryKey } from 'shared';

export const AllowedRoles = {
  /** Only admins can access admin portal routes */
  All: [UserProfileRole.Admin],
} as const;
