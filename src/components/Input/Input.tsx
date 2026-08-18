import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { useFieldContext } from '@/components/Field/Field';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Marks the field as invalid (→ aria-invalid + error border). */
  invalid?: boolean;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
}

/**
 * Text input. Always use it inside a <Field> (label + hint + error).
 * Inherits id/aria from the Field automatically when nested.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ invalid, iconStart, iconEnd, className, id, disabled, ...rest }, ref) => {
    const field = useFieldContext();
    const isInvalid = invalid ?? field?.invalid ?? false;
    const resolvedId = id ?? field?.id;

    return (
      <div
        className={cn(
          'flex h-[var(--h-field)] items-center gap-2 rounded-field border bg-card px-[var(--px-field)]',
          'transition-colors duration-100 ease-standard',
          'focus-within:outline-2 focus-within:outline-offset-0 focus-within:outline-focus',
          isInvalid ? 'border-danger' : 'border-border focus-within:border-focus',
          disabled && 'cursor-not-allowed bg-hover opacity-70',
          className,
        )}
      >
        {iconStart && (
          <span aria-hidden className="inline-flex shrink-0 text-ink-secondary">
            {iconStart}
          </span>
        )}
        <input
          ref={ref}
          id={resolvedId}
          disabled={disabled}
          aria-invalid={isInvalid || undefined}
          aria-required={field?.required || undefined}
          aria-describedby={field?.describedBy}
          className="min-w-0 flex-1 bg-transparent text-body text-ink outline-none placeholder:text-ink-secondary disabled:cursor-not-allowed"
          {...rest}
        />
        {iconEnd && <span className="inline-flex shrink-0 text-ink-secondary">{iconEnd}</span>}
      </div>
    );
  },
);
Input.displayName = 'Input';
