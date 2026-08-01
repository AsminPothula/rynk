import { useMemo } from 'react';
import {
  createHttpClient,
  setupHttpInterceptors,
  setupHttpEndpoints,
} from '../common';
import { useAuthStore } from '../state/useAuthStore';
import { useTokenExchangeStore } from '../state/useTokenExchangeStore';

export const useSetupGlobalApiConfig = (apiEndpoint: string) => {
  const api = useMemo(() => {
    const httpClient = createHttpClient();

    // Create an HttpClientMinState adapter that reads from Zustand
    const httpClientMinState = {
      get authData() {
        return useAuthStore.getState().authData;
      },
      get authTokenVersion() {
        return useAuthStore.getState().authData?._authTokenVersion;
      },
      exchangeOnlyOnce: () =>
        useTokenExchangeStore.getState().exchangeOnlyOnce(),
      logout: () => useAuthStore.getState().logout(),
      rehydrateAuth: async () => {
        await useAuthStore.persist.rehydrate();
      },
    };

    setupHttpInterceptors(httpClient, httpClientMinState);

    const endpoints = setupHttpEndpoints(httpClient, apiEndpoint);

    useTokenExchangeStore
      .getState()
      .setExchangeTokenAction(async (currentRefreshToken) => {
        const response = await endpoints.authApi.refreshToken(
          { refreshToken: currentRefreshToken },
          { _skipExchange: true, _skipLogout: true },
        );

        const { accessToken, refreshToken } = response.data;
        return { accessToken, refreshToken };
      });

    return endpoints;
  }, [apiEndpoint]);

  return api;
};
