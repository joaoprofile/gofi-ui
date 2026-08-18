import {
  cloneElement,
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactElement,
} from 'react';
import { cn } from '@/lib/cn';
import { useEscapeKey } from '@/lib/hooks';

export interface TooltipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Short hint text shown in the tooltip. */
  label: string;
  /** Tooltip position relative to the child element. Default: `top`. */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * Single child — must be a focusable React element.
   * The Tooltip injects aria-describedby and the hover/focus handlers via cloneElement.
   */
  children: ReactElement;
}

/* ============================================================
 * Positioning (CSS absolute relative to the wrapper)
 * ============================================================ */

const sideClasses: Record<NonNullable<TooltipProps['side']>, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

/* ============================================================
 * Tooltip
 * ============================================================ */

/**
 * Text hint that appears on hover AND on focus of the child.
 * Disappears on leave, on blur, or when pressing Escape.
 *
 * Usage: wrap any focusable element (Button, IconButton, etc.).
 * The child receives `aria-describedby` automatically via cloneElement.
 */
export const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(
  ({ label, side = 'top', children, className, ...rest }, ref) => {
    const tooltipId = useId();
    const [visible, setVisible] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const show = useCallback(() => {
      timerRef.current = setTimeout(() => setVisible(true), 300);
    }, []);

    const hide = useCallback(() => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setVisible(false);
    }, []);

    // Close with Escape while the tooltip is visible
    useEscapeKey(hide, visible);

    // Inject props into the child via cloneElement
    const child = cloneElement(children, {
      'aria-describedby': tooltipId,
      onMouseEnter: (e: React.MouseEvent) => {
        show();
        children.props.onMouseEnter?.(e);
      },
      onMouseLeave: (e: React.MouseEvent) => {
        hide();
        children.props.onMouseLeave?.(e);
      },
      onFocus: (e: React.FocusEvent) => {
        show();
        children.props.onFocus?.(e);
      },
      onBlur: (e: React.FocusEvent) => {
        hide();
        children.props.onBlur?.(e);
      },
    });

    return (
      <span
        ref={ref}
        className={cn('relative inline-flex', className)}
        {...rest}
      >
        {child}

        <span
          id={tooltipId}
          role="tooltip"
          aria-hidden={visible ? undefined : true}
          className={cn(
            // Positioning
            'pointer-events-none absolute z-[var(--z-dropdown)] whitespace-nowrap',
            sideClasses[side],
            // Visual: dark sunken background, short text
            'rounded-overlay bg-sunken px-2.5 py-1 text-caption text-ink shadow-md',
            // Visibility transition
            'transition-opacity duration-200 ease-standard',
            visible ? 'opacity-100' : 'opacity-0',
          )}
        >
          {label}
        </span>
      </span>
    );
  },
);
Tooltip.displayName = 'Tooltip';
