/**
 * Chart theme tied to the gofi-ui tokens.
 *
 * The colors are **real** CSS custom properties (`var(--action)` etc.), so the
 * charts react automatically to dark mode and to brand color changes — without
 * recalculating anything in JS.
 */
export const chartColors = {
  action: 'var(--action)',
  accent: 'var(--accent)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
  grid: 'var(--sf-border)',
  axis: 'var(--tx-ink-2)',
} as const;

/** Color sequence for series/slices (distinct and accessible). */
export const chartSeries = [
  chartColors.action,
  chartColors.accent,
  chartColors.success,
  chartColors.warning,
  chartColors.danger,
];

/** Common axis props — text/lines from tokens, without visual clutter. */
export const axisProps = {
  tick: { fill: chartColors.axis, fontSize: 12 },
  tickLine: false,
  axisLine: { stroke: chartColors.grid },
} as const;

interface TooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
  fill?: string;
}

export interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
  /** Formats the displayed value (e.g. currency). */
  valueFormatter?: (value: number | string) => string;
}

/** Themed tooltip (replaces the default white one from Recharts). */
export function ChartTooltip({ active, payload, label, valueFormatter }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2 text-caption shadow-md">
      {label !== undefined && <p className="mb-1 font-medium text-ink">{label}</p>}
      <div className="flex flex-col gap-1">
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-ink-secondary">
            <span className="size-2 shrink-0 rounded-pill" style={{ background: p.color ?? p.fill }} aria-hidden />
            <span>{p.name}</span>
            <span className="ml-auto font-medium text-ink tabular-nums">
              {valueFormatter && p.value !== undefined ? valueFormatter(p.value) : p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Item of a series in cartesian charts (area/bar/line). */
export interface ChartSeries {
  /** Key of the numeric field in the data. */
  key: string;
  /** Label in the legend/tooltip (default = key). */
  label?: string;
  /** Color (default = palette by index). */
  color?: string;
}

export type ChartDatum = Record<string, string | number>;

export interface CartesianChartProps {
  data: ChartDatum[];
  series: ChartSeries[];
  /** Category field of the X axis. */
  xKey: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  stacked?: boolean;
  /** Formats the values in the tooltip/axis (e.g. currency). */
  valueFormatter?: (value: number | string) => string;
  /** Accessible label for the chart (required for screen readers). */
  ariaLabel: string;
  className?: string;
}
