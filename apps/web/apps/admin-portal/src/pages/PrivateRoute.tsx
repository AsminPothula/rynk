import SideNavbar from '@/components/side-navbar';
import { useUIPreferencesStore } from 'shared';
import { useCallback } from 'react';
import { AnimatedOutlet } from '@shared/components/common/animated-outlet';

export function PrivateRoute() {
  const preferSidebarOpen = useUIPreferencesStore((s) => s.preferSidebarOpen);
  const savePreferSidebarOpen = useUIPreferencesStore(
    (s) => s.savePreferSidebarOpen,
  );

  return (
    <div className="flex max-h-full min-h-screen w-full max-w-full">
      <SideNavbar
        isCollapsed={!preferSidebarOpen}
        setIsCollapsed={useCallback(
          (collapse: boolean) => savePreferSidebarOpen(!collapse),
          [savePreferSidebarOpen],
        )}
      />
      {/* main page */}
      <div className="w-full max-w-full overflow-y-scroll p-8 pt-16">
        <AnimatedOutlet />
      </div>
    </div>
  );
}
