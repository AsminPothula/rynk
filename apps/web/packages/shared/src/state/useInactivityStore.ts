import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  CacheKey,
  DevtoolsName,
  InactivityAction,
  StoreName,
} from '../common/constant';

interface InactivityState {
  lastActiveAt: number | null;
  isWarningVisible: boolean;
  secondsRemaining: number;

  stampActivity: () => void;
  showWarning: (seconds: number) => void;
  hideWarning: () => void;
  clear: () => void;
}

export const useInactivityStore = create<InactivityState>()(
  devtools(
    persist(
      (set) =>
        ({
          lastActiveAt: null,
          isWarningVisible: false,
          secondsRemaining: 0,

          stampActivity: () =>
            set(
              { lastActiveAt: Date.now() },
              false,
              InactivityAction.StampActivity,
            ),

          showWarning: (seconds) =>
            set(
              { isWarningVisible: true, secondsRemaining: seconds },
              false,
              InactivityAction.ShowWarning,
            ),

          hideWarning: () =>
            set(
              { isWarningVisible: false, secondsRemaining: 0 },
              false,
              InactivityAction.HideWarning,
            ),

          clear: () =>
            set(
              {
                lastActiveAt: null,
                isWarningVisible: false,
                secondsRemaining: 0,
              },
              false,
              InactivityAction.Clear,
            ),
        }) satisfies InactivityState,
      {
        name: CacheKey.InactivityStore,
        partialize: (state) => ({
          lastActiveAt: state.lastActiveAt,
        }),
      },
    ),
    {
      name: DevtoolsName,
      store: StoreName.Inactivity,
      enabled: import.meta.env.VITE_STORE_DEVTOOLS === 'true',
    },
  ),
);
