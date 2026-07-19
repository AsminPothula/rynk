import { UserProfileRoleType } from '@types';
import { User } from './user.type';

export function hasAnyRequiredRole(
  user: User,
  requiredRoles: UserProfileRoleType[],
): boolean {
  const hasRequiredRole = user.roles?.some((role) =>
    requiredRoles.includes(role.role),
  );

  if (!hasRequiredRole) {
    return false;
  }
  return true;
}
