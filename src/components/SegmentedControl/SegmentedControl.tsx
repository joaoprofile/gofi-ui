import { useCallback, useRef } from 'react';
import { cn } from '@/lib/cn';

export interface SegmentOption<T> {
  value: T;
  label: string;
  /** Number shown next to the label (e.g. item count). */
  count?: number;
}

export interface SegmentedControlProps<T> {
  value: T;
  onChange: (value: T) => void;
  /** Between 2 and 4 segments. */
  options: SegmentOption<T>[];
  className?: string;
}

/**
 * Switches between mutually exclusive views/filters in the same place.
 * Use only with 2–4 short-label segments.
 * Keyboard navigation: ← → arrows move between segments.
 */
export function SegmentedControl<T extends string | number>({
  value,
  onChange,
  options,
  className,
}: SegmentedControlProps<T>) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let next = index;
      if (e.key === 'ArrowRight') {
        next = (index + 1) % options.length;
      } else if (e.key === 'ArrowLeft') {
        next = (index - 1 + options.length) % options.length;
      } else if (e.key === 'Home') {
        next = 0;
      } else if (e.key === 'End') {
        next = options.length - 1;
      } else {
        return;
      }
      e.preventDefault();
      tabRefs.current[next]?.focus();
      onChange(options[next].value);
    },
    [onChange, options],
  );

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={cn(
        'inline-flex gap-1 rounded-control bg-hover p-1',
        className,
      )}
    >
      {options.map((option, index) => {
        const isSelected = option.value === value;
        const ariaLabel =
          option.count !== undefined
            ? `${option.label}, ${option.count}`
            : undefined;

        return (
          <button
            key={String(option.value)}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            role="tab"
            type="button"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            aria-label={ariaLabel}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-control px-4 py-1.5 text-body-sm font-medium',
              'transition-all duration-100 ease-standard',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
              isSelected
                ? 'bg-card text-ink shadow-sm'
                : 'text-ink-secondary hover:text-ink',
            )}
          >
            <span>{option.label}</span>
            {option.count !== undefined && (
              <span
                aria-hidden
                className={cn(
                  'rounded-badge px-1.5 py-0.5 text-caption font-semibold',
                  isSelected
                    ? 'bg-action/10 text-action'
                    : 'bg-border text-ink-secondary',
                )}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
