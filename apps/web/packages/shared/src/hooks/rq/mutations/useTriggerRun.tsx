import { useMutation } from '@tanstack/react-query';
import { useApiContext } from '../../../providers/ApiProvider';

/**
 * Trigger a Layers 1-3 pipeline run for an onboarded client: POST /run
 * { clientId }. Fire-and-forget on the backend (runs minutes, detached); it
 * returns the Run row immediately. Poll its phase with useGetRun.
 */
export const useTriggerRun = () => {
  const api = useApiContext();

  return useMutation({
    mutationFn: async ({ clientId }: { clientId: string }) => {
      const { data } = await api.runApi.trigger({ clientId });
      return data as { id: string; phase: string; domain?: string };
    },
  });
};
