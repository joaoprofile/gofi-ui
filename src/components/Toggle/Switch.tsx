import { cn } from '@/lib/cn';

export interface SwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  invalid?: boolean;
}

/**
 * On/off switch with **immediate** effect. Use only when the change
 * does not need confirmation (e.g.: enabling notifications).
 * Implemented with `role="switch"` over a `<button>` for maximum a11y.
 */
export function Switch({
  id,
  checked,
  onChange,
  label,
  disabled = false,
  invalid = false,
}: SwitchProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'inline-flex min-h-11 cursor-pointer items-center gap-3',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      {/*
        Hidden native input — keeps form semantics and associates the id with the label.
        The visual and a11y role is reinforced by the <span> with role="switch".
      */}
      <input
        type="checkbox"
        id={id}
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        aria-checked={checked}
        aria-invalid={invalid || undefined}
        className="peer sr-only"
      />

      {/* Visual track */}
      <span
        aria-hidden
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-track',
          'transition-colors duration-200 ease-standard',
          'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus',
          checked ? 'bg-action' : 'bg-border',
          invalid && !checked && 'bg-danger/40',
        )}
      >
        {/* Knob */}
        <span
          className={cn(
            'absolute size-4 rounded-track bg-white shadow-sm',
            'transition-transform duration-200 ease-standard',
            checked ? 'translate-x-6' : 'translate-x-1',
          )}
        />
      </span>

      {/* Label */}
      <span className="text-body text-ink">{label}</span>
    </label>
  );
}
