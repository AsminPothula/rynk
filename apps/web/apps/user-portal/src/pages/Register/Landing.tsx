/**
 * Landing → sign-in. The public marketing site (rynk.ai) is the real landing;
 * the portal's entry point is the sign-in screen, so we send visitors straight
 * there instead of showing a second, redundant welcome page.
 */
import { Navigate } from 'react-router-dom';
import { NavigationRoutes } from '@/common/constant';

export function Landing() {
  return <Navigate to={NavigationRoutes.SignIn} replace />;
}
