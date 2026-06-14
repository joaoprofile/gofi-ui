import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/cn';

/* ─────────────────────────────────────────────
 * List
 * ───────────────────────────────────────────── */

export interface ListProps extends HTMLAttributes<HTMLUListElement> {
  children: ReactNode;
}

/**
 * Semantic vertical collection — `<ul role="list">`.
 * Each child should be a `<ListItem>` (which emits its own `<li>`).
 */
export const List = forwardRef<HTMLUListElement, ListProps>(
  ({ className, children, ...rest }, ref) => (
    <ul
      ref={ref}
      role="list"
      className={cn('flex flex-col divide-y divide-border', className)}
      {...rest}
    >
      {children}
    </ul>
  ),
);
List.displayName = 'List';

/* ─────────────────────────────────────────────
 * ListItem
 * ───────────────────────────────────────────── */

export interface ListItemProps {
  /** Element on the left: avatar, icon, etc. */
  leading?: ReactNode;
  /** Main text of the item. */
  title: string;
  /** Secondary text below the title. */
  subtitle?: string;
  /** Element on the right: meta, action, chevron, etc. */
  trailing?: ReactNode;
  /** Makes the item a clickable `<a>`. */
  href?: string;
  /** Makes the item a clickable `<button>` (ignored when href is also passed). */
  onClick?: () => void;
  /** Marks the item as selected/active in navigation. */
  selected?: boolean;
  /** Disables interaction and applies a reduced appearance. */
  disabled?: boolean;
  className?: string;
}

/**
 * Rich list item with optional leading/trailing.
 * Renders as `<a>` when `href` is provided, as `<button>` when
 * `onClick` is provided, or as a static `<div>` otherwise.
 * Minimum height 56px per spec.
 */
export function ListItem({
  leading,
  title,
  subtitle,
  trailing,
  href,
  onClick,
  selected = false,
  disabled = false,
  className,
}: ListItemProps) {
  const isInteractive = Boolean(href ?? onClick);

  const baseClass = cn(
    'flex min-h-14 w-full items-center gap-3 px-4 py-3',
    isInteractive &&
      !disabled &&
      'cursor-pointer hover:bg-hover transition-colors duration-100 ease-standard',
    isInteractive &&
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
    disabled && 'pointer-events-none opacity-40',
    selected && 'bg-hover',
    className,
  );

  const content = (
    <>
      {leading && (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {leading}
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-body font-medium text-ink">{title}</span>
        {subtitle && (
          <span className="truncate text-body-sm text-ink-secondary">{subtitle}</span>
        )}
      </span>
      {trailing && (
        <span className="inline-flex shrink-0 items-center text-ink-secondary">
          {trailing}
        </span>
      )}
    </>
  );

  /* ── Conditional rendering: <a>, <button> or static <div> ── */

  if (href) {
    return (
      <li>
        <a
          href={disabled ? undefined : href}
          aria-current={selected ? 'page' : undefined}
          aria-disabled={disabled || undefined}
          className={baseClass}
        >
          {content}
        </a>
      </li>
    );
  }

  if (onClick) {
    return (
      <li>
        <button
          type="button"
          onClick={disabled ? undefined : onClick}
          disabled={disabled}
          aria-current={selected ? 'true' : undefined}
          aria-pressed={selected}
          className={baseClass}
        >
          {content}
        </button>
      </li>
    );
  }

  /* Static item (no interaction) */
  return (
    <li className={baseClass} aria-current={selected ? 'true' : undefined}>
      {content}
    </li>
  );
}
