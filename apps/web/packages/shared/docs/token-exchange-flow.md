# Token Exchange Flow

How the HTTP interceptor handles 401 responses and token refresh, including cross-tab coordination.

## Scenario 1: Happy Path — Exchange Succeeds

```mermaid
sequenceDiagram
    participant App
    participant ReqInt as Request Interceptor
    participant Server
    participant ResInt as Response Interceptor
    participant AuthStore

    App->>ReqInt: GET /api/data
    ReqInt->>ReqInt: attach accessToken + _authTokenVersion=N
    ReqInt->>Server: GET /api/data (Bearer expired-token)
    Server-->>ResInt: 401 Unauthorized

    ResInt->>ResInt: _retried=false → set _retried=true
    ResInt->>ResInt: config version N == store version N
    ResInt->>AuthStore: exchangeOnlyOnce()
    AuthStore->>Server: POST /auth/refresh-token (_skipExchange, _skipLogout)
    Server-->>AuthStore: { accessToken, refreshToken }
    AuthStore->>AuthStore: setTokens() → version N+1, persist to localStorage

    ResInt->>ResInt: store version N+1 ≠ config version N → skip rehydrate
    ResInt->>ReqInt: retry original request
    ReqInt->>ReqInt: attach new accessToken + _authTokenVersion=N+1
    ReqInt->>Server: GET /api/data (Bearer new-token)
    Server-->>App: 200 OK ✅
```

## Scenario 2: Multiple Calls in One Tab — Dedup via \_exchangePromise

```mermaid
sequenceDiagram
    participant Call1 as API Call 1
    participant Call2 as API Call 2
    participant ResInt as Response Interceptor
    participant AuthStore
    participant Server

    Call1->>Server: GET /api/data1 (version N)
    Call2->>Server: GET /api/data2 (version N)
    Server-->>ResInt: 401 (call 1)
    Server-->>ResInt: 401 (call 2)

    ResInt->>AuthStore: exchangeOnlyOnce() [call 1]
    Note over AuthStore: _exchangePromise = new Promise
    AuthStore->>Server: POST /auth/refresh-token

    ResInt->>AuthStore: exchangeOnlyOnce() [call 2]
    Note over AuthStore: returns existing _exchangePromise (dedup)

    Server-->>AuthStore: { accessToken, refreshToken }
    AuthStore->>AuthStore: setTokens() → version N+1
    Note over AuthStore: _exchangePromise = null

    ResInt->>Server: retry call 1 (new token) → 200 ✅
    ResInt->>Server: retry call 2 (new token) → 200 ✅
```

## Scenario 3: Cross-Tab Race — Before Fix (Spurious Logout)

```mermaid
sequenceDiagram
    participant TabA as Tab A Interceptor
    participant TabB as Tab B Interceptor
    participant Server
    participant LS as localStorage

    TabA->>Server: GET /api/data (version N)
    TabB->>Server: GET /api/data (version N)
    Server-->>TabA: 401
    Server-->>TabB: 401

    TabA->>Server: POST /auth/refresh-token
    TabB->>Server: POST /auth/refresh-token

    Server-->>TabA: 200 { newTokens }
    TabA->>LS: setTokens() → version N+1

    Server-->>TabB: 401 "already consumed"
    Note over TabB: exchange 401 hits logout branch (no _skipLogout)
    TabB->>TabB: logout() ❌ spurious!
    TabB->>LS: authData = null
    Note over TabA: storage event → rehydrate → logged out too ❌
```

## Scenario 4: Cross-Tab Race — With Fix (Rehydrate Rescues)

```mermaid
sequenceDiagram
    participant TabA as Tab A Interceptor
    participant TabB as Tab B Interceptor
    participant Server
    participant LS as localStorage

    TabA->>Server: GET /api/data (version N)
    TabB->>Server: GET /api/data (version N)
    Server-->>TabA: 401
    Server-->>TabB: 401

    TabA->>Server: POST /auth/refresh-token (_skipLogout)
    TabB->>Server: POST /auth/refresh-token (_skipLogout)

    Server-->>TabA: 200 { newTokens }
    TabA->>LS: setTokens() → version N+1

    Server-->>TabB: 401 "already consumed"
    Note over TabB: exchange failed (caught, returns null)
    Note over TabB: _skipLogout prevents logout from exchange call

    TabB->>TabB: store version still N == config version N
    TabB->>LS: rehydrateAuth() → picks up version N+1 + new tokens

    TabB->>Server: retry GET /api/data (new token)
    Server-->>TabB: 200 OK ✅ no logout!
```

## Scenario 5: Truly Invalid Session — Correct Logout

```mermaid
sequenceDiagram
    participant Tab as Interceptor
    participant Server
    participant LS as localStorage

    Tab->>Server: GET /api/data (version N)
    Server-->>Tab: 401

    Tab->>Server: POST /auth/refresh-token (_skipLogout)
    Server-->>Tab: 401 "session expired"
    Note over Tab: exchange failed, _skipLogout prevents logout here

    Tab->>Tab: store version still N
    Tab->>LS: rehydrateAuth() → version still N (no other tab rescued)

    Tab->>Server: retry GET /api/data (old token)
    Server-->>Tab: 401
    Note over Tab: _retried=true → skips exchange block
    Tab->>Tab: logout() ✅ correct
```

## Future Consideration: Web Locks API for Cross-Tab Exchange Dedup

Currently each tab independently attempts the exchange; if it fails, it rehydrates from localStorage to pick up tokens another tab may have refreshed. This works but means N tabs make N exchange calls to the server, N-1 of which will fail.

An alternative is to use the **Web Locks API** (`navigator.locks.request`) so only one tab performs the exchange while others wait:

```
Tab A: acquires lock → exchange → writes tokens → releases lock
Tab B: waits for lock → acquires → sees fresh tokens → skips exchange → rehydrate
```

### How it would work

1. Wrap `exchangeOnlyOnce` in `navigator.locks.request('app:token-exchange', callback)`
2. Inside the callback, check if tokens are already fresh (another tab just finished) — if so, skip
3. Otherwise perform the exchange and write tokens
4. Lock auto-releases when the callback returns
5. Other tabs' awaiting `locks.request` resolves, they rehydrate

### Trade-offs

| Pro                                        | Con                                                                                         |
| ------------------------------------------ | ------------------------------------------------------------------------------------------- |
| Only 1 exchange call hits the server       | Slightly more complex code                                                                  |
| Other tabs wait naturally (no wasted 401s) | Need `AbortSignal.timeout()` for hung-tab protection                                        |
| No tab ID management needed                | Keep `_exchangePromise` for same-tab dedup (Web Locks queues same-tab callers sequentially) |
| Browser auto-releases lock on tab crash    | No IE / older Safari support (needs feature check or fallback)                              |

### Sketch

```typescript
exchangeOnlyOnce: async () => {
  // Same-tab dedup (unchanged)
  if (_exchangePromise) return _exchangePromise;

  await navigator.locks.request(
    'app:token-exchange',
    { signal: AbortSignal.timeout(10_000) },
    async () => {
      // Another tab may have already refreshed while we waited
      // Re-read version from store (rehydrated via storage event)
      if (/* tokens still stale */) {
        await doExchange();
      }
    },
  );
};
```

---

## MSW Test Helpers

### Cross-tab refresh simulation (single-tab test)

```js
window.msw.invalidateAllAccessTokens(); // force 401
window.msw.invalidateAllRefreshTokens(); // exchange will fail
window.msw.simulateCrossTabRefresh(); // plant fresh tokens in localStorage + MSW
// Trigger API call → 401 → exchange fails → rehydrate → retry with fresh tokens → 200 ✅
```

### Negative test (should still logout)

```js
window.msw.invalidateAllTokens(); // no cross-tab rescue
// Trigger API call → 401 → exchange fails → rehydrate same version → retry 401 → logout ✅
```
