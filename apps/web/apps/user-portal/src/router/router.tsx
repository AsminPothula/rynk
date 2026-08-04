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
const ClientDashboard = lazy(() =>
  import('../pages/client/ClientDashboard').then((m) => ({ default: m.ClientDashboard })),
);
// Dev/demo: view the dashboard with sample data, no auth needed.
const PreviewDashboard = lazy(() =>
  import('../pages/client/PreviewDashboard').then((m) => ({ default: m.PreviewDashboard })),
);
// Public: "Try rynk on your site" instant scan (marketing CTA target).
const TryRynk = lazy(() =>
  import('../pages/TryRynk').then((m) => ({ default: m.TryRynk })),
);
// Full-page preview of a content draft as it would publish to the client's site.
const ContentPreview = lazy(() =>
  import('../pages/client/ContentPreview').then((m) => ({ default: m.ContentPreview })),
);

export function Router() {
  const isAuthenticated = useAuthStore(fromAuth.isAuthenticated);

  return (
    <BrowserRouter>
      <AuthTokensInterceptor>
        <Suspense>
          <Routes>
            {/* Always-available dashboard preview (sample data, no auth) */}
            <Route path="/preview" element={<PreviewDashboard />} />
            <Route path="/preview/:domain" element={<PreviewDashboard />} />
            {/* Full-page content-draft preview (sample data, no auth) */}
            <Route path="/preview/content/:id" element={<ContentPreview />} />
            {/* Public "Try rynk on your site" instant scan */}
            <Route path="/try" element={<TryRynk />} />
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
                  <Route path="/clients/:domain" element={<ClientDashboard />} />
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
