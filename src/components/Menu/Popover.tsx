import {
  cloneElement,
  isValidElement,
  useCallback,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/cn';
import { useEscapeKey, useOnClickOutside, useFocusTrap } from '@/lib/hooks';

export interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'start' | 'end';
}

/**
 * Arbitrary floating content anchored to a trigger. The trigger receives
 * aria-expanded; focus enters the panel on open; Esc and click-outside close
 * and return focus to the trigger.
 */
export function Popover({ trigger, children, align = 'start' }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useFocusTrap<HTMLDivElement>(open);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  useOnClickOutside(containerRef, () => close(false), open);
  useEscapeKey(() => close(true), open);

  if (!isValidElement(trigger)) {
    throw new Error('Popover: `trigger` must be a single React element.');
  }

  const triggerEl = cloneElement(trigger as ReactElement<Record<string, unknown>>, {
    ref: triggerRef,
    'aria-expanded': open,
    onClick: (e: MouseEvent) => {
      (trigger.props as { onClick?: (e: MouseEvent) => void }).onClick?.(e);
      setOpen((v) => !v);
    },
  });

  return (
    <div ref={containerRef} className="relative inline-block">
      {triggerEl}
      {open && (
        <div
          ref={panelRef}
          tabIndex={-1}
          className={cn(
            'absolute top-full z-[var(--z-dropdown)] mt-2 min-w-56 outline-none',
            'rounded-overlay border border-border bg-card p-4 text-body-sm text-ink shadow-md',
            align === 'end' ? 'right-0' : 'left-0',
          )}
          style={{ animation: 'gofi-scale-in 150ms var(--ease-standard)' }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
