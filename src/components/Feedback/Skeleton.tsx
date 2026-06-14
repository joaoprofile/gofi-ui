import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /** Block width. Accepts a CSS value ("100%", "200px") or a number (px). */
  width?: string | number;
  /** Height of each line/block. Accepts a CSS value or a number (px). Default: 1rem. */
  height?: string | number;
  /** Block radius. Default: `md`. */
  radius?: 'sm' | 'md' | 'lg' | 'pill';
  /** Renders N stacked lines (last one at 75% width). */
  lines?: number;
}

const radiusClasses = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  pill: 'rounded-pill',
} as const;

/**
 * Gray block with shimmer — represents content that is loading.
 * aria-hidden: the parent region should declare aria-busy="true".
 */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(
  ({ width, height = '1rem', radius = 'md', lines, className, style, ...rest }, ref) => {
    const resolvedHeight: CSSProperties['height'] =
      typeof height === 'number' ? `${height}px` : height;
    const resolvedWidth: CSSProperties['width'] =
      width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined;

    const barBase = cn(
      'relative block overflow-hidden bg-hover',
      // shimmer: pseudo-element using the before: utility
      'before:absolute before:inset-0 before:-translate-x-full',
      'before:bg-gradient-to-r before:from-transparent before:via-card/60 before:to-transparent',
      'before:[animation:gofi-shimmer_1.6s_infinite]',
      radiusClasses[radius],
    );

    if (lines && lines > 1) {
      return (
        <span
          ref={ref}
          aria-hidden="true"
          className={cn('flex flex-col gap-2', className)}
          style={style}
          {...rest}
        >
          {Array.from({ length: lines }).map((_, i) => (
            <span
              key={i}
              className={barBase}
              style={{
                height: resolvedHeight,
                // Last line a bit shorter (natural text effect)
                width: i === lines - 1 ? '75%' : resolvedWidth ?? '100%',
              }}
            />
          ))}
        </span>
      );
    }

    return (
      <span
        ref={ref}
        aria-hidden="true"
        className={cn(barBase, className)}
        style={{ height: resolvedHeight, width: resolvedWidth, ...style }}
        {...rest}
      />
    );
  },
);
Skeleton.displayName = 'Skeleton';
