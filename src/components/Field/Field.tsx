import { createContext, useContext, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface FieldContextValue {
  id: string;
  invalid: boolean;
  describedBy?: string;
  required: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

/**
 * Reads the Field context to wire the control (Input/Select/Textarea) to
 * label, hint and error via aria. Returns `null` if used outside a Field.
 */
export function useFieldContext(): FieldContextValue | null {
  return useContext(FieldContext);
}

export interface FieldProps {
  /** Always-visible label — a placeholder does NOT replace a label. */
  label: string;
  /** id of the internal control (a11y association via htmlFor). */
  htmlFor: string;
  hint?: string;
  /** Specific, actionable error message. Replaces the hint. */
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Wrapper for EVERY form control: associates label, hint and error with the input.
 * Enforces the rule "every input has a label + error + hint".
 */
export function Field({ label, htmlFor, hint, error, required = false, children, className }: FieldProps) {
  const invalid = Boolean(error);
  const hintId = hint ? `${htmlFor}-hint` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;
  const describedBy = [invalid ? errorId : hintId].filter(Boolean).join(' ') || undefined;

  return (
    <FieldContext.Provider value={{ id: htmlFor, invalid, describedBy, required }}>
      <div className={cn('flex flex-col gap-1.5', className)}>
        <label htmlFor={htmlFor} className="text-body-sm font-medium text-ink">
          {label}
          {required && (
            <span className="text-danger" aria-hidden>
              {' '}
              *
            </span>
          )}
        </label>
        {children}
        {error ? (
          <p id={errorId} role="alert" className="text-caption text-danger">
            {error}
          </p>
        ) : (
          hint && (
            <p id={hintId} className="text-caption text-ink-secondary">
              {hint}
            </p>
          )
        )}
      </div>
    </FieldContext.Provider>
  );
}
