import { UserProfileRole } from 'shared';

export { NavigationRoutes, CacheKey, ReactQueryKey } from 'shared';

export const AllowedRoles = {
  /** All authenticated users can view */
  All: [UserProfileRole.User, UserProfileRole.Admin, UserProfileRole.Guest],
  /** Only regular users and admins */
  Authenticated: [UserProfileRole.User, UserProfileRole.Admin],
  /** Only admins */
  AdminOnly: [UserProfileRole.Admin],
} as const;
