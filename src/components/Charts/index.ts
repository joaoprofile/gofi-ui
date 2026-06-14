// Convenience components (cover the common cases)
export { AreaChart } from './AreaChart';
export { BarChart } from './BarChart';
export { LineChart } from './LineChart';
export { DonutChart, type PieDatum, type DonutChartProps } from './DonutChart';
export { ChartContainer, type ChartContainerProps } from './ChartContainer';

// Theme + types
export {
  chartColors,
  chartSeries,
  axisProps,
  ChartTooltip,
  type ChartTooltipProps,
  type ChartSeries,
  type ChartDatum,
  type CartesianChartProps,
} from './theme';

/**
 * Recharts primitives re-exported (without the *Chart ones already wrapped) to
 * build ANY chart via <ChartContainer> with the gofi-ui theme:
 * ComposedChart, RadarChart, ScatterChart, RadialBarChart, Treemap, FunnelChart…
 */
export {
  ResponsiveContainer,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  Bar,
  Line,
  Pie,
  Cell,
  Scatter,
  Radar,
  RadialBar,
  ReferenceLine,
  ReferenceArea,
  LabelList,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  ScatterChart,
  RadarChart,
  RadialBarChart,
  FunnelChart,
  Funnel,
  Treemap,
} from 'recharts';
