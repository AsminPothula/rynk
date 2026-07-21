import { useLanguageTranslation } from '@/hooks/ui/useLanguageTranslation';
import { NavButtonLink } from '@shared/components/ui/top-nav';
import { TopNavbar } from '@shared/components/ui/top-navbar';
import { useMemo } from 'react';
export const TopNav = () => {
  const { t } = useLanguageTranslation();
  const navLinks: NavButtonLink[] = useMemo(
    () => [
      {
        title: t('TOP_NAVBAR.DASHBOARD'),
        href: '/dashboard',
        variant: 'ghost',
        isDisabled: false,
      },
      {
        title: t('TOP_NAVBAR.USERS'),
        href: '/users',
        variant: 'ghost',
      },
      {
        title: t('TOP_NAVBAR.SETTINGS'),
        href: '/settings',
        variant: 'ghost',
      },
    ],
    [t],
  );

  return (
    <TopNavbar
      links={navLinks}
      // className={{}}
      // onLinkClicked={onLinkClicked}
      // logo={logo}
      tabVariant={'button'}
    />
  );
};
