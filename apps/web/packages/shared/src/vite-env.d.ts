/// <reference types="vite/client" />

declare module '*.svg' {
  const src: string;
  export default src;
}

/** Custom properties exposed on window. */
interface Window {
  /** E2E inactivity keepalive interval. */
  __keepAlive?: ReturnType<typeof setInterval>;
  /** MSW test helpers (available when MOCK_API=true). */
  msw?: {
    invalidateAllAccessTokens(): void;
    invalidateAllRefreshTokens(): void;
    invalidateAllTokens(): void;
    setAccessTokenExpiry(ms: number): void;
    setRefreshTokenExpiry(ms: number): void;
    resetTokenExpiry(): void;
    simulateCrossTabRefresh(): void;
  };
  /** React Query devtools toggle. */
  toggleDevtools?: () => void;
}
