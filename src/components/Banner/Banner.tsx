import { type ReactNode } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  X,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { IconButton } from '@/components/Button';

export type BannerTone = 'success' | 'warning' | 'danger' | 'info';

export interface BannerProps {
  tone: BannerTone;
  title?: string;
  children: ReactNode;
  /** Resolution action (e.g. <Button>Try again</Button>). */
  action?: ReactNode;
  /** When set, shows a "Close" IconButton. */
  onDismiss?: () => void;
}

const toneIcon: Record<BannerTone, LucideIcon> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
  info: Info,
};

const toneStyles: Record<BannerTone, { bg: string; icon: string }> = {
  success: { bg: 'bg-success-bg', icon: 'text-success' },
  warning: { bg: 'bg-warning-bg', icon: 'text-warning' },
  danger: { bg: 'bg-danger-bg', icon: 'text-danger' },
  info: { bg: 'bg-info-bg', icon: 'text-info' },
};

const toneRole: Record<BannerTone, 'status' | 'alert'> = {
  success: 'status',
  warning: 'status',
  danger: 'alert',
  info: 'status',
};

/**
 * Persistent, contextual notice (top of section/page). Color by status +
 * icon + text (never color alone). Offers a resolve and/or dismiss action.
 */
export function Banner({ tone, title, children, action, onDismiss }: BannerProps) {
  const Icon = toneIcon[tone];
  const { bg, icon } = toneStyles[tone];

  return (
    <div
      role={toneRole[tone]}
      className={cn('flex items-start gap-3 rounded-md p-4 text-body-sm', bg)}
    >
      <Icon aria-hidden className={cn('mt-0.5 size-5 shrink-0', icon)} />
      <div className="min-w-0 flex-1">
        {title && <p className="font-semibold text-ink">{title}</p>}
        <div className="text-ink">{children}</div>
        {action && <div className="mt-3 flex items-center gap-3">{action}</div>}
      </div>
      {onDismiss && (
        <IconButton
          aria-label="Close"
          size="sm"
          variant="ghost"
          onClick={onDismiss}
          className="-mr-1 -mt-1 shrink-0"
        >
          <X className="size-4" />
        </IconButton>
      )}
    </div>
  );
}
