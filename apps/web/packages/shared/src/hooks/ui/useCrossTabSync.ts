import { useEffect } from 'react';
import { type StoreApi } from 'zustand';

interface PersistStore {
  persist: {
    rehydrate: () => Promise<void> | void;
  };
}

export interface SyncEntry {
  key: string;
  store: StoreApi<unknown> & PersistStore;
}

/**
 * Listens for `storage` events (fired by other tabs) and rehydrates
 * the matching Zustand persisted store so all tabs share live state.
 */
export function useCrossTabSync(
  entries: SyncEntry[],
  onStorageCleared?: () => void,
) {
  useEffect(() => {
    const handler = (event: StorageEvent) => {
      // localStorage.clear() fires a single storage event with key === null
      // instead of one event per key. Without this, no per-key match occurs,
      // no store rehydrates, and the current tab keeps stale in-memory state
      // (user appears logged in) even though localStorage is empty.
      // A page refresh would fix it, but this forces an immediate cleanup.
      if (event.key === null) {
        onStorageCleared?.();
        return;
      }

      for (const { key, store } of entries) {
        if (event.key === key) {
          store.persist.rehydrate();
          break;
        }
      }
    };

    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [entries, onStorageCleared]);
}
