import {
  forwardRef,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/cn';

/* ─────────────────────────────────────────────
 * Types
 * ───────────────────────────────────────────── */

export interface TabItem {
  id: string;
  label: string;
  badge?: number;
  disabled?: boolean;
}

export type TabsVariant = 'underline' | 'pill' | 'vertical';

export interface TabsProps {
  /** ID of the active tab controlled by the parent. */
  value: string;
  /** Called when the user selects a different tab. */
  onChange: (id: string) => void;
  /** List of tabs to render. */
  tabs: TabItem[];
  /** Visual variant: underline (default), pill or vertical. */
  variant?: TabsVariant;
  /** Content panels — each child must be a `<TabPanel>`. */
  children?: ReactNode;
  className?: string;
}

/* ─────────────────────────────────────────────
 * TabPanel
 * ───────────────────────────────────────────── */

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Must match the `id` of the corresponding tab. */
  tabId: string;
  /** ID of the currently active tab (passed by the parent). */
  activeTabId: string;
  children: ReactNode;
}

/**
 * Content panel associated with a tab.
 * Hidden when inactive (native `hidden` — removed from the accessible flow).
 */
export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ tabId, activeTabId, className, children, ...rest }, ref) => (
    <div
      ref={ref}
      id={`tabpanel-${tabId}`}
      role="tabpanel"
      aria-labelledby={`tab-${tabId}`}
      hidden={tabId !== activeTabId}
      tabIndex={0}
      className={cn('focus-visible:outline-none', className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
TabPanel.displayName = 'TabPanel';

/* ─────────────────────────────────────────────
 * Tabs
 * ───────────────────────────────────────────── */

/**
 * Complete tabs component following the ARIA pattern.
 * Keyboard: ← → (horizontal) or ↑ ↓ (vertical) move between tabs;
 * Home/End go to the first/last; Enter/Space activates the focused tab.
 */
export function Tabs({
  value,
  onChange,
  tabs,
  variant = 'underline',
  children,
  className,
}: TabsProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const isVertical = variant === 'vertical';

  /* Keyboard navigation between enabled tabs */
  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const enabledIndexes = tabs
      .map((t, i) => ({ t, i }))
      .filter(({ t }) => !t.disabled)
      .map(({ i }) => i);

    const pos = enabledIndexes.indexOf(index);

    let next: number | undefined;

    if ((!isVertical && e.key === 'ArrowRight') || (isVertical && e.key === 'ArrowDown')) {
      next = enabledIndexes[(pos + 1) % enabledIndexes.length];
    } else if ((!isVertical && e.key === 'ArrowLeft') || (isVertical && e.key === 'ArrowUp')) {
      next = enabledIndexes[(pos - 1 + enabledIndexes.length) % enabledIndexes.length];
    } else if (e.key === 'Home') {
      next = enabledIndexes[0];
    } else if (e.key === 'End') {
      next = enabledIndexes[enabledIndexes.length - 1];
    }

    if (next !== undefined) {
      e.preventDefault();
      tabRefs.current[next]?.focus();
      /* Automatic activation when moving focus */
      onChange(tabs[next].id);
    }
  }

  /* ── Styles per variant ── */
  const listClass = cn(
    isVertical
      ? 'flex flex-col gap-1 border-r border-border pr-1'
      : 'flex flex-row gap-0 overflow-x-auto',
    !isVertical && variant === 'underline' && 'border-b border-border',
    className,
  );

  function tabClass(tab: TabItem) {
    const active = tab.id === value;
    const base = cn(
      'inline-flex items-center gap-2 whitespace-nowrap px-4 py-2 text-body-sm font-semibold',
      'transition-colors duration-100 ease-standard',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
      'disabled:pointer-events-none disabled:opacity-40',
    );

    if (variant === 'underline') {
      return cn(
        base,
        'rounded-t-overlay border-b-[length:var(--bw-tab)] -mb-px',
        active
          ? 'border-action text-action'
          : 'border-transparent text-ink-secondary hover:text-ink hover:border-border',
      );
    }

    if (variant === 'pill') {
      return cn(
        base,
        'rounded-control',
        active
          ? 'bg-action text-on-secondary'
          : 'text-ink-secondary hover:text-ink hover:bg-hover',
      );
    }

    /* vertical */
    return cn(
      base,
      'w-full justify-start rounded-control',
      active
        ? 'bg-action text-on-secondary'
        : 'text-ink-secondary hover:text-ink hover:bg-hover',
    );
  }

  const wrapper = isVertical ? 'flex flex-row gap-4' : 'flex flex-col gap-0';

  return (
    <div className={wrapper}>
      {/* Tab list */}
      <div
        role="tablist"
        aria-orientation={isVertical ? 'vertical' : 'horizontal'}
        className={listClass}
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            type="button"
            ref={(el) => { tabRefs.current[i] = el; }}
            aria-selected={tab.id === value}
            aria-controls={`tabpanel-${tab.id}`}
            aria-disabled={tab.disabled || undefined}
            disabled={tab.disabled}
            tabIndex={tab.id === value ? 0 : -1}
            className={tabClass(tab)}
            onClick={() => !tab.disabled && onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          >
            {tab.label}
            {tab.badge !== undefined && (
              <span
                aria-label={`${tab.badge} notifications`}
                className="inline-flex min-w-[1.25rem] items-center justify-center rounded-badge bg-action px-1 text-caption text-on-secondary"
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Panels — the consumer passes <TabPanel> as children */}
      {children && <div className="flex-1">{children}</div>}
    </div>
  );
}
