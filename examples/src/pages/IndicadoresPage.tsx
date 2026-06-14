import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  BarChart2,
  Heart,
} from 'lucide-react';
import { Card, CardTitle } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Progress } from '@/components/Progress';
import { SegmentedControl } from '@/components/SegmentedControl';
import { Stack, Inline, Grid } from '@/components/Layout';
import {
  LineChart,
  BarChart,
  DonutChart,
  ChartContainer,
  chartColors,
  ChartTooltip,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  Tooltip,
} from '@/components/Charts';
import { DocPage, DocSection, Callout } from '../components';

/* ─────────── utilities ─────────── */
const brl = (v: number) =>
  v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

/* ─────────── sample data ─────────── */

const MRR_DATA = [
  { mes: 'Jul/24', mrr: 148000, meta: 160000 },
  { mes: 'Aug/24', mrr: 155000, meta: 163000 },
  { mes: 'Sep/24', mrr: 162000, meta: 166000 },
  { mes: 'Oct/24', mrr: 170000, meta: 170000 },
  { mes: 'Nov/24', mrr: 178000, meta: 174000 },
  { mes: 'Dec/24', mrr: 185000, meta: 178000 },
  { mes: 'Jan/25', mrr: 179000, meta: 182000 },
  { mes: 'Feb/25', mrr: 188000, meta: 186000 },
  { mes: 'Mar/25', mrr: 196000, meta: 190000 },
  { mes: 'Apr/25', mrr: 204000, meta: 194000 },
  { mes: 'May/25', mrr: 211000, meta: 198000 },
  { mes: 'Jun/25', mrr: 218000, meta: 202000 },
];

const CLIENTES_DATA = [
  { mes: 'Jan', ativos: 312, inativos: 28 },
  { mes: 'Feb', ativos: 328, inativos: 24 },
  { mes: 'Mar', ativos: 341, inativos: 31 },
  { mes: 'Apr', ativos: 355, inativos: 26 },
  { mes: 'May', ativos: 368, inativos: 22 },
  { mes: 'Jun', ativos: 384, inativos: 19 },
];

const RECEITA_SEGMENTO = [
  { name: 'Enterprise', value: 98000, color: chartColors.action },
  { name: 'SMB', value: 74000, color: chartColors.accent },
  { name: 'Starter', value: 46000, color: chartColors.success },
];

const INDICADORES = [
  { label: 'Support SLA (< 4 h)', status: 'success' as const, detalhe: '2.1 h avg' },
  { label: 'Annual renewal rate', status: 'success' as const, detalhe: '91%' },
  { label: 'Onboarding time', status: 'warning' as const, detalhe: '8 days (target: 5)' },
  { label: 'Critical open tickets', status: 'danger' as const, detalhe: '7 open' },
  { label: 'Platform uptime', status: 'success' as const, detalhe: '99.97%' },
];

const STATUS_TONE: Record<'success' | 'warning' | 'danger', { tone: 'success' | 'warning' | 'danger'; label: string }> = {
  success: { tone: 'success', label: 'OK' },
  warning: { tone: 'warning', label: 'Warning' },
  danger: { tone: 'danger', label: 'Critical' },
};

/* ─────────── KPI cards ─────────── */
interface KpiCardProps {
  title: string;
  value: string;
  trend: string;
  positive: boolean;
  icon: React.ReactNode;
  extra?: React.ReactNode;
}

function KpiCard({ title, value, trend, positive, icon, extra }: KpiCardProps) {
  return (
    <Card>
      <Inline justify="between" align="start">
        <Stack gap={1}>
          <span className="text-caption text-ink-secondary">{title}</span>
          <span className="text-h2 font-bold text-ink tabular-nums">{value}</span>
          <Inline gap={1} align="center">
            {positive ? (
              <TrendingUp className="size-4 text-success" aria-hidden />
            ) : (
              <TrendingDown className="size-4 text-danger" aria-hidden />
            )}
            <span className={positive ? 'text-caption text-success' : 'text-caption text-danger'}>{trend}</span>
          </Inline>
        </Stack>
        <span className="grid size-10 place-items-center rounded-lg bg-sunken text-ink-secondary">
          {icon}
        </span>
      </Inline>
      {extra && <div className="mt-3 border-t border-border pt-3">{extra}</div>}
    </Card>
  );
}

/* ─────────── NPS gauge via RadialBarChart ─────────── */
const NPS_VALUE = 62;
const NPS_GAUGE_DATA = [{ name: 'NPS', value: NPS_VALUE, fill: chartColors.success }];

function NpsGauge() {
  return (
    <Card>
      <CardTitle>NPS — Net Promoter Score</CardTitle>
      <ChartContainer ariaLabel="NPS gauge: 62 points" height={220}>
        <RadialBarChart
          cx="50%"
          cy="70%"
          innerRadius="60%"
          outerRadius="90%"
          startAngle={180}
          endAngle={0}
          data={NPS_GAUGE_DATA}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar dataKey="value" cornerRadius={6} background={{ fill: chartColors.grid }} />
          <Tooltip content={<ChartTooltip />} />
        </RadialBarChart>
      </ChartContainer>
      <Stack gap={0} className="-mt-10 items-center text-center">
        <span className="text-h1 font-bold text-ink tabular-nums">{NPS_VALUE}</span>
        <span className="text-caption text-ink-secondary">Current score</span>
        <Badge tone="success" className="mt-2">Promoter</Badge>
      </Stack>
    </Card>
  );
}

/* ─────────── main dashboard ─────────── */
function KpiDashboard() {
  const [periodo, setPeriodo] = useState<'6m' | '12m'>('12m');

  const mrrData = periodo === '6m' ? MRR_DATA.slice(-6) : MRR_DATA;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-page">
      {/* header */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-card px-5 py-4">
        <Inline gap={2}>
          <span className="grid size-9 place-items-center rounded-lg bg-brand text-on-brand">
            <BarChart2 className="size-5" />
          </span>
          <Stack gap={0}>
            <span className="text-h3 font-bold text-ink">GOFI Metrics</span>
            <span className="text-caption text-ink-secondary">Financial and operational health</span>
          </Stack>
        </Inline>
        <SegmentedControl
          value={periodo}
          onChange={(v) => setPeriodo(v as '6m' | '12m')}
          options={[
            { value: '6m', label: 'Last 6 months' },
            { value: '12m', label: 'Last 12 months' },
          ]}
        />
      </header>

      <div className="space-y-6 p-5">
        {/* 1. KPI Cards */}
        <Grid min="220px" gap={4}>
          <KpiCard
            title="MRR"
            value={brl(218000)}
            trend="+3.3% vs. previous month"
            positive
            icon={<DollarSign className="size-5" />}
            extra={
              <Progress
                value={78}
                label="Quarterly target reached"
                showValue
              />
            }
          />
          <KpiCard
            title="Monthly churn"
            value="2.1%"
            trend="+0.4 pp vs. prev. month"
            positive={false}
            icon={<TrendingDown className="size-5" />}
          />
          <KpiCard
            title="LTV / CAC"
            value="4.8×"
            trend="+0.2× this quarter"
            positive
            icon={<TrendingUp className="size-5" />}
          />
          <KpiCard
            title="Active customers"
            value="384"
            trend="+16 in June"
            positive
            icon={<Users className="size-5" />}
          />
        </Grid>

        {/* 2. MRR 12 months */}
        <Card>
          <CardTitle>MRR vs. Target ($)</CardTitle>
          <div className="mt-4 w-full">
            <LineChart
              ariaLabel="Monthly MRR and target evolution over the last 12 months"
              data={mrrData}
              xKey="mes"
              series={[
                { key: 'mrr', label: 'Actual MRR', color: chartColors.action },
                { key: 'meta', label: 'Target', color: chartColors.grid },
              ]}
              height={260}
              showGrid
              showLegend
              valueFormatter={(v) => brl(Number(v))}
            />
          </div>
        </Card>

        {/* 3. Active vs inactive customers */}
        <Card>
          <CardTitle>Active vs. Inactive Customers</CardTitle>
          <div className="mt-4 w-full">
            <BarChart
              ariaLabel="Monthly evolution of active and inactive customers"
              data={CLIENTES_DATA}
              xKey="mes"
              series={[
                { key: 'ativos', label: 'Active', color: chartColors.success },
                { key: 'inativos', label: 'Inactive', color: chartColors.danger },
              ]}
              height={240}
              showGrid
              showLegend
              stacked
            />
          </div>
        </Card>

        {/* 4. NPS gauge + Revenue by segment */}
        <Grid min="280px" gap={4}>
          <NpsGauge />
          <Card>
            <CardTitle>Revenue by Segment</CardTitle>
            <div className="mt-4 w-full">
              <DonutChart
                ariaLabel="Distribution of revenue by customer segment"
                data={RECEITA_SEGMENTO}
                donut
                showLegend
                valueFormatter={(v) => brl(Number(v))}
                height={240}
              />
            </div>
          </Card>
        </Grid>

        {/* 5. Operational metrics panel */}
        <Card>
          <CardTitle>Operational Metrics</CardTitle>
          <Stack gap={3} className="mt-4">
            {INDICADORES.map((ind) => (
              <Inline key={ind.label} justify="between" align="center" className="rounded-lg border border-border bg-sunken px-4 py-3">
                <Inline gap={2} align="center">
                  <Heart className="size-4 text-ink-secondary" aria-hidden />
                  <span className="text-body-sm text-ink">{ind.label}</span>
                </Inline>
                <Inline gap={2} align="center">
                  <span className="text-caption text-ink-secondary">{ind.detalhe}</span>
                  <Badge tone={STATUS_TONE[ind.status].tone}>{STATUS_TONE[ind.status].label}</Badge>
                </Inline>
              </Inline>
            ))}
          </Stack>
        </Card>
      </div>
    </div>
  );
}

/* ─────────── documentation page ─────────── */
export function IndicadoresPage() {
  return (
    <DocPage
      group="Templates"
      title="GOFI Metrics - KPIs"
      lead="A business-health dashboard bringing together MRR, churn, NPS, LTV/CAC, revenue distribution and operational metrics in a single interactive panel."
      source="patterns/page-templates.md"
    >
      <Callout tone="info">
        All data is simulated. The period selector filters the MRR chart dynamically.
        The NPS gauge uses <strong>ChartContainer + RadialBarChart</strong> — the escape hatch for
        charts not covered by the dedicated wrappers.
      </Callout>
      <DocSection title="Template">
        <KpiDashboard />
      </DocSection>
    </DocPage>
  );
}
