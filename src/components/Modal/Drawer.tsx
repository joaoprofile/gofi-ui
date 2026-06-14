import { useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useFocusTrap, useScrollLock, useEscapeKey } from '@/lib/hooks';
import { IconButton } from '@/components/Button';

export type DrawerSide = 'right' | 'left' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: DrawerSide;
  size?: DrawerSize;
  footer?: ReactNode;
  dismissable?: boolean;
  children: ReactNode;
}

const sideSizes: Record<DrawerSide, Record<DrawerSize, string>> = {
  right: { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' },
  left: { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' },
  bottom: { sm: 'max-h-[40dvh]', md: 'max-h-[60dvh]', lg: 'max-h-[80dvh]' },
};

const sidePosition: Record<DrawerSide, string> = {
  right: 'inset-y-0 right-0 h-full w-full rounded-l-lg',
  left: 'inset-y-0 left-0 h-full w-full rounded-r-lg',
  bottom: 'inset-x-0 bottom-0 w-full rounded-t-lg',
};

// Animations per side. `gofi-slide-in-right` exists in the theme; left/bottom use
// equivalent inline keyframes via initial translate + fade (reduced-motion
// is still respected by the global rule).
const sideAnimation: Record<DrawerSide, string> = {
  right: 'gofi-slide-in-right 300ms var(--ease-standard)',
  left: 'gofi-slide-in-left 300ms var(--ease-standard)',
  bottom: 'gofi-slide-in-up 300ms var(--ease-standard)',
};

/**
 * Side panel (or bottom sheet) with slide-in, focus trap, scroll lock and
 * focus return. Same a11y as the Modal. Portal on the <body>.
 */
export function Drawer({
  open,
  onClose,
  title,
  side = 'right',
  size = 'md',
  footer,
  dismissable = true,
  children,
}: DrawerProps) {
  const titleId = useId();
  const panelRef = useFocusTrap<HTMLDivElement>(open);

  useScrollLock(open);
  useEscapeKey(onClose, open && dismissable);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[var(--z-overlay)]"
      style={{ animation: 'gofi-fade-in 200ms var(--ease-standard)' }}
    >
      {/* local keyframes for left/bottom (right lives in theme.css) */}
      <style>{drawerKeyframes}</style>
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
          'absolute z-[var(--z-modal)] flex flex-col gap-4 outline-none',
          'bg-card p-5 shadow-lg',
          sidePosition[side],
          sideSizes[side][size],
        )}
        style={{ animation: sideAnimation[side] }}
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

        <div className="flex-1 overflow-y-auto text-body text-ink">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 pt-1">{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  );
}

const drawerKeyframes = `
@keyframes gofi-slide-in-left { from { transform: translateX(-100%); } to { transform: translateX(0); } }
@keyframes gofi-slide-in-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
`;
