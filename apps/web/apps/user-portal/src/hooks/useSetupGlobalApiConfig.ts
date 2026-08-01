import { useSetupGlobalApiConfig as useSetupGlobalApiConfigShared } from 'shared';
import { apiEndpoint } from '../config/env';

export const useSetupGlobalApiConfig = () => {
  return useSetupGlobalApiConfigShared(apiEndpoint);
};
