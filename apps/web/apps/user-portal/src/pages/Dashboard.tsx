/**
 * Clients list — rynk dashboard home (authed app route).
 *
 * Renders the shared navy ClientsList. Sample-data driven for now; swaps to the
 * real clients query when the DB + backend are wired.
 */
import { ClientsList } from './client/ClientsList';

export function Dashboard() {
  return <ClientsList basePath="/clients" />;
}
