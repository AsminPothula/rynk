import { Inbox } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ElementType;
  className?: string;
}

export function EmptyState({
  title = 'No data',
  message,
  icon: Icon = Inbox,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 p-6 text-center',
        className,
      )}>
      <Icon className="text-muted-foreground h-10 w-10" />
      <p className="text-sm font-semibold">{title}</p>
      {message && <p className="text-muted-foreground text-xs">{message}</p>}
    </div>
  );
}
