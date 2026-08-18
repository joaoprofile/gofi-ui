import { useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useFocusTrap, useScrollLock, useEscapeKey } from '@/lib/hooks';
import { IconButton } from '@/components/Button';

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Accessible title; becomes the dialog's aria-labelledby. */
  title: string;
  size?: ModalSize;
  footer?: ReactNode;
  /** Allows closing via Esc and backdrop click (default true). */
  dismissable?: boolean;
  /**
   * Portal target. Defaults to `document.body`.
   *
   * A theme is a set of custom properties on an element, so an overlay that
   * portals to <body> escapes any `data-brand`/`data-theme` scoped to a
   * subtree and renders unthemed. Pass the themed wrapper here to keep the
   * overlay inside it.
   */
  container?: HTMLElement | null;
  children: ReactNode;
}

const sizes: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

/**
 * Centered modal with backdrop, focus trap, scroll lock and focus return.
 * Rendered in a portal on the <body>. Esc/backdrop close when `dismissable`.
 */
export function Modal({
  open,
  onClose,
  title,
  size = 'md',
  footer,
  dismissable = true,
  container,
  children,
}: ModalProps) {
  const titleId = useId();
  const panelRef = useFocusTrap<HTMLDivElement>(open);

  useScrollLock(open);
  useEscapeKey(onClose, open && dismissable);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[var(--z-overlay)] flex items-center justify-center p-4"
      style={{ animation: 'gofi-fade-in 200ms var(--ease-standard)' }}
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={dismissable ? onClose : undefined}
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'relative z-[var(--z-modal)] flex w-full flex-col gap-4 outline-none',
          'rounded-surface bg-card p-[var(--p-surface)] shadow-lg',
          'max-h-[calc(100dvh-2rem)]',
          sizes[size],
        )}
        style={{ animation: 'gofi-scale-in 200ms var(--ease-standard)' }}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id={titleId} className="text-h3 text-ink">
            {title}
          </h2>
          <IconButton
            aria-label="Close"
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="-mr-2 -mt-1 shrink-0"
          >
            <X className="size-5" />
          </IconButton>
        </div>

        <div className="overflow-y-auto text-body text-ink">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 pt-1">{footer}</div>
        )}
      </div>
    </div>,
    container ?? document.body,
  );
}
