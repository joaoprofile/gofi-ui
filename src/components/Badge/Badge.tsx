import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

/* ============================================================
 * Badge — status label (non-interactive)
 * ============================================================ */

export const badgeVariants = cva(
  'inline-flex items-center justify-center gap-1 rounded-badge px-2 py-0.5 text-caption font-medium select-none',
  {
    variants: {
      tone: {
        success: 'bg-success-bg text-success',
        warning: 'bg-warning-bg text-warning',
        danger: 'bg-danger-bg text-danger',
        info: 'bg-info-bg text-info',
        neutral: 'bg-hover text-ink-secondary',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children: ReactNode;
}

/** Status badge — non-interactive, informational only. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ tone, className, children, ...rest }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ tone }), className)} {...rest}>
      {children}
    </span>
  ),
);
Badge.displayName = 'Badge';

/* ============================================================
 * NotificationBadge — numeric notification circle
 * ============================================================ */

export interface NotificationBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Number of unread notifications. */
  count: number;
  /** Full accessible text (e.g. "3 unread"). Default: "{count} notifications". */
  label?: string;
}

/** Numeric badge for notification counters (bg-action + white text). */
export const NotificationBadge = forwardRef<HTMLSpanElement, NotificationBadgeProps>(
  ({ count, label, className, ...rest }, ref) => (
    <span
      ref={ref}
      aria-label={label ?? `${count} notifications`}
      className={cn(
        'inline-flex min-w-[1.25rem] items-center justify-center rounded-badge',
        'bg-action px-1.5 py-0.5 text-caption font-semibold text-on-secondary select-none',
        className,
      )}
      {...rest}
    >
      {count > 99 ? '99+' : count}
    </span>
  ),
);
NotificationBadge.displayName = 'NotificationBadge';

/* ============================================================
 * Tag — category label (can be a link)
 * ============================================================ */

type TagOwnProps = {
  children: ReactNode;
  /** When provided, renders as `<a>`. */
  href?: string;
};

export type TagProps = TagOwnProps &
  (
    | ({ href?: undefined } & HTMLAttributes<HTMLSpanElement>)
    | ({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)
  );

/** Category tag — neutral pill-style label; use `href` for the link version. */
export const Tag = forwardRef<HTMLElement, TagProps>(({ href, children, className, ...rest }, ref) => {
  const base = cn(
    'inline-flex items-center rounded-chip bg-hover px-2.5 py-0.5',
    'text-caption font-medium text-ink-secondary select-none',
    href && 'cursor-pointer hover:bg-border transition-colors duration-100 ease-standard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
    className,
  );

  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={base}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <span ref={ref as React.Ref<HTMLSpanElement>} className={base} {...(rest as HTMLAttributes<HTMLSpanElement>)}>
      {children}
    </span>
  );
});
Tag.displayName = 'Tag';

/* ============================================================
 * Chip — selectable and removable filter
 * ============================================================ */

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /** Selected state — bg-action background + white text. */
  selected?: boolean;
  /** Callback when clicking the chip itself (toggle). */
  onClick?: () => void;
  /** Shows a ✕ button and fires on remove. */
  onRemove?: () => void;
  children: ReactNode;
}

/**
 * Filter chip — clickable to toggle, removable with ✕.
 * aria-pressed reflects the selected state.
 */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  ({ selected = false, onClick, onRemove, disabled, children, className, ...rest }, ref) => {
    // If onRemove exists, the chip label will be the children string (for the X button aria-label)
    const labelText = typeof children === 'string' ? children : 'item';

    return (
      <span
        className={cn(
          'inline-flex items-center gap-0.5 rounded-chip px-2.5 py-0.5',
          'text-caption font-medium transition-colors duration-100 ease-standard',
          selected ? 'bg-action text-on-secondary' : 'bg-hover text-ink-secondary',
          disabled && 'pointer-events-none opacity-40',
        )}
      >
        <button
          ref={ref}
          type="button"
          role="checkbox"
          aria-checked={selected}
          disabled={disabled}
          onClick={onClick}
          className={cn(
            'cursor-pointer bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus rounded-chip',
            className,
          )}
          {...rest}
        >
          {children}
        </button>
        {onRemove && (
          <button
            type="button"
            aria-label={`Remove ${labelText}`}
            disabled={disabled}
            onClick={onRemove}
            className={cn(
              'inline-flex items-center justify-center rounded-full p-0.5',
              'cursor-pointer bg-transparent transition-opacity duration-100 hover:opacity-70',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
            )}
          >
            <X aria-hidden className="size-3" />
          </button>
        )}
      </span>
    );
  },
);
Chip.displayName = 'Chip';
