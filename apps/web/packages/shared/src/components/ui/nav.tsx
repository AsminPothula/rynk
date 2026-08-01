import { LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { buttonVariants } from '../../components/ui/button';
import { cn } from '../../lib/utils';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { CustomSVGIconType } from '../../type';

export interface NavButtonLink {
  title: string;
  label?: string;
  icon: LucideIcon | CustomSVGIconType;
  variant: 'default' | 'ghost';
  href: string;
}
interface NavProps {
  isCollapsed: boolean;
  links: NavButtonLink[];
  onLinkClicked?: (link: NavButtonLink) => void;
}

interface NavItemProps {
  link: NavButtonLink;
  isActive: boolean;
  onLinkClicked?: (link: NavButtonLink) => void;
}

function NavItemCollapsed({ link, isActive, onLinkClicked }: NavItemProps) {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link
          to={link.href}
          onClick={() => onLinkClicked?.(link)}
          className={cn(
            buttonVariants({
              variant: isActive ? 'default' : 'ghost',
              size: 'icon',
            }),
            'h-9 w-9',
            link.variant === 'default' &&
              'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white',
          )}>
          <link.icon className="h-4 w-4" variant={isActive ? 'on' : 'off'} />
          <span className="sr-only">{link.title}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        className="flex items-center gap-4 pl-2 text-sm">
        {link.title}
        {link.label && (
          <span className="text-muted-foreground">{link.label}</span>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

function NavItemExpanded({ link, isActive, onLinkClicked }: NavItemProps) {
  return (
    <Link
      to={link.href}
      onClick={() => onLinkClicked?.(link)}
      className={cn(
        buttonVariants({
          variant: isActive ? 'default' : 'ghost',
          size: 'sm',
        }),
        link.variant === 'default' &&
          'dark:bg-muted dark:hover:bg-muted dark:text-white dark:hover:text-white',
        'justify-start',
      )}>
      <link.icon className="mr-2 h-4 w-4" variant={isActive ? 'on' : 'off'} />
      {link.title}
      {link.label && (
        <span
          className={cn(
            'ml-auto',
            link.variant === 'default' && 'text-background dark:text-white',
          )}>
          {link.label}
        </span>
      )}
    </Link>
  );
}

export function Nav({ links, isCollapsed, onLinkClicked }: NavProps) {
  const location = useLocation();
  const pathName = location.pathname;

  const NavItem = isCollapsed ? NavItemCollapsed : NavItemExpanded;

  return (
    <TooltipProvider>
      <div
        data-collapsed={isCollapsed}
        className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
        <nav className="grid gap-2 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
          {links.map((link, index) => (
            <NavItem
              key={index}
              link={link}
              isActive={link.href === pathName}
              onLinkClicked={onLinkClicked}
            />
          ))}
        </nav>
      </div>
    </TooltipProvider>
  );
}
