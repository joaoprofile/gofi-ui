import { useCallback } from 'react';
import { cn } from '@/lib/cn';
import { DatePicker } from './DatePicker';
import { TimePicker, type TimePickerLabels } from './TimePicker';
import { type CalendarLabels } from './Calendar';
import { type Weekday } from './dateUtils';

export interface DateTimePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  locale?: string;
  weekStartsOn?: Weekday;
  minDate?: Date | null;
  maxDate?: Date | null;
  isDateDisabled?: (date: Date) => boolean;
  /** Step between selectable minutes. Default 5. */
  minuteStep?: number;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  labels?: Partial<CalendarLabels>;
  timeLabels?: Partial<TimePickerLabels>;
  id?: string;
  className?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Date + time selection on a single `Date`. Combines a DatePicker (calendar
 * popover) with a TimePicker; selecting a day keeps the chosen time and
 * vice-versa. Localized via `locale`.
 */
export function DateTimePicker({
  value,
  onChange,
  locale,
  weekStartsOn,
  minDate,
  maxDate,
  isDateDisabled,
  minuteStep = 5,
  placeholder,
  invalid,
  disabled = false,
  labels,
  timeLabels,
  id,
  className,
}: DateTimePickerProps) {
  const handleDate = useCallback(
    (d: Date) => {
      const h = value ? value.getHours() : 0;
      const m = value ? value.getMinutes() : 0;
      onChange(new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m));
    },
    [value, onChange],
  );

  const handleTime = useCallback(
    (time: string) => {
      const [h, m] = time.split(':').map((p) => Number.parseInt(p, 10));
      const base = value ?? new Date();
      onChange(new Date(base.getFullYear(), base.getMonth(), base.getDate(), h, m));
    },
    [value, onChange],
  );

  const timeValue = value ? `${pad(value.getHours())}:${pad(value.getMinutes())}` : null;

  return (
    <div className={cn('flex flex-wrap items-start gap-2', className)}>
      <DatePicker
        id={id}
        value={value}
        onChange={handleDate}
        locale={locale}
        weekStartsOn={weekStartsOn}
        minDate={minDate}
        maxDate={maxDate}
        isDateDisabled={isDateDisabled}
        placeholder={placeholder}
        invalid={invalid}
        disabled={disabled}
        labels={labels}
        className="min-w-44 flex-1"
      />
      <TimePicker
        value={timeValue}
        onChange={handleTime}
        minuteStep={minuteStep}
        invalid={invalid}
        disabled={disabled}
        labels={timeLabels}
      />
    </div>
  );
}
