import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  DevtoolsName,
  LeaderElectionAction,
  StoreName,
} from '../common/constant';

interface LockEntry {
  isLeader: boolean;
  _release: (() => void) | null;
  _abort: AbortController | null;
}

interface LeaderElectionState {
  locks: Record<string, LockEntry>;

  isLeader: (lockName: string) => boolean;
  request: (lockName: string) => void;
  release: (lockName: string) => void;
}

export const useLeaderElectionStore = create<LeaderElectionState>()(
  devtools(
    (set, get) =>
      ({
        locks: {},

        isLeader: (lockName) => get().locks[lockName]?.isLeader ?? false,

        request: (lockName) => {
          // Graceful degradation: treat every tab as leader
          if (typeof navigator === 'undefined' || !navigator.locks) {
            console.warn('Leader election not supported by browser');
            set(
              (s) => ({
                locks: {
                  ...s.locks,
                  [lockName]: {
                    isLeader: true,
                    _release: null,
                    _abort: null,
                  },
                },
              }),
              false,
              LeaderElectionAction.RequestFallback,
            );
            return;
          }

          const abort = new AbortController();
          set(
            (s) => ({
              locks: {
                ...s.locks,
                [lockName]: {
                  isLeader: false,
                  _release: null,
                  _abort: abort,
                },
              },
            }),
            false,
            LeaderElectionAction.RequestPending,
          );

          navigator.locks
            .request(
              lockName,
              { mode: 'exclusive', signal: abort.signal },
              () =>
                new Promise<void>((resolve) => {
                  set(
                    (s) => ({
                      locks: {
                        ...s.locks,
                        [lockName]: {
                          isLeader: true,
                          _release: resolve,
                          _abort: abort,
                        },
                      },
                    }),
                    false,
                    LeaderElectionAction.RequestAcquired,
                  );
                }),
            )
            .catch((e) => {
              // AbortError when cleanup runs — expected
              console.error(e);
            });
        },

        release: (lockName) => {
          const entry = get().locks[lockName];
          if (!entry) return;

          // Release the held lock (if we are leader)
          if (entry._release) entry._release();

          // Abort the queued request (if we are waiting)
          if (entry._abort) entry._abort.abort();

          set(
            (s) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { [lockName]: _removed, ...rest } = s.locks;
              return { locks: rest };
            },
            false,
            LeaderElectionAction.Release,
          );
        },
      }) satisfies LeaderElectionState,
    {
      name: DevtoolsName,
      store: StoreName.LeaderElection,
      enabled: import.meta.env.VITE_STORE_DEVTOOLS === 'true',
    },
  ),
);
