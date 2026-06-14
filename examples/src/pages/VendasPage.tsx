import { useState } from 'react';
import { TrendingUp, TrendingDown, ShoppingCart, Receipt, Users, BarChart2 } from 'lucide-react';
import { Card, CardTitle } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { SegmentedControl } from '@/components/SegmentedControl';
import { Table, type Column } from '@/components/Table';
import { Stack, Inline, Grid } from '@/components/Layout';
import { AreaChart, BarChart, DonutChart } from '@/components/Charts';
import { DocPage, DocSection, Callout } from '../components';

/* ─────────────────────────────────────────────
   Formatters
───────────────────────────────────────────── */
const brl = (v: number | string) =>
  Number(v).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

/* ─────────────────────────────────────────────
   Sample data
───────────────────────────────────────────── */
const RECEITA_MENSAL = [
  { mes: 'Jan', receita: 142000, meta: 130000 },
  { mes: 'Feb', receita: 158000, meta: 145000 },
  { mes: 'Mar', receita: 173000, meta: 160000 },
  { mes: 'Apr', receita: 165000, meta: 170000 },
  { mes: 'May', receita: 191000, meta: 175000 },
  { mes: 'Jun', receita: 204000, meta: 185000 },
];

const CANAIS = [
  { name: 'Own website', value: 42, color: 'var(--action)' },
  { name: 'Marketplace', value: 28, color: 'var(--accent)' },
  { name: 'Partners', value: 19, color: 'var(--success)' },
  { name: 'Referral', value: 11, color: 'var(--warning)' },
];

const PEDIDOS_CATEGORIA = [
  { categoria: 'Electronics', pedidos: 312 },
  { categoria: 'Apparel', pedidos: 248 },
  { categoria: 'Home & Decor', pedidos: 185 },
  { categoria: 'Sports', pedidos: 143 },
  { categoria: 'Books', pedidos: 97 },
];

interface Produto {
  id: string;
  nome: string;
  unidades: number;
  receita: number;
  tendencia: 'alta' | 'baixa' | 'estavel';
}

const TOP_PRODUTOS: Produto[] = [
  { id: '1', nome: 'Bluetooth Headphones Pro', unidades: 843, receita: 168600, tendencia: 'alta' },
  { id: '2', nome: 'Runner X Sneakers', unidades: 612, receita: 122400, tendencia: 'alta' },
  { id: '3', nome: 'Arco Floor Lamp', unidades: 490, receita: 73500, tendencia: 'estavel' },
  { id: '4', nome: 'Urban 30L Backpack', unidades: 377, receita: 56550, tendencia: 'baixa' },
  { id: '5', nome: 'Book: Grow in Sales', unidades: 298, receita: 14900, tendencia: 'alta' },
];

const TENDENCIA_META: Record<Produto['tendencia'], { label: string; tone: 'success' | 'danger' | 'neutral' }> = {
  alta: { label: 'Up', tone: 'success' },
  baixa: { label: 'Down', tone: 'danger' },
  estavel: { label: 'Stable', tone: 'neutral' },
};

/* ─────────────────────────────────────────────
   KPIs by period
───────────────────────────────────────────── */
type Periodo = '7d' | '30d' | '12m';

const KPIS: Record<Periodo, { receita: number; receitaDelta: number; pedidos: number; pedidosDelta: number; ticket: number; ticketDelta: number; conversao: number; conversaoDelta: number }> = {
  '7d':  { receita: 48200,  receitaDelta: 8.4,  pedidos: 217,  pedidosDelta: 12.1,  ticket: 222,  ticketDelta: -3.2,  conversao: 3.8,  conversaoDelta: 0.4 },
  '30d': { receita: 204000, receitaDelta: 6.8,  pedidos: 912,  pedidosDelta: 9.5,   ticket: 224,  ticketDelta: -1.1,  conversao: 4.1,  conversaoDelta: 0.2 },
  '12m': { receita: 1033000, receitaDelta: 14.3, pedidos: 8740, pedidosDelta: 22.7, ticket: 218,  ticketDelta: -4.5,  conversao: 3.9,  conversaoDelta: -0.1 },
};

/* ─────────────────────────────────────────────
   Product table columns
───────────────────────────────────────────── */
const COLUNAS_PRODUTO: Column<Produto>[] = [
  {
    key: 'nome',
    header: 'Product',
    render: (p) => <span className="font-medium text-ink">{p.nome}</span>,
  },
  {
    key: 'unidades',
    header: 'Units',
    align: 'end',
    sortable: true,
    render: (p) => <span className="tabular-nums text-ink">{p.unidades.toLocaleString('en-US')}</span>,
  },
  {
    key: 'receita',
    header: 'Revenue',
    align: 'end',
    sortable: true,
    render: (p) => <span className="tabular-nums font-medium text-ink">{brl(p.receita)}</span>,
  },
  {
    key: 'tendencia',
    header: 'Trend',
    align: 'end',
    render: (p) => (
      <Badge tone={TENDENCIA_META[p.tendencia].tone}>{TENDENCIA_META[p.tendencia].label}</Badge>
    ),
  },
];

/* ─────────────────────────────────────────────
   Internal dashboard app
───────────────────────────────────────────── */
function SalesDashboard() {
  const [periodo, setPeriodo] = useState<Periodo>('30d');
  const kpi = KPIS[periodo];

  const kpis = [
    {
      label: 'Revenue',
      value: brl(kpi.receita),
      delta: kpi.receitaDelta,
      icon: <Receipt className="size-5" />,
    },
    {
      label: 'Orders',
      value: kpi.pedidos.toLocaleString('en-US'),
      delta: kpi.pedidosDelta,
      icon: <ShoppingCart className="size-5" />,
    },
    {
      label: 'Average order value',
      value: brl(kpi.ticket),
      delta: kpi.ticketDelta,
      icon: <BarChart2 className="size-5" />,
    },
    {
      label: 'Conversion',
      value: `${kpi.conversao.toFixed(1)}%`,
      delta: kpi.conversaoDelta,
      icon: <Users className="size-5" />,
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-page">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-card px-5 py-4">
        <Inline gap={2}>
          <span className="grid size-9 place-items-center rounded-lg bg-brand text-on-brand">
            <TrendingUp className="size-5" />
          </span>
          <Stack gap={0}>
            <span className="text-h3 font-bold text-ink">GOFI Sales</span>
            <span className="text-caption text-ink-secondary">Performance overview</span>
          </Stack>
        </Inline>
        <SegmentedControl
          value={periodo}
          onChange={(v) => setPeriodo(v as Periodo)}
          options={[
            { value: '7d', label: '7d' },
            { value: '30d', label: '30d' },
            { value: '12m', label: '12m' },
          ]}
        />
      </header>

      <div className="flex flex-col gap-6 p-5">
        {/* KPIs */}
        <Grid min="200px" gap={4}>
          {kpis.map((k) => {
            const positivo = k.delta >= 0;
            return (
              <Card key={k.label}>
                <Inline justify="between" align="start">
                  <Stack gap={1}>
                    <span className="text-caption text-ink-secondary">{k.label}</span>
                    <span className="text-h2 font-bold text-ink tabular-nums">{k.value}</span>
                    <Inline gap={1} align="center">
                      {positivo ? (
                        <TrendingUp className="size-4 text-success" />
                      ) : (
                        <TrendingDown className="size-4 text-danger" />
                      )}
                      <span className={positivo ? 'text-caption text-success' : 'text-caption text-danger'}>
                        {positivo ? '+' : ''}{k.delta.toFixed(1)}%
                      </span>
                    </Inline>
                  </Stack>
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-sunken text-ink-secondary">
                    {k.icon}
                  </span>
                </Inline>
              </Card>
            );
          })}
        </Grid>

        {/* Main charts: AreaChart + DonutChart */}
        <Grid min="300px" gap={4}>
          <Card>
            <CardTitle>Revenue by month</CardTitle>
            <div className="w-full">
              <AreaChart
                ariaLabel="Area chart: revenue by month versus target"
                data={RECEITA_MENSAL}
                xKey="mes"
                series={[
                  { key: 'receita', label: 'Revenue' },
                  { key: 'meta', label: 'Target', color: 'var(--accent)' },
                ]}
                height={220}
                showGrid
                showLegend
                valueFormatter={brl}
              />
            </div>
          </Card>

          <Card>
            <CardTitle>Sales by channel</CardTitle>
            <div className="w-full">
              <DonutChart
                ariaLabel="Donut chart: distribution of sales by channel"
                data={CANAIS}
                donut
                showLegend
                valueFormatter={(v) => `${v}%`}
                height={220}
              />
            </div>
          </Card>
        </Grid>

        {/* BarChart + Table */}
        <Grid min="300px" gap={4}>
          <Card>
            <CardTitle>Orders by category</CardTitle>
            <div className="w-full">
              <BarChart
                ariaLabel="Bar chart: orders by product category"
                data={PEDIDOS_CATEGORIA}
                xKey="categoria"
                series={[{ key: 'pedidos', label: 'Orders' }]}
                height={220}
                showGrid
              />
            </div>
          </Card>

          <Card variant="outlined" className="p-0">
            <div className="px-4 py-3">
              <CardTitle>Top products</CardTitle>
            </div>
            <Table
              rowKey={(p) => p.id}
              columns={COLUNAS_PRODUTO}
              rows={TOP_PRODUTOS}
            />
          </Card>
        </Grid>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Documentation page
───────────────────────────────────────────── */
export function VendasPage() {
  return (
    <DocPage
      group="Templates"
      title="GOFI Sales - Dashboard"
      lead="A complete sales dashboard combining KPIs, area, donut and bar charts with a top-products table — all with gofi-ui components and themed charts."
      source="patterns/page-templates.md"
    >
      <Callout tone="info">
        Built exclusively with <strong>gofi-ui</strong> components and themed charts — automatically responds
        to dark mode and brand color changes without any additional configuration.
      </Callout>
      <DocSection title="Template">
        <SalesDashboard />
      </DocSection>
    </DocPage>
  );
}
