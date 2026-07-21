# React Web Starter

A monorepo starter with React + TypeScript + Vite, featuring a complete auth system, OpenAPI-generated API layer, MSW mocks, and Zustand state management.

## Project Structure

```
react-web-starter/
├── apps/
│   ├── user-portal/          # User-facing application (:3021)
│   └── admin-portal/         # Admin-facing application (:3022)
├── packages/
│   └── shared/               # Shared libraries, API client, UI components, mocks (see [shared/README](packages/shared/README.md))
├── package.json              # Workspace root
└── turbo.json                # Turbo build orchestration
```

## Getting Started

### Prerequisites

- Node.js v20+
- npm

### Setup

```bash
npm install
```

### Environment Variables

Copy the template and fill in values for each portal:

```bash
cp apps/user-portal/.env.template apps/user-portal/.env
cp apps/admin-portal/.env.template apps/admin-portal/.env
```

#### User Portal `.env`

```env
VITE__USER_PORTAL__APP_ENV="local"
VITE__USER_PORTAL__API_ENDPOINT="http://localhost:3021"
VITE__USER_PORTAL__REACT_QUERY_DEBUGGING="true"
VITE__USER_PORTAL__MOCK_API="true"
```

#### Admin Portal `.env`

```env
VITE__ADMIN_PORTAL__APP_ENV="local"
VITE__ADMIN_PORTAL__API_ENDPOINT="http://localhost:3022"
VITE__ADMIN_PORTAL__REACT_QUERY_DEBUGGING="true"
VITE__ADMIN_PORTAL__MOCK_API="true"
```

### Running

```bash
npm run user:dev    # User portal on :3021
npm run admin:dev   # Admin portal on :3022
npm run all:dev     # Both portals
```

### Building

```bash
npm run build
```

---

## Mock API (MSW)

When `VITE__*__MOCK_API="true"`, the app boots [MSW](https://mswjs.io/) before rendering. All API calls are intercepted by the service worker — no real backend needed.

### Test Credentials

- **Email**: `admin@test.com`
- **Password**: `password123`

### How It Works

- `main.tsx` conditionally calls `startMockWorker()` via dynamic import
- MSW handlers live in `packages/shared/src/mocks/handlers/`
- Mock data (50 users) lives in `packages/shared/src/mocks/data/`
- In production builds, MSW is fully tree-shaken out

### Testing Token Refresh & Logout Flows

When MSW is enabled, helper functions are exposed on `window.msw` in the browser console. These let you simulate token expiry scenarios without waiting for real timeouts.

#### Scenario 1: Access token expired → refresh succeeds

```js
// Invalidates all access tokens. Next API call will:
// 1. Get 401 from the server
// 2. Interceptor calls /auth/refresh-token with the refresh token
// 3. New tokens issued, original request retried automatically
msw.invalidateAllAccessTokens();
```

Trigger any API call (e.g. navigate to a page). In the Network tab you'll see: original request → 401, then `/auth/refresh-token` → 200, then original request retried → 200.

#### Scenario 2: Both tokens expired → logout

```js
// Invalidates both access and refresh tokens.
// Next API call will 401, refresh will also 401 → app logs out.
msw.invalidateAllTokens();
```

Trigger any API call. The user gets redirected to the landing page.

#### Scenario 3: Only refresh token expired → logout on next 401

```js
// Expire refresh tokens first, then access tokens
msw.invalidateAllRefreshTokens();
msw.invalidateAllAccessTokens();
```

Same result as scenario 2 — the refresh call fails because the refresh token is invalid, so the user gets logged out.

#### Scenario 4: Cross-tab race — exchange fails, another tab rescued

```js
// Simulates the cross-tab race condition:
// 1. All access tokens invalid → next API call will 401
// 2. All refresh tokens invalid → exchange will fail
// 3. But another tab already refreshed → fresh tokens in localStorage + MSW
msw.invalidateAllAccessTokens();
msw.invalidateAllRefreshTokens();
msw.simulateCrossTabRefresh();
```

Trigger any API call. The interceptor will: 401 → exchange fails → rehydrate from localStorage (picks up the other tab's tokens) → retry succeeds. No logout.

#### Scenario 5: Auto-expiring tokens (timed)

```js
// Access token expires in 10 seconds, refresh token in 20 seconds
msw.setAccessTokenExpiry(10000);
msw.setRefreshTokenExpiry(20000);
```

Log in, wait 10 seconds, trigger an API call → refresh flow kicks in. Wait 20 seconds total → both tokens expire, next call logs you out.

```js
// Reset to defaults (access: 5 min, refresh: 30 min)
msw.resetTokenExpiry();
```

#### Token & Auth Flow (Complete)

##### Login

```
User submits email + password
  → useLogin() calls api.authApi.signIn({ email, password })
  → Backend returns { accessToken, refreshToken, userId }
  → useAuthStore.getState().setLoginInfo({ userId, accessToken, refreshToken })
  → Stored in Zustand store + persisted to localStorage
  → Router observes isAuthenticated → navigates to Dashboard
  → ProfileInterceptor fetches /user/profile → stores in profile state
```

##### Normal API Request

```
React Query hook calls api.userApi.getUsers()
  → Axios request interceptor runs:
     1. Reads useAuthStore.getState().authData.accessToken
     2. Attaches Authorization: Bearer <accessToken>
     3. Stamps config._authTokenVersion = current version
  → Request sent to backend
  → 200 OK → data returned to hook
```

##### Access Token Expired → Refresh Succeeds

```
API call → backend returns 401
  → Axios response interceptor catches error
  → Checks: statusCode === 401
            && !config._retried        (first attempt)
            && !config._skipExchange   (not a refresh call)
  → All true → enters exchange block:
     1. Sets config._retried = true
     2. Checks config._authTokenVersion === store's authTokenVersion
        (ensures exchange hasn't already happened for this token generation)
     3. Calls useTokenExchangeStore.getState().exchangeOnlyOnce()

        exchangeOnlyOnce():
          → If _exchangePromise exists, returns it (deduplication)
          → Otherwise calls _exchangeToken():
             a. Reads useAuthStore.getState().authData.refreshToken
             b. Calls authApi.refreshToken({ refreshToken }, { _skipExchange: true, _skipLogout: true })
                (_skipExchange prevents the refresh call's own 401 from
                 re-entering the exchange block → avoids deadlock)
                (_skipLogout prevents the refresh call's 401 from
                 triggering logout directly — gives rehydrate a chance)
             c. Backend returns { accessToken, refreshToken, userId }
             d. Calls useAuthStore.getState().setTokens(newAccess, newRefresh)
                → Updates authData in Zustand store + localStorage
                → Increments _authTokenVersion

     4. Rehydrates from localStorage (in case another tab refreshed)
     5. Retries original request: httpClient(config)
        → Request interceptor re-runs, reads NEW accessToken from store
        → Request sent with new token
        → 200 OK → data returned as if nothing happened
```

##### Access Token Expired → Refresh Fails → Another Tab Rescued (Cross-Tab Recovery)

```
API call → 401
  → Interceptor enters exchange block
  → exchangeOnlyOnce() → _exchangeToken():
     a. Calls authApi.refreshToken({ refreshToken }, { _skipExchange: true, _skipLogout: true })
     b. Backend returns 401 (refresh token already consumed by another tab)
     c. _skipExchange prevents re-entering exchange block
     d. _skipLogout prevents the refresh 401 from triggering logout directly
     e. The 401 error propagates → _exchangeToken catches it → returns null
     f. No new tokens stored, _authTokenVersion unchanged
  → exchangeOnlyOnce() resolves (exchange failed silently)
  → Interceptor calls rehydrateAuth()
     → persist.rehydrate() reads from localStorage
     → Another tab already wrote fresh tokens there
     → Store updated with new tokens + incremented _authTokenVersion
  → Interceptor retries original request
     → Request interceptor reads NEW token from store
     → 200 OK — no logout, session continues ✅
```

##### Access Token Expired → Refresh Fails → No Tab Rescued → Logout

```
API call → 401
  → Interceptor enters exchange block
  → exchangeOnlyOnce() → _exchangeToken():
     a. Calls authApi.refreshToken({ refreshToken }, { _skipExchange: true, _skipLogout: true })
     b. Backend returns 401 (refresh token expired/invalid)
     c. _skipLogout prevents the refresh 401 from triggering logout directly
     d. The 401 error propagates → _exchangeToken catches it → returns null
  → exchangeOnlyOnce() resolves (exchange failed silently)
  → Interceptor calls rehydrateAuth()
     → persist.rehydrate() reads from localStorage
     → No other tab rescued — same stale tokens
     → _authTokenVersion unchanged
  → Interceptor retries original request with OLD token (still expired)
  → Backend returns 401 again
  → Interceptor: config._retried is true → skips exchange block
  → Hits second 401 check: statusCode === 401 && !config._skipLogout
     → Calls useAuthStore.getState().logout()
        → Clears authData from Zustand store + localStorage
        → Clears sidebar preference
        → Clears profile
     → Router observes isUserAuthenticated === false
     → Redirects to Landing page
  → Throws error (caller's catch handles it)
```

##### Multiple Concurrent 401s (Thundering Herd Prevention)

```
3 API calls fire simultaneously, all get 401
  → Call A: enters exchange block, calls exchangeOnlyOnce()
     → Creates _exchangePromise, starts refresh
  → Call B: enters exchange block, calls exchangeOnlyOnce()
     → _exchangePromise exists → returns same promise (no second refresh call)
  → Call C: same as Call B
  → Refresh completes → _authTokenVersion incremented
  → Call A retries with new token → 200
  → Call B retries with new token → 200
  → Call C retries with new token → 200

Only ONE refresh call was made, all three calls get the new token.
```

##### Any Non-401 Error on Refresh (e.g. 500, Network Error)

```
API call → 401 → interceptor calls exchangeOnlyOnce()
  → _exchangeToken() calls authApi.refreshToken({ _skipExchange, _skipLogout })
  → Refresh fails with 500 / network error / timeout
  → _exchangeToken catches the error → returns null (no logout here)
  → rehydrateAuth() — no cross-tab rescue available
  → Interceptor retries original request with old token
  → Gets 401 again → _retried is true → calls logout()

Result: any refresh failure eventually leads to logout,
        but only because the retried request gets 401.
        Only 401 directly triggers logout — not 500s or network errors.
```

##### Key Interceptor Flags

| Flag                       | Set By                     | Purpose                                                                                                                                                           |
| -------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config._retried`          | Response interceptor       | Prevents infinite retry loop — only one exchange attempt per request                                                                                              |
| `config._authTokenVersion` | Request interceptor        | Tracks which token generation this request used — prevents redundant exchanges                                                                                    |
| `config._skipExchange`     | Caller (e.g. refresh call) | Tells interceptor to skip the exchange block — prevents deadlock on refresh 401                                                                                   |
| `config._skipLogout`       | Caller (e.g. refresh call) | Tells interceptor to skip auto-logout on 401 — used on refresh call so a failed exchange doesn't logout before rehydrate has a chance to recover from another tab |

##### Token Lifecycle

```
Login
  → accessToken (v0) + refreshToken (v0) stored
  → _authTokenVersion = 0

Access token expires, refresh succeeds
  → accessToken (v1) + refreshToken (v1) stored
  → _authTokenVersion = 1

Access token expires again, refresh succeeds
  → accessToken (v2) + refreshToken (v2) stored
  → _authTokenVersion = 2

Refresh token expires
  → Next 401 → refresh fails → retry 401 → logout
  → All tokens cleared from authData + localStorage

Page reload
  → Tokens restored from localStorage
  → _authTokenVersion = 0 (reset)
  → Normal flow resumes
```

#### Available `window.msw` helpers

| Helper                             | Effect                                                                             |
| ---------------------------------- | ---------------------------------------------------------------------------------- |
| `msw.invalidateAllAccessTokens()`  | Clears access tokens → next API call triggers refresh                              |
| `msw.invalidateAllRefreshTokens()` | Clears refresh tokens → next refresh call fails                                    |
| `msw.invalidateAllTokens()`        | Clears both → next API call goes straight to logout                                |
| `msw.setAccessTokenExpiry(ms)`     | Sets expiry for newly issued access tokens                                         |
| `msw.setRefreshTokenExpiry(ms)`    | Sets expiry for newly issued refresh tokens                                        |
| `msw.resetTokenExpiry()`           | Resets to defaults (5 min / 30 min)                                                |
| `msw.simulateCrossTabRefresh()`    | Plants fresh tokens in localStorage + MSW (simulates another tab having refreshed) |

### Disabling Mocks

Set `MOCK_API` to `"false"` (or remove it) and point `API_ENDPOINT` to your real backend:

```env
VITE__USER_PORTAL__MOCK_API="false"
VITE__USER_PORTAL__API_ENDPOINT="https://your-api.example.com"
```

### Removing MSW Completely

When your project connects to a real backend and you no longer need mocks, remove all MSW code:

**1. Uninstall the dependency:**

```bash
npm uninstall msw -w packages/shared
```

**2. Delete mock files:**

```bash
rm -rf packages/shared/src/mocks
rm apps/user-portal/public/mockServiceWorker.js
rm apps/admin-portal/public/mockServiceWorker.js
```

**3. Revert `main.tsx` in both portals** — remove the `enableMocking()` wrapper:

```tsx
// Before (with MSW)
async function enableMocking() { ... }
enableMocking().then(() => { ReactDOM.createRoot(...).render(...) });

// After (without MSW)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

**4. Remove `MOCK_API` env variable** from both portals:

- Delete `VITE__USER_PORTAL__MOCK_API` from `apps/user-portal/.env` and `.env.template`
- Delete `VITE__ADMIN_PORTAL__MOCK_API` from `apps/admin-portal/.env` and `.env.template`
- Remove the `VITE__*__MOCK_API` entry and `mockApiEnabled` export from `apps/*/src/config/env.ts`

**5. Remove `msw` entry from `package.json`:**

```bash
# Remove the msw.workerDirectory entry added by msw init
# in the root package.json (under "msw" key)
```

**6. Update your OpenAPI spec and regenerate:**

Replace `packages/shared/openapi.starter.yaml` with your real backend's OpenAPI spec, update `openapi.url.env`, and run `npm run generate-api`.

---

## API Layer

### OpenAPI Code Generation

The API client is generated from `packages/shared/openapi.starter.yaml`:

```bash
npm run generate-api
```

This produces TypeScript Axios classes in `packages/shared/src/_api/` with two API classes:

- **AuthApi** — signIn, signUp, refreshToken, forgotPassword, setUserPassword, changePassword, checkEmail
- **UserApi** — getMyProfile, updateMyProfile, getUsers

### Using the API in Hooks

All hooks access the API through React context:

```typescript
import { useApiContext } from '@/providers/ApiProvider';

export const useMyHook = () => {
  const api = useApiContext();

  return useQuery({
    queryKey: ['my-key'],
    queryFn: async () => {
      const { data } = await api.userApi.getMyProfile();
      return data;
    },
  });
};
```

### Adding New Endpoints

1. Add the endpoint to `packages/shared/openapi.starter.yaml`
2. Run `npm run generate-api`
3. Update `packages/shared/src/common/api.ts` if a new API class was created
4. Add MSW handler in `packages/shared/src/mocks/handlers/`
5. Create a React Query hook using `useApiContext()`

---

## State Management

Zustand stores with `persist` middleware handle all client-side global state. Each store is independent and accessed directly via hooks — no monolithic AppState or context provider needed.

```
Zustand Stores (persisted)
├── useAuthStore           — authData, tokens, login/logout
├── useThemeStore          — dark/light/system theme preference
├── useLanguageStore       — language preference (en/de)
├── useUIPreferencesStore  — sidebar open preference
└── useInactivityStore     — lastActiveAt (warning state computed locally per tab)

Zustand Stores (transient)
├── useTokenExchangeStore  — token exchange dedup (_exchangePromise) and callback (non-persisted to avoid localStorage write-back conflicts)
└── useLeaderElectionStore — Web Locks–based leader election (multi-lock, available for future use)

App Setup (packages/shared/src/setup/)
├── initApp()                  — one-time app initialization (auth transitions + devtools)
├── authTransitions            — callback registry for auth state changes (onAuthLogout, onAuthLogin)
├── defaultAuthCallbacks       — registers default logout cleanup (clear sidebar, inactivity)
└── devtools                   — mountStoreDevtools() for window.stores console helper
```

All `app:`-prefixed keys are defined in `constant.ts`: `CacheKey` for localStorage keys, `LockName` for Web Locks. This avoids collisions with third-party services and keeps lock/key names in one place.

All persisted stores automatically sync across browser tabs via `useAppCrossTabSync()` (called in `App.tsx`), which listens for `storage` events and rehydrates matching stores. See [Cross-Tab Sync & Leader Election](packages/shared/docs/cross-tab-sync.md) for architecture details.

Auth transition side effects (clear sidebar, clear inactivity on logout) are handled via a store subscription registered by `initApp()`. This ensures cleanup runs regardless of how `authData` is cleared (direct logout, cross-tab rehydration, token failure).

A `HydrationGate` component wraps the app tree to prevent rendering until all persisted stores have hydrated from localStorage.

---

## Debugging State

Both debugging tools are disabled by default and controlled via env vars.

### Browser Console (`window.stores`)

Set `VITE__<PORTAL>__STORE_DEVTOOLS="true"` in your `.env` to expose stores on `window.stores`:

```js
stores.auth(); // → { authData: {...}, ready: true, ... }
stores.uiPreferences(); // → { preferSidebarOpen: false }
stores.inactivity(); // → { lastActiveAt: 1711234567890, ... }
```

### Redux DevTools Extension

Set `VITE_STORE_DEVTOOLS="true"` in your `.env` to enable the Zustand `devtools` middleware. Then install the [Redux DevTools](https://chromewebstore.google.com/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) browser extension to see state changes in real time. Each store appears as a separate instance (`AuthStore`, `TokenExchangeStore`, `UIPreferencesStore`, `InactivityStore`, `LeaderElectionStore`).

| Env Var                          | Scope                 | Controls                            |
| -------------------------------- | --------------------- | ----------------------------------- |
| `VITE_STORE_DEVTOOLS`            | Shared (both portals) | Redux DevTools extension connection |
| `VITE__<PORTAL>__STORE_DEVTOOLS` | Per portal            | `window.stores` console helper      |

---

## E2E Testing (Playwright)

End-to-end tests live in `e2e/` and use [Playwright](https://playwright.dev/) with Chromium. Each test runs in an isolated browser context (separate localStorage, cookies).

### Running tests

```bash
npm run test:e2e              # headless, both portals (excludes inactivity)
npm run test:e2e:user         # headless, user portal only
npm run test:e2e:admin        # headless, admin portal only
npm run test:e2e:inactivity   # headless, inactivity tests only
npm run test:e2e:all          # headless, all tests including inactivity
npm run test:e2e:ui           # interactive picker (portal + headed/ui mode)
```

### Setup

Tests work out of the box with MSW (Mock Service Worker) — no real backend needed. MSW intercepts HTTP requests in the browser and returns mock responses, so the app behaves as if a real API is running.

To run against a **real backend**, create a `.env.e2e` file with test credentials:

```bash
cp .env.e2e.template .env.e2e   # then fill in real credentials
```

Playwright loads `.env.e2e` via `dotenv` at config time. The file is gitignored.

### Test credentials

Credentials are portal-specific and role-based. Each portal can have different users for different roles, following the pattern `E2E__<PORTAL>__<ROLE>_EMAIL/PASSWORD`:

| Variable                            | Default          | Description                 |
| ----------------------------------- | ---------------- | --------------------------- |
| `E2E__USER_PORTAL__ADMIN_EMAIL`     | `admin@test.com` | User portal admin login     |
| `E2E__USER_PORTAL__ADMIN_PASSWORD`  | `password123`    | User portal admin password  |
| `E2E__USER_PORTAL__USER_EMAIL`      | `admin@test.com` | User portal user login      |
| `E2E__USER_PORTAL__USER_PASSWORD`   | `password123`    | User portal user password   |
| `E2E__ADMIN_PORTAL__ADMIN_EMAIL`    | `admin@test.com` | Admin portal admin login    |
| `E2E__ADMIN_PORTAL__ADMIN_PASSWORD` | `password123`    | Admin portal admin password |
| `E2E__ADMIN_PORTAL__USER_EMAIL`     | `admin@test.com` | Admin portal user login     |
| `E2E__ADMIN_PORTAL__USER_PASSWORD`  | `password123`    | Admin portal user password  |

Defaults match the MSW mock user, so tests pass without any `.env.e2e` file. To add more roles, extend `TestRole` in `e2e/fixtures/test-users.ts` and add corresponding env vars to `.env.e2e.template`.

### Ports

The inactivity project runs on a separate dev server. The port defaults to `3023` but can be overridden in `.env.e2e` — useful when running multiple worktrees to avoid port conflicts:

```
E2E_INACTIVITY_DEV_PORT=3023
```

### Configuration

`playwright.config.ts` defines two default projects and one opt-in project:

| Project                  | Port | Inactivity | Description                        |
| ------------------------ | ---- | ---------- | ---------------------------------- |
| `user-portal`            | 3021 | Disabled   | All tests except `e2e/inactivity/` |
| `admin-portal`           | 3022 | Disabled   | All tests except `e2e/inactivity/` |
| `user-portal-inactivity` | 3023 | Enabled    | Only `e2e/inactivity/` tests       |

Both default projects start their dev server with `MOCK_API=true` and `INACTIVITY_ENABLED=false`. The **inactivity project** starts a separate dev server with `INACTIVITY_ENABLED=true` and short timeouts (`TIMEOUT=6s`, `WARNING=4s`) so tests can observe warning dialogs and auto-logout without waiting 30 minutes. It runs via `npm run test:e2e:inactivity` (or option 4 in the interactive picker). Since the inactivity logic lives in `shared/`, testing on one portal is sufficient.

When `reuseExistingServer` is true (non-CI), tests run against already-running dev servers. In CI, Playwright starts them automatically. Retries: 1 locally, 2 in CI.

### Test structure

```
e2e/
├── fixtures/
│   ├── test-users.ts              # Credentials (env-overridable defaults)
│   ├── auth.ts                    # login() helper
│   └── helpers.ts                 # neutralizeInactivity(), msw() wrapper
├── auth/
│   ├── sign-in.spec.ts            # Login, invalid creds, navigation
│   ├── sign-up.spec.ts            # Registration, navigation
│   ├── sign-out.spec.ts           # Logout, localStorage cleanup, guards
│   ├── token-exchange.spec.ts     # Token refresh race conditions (MSW)
│   └── session-lifecycle.spec.ts  # Logout edge cases, re-login, token lifecycle
├── navigation/
│   ├── routing-guards.spec.ts     # Auth/unauth redirects
│   └── sidebar.spec.ts           # Nav links, preference persistence
├── settings/
│   ├── theme.spec.ts              # Dark/light/system, persistence
│   └── language.spec.ts          # En/de switching, persistence
├── cross-tab/
│   ├── sync.spec.ts               # Logout, theme, language via StorageEvent
│   └── sync-edge-cases.spec.ts   # Sidebar sync, rapid changes, token refresh, corruption
└── inactivity/                    # Opt-in: npm run test:e2e:inactivity
    ├── auto-logout.spec.ts        # Warning dialog, stay/logout, timeout, activity reset
    └── cross-tab.spec.ts          # Cross-tab activity extension, expired session
```

### MSW dependency

[MSW](https://mswjs.io/) (Mock Service Worker) intercepts HTTP requests in the browser and returns mock responses, so tests don't need a real backend. Most tests are **MSW-independent** — they test UI behavior, routing, and localStorage persistence. A few tests use `window.msw` helpers (e.g. `invalidateAllAccessTokens()`) to simulate token expiry and refresh scenarios:

| File                             | MSW usage                                                   |
| -------------------------------- | ----------------------------------------------------------- |
| `auth/token-exchange.spec.ts`    | All 3 tests — invalidate tokens, simulate cross-tab refresh |
| `auth/session-lifecycle.spec.ts` | "Token exchange edge cases" describe block (7 of 10 tests)  |

All other test files (sign-in, sign-out, navigation, settings, cross-tab, inactivity) work without MSW.

### Removing MSW

When transitioning from MSW to a real backend:

1. **Configure credentials** — fill in `.env.e2e` with real user accounts for each portal/role
2. **Update `playwright.config.ts`** — remove `MOCK_API=true` from the `webServer` commands and point `API_ENDPOINT` to the real backend
3. **MSW-independent tests (majority)** — work as-is, no changes needed
4. **MSW-dependent tests** — the two files listed above need attention:
   - `auth/token-exchange.spec.ts` — these test the interceptor's 401 → refresh → retry flow. With a real backend, you can either wait for natural token expiry or replace `window.msw` helpers with direct backend API calls to invalidate tokens
   - `auth/session-lifecycle.spec.ts` — the "Token exchange edge cases" block uses `msw()` helpers. The "Logout edge cases" and "Re-login" blocks are MSW-independent and work as-is
5. **Remove MSW artifacts** — delete `e2e/fixtures/helpers.ts:msw()`, remove `window.msw` type from `vite-env.d.ts`, and uninstall the `msw` package

### Inactivity tests

Most tests run with `INACTIVITY_ENABLED=false` and call `neutralizeInactivity()` to prevent timeouts during headless execution. Dedicated inactivity tests run on the opt-in `user-portal-inactivity` project with short timeouts and intentionally do **not** call `neutralizeInactivity()` — they need the timer to fire.

### Test coverage

| Suite                  | Tests | Scenarios                                                                                                                 |
| ---------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------- |
| Sign in                | 4     | Successful login, invalid creds, nav to sign-up, nav to forgot password                                                   |
| Sign up                | 2     | Successful registration (handles portal-specific fields), nav to sign-in                                                  |
| Sign out               | 3     | Logout redirect, localStorage cleared, guards after logout                                                                |
| Token exchange         | 3     | Happy path refresh, cross-tab rescue, invalid session logout                                                              |
| Session lifecycle      | 10    | Cancel logout, cleanup, re-login, thundering herd, auto-expiry, refresh expiry, post-exchange nav, multi-cycle, rapid nav |
| Routing guards         | 7     | Unauth redirects (dashboard/settings/users/unknown), auth redirects, landing                                              |
| Sidebar                | 4     | Nav to users/settings/dashboard, preference persistence across reload                                                     |
| Theme                  | 4     | Dark/light/system switching, persistence across reload                                                                    |
| Language               | 4     | English/German switching, persistence across reload                                                                       |
| Cross-tab sync         | 4     | Logout from another tab, theme sync, language sync, localStorage.clear()                                                  |
| Cross-tab edge cases   | 5     | Sidebar sync, rapid changes, token refresh sync, corruption, key removal                                                  |
| Inactivity auto-logout | 6     | Warning dialog, stay logged in, log out now, auto-timeout, activity reset, countdown                                      |
| Inactivity cross-tab   | 3     | Activity extends timer, expired session on load, logout during warning                                                    |

See also: [Token Exchange Flow docs](packages/shared/docs/token-exchange-flow.md) for mermaid sequence diagrams of all scenarios.

---

## Inactivity Auto-Logout

Both portals include a configurable inactivity timer that warns the user before automatically logging them out.

### How It Works

- A Zustand store (`useInactivityStore`) persists `lastActiveAt` to localStorage (only field persisted — warning state is computed locally)
- A setup hook (`useInactivityStoreSetup`) composes three concerns:
  - `useStampOnActivation` — treats new tab / login as activity (unless session expired)
  - `useActivityListeners` — throttled DOM event listeners (keydown, mousedown, etc.)
  - `useInactivityTick` — 1-second interval that computes warning state and triggers logout
- `InactivityProviderZustand` composes the hook + store + warning dialog into a drop-in wrapper
- All tabs run their own tick independently — `logout()` is idempotent, so multiple tabs calling it is safe
- On tab close/reopen: if `elapsed >= timeout`, the user is logged out immediately on load
- Activity in any tab resets the timer for all tabs via cross-tab sync of `lastActiveAt`. See [Cross-Tab Sync](packages/shared/docs/cross-tab-sync.md) for full data flow scenarios.

### Configuration

Controlled via environment variables (all optional, with defaults):

| Variable                     | Default         | Description                                |
| ---------------------------- | --------------- | ------------------------------------------ |
| `INACTIVITY_TIMEOUT_SECONDS` | `1800` (30 min) | Total inactivity before auto-logout        |
| `INACTIVITY_WARNING_SECONDS` | `900` (15 min)  | How long before logout the warning appears |
| `INACTIVITY_ENABLED`         | `false`         | Set to `true` to enable the feature        |

Each portal has its own prefixed env vars (e.g. `VITE__USER_PORTAL__INACTIVITY_ENABLED`).

### Disabling

- Set `INACTIVITY_ENABLED="false"` (or leave it unset — disabled by default)
- Or remove `InactivityProviderZustand` from `App.tsx` entirely

---

## Routing

### Architecture

```
BrowserRouter
└── AuthTokensInterceptor
     ├── Authenticated Routes
     │    └── ProfileInterceptor
     │         └── PrivateRoute (layout with sidebar/nav)
     │              ├── Dashboard
     │              ├── Users
     │              ├── Templates (user-portal only)
     │              └── Settings
     └── Unauthenticated Routes
          ├── Landing
          ├── Login (/sign-in)
          ├── Signup (/sign-up)
          ├── ForgotPassword (/forgot-password)
          └── SetPassword (/set-password)
```

### Route Interceptors

- **AuthTokensInterceptor** — Reads `?auth_tokens=<base64>` from the URL for SSO/deep-link flows, decodes tokens, authenticates, and cleans the URL
- **ProfileInterceptor** — Fetches user profile on authentication, shows a loading state until ready
- **RoleRouteGuard** — Protects routes by role:

```tsx
<Route
  path="/admin-only"
  element={
    <RoleRouteGuard allowedRoles={['admin']}>
      <AdminPage />
    </RoleRouteGuard>
  }
/>
```

### SSO Token Flow

Append base64-encoded JSON to any URL:

```
http://localhost:3021/dashboard?auth_tokens=eyJpZCI6InVzZXItMDAwIiwiYWNjZXNzVG9rZW4iOiJ4eHgiLCJyZWZyZXNoVG9rZW4iOiJ5eXkifQ==
```

The JSON payload should be: `{ "id": "...", "accessToken": "...", "refreshToken": "..." }`

---

## Component Architecture

### Layer Model

Components follow a four-layer hierarchy. Each layer only imports from layers below it:

```
Pages (apps/*/src/pages/)
  ↓ compose
Containers (packages/shared/src/containers/)
  ↓ compose
Common Components (packages/shared/src/components/common/)
  ↓ compose
UI Primitives (packages/shared/src/components/ui/)
```

| Layer                 | Location             | Responsibility                                                                      | State                   | Examples                                                                                                                  |
| --------------------- | -------------------- | ----------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **UI Primitives**     | `components/ui/`     | Styled wrappers around Radix/HTML elements. Zero business logic.                    | None                    | Button, Input, Card, AlertDialog                                                                                          |
| **Common Components** | `components/common/` | Domain-aware presentation components. Accept data via props, render UI.             | Local only (e.g. hover) | DataCard, BarChart, LineChart, PieChart, SectionLoader, ErrorState, ConfirmActionAlert, DashboardOverview, DashboardSales |
| **Containers**        | `containers/`        | Wire up form logic, validation, mutations. Accept callbacks/mutations from pages.   | Form state, validation  | LoginForm, SignupForm, RoleRouteGuard, AuthTokensInterceptor                                                              |
| **Pages**             | `apps/*/src/pages/`  | Route-level orchestrators. Fetch data via hooks, compose containers and components. | React Query hooks       | Dashboard, Users, Settings                                                                                                |

### Shared vs Portal-Specific

```
packages/shared/          → Reusable across both portals
apps/user-portal/src/     → User portal only (@/ alias)
apps/admin-portal/src/    → Admin portal only (@/ alias)
```

Portal-specific components are thin wrappers that inject i18n translations and portal-specific configuration into shared components. Example: each portal's `SideNavbar` wraps the shared `SideNavbar` with translated labels and portal-specific nav links.

### Conventions

- **File naming**: kebab-case for component files (`section-loader.tsx`), PascalCase for container files (`LoginForm.tsx`)
- **Barrel exports**: Each component directory has an `index.ts` re-exporting all public components and types
- **Path aliases**: `@shared/` → `packages/shared/src/`, `@/` → `apps/*/src/`
- **Props interfaces**: Exported alongside components. Named `{ComponentName}Props`
- **Charts**: All chart components accept `data` and configuration as props — no hardcoded data
- **Loading states**: Use `SectionLoader` for inline spinners, not raw `LoaderCircle`
- **Error/empty states**: Use `ErrorState` and `EmptyState` for consistent feedback UI
- **Confirmation dialogs**: Use `ConfirmActionAlert` for any "click button → confirm → action" pattern
- **Forms**: Built with React Hook Form + Zod. Use the `FormField` → `FormItem` → `FormControl` → `FormMessage` composition from `form.tsx` — error display is centralized in `FormMessage`
- **Icons**: Lucide React for standard icons. `CustomSVGIconType` for custom SVGs that support `variant: 'on' | 'off'`

### Data Flow

```
Page (useQuery hooks)
  → passes data as props to containers/common components
  → containers manage form state internally
  → mutations passed down as props from page hooks
  → Zustand stores for global auth/UI preferences
```

React Query handles all server state. Zustand handles client-only global state (auth, sidebar preferences, inactivity). No mixing — components never call both for the same concern.

---

## UI Components (shadcn/ui)

This project uses [shadcn/ui](https://ui.shadcn.com/) for UI components. All shared UI components live in `packages/shared/src/components/ui/` and are aliased as `@shared/components/ui/*` in both portals.

### Installing New Components

Due to a known npm workspace bug, the shadcn CLI's auto-install step may fail. Use the `--no-deps` flag:

```bash
# Add a component (installs into packages/shared via alias config)
npx shadcn@latest add <component-name> -c apps/user-portal --no-deps

# Examples
npx shadcn@latest add table -c apps/user-portal --no-deps
npx shadcn@latest add badge -c apps/user-portal --no-deps
npx shadcn@latest add tabs -c apps/user-portal --no-deps
```

### Useful Flags

```bash
# Preview what files will be created/modified
npx shadcn@latest add <component> -c apps/user-portal --dry-run

# See the full source that would be written
npx shadcn@latest add <component> -c apps/user-portal --view

# Overwrite existing component files
npx shadcn@latest add <component> -c apps/user-portal --no-deps --overwrite
```

### If a Component Needs a New Dependency

Install it manually into the shared package:

```bash
npm install <dependency> -w packages/shared
```

### Configuration

The shadcn config lives in `apps/*/components.json`. Key settings:

- **Style**: `default`
- **Base color**: `slate`
- **CSS variables**: enabled
- **Component output**: `packages/shared/src/components/ui/`
- **Utilities**: `packages/shared/src/lib/utils`

---

## CI/CD (Bitbucket Pipelines)

Two pipeline templates are included — pick one during project setup:

| File                             | Auth Method         | When to use                                         |
| -------------------------------- | ------------------- | --------------------------------------------------- |
| `bitbucket-pipelines.oidc.yml`   | OIDC (recommended)  | AWS accounts with OIDC identity provider configured |
| `bitbucket-pipelines.apikey.yml` | Access Key + Secret | Legacy AWS setups without OIDC                      |

### Setup

Copy your chosen template to `bitbucket-pipelines.yml`:

```bash
# OIDC (recommended)
cp bitbucket-pipelines.oidc.yml bitbucket-pipelines.yml

# Or API key
cp bitbucket-pipelines.apikey.yml bitbucket-pipelines.yml
```

### Required Bitbucket Variables

See `.env.cd.template` at the repo root for a copyable reference of all CD variables.

**Both variants:**

| Variable                             | Description                                      |
| ------------------------------------ | ------------------------------------------------ |
| `CD_AWS_DEFAULT_REGION`              | AWS region (e.g. `ap-southeast-1`)               |
| `CD_S3_BUCKET_NAME`                  | S3 bucket for deployments                        |
| `CD_ENVIRONMENT`                     | Deployment environment name (e.g. `development`) |
| `CD__USER_PORTAL__APPLICATION_NAME`  | User portal app name in S3 path                  |
| `CD__USER_PORTAL__DISTRIBUTION_ID`   | CloudFront distribution for user portal          |
| `CD__ADMIN_PORTAL__APPLICATION_NAME` | Admin portal app name in S3 path                 |
| `CD__ADMIN_PORTAL__DISTRIBUTION_ID`  | CloudFront distribution for admin portal         |

**OIDC variant only:**

| Variable                  | Description                     |
| ------------------------- | ------------------------------- |
| `CD_PORTAL_OIDC_ROLE_ARN` | IAM role ARN to assume via OIDC |

**API key variant only:**

| Variable                   | Description                      |
| -------------------------- | -------------------------------- |
| `CD_AWS_ACCESS_KEY_ID`     | AWS access key                   |
| `CD_AWS_SECRET_ACCESS_KEY` | AWS secret key                   |
| `CD_DEPLOYMENT_GROUP`      | Deployment group name in S3 path |

### Bitbucket Deployment Environments

These deployment environments must be created in **Repository settings → Deployments**:

`ci`, `development`, `staging`, `qa`, `production`

### Pipeline Behavior

- **`default` (any branch)** — lint + build check on every push (deployment: `ci`, no deploy)
- **`development`**, **`staging`**, **`qa`** — auto deploy on push
- **`production`** — auto deploy on push

---

## Tech Stack

| Area         | Technology                            |
| ------------ | ------------------------------------- |
| Framework    | React 18, TypeScript 5                |
| Build        | Vite 5, Turbo                         |
| State        | Zustand 5                             |
| Server State | TanStack React Query v5               |
| HTTP         | Axios + OpenAPI Generator             |
| Routing      | React Router v6                       |
| Forms        | React Hook Form + Zod                 |
| UI           | Radix UI, Tailwind CSS, Framer Motion |
| i18n         | i18next                               |
| Mocking      | MSW (Mock Service Worker)             |
| Charts       | Recharts                              |
