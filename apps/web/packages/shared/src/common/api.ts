import { AxiosInstance } from 'axios';
import { AuthApi, ClientApi, RunApi, UserApi } from '../_api';

export const setupHttpEndpoints = (
  httpClient: AxiosInstance,
  apiEndpoint: string,
) => {
  const authApi = new AuthApi(undefined, apiEndpoint, httpClient);
  const userApi = new UserApi(undefined, apiEndpoint, httpClient);
  const clientApi = new ClientApi(undefined, apiEndpoint, httpClient);
  const runApi = new RunApi(undefined, apiEndpoint, httpClient);

  return {
    authApi,
    userApi,
    clientApi,
    runApi,
  };
};

export type ApiEndpoints = ReturnType<typeof setupHttpEndpoints>;
