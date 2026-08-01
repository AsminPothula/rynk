import { Link, useLocation } from 'react-router-dom';

import { buttonVariants } from '../../components/ui/button';
import { cn } from '../../lib/utils';
import { ScrollArea, ScrollBar } from './scroll-area';

export interface TopNavClassName {
  mainContainer?: string;
  linkDefault?: string;
  linkSelected?: string;
  linkDisabled?: string;
  logoStyle?: string;
}

export interface NavButtonLink {
  title: string;
  href: string;
  variant: 'default' | 'ghost';
  isDisabled?: boolean;
}

export interface TopNavProps {
  isMobileView?: boolean;
  links: NavButtonLink[];
  className?: TopNavClassName;
  onLinkClicked?: (link: NavButtonLink) => void;
  logo?: string;
  tabVariant?: 'default' | 'button';
}

/**
 * Returns the class name for the current link based on the provided path name, link, index, and class names.
 *
 * @param {string} pathName - The current path name.
 * @param {NavButtonLink} link - The link object.
 * @param {number} index - The index of the link in the list.
 * @param {TopNavClassName} classNames - The class names object.
 * @return {string} The class name for the current link.
 */
const getCurrentLinkClassName = (
  pathName: string,
  link: NavButtonLink,
  index: number,
  classNames: TopNavClassName,
) => {
  const { linkDefault, linkSelected, linkDisabled } = classNames;
  if (link.isDisabled) return linkDisabled || '';
  return pathName?.startsWith(link.href) || (index === 0 && pathName === '/')
    ? linkSelected || ''
    : linkDefault || '';
};

/**
 * Renders a navigation bar with tabs based on the provided links and current path name.
 *
 * @param {Object} props - The props object.
 * @param {string} [props.className] - Optional class name for the navigation bar.
 * @param {string} props.pathName - The current path name.
 * @param {NavButtonLink[]} props.links - An array of navigation button links.
 * @param {function} [props.onLinkClicked] - Optional callback function when a link is clicked.
 * @param {string} [props.logo] - Optional logo URL to be displayed.
 * @param {string} [props.tabVariant='default'] - Optional tab variant.
 * @return {JSX.Element} The rendered navigation bar with tabs.
 */
const TabsNavBar = ({
  className,
  pathName,
  links,
  onLinkClicked,
  logo,
  tabVariant = 'default',
}: {
  className?: TopNavClassName;
  links: NavButtonLink[];
  pathName: string;
  onLinkClicked?: (link: NavButtonLink) => void;
  logo?: string;
  tabVariant?: 'default' | 'button';
}) => {
  const isButtonVariant = tabVariant === 'button';
  const linkClassNames = {
    linkDefault: isButtonVariant
      ? className?.linkDefault ||
        'inline-block text-gray-600 dark:text-white h-46px flex items-center justify-center py-2.5 px-5 text-xl font-bold hover:text-gray-600 hover:bg-accent hover:rounded-2xl dark:hover:text-white'
      : className?.linkDefault ||
        'inline-block rounded-t-lg border-b-2 border-transparent p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-white',
    linkSelected: isButtonVariant
      ? className?.linkSelected ||
        'active inline-block rounded-2xl bg-primary text-white dark:text-black h-46px flex items-center justify-center py-2.5 px-5 text-xl font-bold'
      : className?.linkSelected ||
        'active inline-block rounded-t-lg border-b-2 border-primary p-4 text-primary dark:border-primary dark:text-primary',
    linkDisabled: isButtonVariant
      ? className?.linkDisabled ||
        'inline-block cursor-not-allowed text-gray h-46px flex items-center justify-center py-2.5 px-5 text-xl font-bold'
      : className?.linkDisabled ||
        'inline-block cursor-not-allowed rounded-t-lg p-4 text-gray dark:text-gray',
  };

  const currentLinks = links.map((link, index) => {
    const currentClassName = getCurrentLinkClassName(
      pathName,
      link,
      index,
      linkClassNames,
    );
    return { ...link, currentClassName };
  });

  return (
    <ScrollArea className="whitespace-nowrap">
      <div
        className={
          isButtonVariant
            ? className?.mainContainer ||
              'border-light-gray-border text-gray dark:text-gray dark:border-light-gray-border flex border-b py-3 text-center text-sm font-medium'
            : className?.mainContainer ||
              'text-gray dark:text-gray flex text-center text-sm font-medium'
        }>
        {logo ? (
          <img
            className={className?.logoStyle || ' h-30 mr-4 w-20 p-2 '}
            src={logo}
          />
        ) : null}
        <ul
          className={cn(
            'flex w-full items-center',
            isButtonVariant ? 'justify-center' : '',
          )}>
          {currentLinks.map((link) => (
            <li className={isButtonVariant ? '' : 'me-2'} key={link.href}>
              <Link
                to={link.isDisabled ? '#' : link.href}
                onClick={() => {
                  onLinkClicked?.(link);
                }}
                aria-disabled={link.isDisabled || false}
                className={link.currentClassName}>
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

/**
 * A function that renders the mobile menu.
 *
 * @param {TopNavClassName} className - optional class name for the top navigation bar
 * @param {NavButtonLink[]} links - array of navigation button links
 * @param {string} pathName - the current path name
 * @param {(link: NavButtonLink) => void} onLinkClicked - optional callback function when a link is clicked
 * @return {JSX.Element} the rendered mobile menu component
 */
const MobileMenu = ({
  pathName,
  links,
  onLinkClicked,
  logo,
}: {
  links: NavButtonLink[];
  pathName: string;
  onLinkClicked?: (link: NavButtonLink) => void;
  logo?: string;
}) => {
  /**
   * A function that renders a link based on the provided NavButtonLink and index.
   *
   * @param {NavButtonLink} link - the NavButtonLink object to render
   * @param {number} index - the index of the link in the list
   * @return {JSX.Element} the rendered Link component
   */
  const linkRender = (link: NavButtonLink, index: number) => {
    const isActive = link.href === pathName;
    const variant = isActive ? 'default' : 'ghost';
    const onClick = () => onLinkClicked?.(link);

    return (
      <Link
        key={index}
        to={link.href}
        onClick={onClick}
        className={cn(
          buttonVariants({ variant, size: 'sm' }),
          isActive &&
            'dark:bg-muted dark:hover:bg-muted dark:text-background dark:hover:text-background',
          'justify-start',
        )}>
        {link.title}
      </Link>
    );
  };

  return (
    <ScrollArea className="h-[85vh]">
      <div
        className={cn(
          'group flex flex-col gap-4 p-2 data-[collapsed=true]:p-2',
        )}>
        {logo ? <img className={'h-20 w-full'} src={logo} /> : null}
        <nav className="grid gap-2 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
          {links.map(linkRender)}
        </nav>
      </div>
    </ScrollArea>
  );
};

/**
 * Generate the top navigation component based on the current view.
 *
 * @param {string} className - The CSS class name for the top navigation component.
 * @param {boolean} isMobileView - A flag indicating if the view is in mobile mode.
 * @param {array} links - An array of links to be displayed in the navigation component.
 * @param {function} onLinkClicked - A function to be called when a link is clicked.
 * @param {...any} props - Additional props to be spread on the top navigation component.
 * @return {JSX.Element} The rendered top navigation component.
 */
const TopNav = ({
  className,
  isMobileView,
  links,
  onLinkClicked,
  logo,
  tabVariant,
  ...props
}: TopNavProps) => {
  const location = useLocation();
  const { pathname: pathName } = location;

  const NavComponent = isMobileView ? MobileMenu : TabsNavBar;

  return (
    <div {...props}>
      <NavComponent
        links={links}
        pathName={pathName}
        onLinkClicked={onLinkClicked}
        className={className}
        logo={logo}
        tabVariant={tabVariant}
      />
    </div>
  );
};

export { TopNav };
