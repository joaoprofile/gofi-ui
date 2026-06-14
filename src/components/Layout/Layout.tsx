import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

/* 4/8 scale → Tailwind gap utility (gap-N == N*4px). */
type Gap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;

const gapClass: Record<Gap, string> = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
  16: 'gap-16',
};

const alignClass = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
} as const;

const justifyClass = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
} as const;

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: Gap;
  align?: keyof typeof alignClass;
  justify?: keyof typeof justifyClass;
  as?: ElementType;
  children: ReactNode;
}

/** Stacks children vertically with a consistent gap from the 4/8 scale. */
export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ gap = 4, align, justify, as: Tag = 'div', className, children, ...rest }, ref) => (
    <Tag
      ref={ref}
      className={cn(
        'flex flex-col',
        gapClass[gap],
        align && alignClass[align],
        justify && justifyClass[justify],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  ),
);
Stack.displayName = 'Stack';

export interface InlineProps extends HTMLAttributes<HTMLDivElement> {
  gap?: Gap;
  align?: keyof typeof alignClass;
  justify?: keyof typeof justifyClass;
  wrap?: boolean;
  as?: ElementType;
  children: ReactNode;
}

/** Lays out children in a row with gap and wrap (toolbars, groups of chips/buttons). */
export const Inline = forwardRef<HTMLDivElement, InlineProps>(
  (
    { gap = 3, align = 'center', justify, wrap = true, as: Tag = 'div', className, children, ...rest },
    ref,
  ) => (
    <Tag
      ref={ref}
      className={cn(
        'flex flex-row',
        wrap && 'flex-wrap',
        gapClass[gap],
        alignClass[align],
        justify && justifyClass[justify],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  ),
);
Inline.displayName = 'Inline';

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Minimum width of each column (auto-fit responsive grid). */
  min?: string;
  /** Fixed number of columns (overrides `min`). */
  cols?: number;
  gap?: Gap;
  children: ReactNode;
}

/** Responsive grid — by default `auto-fit minmax(min, 1fr)`. */
export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ min = '240px', cols, gap = 4, className, style, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn('grid', gapClass[gap], className)}
      style={{
        gridTemplateColumns: cols
          ? `repeat(${cols}, minmax(0, 1fr))`
          : `repeat(auto-fit, minmax(min(${min}, 100%), 1fr))`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  ),
);
Grid.displayName = 'Grid';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: ReactNode;
}

const containerSize = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[1280px]',
  full: 'max-w-none',
} as const;

/** Max width + centering + side padding per breakpoint. */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = 'xl', className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn('mx-auto w-full px-4 md:px-6 lg:px-8', containerSize[size], className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
Container.displayName = 'Container';

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
}

/** Semantic separator using the theme's border color. */
export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  ({ orientation = 'horizontal', className, ...rest }, ref) => (
    <hr
      ref={ref}
      aria-orientation={orientation}
      className={cn(
        'border-0 bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px self-stretch',
        className,
      )}
      {...rest}
    />
  ),
);
Divider.displayName = 'Divider';
