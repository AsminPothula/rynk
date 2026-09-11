import { useQuery } from '@tanstack/react-query';
import { useApiContext } from '../../../providers/ApiProvider';

export type RunPhase =
  | 'onboarding'
  | 'onboarded'
  | 'layer1'
  | 'layer2'
  | 'layer3'
  | 'done'
  | 'failed';

export interface RunVm {
  id: string;
  phase: RunPhase;
  domain?: string;
  error?: string | null;
}

const TERMINAL: RunPhase[] = ['done', 'failed'];

/**
 * Poll a run's phase. GET /run/:id re-syncs the phase from the pipeline's
 * status.json on every read, so polling reflects live progress. Stops polling
 * once the run reaches a terminal phase (done / failed).
 */
export const useGetRun = (runId: string | null) => {
  const api = useApiContext();

  return useQuery({
    queryKey: ['run', runId],
    enabled: !!runId,
    refetchInterval: (query) => {
      const phase = (query.state.data as RunVm | undefined)?.phase;
      return phase && TERMINAL.includes(phase) ? false : 3000;
    },
    queryFn: async (): Promise<RunVm> => {
      const { data } = await api.runApi.get(runId as string);
      return data as RunVm;
    },
  });
};
