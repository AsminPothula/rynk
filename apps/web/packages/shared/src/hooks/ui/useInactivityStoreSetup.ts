import { useEffect, useRef } from 'react';
import { fromAuth, useAuthStore } from '../../state/useAuthStore';
import { useInactivityStore } from '../../state/useInactivityStore';
import type { InactivityTimerConfig } from './useInactivityTimer';

const DEFAULT_ACTIVITY_EVENTS = [
  'keydown',
  'mousedown',
  'touchstart',
  'scroll',
  'click',
];

const TICK_INTERVAL_MS = 1000;
const THROTTLE_MS = 1000;

// --- Main setup hook ---------------------------------------------------------

export function useInactivityStoreSetup(config: InactivityTimerConfig) {
  const {
    timeoutMs,
    warningMs,
    activityEvents = DEFAULT_ACTIVITY_EVENTS,
    enabled = true,
  } = config;

  const isAuthenticated = useAuthStore(fromAuth.isAuthenticated);
  const active = enabled && isAuthenticated;

  useStampOnActivation(active, timeoutMs);
  useActivityListeners(active, activityEvents);
  useInactivityTick(active, timeoutMs, warningMs);
}

// --- Composable hooks --------------------------------------------------------

/** Treat new tab / login / re-login as user activity (resets timer).
 *  Skipped when the session has already expired so the tick can logout. */
function useStampOnActivation(active: boolean, timeoutMs: number) {
  useEffect(() => {
    if (!active) return;
    const { lastActiveAt } = useInactivityStore.getState();
    if (!lastActiveAt || Date.now() - lastActiveAt < timeoutMs) {
      useInactivityStore.getState().stampActivity();
    }
  }, [active, timeoutMs]);
}

/** Throttled DOM event listeners that stamp activity on user interaction. */
function useActivityListeners(active: boolean, activityEvents: string[]) {
  const lastThrottleRef = useRef(0);

  useEffect(() => {
    if (!active) return;

    const handleActivity = () => {
      const now = Date.now();
      if (now - lastThrottleRef.current < THROTTLE_MS) return;
      lastThrottleRef.current = now;
      useInactivityStore.getState().stampActivity();
    };

    for (const event of activityEvents) {
      window.addEventListener(event, handleActivity, { passive: true });
    }

    return () => {
      for (const event of activityEvents) {
        window.removeEventListener(event, handleActivity);
      }
    };
  }, [active, activityEvents]);
}

/** Runs a 1-second tick in every tab. Each tick:
 *  1. Checks if session expired → logout (idempotent across tabs)
 *  2. Checks if in warning window → show countdown
 *  3. Otherwise → hide warning */
function useInactivityTick(
  active: boolean,
  timeoutMs: number,
  warningMs: number,
) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) {
      clearTickInterval(intervalRef);
      useInactivityStore.getState().hideWarning();
      return;
    }

    const tick = () => {
      const elapsed = getElapsedMs();
      if (elapsed === null) return;

      if (elapsed >= timeoutMs) {
        useInactivityStore.getState().hideWarning();
        useAuthStore.getState().logout();
      } else if (elapsed >= timeoutMs - warningMs) {
        const remaining = Math.ceil((timeoutMs - elapsed) / 1000);
        useInactivityStore.getState().showWarning(remaining);
      } else {
        useInactivityStore.getState().hideWarning();
      }
    };

    tick();
    intervalRef.current = setInterval(tick, TICK_INTERVAL_MS);
    return () => clearTickInterval(intervalRef);
  }, [active, timeoutMs, warningMs]);
}

function getElapsedMs(): number | null {
  const { lastActiveAt } = useInactivityStore.getState();
  return lastActiveAt ? Date.now() - lastActiveAt : null;
}

function clearTickInterval(
  ref: React.MutableRefObject<ReturnType<typeof setInterval> | null>,
) {
  if (ref.current) {
    clearInterval(ref.current);
    ref.current = null;
  }
}
