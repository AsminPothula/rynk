import { useEffect } from 'react';
import { useLeaderElectionStore } from '../../state/useLeaderElectionStore';

/**
 * Thin lifecycle wrapper around `useLeaderElectionStore`.
 * Requests the lock when `enabled` is true, releases on cleanup or disable.
 */
export function useLeaderElection(lockName: string, enabled: boolean): boolean {
  const isLeader = useLeaderElectionStore(
    (s) => s.locks[lockName]?.isLeader ?? false,
  );

  useEffect(() => {
    if (!enabled) return;

    useLeaderElectionStore.getState().request(lockName);
    return () => useLeaderElectionStore.getState().release(lockName);
  }, [lockName, enabled]);

  return isLeader;
}
