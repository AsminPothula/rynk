import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { AuthData } from '../type';
import {
  AuthAction,
  CacheKey,
  DevtoolsName,
  StoreName,
} from '../common/constant';

interface AuthState {
  authData: AuthData | null;
  ready: boolean;

  setLoginInfo: (params: {
    userId: string;
    accessToken: string;
    refreshToken: string;
  }) => void;
  setAuthData: (authData: AuthData | null) => void;
  removeAuthData: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) =>
        ({
          authData: null satisfies AuthData | null,
          ready: true,

          setAuthData: (authData) =>
            set({ authData: authData }, false, AuthAction.SetAuthData),

          removeAuthData: () =>
            set({ authData: null }, false, AuthAction.RemoveAuthData),

          setLoginInfo: (params) => {
            const { userId, accessToken, refreshToken } = params;
            set(
              {
                authData: {
                  _authTokenVersion: 0,
                  accessToken,
                  id: userId,
                  refreshToken,
                },
              },
              false,
              AuthAction.SetLoginInfo,
            );
          },

          setTokens: (accessToken, refreshToken) => {
            const { authData } = get();
            if (authData) {
              set(
                {
                  authData: {
                    ...authData,
                    _authTokenVersion: authData._authTokenVersion + 1,
                    accessToken,
                    refreshToken,
                  },
                },
                false,
                AuthAction.SetTokens,
              );
            }
          },

          logout: () => {
            set({ authData: null }, false, AuthAction.Logout);
            // Side effects (clear sidebar, inactivity) handled by
            // setup/authTransitions.ts — runs on any authData → null transition.
          },
        }) satisfies AuthState,
      {
        name: CacheKey.Auth,
        partialize: (state) => ({ authData: state.authData }),
      },
    ),
    {
      name: DevtoolsName,
      store: StoreName.Auth,
      enabled: import.meta.env.VITE_STORE_DEVTOOLS === 'true',
    },
  ),
);

export const fromAuth = {
  isAuthenticated: (s: AuthState): boolean => !!s.authData?.id,
};
