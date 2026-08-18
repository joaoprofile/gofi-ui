import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const iconButtonVariants = cva(
  [
    'inline-flex items-center justify-center rounded-control',
    'transition-colors duration-100 ease-standard',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
    'disabled:pointer-events-none disabled:opacity-40',
  ],
  {
    variants: {
      variant: {
        solid: 'bg-action text-on-secondary hover:bg-action-hover',
        ghost: 'bg-transparent text-ink hover:bg-hover',
        outline: 'border border-border bg-card text-ink hover:bg-hover',
      },
      size: {
        sm: 'size-[var(--h-control-sm)]',
        md: 'size-[var(--h-control-md)]',
        lg: 'size-[var(--h-control-lg)]',
      },
    },
    defaultVariants: { variant: 'ghost', size: 'md' },
  },
);

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  /** REQUIRED accessible label — describes the action (e.g. "Close"). */
  'aria-label': string;
  children: ReactNode;
}

/** Icon-only button. Minimum touch target 32–48px; `aria-label` required. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant, size, className, children, type = 'button', ...rest }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...rest}
    >
      <span aria-hidden className="inline-flex">{children}</span>
    </button>
  ),
);
IconButton.displayName = 'IconButton';
