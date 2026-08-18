import { cn } from '@/lib/cn';

export interface RadioProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  /** Groups exclusive radios — all in the same group share the same `name`. */
  name?: string;
  disabled?: boolean;
  invalid?: boolean;
}

/**
 * Radio button. Always inside `<fieldset>` + `<legend>` for groups.
 * Use when there are 2–5 visible exclusive options.
 */
export function Radio({
  id,
  checked,
  onChange,
  label,
  name,
  disabled = false,
  invalid = false,
}: RadioProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'group inline-flex min-h-11 cursor-pointer items-center gap-3',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      {/* Hidden native input */}
      <input
        type="radio"
        id={id}
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className="peer sr-only"
      />

      {/* Visual circle */}
      <span
        aria-hidden
        className={cn(
          'inline-flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-100 ease-standard',
          'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus',
          checked ? 'border-action bg-card' : 'border-border bg-card',
          invalid && !checked && 'border-danger',
        )}
      >
        {checked && (
          <span aria-hidden className="size-2.5 rounded-full bg-action" />
        )}
      </span>

      {/* Label */}
      <span className="text-body text-ink">{label}</span>
    </label>
  );
}
