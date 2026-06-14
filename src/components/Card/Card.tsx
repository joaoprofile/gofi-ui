import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const cardVariants = cva(
  'rounded-lg p-5 transition-shadow duration-150 ease-standard',
  {
    variants: {
      variant: {
        default: 'bg-card border border-border shadow-sm',
        brand: 'bg-brand text-on-brand shadow-sm',
        outlined: 'bg-card border border-border',
        interactive:
          'bg-card border border-border shadow-sm cursor-pointer hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

type CardOwnProps = VariantProps<typeof cardVariants> & {
  header?: ReactNode;
  footer?: ReactNode;
  media?: ReactNode;
  children: ReactNode;
};

export type CardProps = CardOwnProps &
  (
    | ({ as?: 'div' | 'article' } & HTMLAttributes<HTMLElement>)
    | ({ as: 'a'; href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)
  );

/**
 * Surface that groups related content — base block for dashboards and lists.
 * A clickable card uses `as="a"`/`variant="interactive"` (real link/button, never div+onClick).
 */
export const Card = forwardRef<HTMLElement, CardProps>(
  ({ variant, as = 'div', header, footer, media, className, children, ...rest }, ref) => {
    const Tag = as as 'div';
    return (
      <Tag
        ref={ref as never}
        className={cn(cardVariants({ variant }), 'flex flex-col gap-4', className)}
        {...(rest as HTMLAttributes<HTMLElement>)}
      >
        {media && <div className="-m-5 mb-0 overflow-hidden rounded-t-lg">{media}</div>}
        {header && <div className="flex items-start justify-between gap-3">{header}</div>}
        <div className="flex flex-col gap-3">{children}</div>
        {footer && <div className="flex items-center gap-3 pt-1">{footer}</div>}
      </Tag>
    );
  },
);
Card.displayName = 'Card';

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

/** Card title (h3) — one clear hierarchy per card. */
export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...rest }, ref) => (
    <h3 ref={ref} className={cn('text-h3', className)} {...rest}>
      {children}
    </h3>
  ),
);
CardTitle.displayName = 'CardTitle';
