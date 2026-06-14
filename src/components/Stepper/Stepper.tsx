import { Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

/* ─────────────────────────────────────────────
 * Types
 * ───────────────────────────────────────────── */

export interface Step {
  id: string;
  label: string;
  optional?: boolean;
  status?: 'error';
}

export interface StepperProps {
  steps: Step[];
  /** Index (0-based) of the current step. */
  current: number;
  orientation?: 'horizontal' | 'vertical';
  /** Allows clicking already completed steps to navigate. */
  onStepClick?: (index: number) => void;
  className?: string;
}

/* ─────────────────────────────────────────────
 * Step icon
 * ───────────────────────────────────────────── */

type StepState = 'completed' | 'current' | 'error' | 'upcoming';

function StepIcon({ state, number }: { state: StepState; number: number }) {
  const base = 'flex size-8 items-center justify-center rounded-full text-body-sm font-semibold shrink-0';

  if (state === 'completed') {
    return (
      <span className={cn(base, 'bg-success text-white')}>
        {/* Icon + label hidden for screen readers */}
        <Check aria-hidden="true" className="size-4" />
        <span className="sr-only">Completed</span>
      </span>
    );
  }

  if (state === 'error') {
    return (
      <span className={cn(base, 'bg-danger-bg border-2 border-danger text-danger')}>
        <AlertCircle aria-hidden="true" className="size-4" />
        <span className="sr-only">Error</span>
      </span>
    );
  }

  if (state === 'current') {
    return (
      <span className={cn(base, 'bg-action text-white ring-2 ring-action ring-offset-2')}>
        {number}
        <span className="sr-only">Current</span>
      </span>
    );
  }

  /* upcoming */
  return (
    <span className={cn(base, 'border-2 border-border bg-card text-ink-secondary')}>
      {number}
    </span>
  );
}

/* ─────────────────────────────────────────────
 * Stepper
 * ───────────────────────────────────────────── */

/**
 * Sequential multi-step flow.
 * `<ol>` with `aria-current="step"` on the active step.
 * State communicated by icon+text, never by color alone (a11y).
 */
export function Stepper({
  steps,
  current,
  orientation = 'horizontal',
  onStepClick,
  className,
}: StepperProps) {
  const isVertical = orientation === 'vertical';
  const total = steps.length;

  function getState(index: number, step: Step): StepState {
    if (step.status === 'error') return 'error';
    if (index < current) return 'completed';
    if (index === current) return 'current';
    return 'upcoming';
  }

  return (
    <nav aria-label={`Step ${current + 1} of ${total}`}>
      {/* Progress announced for screen readers */}
      <p className="sr-only">
        Step {current + 1} of {total}: {steps[current]?.label}
      </p>

      <ol
        className={cn(
          isVertical
            ? 'flex flex-col gap-0'
            : 'flex flex-row items-start gap-0',
          className,
        )}
      >
        {steps.map((step, index) => {
          const state = getState(index, step);
          const isClickable = onStepClick && state === 'completed';
          const isCurrent = index === current;
          const isLast = index === total - 1;

          const labelClass = cn(
            'text-body-sm font-semibold leading-tight',
            state === 'current' && 'text-action',
            state === 'completed' && 'text-ink',
            state === 'upcoming' && 'text-ink-secondary',
            state === 'error' && 'text-danger',
          );

          const stepContent = (
            <>
              <StepIcon state={state} number={index + 1} />
              <span className="flex flex-col gap-0.5">
                <span className={labelClass}>{step.label}</span>
                {step.optional && (
                  <span className="text-caption text-ink-secondary">Optional</span>
                )}
                {state === 'error' && (
                  <span className="text-caption text-danger">Attention needed</span>
                )}
              </span>
            </>
          );

          return (
            <li
              key={step.id}
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'relative flex',
                isVertical
                  ? 'flex-row items-start gap-3 pb-6 last:pb-0'
                  : 'flex-1 flex-col items-center gap-2 last:flex-none',
              )}
            >
              {/* Connector line */}
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute bg-border',
                    isVertical
                      ? 'left-4 top-8 w-px'
                      : 'top-4 h-px w-full',
                    isVertical ? 'bottom-0' : 'left-[calc(50%+20px)] right-[calc(-50%+20px)]',
                    state === 'completed' && 'bg-success',
                  )}
                />
              )}

              {/* Step content — button if clickable */}
              {isClickable ? (
                <button
                  type="button"
                  onClick={() => onStepClick(index)}
                  className={cn(
                    'flex gap-3 items-center',
                    isVertical ? 'flex-row' : 'flex-col items-center',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus rounded-sm',
                  )}
                >
                  {stepContent}
                </button>
              ) : (
                <div
                  className={cn(
                    'flex gap-3 items-center',
                    isVertical ? 'flex-row' : 'flex-col items-center',
                  )}
                >
                  {stepContent}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
