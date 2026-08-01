import SharedSideNavbar from '@shared/components/common/side-navbar';
import { useLanguageTranslation } from '@/hooks/ui/useLanguageTranslation';

interface SideNavbarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapse: boolean) => void;
}

export default function SideNavbar({
  isCollapsed,
  setIsCollapsed,
}: SideNavbarProps) {
  const { t } = useLanguageTranslation();
  return (
    <SharedSideNavbar
      isCollapsed={isCollapsed}
      setIsCollapsed={setIsCollapsed}
      labels={{
        dashboard: t('NAVBAR.DASHBOARD'),
        users: t('NAVBAR.USERS'),
        settings: t('NAVBAR.SETTINGS'),
      }}
    />
  );
}
