/**
 * GOFI Design System — public barrel.
 * Import any component from here: `import { Button, Card } from 'gofi-ui'`.
 */

// Theme
export {
  ThemeProvider,
  useTheme,
  type ThemeMode,
  type BrandMode,
  type ThemeProviderProps,
} from './theme/ThemeProvider';

// Utilities
export { cn } from './lib/cn';
export * from './lib/hooks';

// Layout
export * from './components/Layout';

// Atoms
export * from './components/Button';
export * from './components/Badge';
export * from './components/Avatar';
export * from './components/Feedback';
export * from './components/Progress';
export * from './components/Tooltip';

// Forms
export * from './components/Field';
export * from './components/Input';
export * from './components/Textarea';
export * from './components/Select';
export * from './components/DatePicker';
export * from './components/Toggle';
export * from './components/SegmentedControl';

// Containers and data
export * from './components/Card';
export * from './components/List';
export * from './components/Table';
export * from './components/Tabs';
export * from './components/Accordion';
export * from './components/Stepper';
export * from './components/Pagination';
export * from './components/EmptyState';

// Overlay and feedback
export * from './components/Modal';
export * from './components/Toast';
export * from './components/Banner';
export * from './components/Menu';

// Charts (Recharts wrapped in the gofi-ui tokens)
// Wrappers + theme. The raw Recharts primitives (XAxis, Tooltip, ComposedChart…)
// stay in the './components/Charts' subpath to avoid colliding with the DS Tooltip.
export {
  AreaChart,
  BarChart,
  LineChart,
  DonutChart,
  ChartContainer,
  chartColors,
  chartSeries,
  axisProps,
  ChartTooltip,
  type PieDatum,
  type DonutChartProps,
  type ChartContainerProps,
  type ChartTooltipProps,
  type ChartSeries,
  type ChartDatum,
  type CartesianChartProps,
} from './components/Charts';
