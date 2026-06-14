import {
  ResponsiveContainer,
  BarChart as RBarChart,
  Bar,
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

/** Themed bar chart (rounded corners). Stackable via `stacked`. */
export function BarChart({
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
  return (
    <div role="img" aria-label={ariaLabel} className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RBarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          {showGrid && <CartesianGrid strokeDasharray="4 4" stroke={chartColors.grid} vertical={false} />}
          <XAxis dataKey={xKey} {...axisProps} />
          <YAxis width={44} {...axisProps} />
          <Tooltip content={<ChartTooltip valueFormatter={valueFormatter} />} cursor={{ fill: chartColors.grid, opacity: 0.4 }} />
          {showLegend && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {series.map((s, i) => {
            const color = s.color ?? chartSeries[i % chartSeries.length];
            return (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label ?? s.key}
                fill={color}
                radius={stacked ? 0 : [6, 6, 0, 0]}
                stackId={stacked ? 'stack' : undefined}
                maxBarSize={48}
              />
            );
          })}
        </RBarChart>
      </ResponsiveContainer>
    </div>
  );
}
