import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useAuthStore } from './useAuthStore';
import {
  DevtoolsName,
  StoreName,
  TokenExchangeAction,
} from '../common/constant';

type ExchangeTokenAction = (currentRefreshToken: string) => Promise<{
  accessToken: string;
  refreshToken: string;
}>;

interface TokenExchangeState {
  _exchangePromise: Promise<null> | null;
  _exchangeTokenActionCallback: ExchangeTokenAction | null;

  setExchangeTokenAction: (cb: ExchangeTokenAction) => void;
  exchangeOnlyOnce: () => Promise<unknown>;
}

/**
 * Non-persisted store for token exchange bookkeeping.
 *
 * Kept separate from the persisted AuthStore so that set() calls here
 * (e.g. updating _exchangePromise) don't trigger Zustand persist
 * write-back, which would overwrite cross-tab tokens in localStorage
 * before rehydrate can read them.
 */
export const useTokenExchangeStore = create<TokenExchangeState>()(
  devtools(
    (set, get) => ({
      _exchangePromise: null satisfies Promise<null> | null,
      _exchangeTokenActionCallback: null satisfies ExchangeTokenAction | null,

      setExchangeTokenAction: (cb) =>
        set(
          { _exchangeTokenActionCallback: cb },
          false,
          TokenExchangeAction.SetExchangeTokenAction,
        ),

      exchangeOnlyOnce: async () => {
        const { _exchangePromise } = get();
        if (_exchangePromise) {
          return _exchangePromise;
        }

        const exchangeToken = async (): Promise<null> => {
          const refreshToken = useAuthStore.getState().authData?.refreshToken;
          if (refreshToken) {
            try {
              const result =
                await get()._exchangeTokenActionCallback?.(refreshToken);
              if (result) {
                useAuthStore
                  .getState()
                  .setTokens(result.accessToken, result.refreshToken);
              }
            } catch {
              return null;
            }
          }
          return null;
        };

        try {
          const promise = exchangeToken();
          set(
            { _exchangePromise: promise },
            false,
            TokenExchangeAction.ExchangeStart,
          );
          await promise;
        } finally {
          set(
            { _exchangePromise: null },
            false,
            TokenExchangeAction.ExchangeEnd,
          );
        }
      },
    }),
    {
      name: DevtoolsName,
      store: StoreName.TokenExchange,
      enabled: import.meta.env.VITE_STORE_DEVTOOLS === 'true',
    },
  ),
);
