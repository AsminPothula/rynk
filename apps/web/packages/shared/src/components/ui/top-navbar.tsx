import { MenuIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useWindowSize } from 'usehooks-ts';
import { Button } from './button';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from './sheet';
import { NavButtonLink, TopNav, TopNavClassName, TopNavProps } from './top-nav';

/**
 * Renders the top navigation menu based on the given parameters.
 *
 * @param {boolean} isMobileView - Indicates if the view is on a mobile device
 * @param {boolean} lockToCollapse - Indicates if the menu should be locked in the collapsed state
 * @param {(link: NavButtonLink) => void} [onLinkClicked] - Optional callback for when a navigation link is clicked
 * @return {JSX.Element} The rendered top navigation menu
 */
const TopNavMenu = ({
  isMobileView,
  lockToCollapse,
  onLinkClicked,
  links,
  logo,
  className,
  tabVariant,
}: {
  isMobileView: boolean;
  lockToCollapse: boolean;
  onLinkClicked?: (link: NavButtonLink) => void;
  links: NavButtonLink[];
  logo?: string;
  className?: TopNavClassName;
  tabVariant?: 'default' | 'button';
}) => {
  return (
    <TopNav
      className={className}
      isMobileView={lockToCollapse ? true : isMobileView}
      onLinkClicked={onLinkClicked}
      links={links}
      logo={logo}
      tabVariant={tabVariant}
    />
  );
};

/**
 * Function component for rendering a navigation sheet.
 *
 * @return {JSX.Element} The navigation sheet component
 */

const NavSheet: React.FC<TopNavProps> = (props: TopNavProps) => {
  const [isSheetOpen, setSheetOpen] = useState(false);

  const handleClose = useCallback(() => {
    setSheetOpen(false);
  }, []);

  return (
    <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className=" left-3 top-3 h-8 w-8 border-0 p-1"
          onClick={handleClose}>
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="px-0">
        <TopNavMenu
          isMobileView
          lockToCollapse={false}
          onLinkClicked={handleClose}
          logo={props.logo}
          className={props.className}
          links={props.links}
        />
      </SheetContent>
      <SheetClose />
    </Sheet>
  );
};

/**
 * Generates the content for the top navigation bar based on screen width.
 *
 * @return {JSX.Element} The appropriate navigation component based on screen size.
 */

interface TopNavBarProps {
  links: NavButtonLink[];
  onLinkClicked?: (link: NavButtonLink) => void;
  logo?: string | undefined;
  className?: TopNavClassName;
  tabVariant?: 'default' | 'button';
}
const TopNavbar: React.FC<TopNavBarProps> = (props: TopNavBarProps) => {
  const { width: windowWidth = 0 } = useWindowSize();
  const smallScreen = windowWidth < 450;

  const MobileNav = () => <NavSheet {...props} />;
  const DesktopNav = () => (
    <TopNavMenu
      logo={props.logo}
      isMobileView={false}
      lockToCollapse={smallScreen}
      {...props}
    />
  );

  const NavComponent =
    smallScreen || windowWidth < 450 ? MobileNav : DesktopNav;

  return <NavComponent />;
};

export { TopNavbar };
