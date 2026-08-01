import { LoaderCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SectionLoaderProps {
  isLoading: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-14 w-14',
} as const;

export function SectionLoader({
  isLoading,
  size = 'md',
  className,
}: SectionLoaderProps) {
  if (!isLoading) return null;

  return (
    <LoaderCircle
      className={cn(
        'inset-0 m-auto animate-spin',
        sizeClasses[size],
        className,
      )}
    />
  );
}
