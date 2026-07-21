import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { PrivateRoute } from '../pages/PrivateRoute';
import { NavigationRoutes, AllowedRoles } from '../common/constant';
import { fromAuth, useAuthStore } from 'shared';
import { AuthTokensInterceptor } from './AuthTokensInterceptor';
import { ProfileInterceptor } from './ProfileInterceptor';
import { RoleRouteGuard } from './RoleRouteGuard';

// Lazy-loaded page components (each becomes a separate chunk)
const Login = lazy(() =>
  import('../pages/Register/Login/Login').then((m) => ({ default: m.Login })),
);
const Signup = lazy(() =>
  import('../pages/Register/Signup/Signup').then((m) => ({
    default: m.Signup,
  })),
);
const ForgotPassword = lazy(() =>
  import('../pages/Register/ForgotPassword/ForgotPassword').then((m) => ({
    default: m.ForgotPassword,
  })),
);
const SetPassword = lazy(() =>
  import('../pages/Register/SetPassword/SetPassword').then((m) => ({
    default: m.SetPassword,
  })),
);
const Landing = lazy(() =>
  import('../pages/Register/Landing').then((m) => ({ default: m.Landing })),
);
const Dashboard = lazy(() =>
  import('../pages/Dashboard').then((m) => ({ default: m.Dashboard })),
);
const Settings = lazy(() =>
  import('../pages/Settings/Settings').then((m) => ({
    default: m.Settings,
  })),
);
const Users = lazy(() =>
  import('../pages/Users/Users').then((m) => ({ default: m.Users })),
);

export function Router() {
  const isAuthenticated = useAuthStore(fromAuth.isAuthenticated);

  return (
    <BrowserRouter>
      <AuthTokensInterceptor>
        <Suspense>
          <Routes>
            {isAuthenticated ? (
              <>
                <Route
                  path="*"
                  element={<Navigate to={NavigationRoutes.Home} />}
                />
                <Route
                  path={NavigationRoutes.Home}
                  element={
                    <ProfileInterceptor>
                      <PrivateRoute />
                    </ProfileInterceptor>
                  }>
                  <Route
                    path={NavigationRoutes.Dashboard}
                    element={<Dashboard />}
                  />
                  <Route
                    path={NavigationRoutes.Users}
                    element={
                      <RoleRouteGuard allowedRoles={AllowedRoles.All}>
                        <Users />
                      </RoleRouteGuard>
                    }
                  />
                  <Route
                    path={NavigationRoutes.Settings}
                    element={<Settings />}
                  />
                  <Route
                    path="/"
                    element={<Navigate to={NavigationRoutes.Dashboard} />}
                  />
                </Route>
              </>
            ) : (
              <>
                <Route path={NavigationRoutes.SignIn} element={<Login />} />
                <Route path={NavigationRoutes.SignUp} element={<Signup />} />
                <Route
                  path={NavigationRoutes.ForgotPassword}
                  element={<ForgotPassword />}
                />
                <Route
                  path={NavigationRoutes.SetPassword}
                  element={<SetPassword />}
                />
                <Route path={NavigationRoutes.Landing} element={<Landing />} />
                <Route
                  path="*"
                  element={<Navigate to={NavigationRoutes.Landing} />}
                />
              </>
            )}
          </Routes>
        </Suspense>
      </AuthTokensInterceptor>
    </BrowserRouter>
  );
}
