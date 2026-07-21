import { useQuery } from '@tanstack/react-query';
import { useApiContext } from '../../../providers/ApiProvider';

/** Summary row for the clients list (mirrors the rynk dashboard's ClientSummary). */
export interface ClientSummaryVm {
  id: string;
  domain: string;
  legalEntity: string | null;
  industry: string | null;
  latestRunDate: string | null;
  latestActionCount: number | null;
  latestDAScore: number | null;
}

/**
 * List clients + enrich each with its latest run summary (DA / action count /
 * run date) from the backend's /client/:id/overview endpoint.
 */
export const useGetClients = () => {
  const api = useApiContext();

  return useQuery({
    queryKey: ['clients', 'list'],
    queryFn: async (): Promise<ClientSummaryVm[]> => {
      const { data: clients } = await api.clientApi.list();

      const rows = await Promise.all(
        clients.map(async (c: any): Promise<ClientSummaryVm> => {
          let ov: any = null;
          try {
            ov = (await api.clientApi.overview(c.id)).data;
          } catch {
            ov = null;
          }
          const ctx = c.context ?? {};
          return {
            id: c.id,
            domain: c.domain,
            legalEntity: ctx.legalEntity ?? c.name ?? null,
            industry: ctx.industry ?? null,
            latestRunDate: ov?.latestRunDate ?? null,
            latestActionCount: ov?.latestManifest?.summary?.totalActions ?? null,
            latestDAScore: ov?.latestAudit?.authority?.client?.score ?? null,
          };
        }),
      );

      return rows.sort((a, b) => a.domain.localeCompare(b.domain));
    },
  });
};
