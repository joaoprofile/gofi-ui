import { useCallback, useId, useMemo, useRef, type KeyboardEvent } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useDisclosure, useEscapeKey, useOnClickOutside } from '@/lib/hooks';
import { useFieldContext } from '@/components/Field/Field';
import { Calendar, type CalendarLabels } from './Calendar';
import { addDays, formatDate, startOfDay, startOfMonth, type DateRange, type Weekday } from './dateUtils';

/** A named shortcut shown beside the calendar (e.g. "Last 30 days"). */
export interface DateRangePreset {
  label: string;
  /** Computed lazily when clicked, so "today" is always current. */
  range: () => DateRange;
}

/** Built-in relative presets (English labels). Pass your own for i18n. */
export function defaultRangePresets(): DateRangePreset[] {
  const today = startOfDay(new Date());
  const lastN = (n: number): DateRange => ({ start: addDays(today, -(n - 1)), end: today });
  return [
    { label: 'Today', range: () => ({ start: today, end: today }) },
    { label: 'Last 7 days', range: () => lastN(7) },
    { label: 'Last 15 days', range: () => lastN(15) },
    { label: 'Last 30 days', range: () => lastN(30) },
    { label: 'This month', range: () => ({ start: startOfMonth(today), end: today }) },
  ];
}

export interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  /** Quick-select shortcuts. Defaults to Today / 7 / 15 / 30 days / This month. */
  presets?: DateRangePreset[];
  /** Hide the preset column entirely. */
  showPresets?: boolean;
  locale?: string;
  weekStartsOn?: Weekday;
  minDate?: Date | null;
  maxDate?: Date | null;
  isDateDisabled?: (date: Date) => boolean;
  displayFormat?: Intl.DateTimeFormatOptions;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  labels?: Partial<CalendarLabels>;
  id?: string;
  className?: string;
}

/**
 * Date range input that opens a Calendar (range mode) plus quick presets in a
 * popover. Click a start day then an end day; presets fill both at once.
 * Localized via `locale`; pass `presets` with translated labels for i18n.
 */
export function DateRangePicker({
  value,
  onChange,
  presets,
  showPresets = true,
  locale,
  weekStartsOn,
  minDate,
  maxDate,
  isDateDisabled,
  displayFormat = { dateStyle: 'medium' },
  placeholder = 'Select a period',
  invalid,
  disabled = false,
  labels,
  id,
  className,
}: DateRangePickerProps) {
  const field = useFieldContext();
  const isInvalid = invalid ?? field?.invalid ?? false;
  const uid = useId();
  const resolvedId = id ?? field?.id ?? uid;

  const { open, onClose, onToggle } = useDisclosure();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const resolvedPresets = useMemo(() => presets ?? defaultRangePresets(), [presets]);

  useOnClickOutside(containerRef, onClose, open);
  useEscapeKey(
    useCallback(() => {
      if (open) {
        onClose();
        triggerRef.current?.focus();
      }
    }, [open, onClose]),
    open,
  );

  const closeAndReturn = useCallback(() => {
    onClose();
    triggerRef.current?.focus();
  }, [onClose]);

  const handleRangeChange = useCallback(
    (next: DateRange) => {
      onChange(next);
      if (next.start && next.end) closeAndReturn();
    },
    [onChange, closeAndReturn],
  );

  const onTriggerKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onToggle();
      }
    },
    [open, onToggle],
  );

  const text =
    value.start && value.end
      ? `${formatDate(value.start, locale, displayFormat)} – ${formatDate(value.end, locale, displayFormat)}`
      : value.start
        ? `${formatDate(value.start, locale, displayFormat)} – …`
        : placeholder;

  const hasValue = Boolean(value.start);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        id={resolvedId}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-invalid={isInvalid || undefined}
        aria-required={field?.required || undefined}
        aria-describedby={field?.describedBy}
        disabled={disabled}
        onClick={() => !disabled && onToggle()}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          'flex h-11 w-full items-center gap-2 rounded-sm border bg-card px-3',
          'text-body transition-colors duration-100 ease-standard',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
          isInvalid ? 'border-danger' : open ? 'border-action' : 'border-border',
          disabled && 'cursor-not-allowed bg-hover opacity-70',
        )}
      >
        <CalendarIcon aria-hidden className="size-4 shrink-0 text-ink-secondary" />
        <span className={cn('min-w-0 flex-1 truncate text-left', hasValue ? 'text-ink' : 'text-ink-secondary')}>
          {text}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={placeholder}
          className={cn(
            'absolute left-0 top-full z-[var(--z-dropdown)] mt-1 flex rounded-md border border-border bg-card p-3 shadow-md',
            'animate-[gofi-scale-in_100ms_ease-standard_both]',
          )}
        >
          {showPresets && (
            <ul className="mr-3 flex w-32 shrink-0 flex-col gap-0.5 border-r border-border pr-3">
              {resolvedPresets.map((p) => (
                <li key={p.label}>
                  <button
                    type="button"
                    onClick={() => handleRangeChange(p.range())}
                    className="w-full rounded-md px-2 py-1.5 text-left text-body-sm text-ink transition-colors duration-100 ease-standard hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                  >
                    {p.label}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <Calendar
            mode="range"
            value={value}
            onChange={handleRangeChange}
            locale={locale}
            weekStartsOn={weekStartsOn}
            minDate={minDate}
            maxDate={maxDate}
            isDateDisabled={isDateDisabled}
            labels={labels}
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
