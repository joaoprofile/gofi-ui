import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type MutableRefObject,
  type RefCallback,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/lib/cn';
import { useFieldContext } from '@/components/Field/Field';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Marks the field as invalid (→ aria-invalid + error border). */
  invalid?: boolean;
  /**
   * Adjusts the height automatically as the content grows.
   * The minimum height (~96px) is always preserved.
   */
  autoResize?: boolean;
}

/**
 * Multiline text field. Always use inside a <Field>.
 * Inherits id/aria from the Field automatically when nested.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ invalid, autoResize = false, className, id, disabled, onChange, ...rest }, ref) => {
    const field = useFieldContext();
    const isInvalid = invalid ?? field?.invalid ?? false;
    const resolvedId = id ?? field?.id;

    // Internal ref for the auto-resize (combines with the external ref via callback)
    const innerRef = useRef<HTMLTextAreaElement>(null);

    const setRefs = useCallback<RefCallback<HTMLTextAreaElement>>(
      (node) => {
        (innerRef as MutableRefObject<HTMLTextAreaElement | null>).current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as MutableRefObject<HTMLTextAreaElement | null>).current = node;
        }
      },
      [ref],
    );

    /** Recalculates the textarea height to wrap the content. */
    const resize = useCallback(() => {
      const el = innerRef.current;
      if (!el || !autoResize) return;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }, [autoResize]);

    // Initial adjustment (in case the value comes pre-filled via `defaultValue`/`value`)
    useEffect(() => {
      resize();
    }, [resize]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        resize();
        onChange?.(e);
      },
      [onChange, resize],
    );

    return (
      <div
        className={cn(
          'flex min-h-24 rounded-sm border bg-card px-3 py-2',
          'transition-colors duration-100 ease-standard',
          'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus',
          isInvalid ? 'border-danger' : 'border-border focus-within:border-action',
          disabled && 'cursor-not-allowed bg-hover opacity-70',
          className,
        )}
      >
        <textarea
          ref={setRefs}
          id={resolvedId}
          disabled={disabled}
          aria-invalid={isInvalid || undefined}
          aria-required={field?.required || undefined}
          aria-describedby={field?.describedBy}
          onChange={handleChange}
          className={cn(
            'min-h-20 w-full resize-y bg-transparent text-body text-ink',
            'outline-none placeholder:text-ink-secondary',
            'disabled:cursor-not-allowed',
            autoResize && 'resize-none overflow-hidden',
          )}
          {...rest}
        />
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';
