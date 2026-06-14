import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type EmptyStateVariant = 'first-use' | 'no-results' | 'all-done';

export interface EmptyStateProps {
  /** Decorative icon — will be aria-hidden automatically. */
  icon?: ReactNode;
  /** Title of the empty region (heading). */
  title: string;
  /** Short description explaining the state or guiding the next action. */
  description?: string;
  /** Real CTA (Button, link, etc.) rendered below the description. */
  action?: ReactNode;
  /** Semantic context of the empty state: first use, no results or all done. */
  variant?: EmptyStateVariant;
  className?: string;
}

/**
 * Empty state — one of the 4 required data screens (patterns/states.md).
 * Distinguishes first-use, no-results and all-done with microcopy.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'first-use',
  className,
}: EmptyStateProps) {
  /* visual tone per variant */
  const iconWrapperClass = cn(
    'flex size-16 items-center justify-center rounded-xl',
    variant === 'all-done' && 'bg-success-bg text-success',
    variant === 'no-results' && 'bg-sunken text-ink-secondary',
    variant === 'first-use' && 'bg-brand text-on-brand',
  );

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 px-6 py-12 text-center',
        className,
      )}
      /* no role=region here — the title is already the region heading */
    >
      {icon && (
        /* decorative icon — no semantics for screen readers */
        <div aria-hidden="true" className={iconWrapperClass}>
          {icon}
        </div>
      )}

      {/* title is a heading so screen readers announce the region */}
      <h3 className="text-h3 text-ink">{title}</h3>

      {description && (
        <p className="max-w-sm text-body-sm text-ink-secondary">{description}</p>
      )}

      {action && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          {action}
        </div>
      )}
    </div>
  );
}
