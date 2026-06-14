import { type ReactElement } from 'react';
import { ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/cn';

export interface ChartContainerProps {
  /** Chart height in px. */
  height?: number;
  /** Accessible label (required for screen readers). */
  ariaLabel: string;
  className?: string;
  /** ONE Recharts chart (ComposedChart, RadarChart, ScatterChart…). */
  children: ReactElement;
}

/**
 * Responsive + accessible shell to build **any** Recharts chart with
 * the gofi-ui theme. Use together with the re-exported primitives (XAxis, Tooltip,
 * chartColors, ChartTooltip…) for types that don't have a dedicated wrapper.
 */
export function ChartContainer({ height = 280, ariaLabel, className, children }: ChartContainerProps) {
  return (
    <div role="img" aria-label={ariaLabel} className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}
