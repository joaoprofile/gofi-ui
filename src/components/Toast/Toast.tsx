import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
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

export type ToastTone = 'success' | 'warning' | 'danger' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  tone: ToastTone;
  message: string;
  action?: ToastAction;
  /** Auto-dismiss in ms (default 5000). */
  duration?: number;
}

interface ToastEntry extends ToastOptions {
  id: number;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const MAX_TOASTS = 3;
const DEFAULT_DURATION = 5000;

const toneIcon: Record<ToastTone, LucideIcon> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
  info: Info,
};

const toneIconColor: Record<ToastTone, string> = {
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  info: 'text-info',
};

export interface ToastProviderProps {
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

/**
 * Provides `useToast()` and renders the toast stack (top-right corner,
 * max 3) in a portal on the <body>. Must wrap the application.
 */
export function ToastProvider({ container, children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    const id = ++idRef.current;
    setToasts((list) => {
      const next = [...list, { ...options, id }];
      // keep at most MAX_TOASTS, discarding the oldest ones
      return next.slice(-MAX_TOASTS);
    });
    return id;
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div
          className="pointer-events-none fixed right-4 top-4 z-[var(--z-toast)] flex w-full max-w-sm flex-col gap-3"
          aria-live="polite"
        >
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </div>,
        container ?? document.body,
      )}
    </ToastContext.Provider>
  );
}

interface ToastItemProps {
  toast: ToastEntry;
  onDismiss: () => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const { tone, message, action, duration = DEFAULT_DURATION } = toast;
  const Icon = toneIcon[tone];
  const isError = tone === 'danger';

  const [paused, setPaused] = useState(false);
  const remainingRef = useRef(duration);
  const startRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (duration <= 0) return;
    if (paused) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        remainingRef.current -= Date.now() - startRef.current;
      }
      return;
    }
    startRef.current = Date.now();
    timerRef.current = setTimeout(onDismiss, Math.max(remainingRef.current, 0));
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [paused, duration, onDismiss]);

  return (
    <div
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
      className={cn(
        'pointer-events-auto flex items-start gap-3 rounded-overlay bg-card p-4 shadow-lg',
        'border border-border text-body-sm text-ink',
      )}
      style={{ animation: 'gofi-scale-in 200ms var(--ease-standard)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Icon aria-hidden className={cn('mt-0.5 size-5 shrink-0', toneIconColor[tone])} />
      <p className="min-w-0 flex-1 break-words">{message}</p>
      {action && (
        <button
          type="button"
          onClick={() => {
            action.onClick();
            onDismiss();
          }}
          className="shrink-0 self-center font-semibold text-action hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          {action.label}
        </button>
      )}
      <IconButton
        aria-label="Close"
        size="sm"
        variant="ghost"
        onClick={onDismiss}
        className="-mr-1 -mt-1 shrink-0"
      >
        <X className="size-4" />
      </IconButton>
    </div>
  );
}

/** Accesses `toast(options)` and `dismiss(id)`. Requires <ToastProvider>. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within <ToastProvider>.');
  }
  return ctx;
}
