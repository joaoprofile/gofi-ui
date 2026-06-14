import { useId } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useFieldContext } from '@/components/Field/Field';

/** Translatable accessible names for the two selects. */
export interface TimePickerLabels {
  hours: string;
  minutes: string;
}

const DEFAULT_LABELS: TimePickerLabels = { hours: 'Hours', minutes: 'Minutes' };

export interface TimePickerProps {
  /** 24-hour "HH:mm" string, or null when empty. */
  value: string | null;
  onChange: (value: string) => void;
  /** Step between selectable minutes. Default 5. */
  minuteStep?: number;
  invalid?: boolean;
  disabled?: boolean;
  labels?: Partial<TimePickerLabels>;
  id?: string;
  className?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

function parse(value: string | null): { h: number | null; m: number | null } {
  if (!value) return { h: null, m: null };
  const [h, m] = value.split(':').map((p) => Number.parseInt(p, 10));
  return { h: Number.isNaN(h) ? null : h, m: Number.isNaN(m) ? null : m };
}

/**
 * Compact 24-hour time picker (hours : minutes). Numeric values are
 * locale-independent; only the accessible labels are translatable.
 * Integrates with <Field> for id/invalid/aria.
 */
export function TimePicker({
  value,
  onChange,
  minuteStep = 5,
  invalid,
  disabled = false,
  labels: labelsProp,
  id,
  className,
}: TimePickerProps) {
  const field = useFieldContext();
  const isInvalid = invalid ?? field?.invalid ?? false;
  const uid = useId();
  const resolvedId = id ?? field?.id ?? uid;
  const labels = { ...DEFAULT_LABELS, ...labelsProp };

  const { h, m } = parse(value);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep);

  const emit = (nh: number | null, nm: number | null) => onChange(`${pad(nh ?? 0)}:${pad(nm ?? 0)}`);

  const selectClass =
    'bg-transparent text-body tabular-nums text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed';

  return (
    <div
      className={cn(
        'inline-flex h-11 items-center gap-1 rounded-sm border bg-card px-3',
        'transition-colors duration-100 ease-standard',
        'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus',
        isInvalid ? 'border-danger' : 'border-border focus-within:border-action',
        disabled && 'cursor-not-allowed bg-hover opacity-70',
        className,
      )}
    >
      <Clock aria-hidden className="size-4 shrink-0 text-ink-secondary" />
      <select
        id={resolvedId}
        aria-label={labels.hours}
        aria-invalid={isInvalid || undefined}
        disabled={disabled}
        value={h ?? ''}
        onChange={(e) => emit(Number.parseInt(e.target.value, 10), m)}
        className={selectClass}
      >
        <option value="" disabled>
          --
        </option>
        {hours.map((hh) => (
          <option key={hh} value={hh}>
            {pad(hh)}
          </option>
        ))}
      </select>
      <span aria-hidden className="text-ink-secondary">:</span>
      <select
        aria-label={labels.minutes}
        disabled={disabled}
        value={m ?? ''}
        onChange={(e) => emit(h, Number.parseInt(e.target.value, 10))}
        className={selectClass}
      >
        <option value="" disabled>
          --
        </option>
        {minutes.map((mm) => (
          <option key={mm} value={mm}>
            {pad(mm)}
          </option>
        ))}
      </select>
    </div>
  );
}
