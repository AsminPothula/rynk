import { Nav, NavButtonLink } from '../ui/nav';

import {
  LayoutDashboard,
  UsersRound,
  Settings,
  ChevronRight,
  ChevronLeft,
  MenuIcon,
} from 'lucide-react';
import { Button } from '../ui/button';
import { useWindowSize } from 'usehooks-ts';
import { cn } from '../../lib/utils';
import { Sheet, SheetTrigger, SheetContent, SheetClose } from '../ui/sheet';
import { useCallback, useEffect, useState } from 'react';

interface SideNavbarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapse: boolean) => void;
  labels: {
    dashboard: string;
    users: string;
    settings: string;
  };
}

const NavMenu = ({
  isCollapsed,
  lockToCollapse,
  onLinkClicked,
  labels,
}: {
  isCollapsed: boolean;
  lockToCollapse: boolean;
  onLinkClicked?: (link: NavButtonLink) => void;
  labels: SideNavbarProps['labels'];
}) => {
  return (
    <Nav
      isCollapsed={lockToCollapse ? true : isCollapsed}
      onLinkClicked={onLinkClicked}
      links={[
        {
          title: labels.dashboard,
          href: '/dashboard',
          icon: LayoutDashboard,
          variant: 'ghost',
        },
        {
          title: labels.users,
          href: '/users',
          icon: UsersRound,
          variant: 'ghost',
        },
        {
          title: labels.settings,
          href: '/settings',
          icon: Settings,
          variant: 'ghost',
        },
      ]}
    />
  );
};

const NavSheet = ({ labels }: { labels: SideNavbarProps['labels'] }) => {
  const [isSheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    return () => {
      setSheetOpen(false);
    };
  }, []);

  return (
    <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="fixed left-3 top-3 h-8 w-8 border-0 p-1">
          <MenuIcon></MenuIcon>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="px-0 py-20">
        <NavMenu
          isCollapsed={false}
          lockToCollapse={false}
          labels={labels}
          onLinkClicked={useCallback(() => setSheetOpen(false), [])}
        />
      </SheetContent>
      <SheetClose />
    </Sheet>
  );
};

export default function SideNavbar({
  isCollapsed,
  setIsCollapsed,
  labels,
}: SideNavbarProps) {
  const { width: windowWidth = 0 } = useWindowSize();
  const smallScreen = windowWidth < 768;
  const mobileWidth = windowWidth < 450;

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }

  if (mobileWidth) {
    return <NavSheet labels={labels} />;
  }

  return (
    <div
      className={cn(
        'relative border-r px-3 pb-10 pt-24',
        isCollapsed && 'min-w-[70px]',
      )}>
      {!smallScreen && (
        <div className="absolute right-[-17px] top-7">
          <Button
            onClick={toggleSidebar}
            variant="outline"
            className="h-8 w-8 rounded-full p-1.5">
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>
      )}
      <NavMenu
        isCollapsed={isCollapsed}
        lockToCollapse={smallScreen}
        labels={labels}
      />
    </div>
  );
}
