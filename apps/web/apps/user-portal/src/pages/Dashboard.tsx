/**
 * Clients list — rynk dashboard home (authed app route).
 *
 * Real data from the backend: lists the signed-in user's onboarded clients and
 * leads into the onboard-and-run flow. (The sample-data ClientsList still backs
 * the auth-free /preview shell.)
 */
import { RealClientsList } from './client/RealClientsList';

export function Dashboard() {
  return <RealClientsList />;
}
