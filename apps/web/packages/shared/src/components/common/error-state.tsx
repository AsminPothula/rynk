import { AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  className?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  className,
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 p-6 text-center',
        className,
      )}>
      <AlertCircle className="text-destructive h-10 w-10" />
      <p className="text-sm font-semibold">{title}</p>
      {message && <p className="text-muted-foreground text-xs">{message}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-primary mt-2 text-sm underline hover:no-underline">
          Try again
        </button>
      )}
    </div>
  );
}
