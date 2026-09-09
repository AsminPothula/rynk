import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiContext } from '../../../providers/ApiProvider';

/**
 * Edit an onboarded client's profile: PATCH /client/:id/profile.
 *
 * The generated OpenAPI client doesn't expose this route, so we reuse the same
 * authenticated axios instance the ClientApi was built with (it carries the
 * Bearer-token interceptor) and call the endpoint directly.
 *
 * `rerun` controls whether the backend auto-re-runs Layers 1-3 after saving:
 *   - true (default): dashboard edit → recompute immediately.
 *   - false: first-run setup → persist the edit only; the run is fired
 *     explicitly once all setup steps are confirmed.
 */
export const useEditClientProfile = () => {
  const api = useApiContext();
  const qc = useQueryClient();
  // BaseAPI stores the configured axios + basePath; reuse them (auth attached).
  const axios = (api.clientApi as any).axios;
  const basePath = (api.clientApi as any).basePath ?? '';

  return useMutation({
    mutationFn: async ({
      clientId,
      patch,
      rerun = true,
    }: {
      clientId: string;
      patch: Record<string, unknown>;
      rerun?: boolean;
    }) => {
      const { data } = await axios.patch(`${basePath}/v1/client/${clientId}/profile`, {
        ...patch,
        rerun,
      });
      return data;
    },
    onSuccess: (_data, { clientId }) => {
      qc.invalidateQueries({ queryKey: ['clients', 'list'] });
      qc.invalidateQueries({ queryKey: ['runs', 'latest', clientId] });
    },
  });
};
