import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Current value. Omit = indeterminate.
   * Use with `showValue` to display the numeric label alongside.
   */
  value?: number;
  /** Maximum value. Default: 100. */
  max?: number;
  /** Visual variant. Default: `linear`. */
  variant?: 'linear' | 'circular';
  /** Descriptive label of what is progressing (for aria-label). */
  label?: string;
  /**
   * Displays the textual value alongside (e.g. "14 / 22").
   * Required in contexts where the number matters — don't rely on the bar alone.
   */
  showValue?: boolean;
}

/* ============================================================
 * Internal types (without `variant` so it doesn't leak to the DOM)
 * ============================================================ */

type InnerProgressProps = Omit<ProgressProps, 'variant'>;

/* ============================================================
 * Progress Linear
 * ============================================================ */

const LinearProgress = forwardRef<HTMLDivElement, InnerProgressProps>(
  ({ value, max = 100, label, showValue, className, ...rest }, ref) => {
    const isDeterminate = value !== undefined;
    const pct = isDeterminate ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
    const isComplete = isDeterminate && pct >= 100;

    return (
      <div ref={ref} className={cn('flex flex-col gap-1', className)} {...rest}>
        {(label || showValue) && (
          <div className="flex items-center justify-between gap-2">
            {label && <span className="text-body-sm text-ink-secondary">{label}</span>}
            {showValue && isDeterminate && (
              <span className="text-body-sm font-semibold text-ink tabular-nums">
                {value} / {max}
              </span>
            )}
          </div>
        )}

        <div
          role="progressbar"
          aria-label={label ?? 'Progress'}
          aria-valuemin={0}
          aria-valuemax={isDeterminate ? max : undefined}
          aria-valuenow={isDeterminate ? value : undefined}
          className="h-2 w-full overflow-hidden rounded-track bg-hover"
        >
          {isDeterminate ? (
            <div
              className={cn(
                'h-full rounded-track transition-all duration-300 ease-standard',
                isComplete ? 'bg-success' : 'bg-action',
              )}
              style={{ width: `${pct}%` }}
            />
          ) : (
            /* Indeterminate bar: back-and-forth animation */
            <div
              aria-hidden
              className="h-full w-1/3 rounded-track bg-action [animation:gofi-indeterminate_1.4s_ease-standard_infinite]"
            />
          )}
        </div>
      </div>
    );
  },
);
LinearProgress.displayName = 'LinearProgress';

/* ============================================================
 * Progress Circular
 * ============================================================ */

const CIRCLE_SIZE = 40;
const STROKE = 4;
const RADIUS = (CIRCLE_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const CircularProgress = forwardRef<HTMLDivElement, InnerProgressProps>(
  ({ value, max = 100, label, showValue, className, ...rest }, ref) => {
    const isDeterminate = value !== undefined;
    const pct = isDeterminate ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
    const isComplete = isDeterminate && pct >= 100;
    const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-label={label ?? 'Progress'}
        aria-valuemin={0}
        aria-valuemax={isDeterminate ? max : undefined}
        aria-valuenow={isDeterminate ? value : undefined}
        className={cn('relative inline-flex items-center justify-center', className)}
        {...rest}
      >
        <svg
          width={CIRCLE_SIZE}
          height={CIRCLE_SIZE}
          viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}
          aria-hidden
          className={cn(!isDeterminate && '[animation:gofi-spin_1s_linear_infinite]')}
        >
          {/* Track */}
          <circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            className="stroke-hover"
          />
          {/* Fill */}
          <circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={isDeterminate ? offset : CIRCUMFERENCE * 0.75}
            className={cn(
              'transition-[stroke-dashoffset] duration-300 ease-standard',
              isComplete ? 'stroke-success' : 'stroke-action',
            )}
            style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
          />
        </svg>

        {showValue && isDeterminate && (
          <span className="absolute text-caption font-semibold text-ink tabular-nums">
            {Math.round(pct)}%
          </span>
        )}
      </div>
    );
  },
);
CircularProgress.displayName = 'CircularProgress';

/* ============================================================
 * Progress — unified entry point
 * ============================================================ */

/**
 * Progress bar or circle. Supports determinate and indeterminate modes.
 * Always pair it with `label` and `showValue` when the number matters.
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ variant = 'linear', ...props }, ref) => {
    if (variant === 'circular') return <CircularProgress ref={ref} {...props} />;
    return <LinearProgress ref={ref} {...props} />;
  },
);
Progress.displayName = 'Progress';
