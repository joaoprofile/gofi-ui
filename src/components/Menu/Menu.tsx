import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/cn';
import { useEscapeKey, useOnClickOutside } from '@/lib/hooks';

export interface MenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

export interface MenuProps {
  trigger: ReactNode;
  items: MenuItem[];
  align?: 'start' | 'end';
}

/**
 * Actions dropdown. The trigger receives aria-haspopup + aria-expanded; panel
 * role="menu", items role="menuitem". Arrows navigate, Enter/Space activates,
 * Esc closes and returns focus to the trigger, click-outside closes. Destructive
 * items are grouped at the end with a divider.
 */
export function Menu({ trigger, items, align = 'start' }: MenuProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const enabledIndexes = items
    .map((it, i) => (it.disabled ? -1 : i))
    .filter((i) => i >= 0);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    setActiveIndex(-1);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  useOnClickOutside(containerRef, () => close(false), open);
  useEscapeKey(() => close(true), open);

  // focus the active item
  useEffect(() => {
    if (open && activeIndex >= 0) itemRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  const openMenu = (index: number) => {
    setOpen(true);
    setActiveIndex(index);
  };

  const step = (from: number, dir: 1 | -1) => {
    if (enabledIndexes.length === 0) return from;
    const pos = enabledIndexes.indexOf(from);
    const nextPos =
      pos === -1
        ? dir === 1
          ? 0
          : enabledIndexes.length - 1
        : (pos + dir + enabledIndexes.length) % enabledIndexes.length;
    return enabledIndexes[nextPos];
  };

  const onTriggerKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openMenu(enabledIndexes[0] ?? -1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      openMenu(enabledIndexes[enabledIndexes.length - 1] ?? -1);
    }
  };

  const onMenuKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => step(i, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => step(i, -1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(enabledIndexes[0] ?? -1);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(enabledIndexes[enabledIndexes.length - 1] ?? -1);
    }
  };

  const select = (item: MenuItem) => {
    if (item.disabled) return;
    item.onSelect();
    close(true);
  };

  if (!isValidElement(trigger)) {
    throw new Error('Menu: `trigger` must be a single React element.');
  }

  const triggerEl = cloneElement(trigger as ReactElement<Record<string, unknown>>, {
    ref: triggerRef,
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    onClick: (e: MouseEvent) => {
      (trigger.props as { onClick?: (e: MouseEvent) => void }).onClick?.(e);
      open ? close(false) : openMenu(-1);
    },
    onKeyDown: onTriggerKeyDown,
  });

  // index of the first contiguous destructive item at the end → divider before it
  let dividerAt = -1;
  for (let i = items.length - 1; i >= 0; i--) {
    if (items[i].danger) dividerAt = i;
    else break;
  }
  if (dividerAt <= 0) dividerAt = -1;

  return (
    <div ref={containerRef} className="relative inline-block">
      {triggerEl}
      {open && (
        <div
          role="menu"
          aria-orientation="vertical"
          onKeyDown={onMenuKeyDown}
          className={cn(
            'absolute top-full z-[var(--z-dropdown)] mt-2 min-w-44 overflow-hidden',
            'rounded-md border border-border bg-card py-1 shadow-md',
            align === 'end' ? 'right-0' : 'left-0',
          )}
          style={{ animation: 'gofi-scale-in 150ms var(--ease-standard)' }}
        >
          {items.map((item, i) => (
            <div key={item.id} className="contents">
              {i === dividerAt && (
                <div role="separator" className="my-1 border-t border-border" />
              )}
              <button
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                type="button"
                role="menuitem"
                tabIndex={i === activeIndex ? 0 : -1}
                disabled={item.disabled}
                onClick={() => select(item)}
                className={cn(
                  'flex w-full items-center gap-3 px-3 py-2 text-left text-body-sm',
                  'transition-colors duration-100 ease-standard hover:bg-hover',
                  'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus',
                  'disabled:pointer-events-none disabled:opacity-40',
                  item.danger ? 'text-danger' : 'text-ink',
                )}
              >
                {item.icon && (
                  <span aria-hidden className="inline-flex shrink-0">
                    {item.icon}
                  </span>
                )}
                <span className="flex-1">{item.label}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
