import axios, { AxiosInstance } from 'axios';
import { type HttpClientMinState } from '../type';

export const createHttpClient = () => {
  const httpClient = axios.create();
  return httpClient;
};

export const setupHttpInterceptors = (
  httpClient: AxiosInstance,
  httpClientMinState: HttpClientMinState,
) => {
  httpClient.interceptors.request.use((config) => {
    const { authData, authTokenVersion } = httpClientMinState;
    if (authData) {
      const { accessToken } = authData;
      if (accessToken) {
        config.headers.set('Authorization', `Bearer ${accessToken}`);
      }
      config._authTokenVersion = authTokenVersion;
    }

    return config;
  });

  httpClient.interceptors.response.use(undefined, async (err) => {
    const { config, response } = err;
    const statusCode = +response.status;

    // if 401 and token expired?
    if (statusCode === 401 && !config._retried && !config._skipExchange) {
      config._retried = true;

      // await exchange the token only once.
      if (config._authTokenVersion === httpClientMinState.authTokenVersion) {
        try {
          await httpClientMinState.exchangeOnlyOnce();
        } catch {
          // exchange failed — will attempt rehydrate below
        }
      }

      await httpClientMinState.rehydrateAuth();

      return httpClient(config);
    }

    // if 401 (skip logout if explicitly opted out)
    if (statusCode === 401 && !config._skipLogout) {
      try {
        httpClientMinState.logout();
      } catch {
        //
      }
    }
    throw err;
  });
};
