import { useEffect, useState } from 'react';

interface PersistedStore {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (fn: () => void) => () => void;
  };
}

interface HydrationGateProps {
  stores: PersistedStore[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function HydrationGate({
  stores,
  children,
  fallback = null,
}: HydrationGateProps) {
  const [ready, setReady] = useState(() =>
    stores.every((store) => store.persist.hasHydrated()),
  );

  useEffect(() => {
    if (ready) return;

    const unsubs = stores.map((store) =>
      store.persist.onFinishHydration(() => {
        if (stores.every((s) => s.persist.hasHydrated())) {
          setReady(true);
        }
      }),
    );

    return () => unsubs.forEach((unsub) => unsub());
  }, [ready, stores]);

  if (!ready) return fallback;

  return children;
}
