import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Spinner size. Default: `md`. */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label (default: "Loading"). */
  label?: string;
}

const sizeClasses = {
  sm: 'size-4 border-2',
  md: 'size-6 border-2',
  lg: 'size-8 border-4',
} as const;

/**
 * Spinner for one-off actions — replaces an icon in a button or a short overlay.
 * Use Skeleton for loading content with a known layout.
 */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ size = 'md', label = 'Loading', className, ...rest }, ref) => (
    <span
      ref={ref}
      role="status"
      aria-label={label}
      className={cn('inline-flex items-center justify-center', className)}
      {...rest}
    >
      <span
        aria-hidden
        className={cn(
          'animate-spin rounded-pill border-current border-r-transparent text-action',
          sizeClasses[size],
        )}
      />
      {/* Text visible only to screen readers */}
      <span className="sr-only">{label}</span>
    </span>
  ),
);
Spinner.displayName = 'Spinner';
