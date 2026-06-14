import {
  ResponsiveContainer,
  LineChart as RLineChart,
  Line,
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

/** Themed line chart. */
export function LineChart({
  data,
  series,
  xKey,
  height = 280,
  showGrid = true,
  showLegend = false,
  valueFormatter,
  ariaLabel,
  className,
}: Omit<CartesianChartProps, 'stacked'>) {
  return (
    <div role="img" aria-label={ariaLabel} className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RLineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          {showGrid && <CartesianGrid strokeDasharray="4 4" stroke={chartColors.grid} vertical={false} />}
          <XAxis dataKey={xKey} {...axisProps} />
          <YAxis width={44} {...axisProps} />
          <Tooltip content={<ChartTooltip valueFormatter={valueFormatter} />} cursor={{ stroke: chartColors.grid }} />
          {showLegend && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {series.map((s, i) => {
            const color = s.color ?? chartSeries[i % chartSeries.length];
            return (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label ?? s.key}
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            );
          })}
        </RLineChart>
      </ResponsiveContainer>
    </div>
  );
}
