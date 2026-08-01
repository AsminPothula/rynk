import { Nav, NavButtonLink } from '@shared/components/ui/nav-link';

import { MenuIcon } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { useWindowSize } from 'usehooks-ts';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from '@shared/components/ui/sheet';
import { useCallback, useState } from 'react';
import { useLanguageTranslation } from '@/hooks/ui/useLanguageTranslation';
import { TranslationTypeKeys } from '@/common/locales/en';

const navLinks = (t: (key: TranslationTypeKeys) => string): NavButtonLink[] => [
  {
    id: 'dashboard',
    title: t('NAVBAR.DASHBOARD'),
    href: '/dashboard',
  },
  {
    id: 'users',
    title: t('NAVBAR.USERS'),
    href: '/users',
  },
  {
    id: 'settings',
    title: t('NAVBAR.SETTINGS'),
    href: '/settings',
  },
];

const NavMenu = ({
  onLinkClicked,
}: {
  onLinkClicked?: (link: NavButtonLink) => void;
}) => {
  const { t } = useLanguageTranslation();
  return (
    <Nav
      isCollapsed={false}
      onLinkClicked={onLinkClicked}
      links={navLinks(t)}
    />
  );
};

const NavSheet = () => {
  const [isSheetOpen, setSheetOpen] = useState(false);

  return (
    <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="fixed left-3 top-3 h-8 w-8 border-0 p-1">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="px-0 py-20">
        <NavMenu onLinkClicked={useCallback(() => setSheetOpen(false), [])} />
      </SheetContent>
      <SheetClose />
    </Sheet>
  );
};

export default function SideNavbar() {
  const { width: windowWidth = 0 } = useWindowSize();
  const mobileWidth = windowWidth < 450;

  if (mobileWidth) {
    return <NavSheet />;
  }

  return (
    <div className="border-r px-3 pb-10 pt-24">
      <NavMenu />
    </div>
  );
}
