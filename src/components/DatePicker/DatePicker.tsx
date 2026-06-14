import { useCallback, useId, useRef, type KeyboardEvent } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useDisclosure, useEscapeKey, useOnClickOutside } from '@/lib/hooks';
import { useFieldContext } from '@/components/Field/Field';
import { Calendar, type CalendarLabels } from './Calendar';
import { formatDate, type Weekday } from './dateUtils';

export interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  /** `day` picks a date; `month` turns it into a month/year picker. */
  granularity?: 'day' | 'month';
  /** BCP-47 locale for names and formatting, e.g. 'pt-BR'. */
  locale?: string;
  weekStartsOn?: Weekday;
  minDate?: Date | null;
  maxDate?: Date | null;
  isDateDisabled?: (date: Date) => boolean;
  /** Intl options for the text shown in the trigger. Sensible default per granularity. */
  displayFormat?: Intl.DateTimeFormatOptions;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  labels?: Partial<CalendarLabels>;
  id?: string;
  className?: string;
}

/**
 * Date input that opens a Calendar in a popover. Single date by default;
 * set `granularity="month"` for a month/year picker. Localized via `locale`.
 * Integrates with <Field> to inherit id, invalid state and aria.
 */
export function DatePicker({
  value,
  onChange,
  granularity = 'day',
  locale,
  weekStartsOn,
  minDate,
  maxDate,
  isDateDisabled,
  displayFormat,
  placeholder = 'Select a date',
  invalid,
  disabled = false,
  labels,
  id,
  className,
}: DatePickerProps) {
  const field = useFieldContext();
  const isInvalid = invalid ?? field?.invalid ?? false;
  const uid = useId();
  const resolvedId = id ?? field?.id ?? uid;

  const { open, onClose, onToggle } = useDisclosure();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

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

  const handleSelect = useCallback(
    (date: Date) => {
      onChange(date);
      onClose();
      triggerRef.current?.focus();
    },
    [onChange, onClose],
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

  const fmt = displayFormat ?? (granularity === 'month'
    ? { month: 'long', year: 'numeric' }
    : { dateStyle: 'medium' });
  const text = value ? formatDate(value, locale, fmt) : placeholder;

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
        <span className={cn('min-w-0 flex-1 truncate text-left', value ? 'text-ink' : 'text-ink-secondary')}>
          {text}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={placeholder}
          className={cn(
            'absolute left-0 top-full z-[var(--z-dropdown)] mt-1 rounded-md border border-border bg-card p-3 shadow-md',
            'animate-[gofi-scale-in_100ms_ease-standard_both]',
          )}
        >
          <Calendar
            mode="single"
            value={value}
            onChange={handleSelect}
            granularity={granularity}
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
