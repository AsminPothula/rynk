import type { ReactNode } from 'react';
import type { InactivityTimerConfig } from '../hooks/ui/useInactivityTimer';
import { useInactivityStoreSetup } from '../hooks/ui/useInactivityStoreSetup';
import { useInactivityStore } from '../state/useInactivityStore';
import { InactivityWarningDialog } from '../components/common/inactivity-warning-dialog';
import { useAuthStore } from '../state/useAuthStore';

export interface InactivityProviderZustandProps extends Omit<
  InactivityTimerConfig,
  'timeoutMs' | 'warningMs'
> {
  children: ReactNode;
  timeoutMs: number;
  warningMs: number;
}

const handleStayLoggedIn = () => {
  useInactivityStore.getState().stampActivity();
  useInactivityStore.getState().hideWarning();
};

const handleLogout = () => {
  useAuthStore.getState().logout();
};

export function InactivityProviderZustand({
  children,
  ...config
}: InactivityProviderZustandProps) {
  useInactivityStoreSetup(config);

  const isWarningVisible = useInactivityStore((s) => s.isWarningVisible);
  const secondsRemaining = useInactivityStore((s) => s.secondsRemaining);

  return (
    <>
      {children}
      <InactivityWarningDialog
        open={isWarningVisible}
        secondsRemaining={secondsRemaining}
        onStayLoggedIn={handleStayLoggedIn}
        onLogout={handleLogout}
      />
    </>
  );
}
