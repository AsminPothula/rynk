import { useQuery } from '@tanstack/react-query';
import { useApiContext } from '../../../providers/ApiProvider';
import type { RunPhase, RunVm } from './useGetRun';

const TERMINAL: RunPhase[] = ['done', 'failed'];

/**
 * The client's most recent run (GET /run?clientId=...), polled while it's still
 * active so the dashboard can show live progress. Returns null when the client
 * has never been run. Stops polling on a terminal phase.
 */
export const useGetLatestRun = (clientId: string | null | undefined) => {
  const api = useApiContext();

  return useQuery({
    queryKey: ['runs', 'latest', clientId],
    enabled: !!clientId,
    refetchInterval: (query) => {
      const phase = (query.state.data as RunVm | null | undefined)?.phase;
      return phase && !TERMINAL.includes(phase) ? 4000 : false;
    },
    queryFn: async (): Promise<RunVm | null> => {
      const { data } = await api.runApi.list(clientId as string);
      const runs = (data as unknown as RunVm[]) ?? [];
      if (runs.length === 0) return null;
      // Backend returns newest-first; be defensive and take the latest by start.
      return [...runs].sort((a: any, b: any) =>
        String(b.startedAt ?? '').localeCompare(String(a.startedAt ?? '')),
      )[0];
    },
  });
};
