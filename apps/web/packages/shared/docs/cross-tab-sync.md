# Cross-Tab Sync & Inactivity

## Overview

**Problem:** Zustand's `persist` middleware writes to localStorage but never listens for changes from other tabs. This causes:

- **Stale tokens** — Tab A exchanges a token, Tab B keeps using the old one until a full page refresh
- **Stale logout** — Tab A logs out, Tab B stays authenticated
- **Independent inactivity timers** — Each tab tracks activity independently, unaware of user interaction in other tabs

**Solution (two parts):**

1. **Cross-tab state sync** — `useCrossTabSync` listens for `storage` events and calls `store.persist.rehydrate()` on the matching store
2. **Multi-tab inactivity timer** — all tabs tick independently, sharing `lastActiveAt` via cross-tab sync. `logout()` is idempotent.

Zero new dependencies.

---

## Cross-Tab State Sync

### How it works

The browser fires a [`storage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event) event whenever localStorage is modified — but only in **other** tabs on the same origin (never the tab that wrote). `useCrossTabSync` leverages this:

1. Register a single `storage` event listener
2. When `event.key` matches a persisted store's key, call `store.persist.rehydrate()`
3. Zustand merges the updated persisted state into the live store
4. Components subscribed to the affected slices re-render

### Which stores sync

| Store                   | localStorage Key          | Persisted Fields        |
| ----------------------- | ------------------------- | ----------------------- |
| `useAuthStore`          | `app:auth`                | `authData` (tokens, id) |
| `useInactivityStore`    | `app:inactivity`          | `lastActiveAt`          |
| `useUIPreferencesStore` | `app:prefer-sidebar-open` | `preferSidebarOpen`     |

### Special cases

- **`event.key === null`** — Fired when `localStorage.clear()` is called. Triggers `logout()` on all receiving tabs.
- **Auth logout side effects** — When `authData` transitions to `null` (from any source including rehydration), a store subscription registered by `initApp()` clears sidebar preference and inactivity state. See `setup/authTransitions.ts`.

### What's NOT synced (transient state)

- `ready` flag (per-tab hydration state)
- `_exchangePromise` / `_exchangeTokenActionCallback` (in-flight token exchange)
- Action functions (Zustand actions are always in-memory)

---

## Inactivity Timer (Multi-Tab)

### How it works

All tabs run independently — no leader election needed. Each tab:

1. Listens for DOM activity events (throttled) → stamps `lastActiveAt`
2. Runs a 1-second tick interval that reads `lastActiveAt` and computes warning state
3. Calls `logout()` when `elapsed >= timeoutMs` (idempotent — multiple tabs calling it is safe)

Only `lastActiveAt` is persisted. `isWarningVisible` and `secondsRemaining` are computed locally per tab from `lastActiveAt` + `timeoutMs` + `warningMs`.

### Setup hook composition (`useInactivityStoreSetup`)

| Hook                   | Purpose                                                                 |
| ---------------------- | ----------------------------------------------------------------------- |
| `useStampOnActivation` | Treats new tab / login as activity (skipped if session already expired) |
| `useActivityListeners` | Throttled DOM event listeners (keydown, mousedown, etc.)                |
| `useInactivityTick`    | 1-second interval: computes warning state, triggers logout on timeout   |

---

## Architecture Diagram

```
App.tsx (module scope)
  |-- initApp({ storeDevtools })         — registers auth transition callbacks + devtools
  |
App component
  |-- useAppCrossTabSync()               — syncs persisted stores across tabs
  |
  '-- InactivityProviderZustand
        |
        |-- useInactivityStoreSetup(config)
        |     |-- useStampOnActivation   — new tab / login = activity (unless expired)
        |     |-- useActivityListeners   — throttled DOM events -> stampActivity()
        |     '-- useInactivityTick      — 1s interval: warning state + logout on timeout
        |
        '-- <InactivityWarningDialog />
              '-- reads isWarningVisible + secondsRemaining from useInactivityStore
```

---

## Scenarios

### 1. Token exchange syncs across tabs

```
Tab A: setTokens() -> persist writes localStorage['app:auth']
Tab B: storage event -> rehydrate() -> components re-render with new token
```

### 2. Logout propagates to all tabs

```
Tab A: logout() -> set({ authData: null }) -> persist writes localStorage['app:auth']
     -> authTransitions subscription fires -> clears sidebar + inactivity
Tab B: storage event -> rehydrate() -> authData=null -> isAuthenticated=false
     -> authTransitions subscription fires -> clears sidebar + inactivity
     -> Router navigates to /landing
```

### 3. Login propagates to all tabs

```
Tab A: setLoginInfo() -> persist writes localStorage['app:auth']
Tab B: storage event -> rehydrate() -> isAuthenticated=true -> Router renders dashboard
     -> useInactivityStoreSetup activates -> stampActivity()
```

### 4. Sidebar preference syncs

```
Tab A: savePreferSidebarOpen(true) -> persist writes localStorage['app:prefer-sidebar-open']
Tab B: storage event -> rehydrate() -> sidebar re-renders as open
```

### 5. Inactivity warning — all tabs show dialog

```
All tabs: tick() computes elapsed >= warningThreshold -> showWarning(remaining)
All tabs: render InactivityWarningDialog with computed countdown
```

### 6. "Stay Logged In" from any tab

```
Tab B: stampActivity() + hideWarning() -> persist writes localStorage['app:inactivity']
Tab A: storage event -> rehydrate() -> next tick sees fresh timestamp -> warning clears
```

### 7. Inactivity timeout — all tabs log out

```
Tab A: tick() detects elapsed >= timeout -> hideWarning() + logout()
     -> authTransitions subscription fires -> clears inactivity + sidebar
     -> persist writes localStorage['app:auth'] and ['app:inactivity']
Tab B: tick() also detects timeout -> hideWarning() + logout() (idempotent)
     -> storage events -> rehydrate confirms clean state
```

### 8. Activity in any tab extends timer for all

```
Tab B: user clicks -> stampActivity() -> persist writes localStorage['app:inactivity']
Tab A: storage event -> rehydrate() -> next tick sees fresh lastActiveAt -> no warning
```

### 9. New tab opens while session active

```
New tab: HydrationGate rehydrates stores -> useStampOnActivation runs
     -> lastActiveAt exists and not expired -> stamps fresh activity
     -> tick starts with reset timer
```

### 10. New tab opens with expired session

```
New tab: HydrationGate rehydrates stores -> useStampOnActivation runs
     -> lastActiveAt exists but elapsed >= timeout -> skips stamp
     -> first tick detects timeout -> logout()
```

### 11. localStorage.clear() — emergency logout

```
Any tab: localStorage.clear()
Other tabs: storage event with key===null -> call logout()
```

---

## Configuration

Inactivity is controlled via environment variables:

| Env Var                           | Description                         | Default        |
| --------------------------------- | ----------------------------------- | -------------- |
| `VITE_INACTIVITY_ENABLED`         | Enable/disable the inactivity timer | `true`         |
| `VITE_INACTIVITY_TIMEOUT_SECONDS` | Total idle time before auto-logout  | `900` (15 min) |
| `VITE_INACTIVITY_WARNING_SECONDS` | Warning countdown duration          | `120` (2 min)  |

To disable inactivity entirely, set `VITE_INACTIVITY_ENABLED=false`.

---

## Browser Support

| Feature         | Required                  | Fallback                                           |
| --------------- | ------------------------- | -------------------------------------------------- |
| `storage` event | Yes (all modern browsers) | N/A — core sync mechanism                          |
| Web Locks API   | No                        | Every tab runs its own timer (pre-change behavior) |

Web Locks API is supported in Chrome 69+, Firefox 96+, Safari 15.4+, Edge 79+. Not available in non-secure contexts (HTTP without localhost).
