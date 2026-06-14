import {
  AreaChart,
  BarChart,
  LineChart,
  DonutChart,
  ChartContainer,
  ChartTooltip,
  chartColors,
  axisProps,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from '@/components/Charts';
import { DocPage, DocSection, Example, PropsTable, Callout, type PropRow } from '../components';

const monthly = [
  { mes: 'Jan', vendas: 32, meta: 28 },
  { mes: 'Feb', vendas: 41, meta: 34 },
  { mes: 'Mar', vendas: 38, meta: 36 },
  { mes: 'Apr', vendas: 52, meta: 40 },
  { mes: 'May', vendas: 49, meta: 44 },
  { mes: 'Jun', vendas: 63, meta: 48 },
];

const sources = [
  { name: 'Direct', value: 42 },
  { name: 'Organic', value: 28 },
  { name: 'Social', value: 18 },
  { name: 'Referral', value: 12 },
];

const cartesianProps: PropRow[] = [
  { name: 'data', type: 'ChartDatum[]', required: true, description: 'Array of objects (each one is a point on the X axis).' },
  { name: 'series', type: 'ChartSeries[]', required: true, description: '{ key, label?, color? } — one series per numeric field.' },
  { name: 'xKey', type: 'string', required: true, description: 'Category field for the X axis.' },
  { name: 'height', type: 'number', default: '280', description: 'Chart height in px.' },
  { name: 'showGrid', type: 'boolean', default: 'true', description: 'Shows the horizontal grid.' },
  { name: 'showLegend', type: 'boolean', default: 'false', description: 'Shows the legend.' },
  { name: 'stacked', type: 'boolean', default: 'false', description: 'Stacks the series (area/bar).' },
  { name: 'valueFormatter', type: '(v) => string', description: 'Formats values in the tooltip (e.g., currency).' },
  { name: 'ariaLabel', type: 'string', required: true, description: 'Accessible description of the chart.' },
];

const donutProps: PropRow[] = [
  { name: 'data', type: 'PieDatum[]', required: true, description: '{ name, value, color? } per slice.' },
  { name: 'donut', type: 'boolean', default: 'true', description: 'Donut (center hole) or full pie.' },
  { name: 'showLegend', type: 'boolean', default: 'true', description: 'Shows the legend.' },
  { name: 'height', type: 'number', default: '280', description: 'Height in px.' },
  { name: 'ariaLabel', type: 'string', required: true, description: 'Accessible description of the chart.' },
];

export function ChartsPage() {
  return (
    <DocPage
      group="Charts"
      title="Charts (Recharts)"
      lead="Recharts wrapped in the gofi-ui tokens: colors, axes and tooltip follow the theme and react to dark mode and brand color changes automatically."
      source="recharts.github.io"
    >
      <Callout tone="info">
        Colors come from CSS custom properties (<code>var(--action)</code>…), so the charts
        re-theme themselves. Always pass <code>ariaLabel</code> and, for critical data, also offer
        a table (a chart is not accessible on its own).
      </Callout>

      <DocSection title="Area" description="Trend over time, with a gradient.">
        <Example
          code={`<AreaChart
  ariaLabel="Sales by month"
  data={monthly}
  xKey="mes"
  series={[{ key: 'vendas', label: 'Sales' }, { key: 'meta', label: 'Target' }]}
  showLegend
/>`}
        >
          <div className="w-full">
            <AreaChart ariaLabel="Sales by month" data={monthly} xKey="mes" series={[{ key: 'vendas', label: 'Sales' }, { key: 'meta', label: 'Target' }]} showLegend />
          </div>
        </Example>
      </DocSection>

      <DocSection title="Bars" description="Comparison between categories. Use stacked to stack.">
        <Example
          code={`<BarChart
  ariaLabel="Sales vs target"
  data={monthly}
  xKey="mes"
  series={[{ key: 'vendas', label: 'Sales' }, { key: 'meta', label: 'Target' }]}
  showLegend
/>`}
        >
          <div className="w-full">
            <BarChart ariaLabel="Sales vs target by month" data={monthly} xKey="mes" series={[{ key: 'vendas', label: 'Sales' }, { key: 'meta', label: 'Target' }]} showLegend />
          </div>
        </Example>
      </DocSection>

      <DocSection title="Line" description="Continuous series and trend comparisons.">
        <Example
          code={`<LineChart
  ariaLabel="Sales evolution"
  data={monthly}
  xKey="mes"
  series={[{ key: 'vendas', label: 'Sales' }, { key: 'meta', label: 'Target' }]}
  showLegend
/>`}
        >
          <div className="w-full">
            <LineChart ariaLabel="Sales evolution" data={monthly} xKey="mes" series={[{ key: 'vendas', label: 'Sales' }, { key: 'meta', label: 'Target' }]} showLegend />
          </div>
        </Example>
      </DocSection>

      <DocSection title="Donut / Pie" description="Distribution of a total across categories.">
        <Example
          code={`<DonutChart
  ariaLabel="Traffic source"
  data={[
    { name: 'Direct', value: 42 },
    { name: 'Organic', value: 28 },
    { name: 'Social', value: 18 },
    { name: 'Referral', value: 12 },
  ]}
  valueFormatter={(v) => \`\${v}%\`}
/>`}
        >
          <div className="w-full max-w-md">
            <DonutChart ariaLabel="Traffic source" data={sources} valueFormatter={(v) => `${v}%`} />
          </div>
        </Example>
      </DocSection>

      <DocSection
        title="Custom (any chart)"
        description="For types without a wrapper (composed, radar, scatter…), use <ChartContainer> + the re-exported Recharts primitives, with the gofi-ui theme."
      >
        <Example
          code={`import { ChartContainer, ComposedChart, Bar, Line, XAxis, YAxis,
         CartesianGrid, Tooltip, ChartTooltip, chartColors, axisProps } from 'gofi-ui';

<ChartContainer ariaLabel="Sales (bar) and target (line)">
  <ComposedChart data={monthly} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
    <CartesianGrid strokeDasharray="4 4" stroke={chartColors.grid} vertical={false} />
    <XAxis dataKey="mes" {...axisProps} />
    <YAxis width={44} {...axisProps} />
    <Tooltip content={<ChartTooltip />} cursor={{ fill: chartColors.grid, opacity: 0.4 }} />
    <Bar dataKey="vendas" name="Sales" fill={chartColors.action} radius={[6, 6, 0, 0]} maxBarSize={40} />
    <Line type="monotone" dataKey="meta" name="Target" stroke={chartColors.warning} strokeWidth={2} dot={false} />
  </ComposedChart>
</ChartContainer>`}
        >
          <div className="w-full">
            <ChartContainer ariaLabel="Sales (bar) and target (line)">
              <ComposedChart data={monthly} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
                <CartesianGrid strokeDasharray="4 4" stroke={chartColors.grid} vertical={false} />
                <XAxis dataKey="mes" {...axisProps} />
                <YAxis width={44} {...axisProps} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: chartColors.grid, opacity: 0.4 }} />
                <Bar dataKey="vendas" name="Sales" fill={chartColors.action} radius={[6, 6, 0, 0]} maxBarSize={40} />
                <Line type="monotone" dataKey="meta" name="Target" stroke={chartColors.warning} strokeWidth={2} dot={false} />
              </ComposedChart>
            </ChartContainer>
          </div>
        </Example>
      </DocSection>

      <DocSection title="Properties">
        <PropsTable title="CartesianChartProps (Area/Bar/Line)" rows={cartesianProps} />
        <PropsTable title="DonutChartProps" rows={donutProps} />
      </DocSection>
    </DocPage>
  );
}
