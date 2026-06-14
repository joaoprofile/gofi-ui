import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { cn } from '@/lib/cn';
import { chartSeries, ChartTooltip } from './theme';

export interface PieDatum {
  name: string;
  value: number;
  color?: string;
}

export interface DonutChartProps {
  data: PieDatum[];
  height?: number;
  /** true = donut (with central hole); false = full pie. */
  donut?: boolean;
  showLegend?: boolean;
  valueFormatter?: (value: number | string) => string;
  ariaLabel: string;
  className?: string;
}

/** Themed pie/donut chart. Slices follow the token palette. */
export function DonutChart({
  data,
  height = 280,
  donut = true,
  showLegend = true,
  valueFormatter,
  ariaLabel,
  className,
}: DonutChartProps) {
  return (
    <div role="img" aria-label={ariaLabel} className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={donut ? 64 : 0}
            outerRadius={96}
            paddingAngle={data.length > 1 ? 2 : 0}
            stroke="var(--sf-card)"
            strokeWidth={2}
          >
            {data.map((d, i) => (
              <Cell key={d.name} fill={d.color ?? chartSeries[i % chartSeries.length]} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip valueFormatter={valueFormatter} />} />
          {showLegend && <Legend wrapperStyle={{ fontSize: 12 }} />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
