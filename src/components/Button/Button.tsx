import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * Button variants. Primary action is a filled PILL with `bg-action`,
 * faithful to the GOFI DS web/mobile references.
 */
export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 rounded-control font-control',
    'whitespace-nowrap select-none transition-colors duration-100 ease-standard',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
    'disabled:pointer-events-none disabled:opacity-40',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-action text-on-secondary hover:bg-action-hover',
        secondary:
          'border border-action bg-transparent text-action hover:bg-action/10',
        ghost: 'bg-transparent text-ink hover:bg-hover',
        danger: 'bg-danger text-on-secondary hover:opacity-90',
        brand: 'bg-brand text-on-brand hover:brightness-95',
      },
      size: {
        sm: 'h-[var(--h-control-sm)] px-[var(--px-control-sm)] text-body-sm',
        md: 'h-[var(--h-control-md)] px-[var(--px-control-md)] text-body-sm',
        lg: 'h-[var(--h-control-lg)] px-[var(--px-control-lg)] text-body',
      },
      full: { true: 'w-full', false: '' },
    },
    defaultVariants: { variant: 'primary', size: 'md', full: false },
  },
);

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    VariantProps<typeof buttonVariants> {
  /** Shows spinner, disables the click and marks aria-busy (keeps the label). */
  loading?: boolean;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      size,
      full,
      loading = false,
      iconStart,
      iconEnd,
      disabled,
      className,
      children,
      type = 'button',
      ...rest
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size, full }), className)}
      {...rest}
    >
      {loading ? (
        <Loader2 aria-hidden className="size-4 animate-spin" />
      ) : (
        iconStart && <span aria-hidden className="inline-flex shrink-0">{iconStart}</span>
      )}
      {children}
      {iconEnd && !loading && (
        <span aria-hidden className="inline-flex shrink-0">{iconEnd}</span>
      )}
    </button>
  ),
);
Button.displayName = 'Button';
