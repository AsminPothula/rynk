import { Navigate } from 'react-router-dom';
import type { UserProfileRole } from '../_api';
import { NavigationRoutes } from '../common/constant';
import { useCanAccess } from '../hooks/rq/queries/useProfile';

export function RoleRouteGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: readonly UserProfileRole[];
  children: React.ReactNode;
}) {
  const hasAccess = useCanAccess(allowedRoles);

  if (!hasAccess) {
    return <Navigate to={NavigationRoutes.Dashboard} replace />;
  }

  return <>{children}</>;
}
