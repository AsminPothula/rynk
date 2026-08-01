let tokenCounter = 0;

const TOKEN_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes default
const REFRESH_TOKEN_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes default

interface StoredToken {
  userId: string;
  expiresAt: number;
}

const activeTokens = new Map<string, StoredToken>();
const activeRefreshTokens = new Map<string, StoredToken>();

// When true, fallback parsing is disabled — only tokens in the Map are accepted
let accessTokensFallbackDisabled = false;
let refreshTokensFallbackDisabled = false;

// Allows overriding expiry for testing
let accessTokenExpiryMs = TOKEN_EXPIRY_MS;
let refreshTokenExpiryMs = REFRESH_TOKEN_EXPIRY_MS;

export function generateTokenPair(userId: string) {
  tokenCounter++;
  const timestamp = Date.now();
  return {
    accessToken: `mock-access-${userId}-${timestamp}-${tokenCounter}`,
    refreshToken: `mock-refresh-${userId}-${timestamp}-${tokenCounter}`,
    userId,
  };
}

function parseUserIdFromToken(token: string): string | null {
  // Token format: mock-access-{userId}-{timestamp}-{counter}
  //            or mock-refresh-{userId}-{timestamp}-{counter}
  const match = token.match(/^mock-(?:access|refresh)-(.+)-\d+-\d+$/);
  return match ? match[1] : null;
}

export function storeToken(accessToken: string, userId: string) {
  activeTokens.set(accessToken, {
    userId,
    expiresAt: Date.now() + accessTokenExpiryMs,
  });
}

export function getUserIdFromToken(accessToken: string): string | null {
  const entry = activeTokens.get(accessToken);
  if (entry) {
    if (Date.now() > entry.expiresAt) {
      activeTokens.delete(accessToken);
      return null;
    }
    return entry.userId;
  }
  // Fallback: parse userId from token string (survives page reload)
  // Disabled after explicit invalidation so testing works correctly
  if (accessTokensFallbackDisabled) return null;
  return parseUserIdFromToken(accessToken);
}

export function storeRefreshToken(refreshToken: string, userId: string) {
  activeRefreshTokens.set(refreshToken, {
    userId,
    expiresAt: Date.now() + refreshTokenExpiryMs,
  });
}

export function getUserIdFromRefreshToken(refreshToken: string): string | null {
  const entry = activeRefreshTokens.get(refreshToken);
  if (entry) {
    if (Date.now() > entry.expiresAt) {
      activeRefreshTokens.delete(refreshToken);
      return null;
    }
    return entry.userId;
  }
  if (refreshTokensFallbackDisabled) return null;
  return parseUserIdFromToken(refreshToken);
}

// ─── Console helpers for manual testing ───

export function invalidateAllAccessTokens() {
  activeTokens.clear();
  accessTokensFallbackDisabled = true;
  console.log(
    '[MSW] All access tokens invalidated. Next API call will trigger token refresh.',
  );
}

export function invalidateAllRefreshTokens() {
  activeRefreshTokens.clear();
  refreshTokensFallbackDisabled = true;
  console.log(
    '[MSW] All refresh tokens invalidated. Next token refresh will fail → logout.',
  );
}

export function invalidateAllTokens() {
  invalidateAllAccessTokens();
  invalidateAllRefreshTokens();
  console.log(
    '[MSW] All tokens invalidated. Next API call will 401 → refresh will fail → logout.',
  );
}

export function setAccessTokenExpiry(ms: number) {
  accessTokenExpiryMs = ms;
  console.log(
    `[MSW] Access token expiry set to ${ms}ms. New tokens will use this value.`,
  );
}

export function setRefreshTokenExpiry(ms: number) {
  refreshTokenExpiryMs = ms;
  console.log(
    `[MSW] Refresh token expiry set to ${ms}ms. New tokens will use this value.`,
  );
}

export function resetTokenExpiry() {
  accessTokenExpiryMs = TOKEN_EXPIRY_MS;
  refreshTokenExpiryMs = REFRESH_TOKEN_EXPIRY_MS;
  console.log(
    '[MSW] Token expiry reset to defaults (access: 5min, refresh: 30min).',
  );
}

export function simulateCrossTabRefresh() {
  const raw = localStorage.getItem('app:auth');
  const persisted = raw ? JSON.parse(raw) : null;
  const currentAuth = persisted?.state?.authData;
  if (!currentAuth?.id) {
    console.warn('[MSW] No auth data in localStorage — log in first.');
    return;
  }

  const tokens = generateTokenPair(currentAuth.id);
  storeToken(tokens.accessToken, tokens.userId);
  storeRefreshToken(tokens.refreshToken, tokens.userId);

  persisted.state.authData = {
    ...currentAuth,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    _authTokenVersion: (currentAuth._authTokenVersion ?? 0) + 1,
  };
  localStorage.setItem('app:auth', JSON.stringify(persisted));

  console.log(
    '[MSW] Simulated cross-tab refresh. Fresh tokens planted in localStorage + MSW.',
  );
}
