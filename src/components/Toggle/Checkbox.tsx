import { useEffect, useRef } from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  /** Intermediate state — "select all" when partially checked. */
  indeterminate?: boolean;
  disabled?: boolean;
  invalid?: boolean;
}

/**
 * Checkbox. Use for independent choices (0..N).
 * The `indeterminate` state is controlled externally (e.g.: "select all").
 */
export function Checkbox({
  id,
  checked,
  onChange,
  label,
  indeterminate = false,
  disabled = false,
  invalid = false,
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // The `indeterminate` attribute does not exist in HTML — requires direct DOM access.
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label
      htmlFor={id}
      className={cn(
        'group inline-flex min-h-11 cursor-pointer items-center gap-3',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      {/* Hidden native input — controls accessibility and state */}
      <input
        ref={inputRef}
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className="peer sr-only"
      />

      {/* Visual box */}
      <span
        aria-hidden
        className={cn(
          'inline-flex size-5 shrink-0 items-center justify-center rounded-sm border-2 transition-colors duration-100 ease-standard',
          'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus',
          checked || indeterminate
            ? 'border-action bg-action text-white'
            : 'border-border bg-card',
          invalid && !(checked || indeterminate) && 'border-danger',
        )}
      >
        {indeterminate ? (
          <Minus className="size-3" strokeWidth={3} />
        ) : checked ? (
          <Check className="size-3" strokeWidth={3} />
        ) : null}
      </span>

      {/* Label */}
      <span className="text-body text-ink">{label}</span>
    </label>
  );
}
