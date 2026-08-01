import { useQuery } from '@tanstack/react-query';
import { useApiContext } from '../../../providers/ApiProvider';

/** Full client overview (context + latest audit/strategy/manifest) from the backend. */
export interface ClientOverviewVm {
  id: string;
  domain: string;
  name: string;
  status: string;
  context: Record<string, any> | null;
  latestAudit: Record<string, any> | null;
  latestStrategy: Record<string, any> | null;
  latestManifest: Record<string, any> | null;
  latestRunDate: string | null;
}

export const useGetClientOverview = (domain: string) => {
  const api = useApiContext();

  return useQuery({
    queryKey: ['client', domain, 'overview'],
    enabled: !!domain,
    queryFn: async (): Promise<ClientOverviewVm | null> => {
      // Dashboard routes are domain-keyed; resolve to the backend's client id.
      const { data: clients } = await api.clientApi.list();
      const match = (clients as any[]).find((c) => c.domain === domain);
      if (!match) return null;
      const { data } = await api.clientApi.overview(match.id);
      return data as ClientOverviewVm;
    },
  });
};
