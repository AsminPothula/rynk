import { LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

import { TooltipProvider } from '@radix-ui/react-tooltip';
import { CustomSVGIconType } from '../../type';
import { buttonVariants } from './button';

export interface NavButtonLink {
  id: string;
  title: string;
  label?: string;
  icon?: LucideIcon | CustomSVGIconType;
  variant?: 'default' | 'ghost';
  href: string;
}
interface NavProps {
  isCollapsed: boolean;
  links: NavButtonLink[];
  onLinkClicked?: (link: NavButtonLink) => void;
}

export function Nav({ links, isCollapsed, onLinkClicked }: NavProps) {
  const location = useLocation();
  const pathName = location.pathname;
  return (
    <TooltipProvider>
      <div
        data-collapsed={isCollapsed}
        className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
        <nav className="grid gap-2 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              onClick={() => {
                onLinkClicked?.(link);
              }}
              className={cn(
                buttonVariants({
                  variant: link.href === pathName ? 'default' : 'ghost',
                  size: 'sm',
                }),
                link.variant === 'default' &&
                  'dark:bg-muted dark:hover:bg-muted dark:text-white dark:hover:text-white',
                'justify-start',
              )}>
              {link.title}
            </Link>
          ))}
        </nav>
      </div>
    </TooltipProvider>
  );
}
