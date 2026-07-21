import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import {
  invalidateAllAccessTokens,
  invalidateAllRefreshTokens,
  invalidateAllTokens,
  setAccessTokenExpiry,
  setRefreshTokenExpiry,
  resetTokenExpiry,
  simulateCrossTabRefresh,
} from './data/tokens';

export const worker = setupWorker(...handlers);

// Expose helpers on window for browser console testing
window.msw = {
  invalidateAllAccessTokens,
  invalidateAllRefreshTokens,
  invalidateAllTokens,
  setAccessTokenExpiry,
  setRefreshTokenExpiry,
  resetTokenExpiry,
  simulateCrossTabRefresh,
};
