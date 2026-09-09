import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiContext } from '../../../providers/ApiProvider';

/**
 * Onboard a domain: POST /client { url }. The backend runs the pipeline's
 * onboarding step (scrape + AI extract, ~1 min) synchronously and returns the
 * created/refreshed client row with its extracted context. Trigger the layers
 * run separately afterwards (useTriggerRun).
 */
export const useOnboardClient = () => {
  const api = useApiContext();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ url }: { url: string }) => {
      const { data } = await api.clientApi.onboard({ url });
      return data as {
        id: string;
        domain: string;
        name: string;
        status: string;
        context: Record<string, any> | null;
      };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clients', 'list'] });
    },
  });
};
