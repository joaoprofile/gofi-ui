import { useId } from 'react';
import {
  ResponsiveContainer,
  AreaChart as RAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { cn } from '@/lib/cn';
import {
  axisProps,
  chartColors,
  chartSeries,
  ChartTooltip,
  type CartesianChartProps,
} from './theme';

/** Themed area chart (with gradient). Stackable via `stacked`. */
export function AreaChart({
  data,
  series,
  xKey,
  height = 280,
  showGrid = true,
  showLegend = false,
  stacked = false,
  valueFormatter,
  ariaLabel,
  className,
}: CartesianChartProps) {
  const uid = useId().replace(/:/g, '');
  return (
    <div role="img" aria-label={ariaLabel} className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RAreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <defs>
            {series.map((s, i) => {
              const color = s.color ?? chartSeries[i % chartSeries.length];
              return (
                <linearGradient key={s.key} id={`${uid}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
              );
            })}
          </defs>
          {showGrid && <CartesianGrid strokeDasharray="4 4" stroke={chartColors.grid} vertical={false} />}
          <XAxis dataKey={xKey} {...axisProps} />
          <YAxis width={44} {...axisProps} />
          <Tooltip
            content={<ChartTooltip valueFormatter={valueFormatter} />}
            cursor={{ stroke: chartColors.grid }}
          />
          {showLegend && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {series.map((s, i) => {
            const color = s.color ?? chartSeries[i % chartSeries.length];
            return (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label ?? s.key}
                stroke={color}
                strokeWidth={2}
                fill={`url(#${uid}-${s.key})`}
                stackId={stacked ? 'stack' : undefined}
              />
            );
          })}
        </RAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
