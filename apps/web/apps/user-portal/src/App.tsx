import './providers/LanguageProvider'; // i18n init — must come before initApp
import { QueryClientProvider } from '@tanstack/react-query';
import { Router } from './router';
import { ModeToggle } from '@shared/components/mode-toggle';
import {
  queryClient,
  ApiContextProvider,
  useAuthStore,
  useUIPreferencesStore,
  useInactivityStore,
  useThemeStore,
  useLanguageStore,
  HydrationGate,
  InactivityProviderZustand,
  useAppCrossTabSync,
  initApp,
} from 'shared';
import {
  reactQueryDebugging,
  storeDevtools,
  inactivityTimeoutMs,
  inactivityWarningMs,
  inactivityEnabled,
} from './config/env';
import { LanguageToggle } from '@/components/language-toggle';
import { Toaster } from '@shared/components/ui/sonner';
import ReactQueryDevtoolsProduction from '@shared/hooks/rq/rq-dev-tools';
import { useSetupGlobalApiConfig } from './hooks/useSetupGlobalApiConfig';

initApp({ storeDevtools });

function App() {
  const api = useSetupGlobalApiConfig();
  useAppCrossTabSync();

  return (
    <ApiContextProvider value={api}>
      <QueryClientProvider client={queryClient}>
        <HydrationGate
          stores={[
            useAuthStore,
            useUIPreferencesStore,
            useInactivityStore,
            useThemeStore,
            useLanguageStore,
          ]}>
          <InactivityProviderZustand
            enabled={inactivityEnabled}
            timeoutMs={inactivityTimeoutMs}
            warningMs={inactivityWarningMs}>
            <Router />
          </InactivityProviderZustand>
        </HydrationGate>

        <span className="absolute right-8 top-8 space-x-2">
          <ModeToggle />
          <LanguageToggle />
        </span>

        <Toaster
          richColors
          expand={false}
          closeButton={true}
          visibleToasts={10}
          toastOptions={{
            duration: 3500,
            closeButton: true,
          }}
        />

        <ReactQueryDevtoolsProduction enabled={reactQueryDebugging} />
      </QueryClientProvider>
    </ApiContextProvider>
  );
}

export default App;
