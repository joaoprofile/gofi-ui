import { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Utensils,
  Car,
  House,
  Film,
  ShoppingBag,
  PiggyBank,
  TrendingUp,
} from 'lucide-react';
import { Card, CardTitle } from '@/components/Card';
import { Button, IconButton } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { Progress } from '@/components/Progress';
import { SegmentedControl } from '@/components/SegmentedControl';
import { AreaChart, DonutChart, chartColors } from '@/components/Charts';
import { Stack, Inline } from '@/components/Layout';
import { cn } from '@/lib/cn';
import { DocPage, DocSection, Callout } from '../components';

const brl = (v: number) =>
  v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

type Period = 'mes' | 'trimestre' | 'ano';

const FLOW = [
  { mes: 'Jan', receitas: 9200, despesas: 6100 },
  { mes: 'Feb', receitas: 9400, despesas: 6800 },
  { mes: 'Mar', receitas: 9800, despesas: 5900 },
  { mes: 'Apr', receitas: 9600, despesas: 7200 },
  { mes: 'May', receitas: 10200, despesas: 6400 },
  { mes: 'Jun', receitas: 11000, despesas: 6700 },
];

const CATEGORIES = [
  { name: 'Housing', value: 2400, color: chartColors.action, icon: House },
  { name: 'Food', value: 1650, color: chartColors.accent, icon: Utensils },
  { name: 'Transport', value: 820, color: chartColors.success, icon: Car },
  { name: 'Leisure', value: 560, color: chartColors.warning, icon: Film },
  { name: 'Shopping', value: 1270, color: chartColors.danger, icon: ShoppingBag },
];

const BUDGETS = [
  { name: 'Housing', spent: 2400, limit: 2600 },
  { name: 'Food', spent: 1650, limit: 1500 },
  { name: 'Transport', spent: 820, limit: 1000 },
  { name: 'Leisure', spent: 560, limit: 800 },
];

interface Tx {
  id: string;
  merchant: string;
  category: string;
  date: string;
  amount: number;
  icon: typeof House;
}

const TRANSACTIONS: Tx[] = [
  { id: '1', merchant: 'Salary', category: 'Income', date: 'Today', amount: 11000, icon: TrendingUp },
  { id: '2', merchant: 'Pão Supermarket', category: 'Food', date: 'Yesterday', amount: -342, icon: Utensils },
  { id: '3', merchant: 'Rent', category: 'Housing', date: 'Jun 03', amount: -2400, icon: House },
  { id: '4', merchant: 'Shell Station', category: 'Transport', date: 'Jun 02', amount: -218, icon: Car },
  { id: '5', merchant: 'Cinema', category: 'Leisure', date: 'Jun 01', amount: -96, icon: Film },
];

function StatPill({ tone, children }: { tone: 'in' | 'out'; children: React.ReactNode }) {
  return (
    <Inline gap={1} className="rounded-pill bg-white/15 px-3 py-1.5">
      {tone === 'in' ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
      <span className="text-body-sm font-medium">{children}</span>
    </Inline>
  );
}

function FinancasApp() {
  const [period, setPeriod] = useState<Period>('mes');
  const totalGastos = CATEGORIES.reduce((s, c) => s + c.value, 0); // total spending
  const entradas = 11000; // income
  const saidas = 6700; // expenses

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-page shadow-lg">
      {/* header */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-card px-5 py-4">
        <Inline gap={2}>
          <span className="grid size-10 place-items-center rounded-lg bg-brand text-on-brand"><Wallet className="size-5" /></span>
          <Stack gap={0}>
            <span className="text-h3 font-bold text-ink">GOFI Finance</span>
            <span className="text-caption text-ink-secondary">Hi, Marina — June 2026</span>
          </Stack>
        </Inline>
        <Inline gap={3}>
          <SegmentedControl
            value={period}
            onChange={setPeriod}
            options={[{ value: 'mes', label: 'Month' }, { value: 'trimestre', label: 'Quarter' }, { value: 'ano', label: 'Year' }]}
          />
          <Button variant="primary" iconStart={<Plus className="size-4" />}>New transaction</Button>
        </Inline>
      </header>

      <div className="flex flex-col gap-6 p-5 md:p-6">
        {/* top: balance hero + income/expenses */}
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex flex-col justify-between gap-6 rounded-xl bg-gradient-to-br from-action to-accent p-6 text-white shadow-md">
            <Inline justify="between" align="start">
              <Stack gap={1}>
                <span className="text-body-sm text-white/80">Total balance</span>
                <span className="text-display font-bold">{brl(48250)}</span>
              </Stack>
              <span className="grid size-10 place-items-center rounded-pill bg-white/15"><Wallet className="size-5" /></span>
            </Inline>
            <Inline gap={2}>
              <StatPill tone="in">{brl(entradas)} income</StatPill>
              <StatPill tone="out">{brl(saidas)} expenses</StatPill>
            </Inline>
          </div>

          <Card>
            <Inline justify="between" align="start">
              <Stack gap={1}>
                <span className="text-body-sm text-ink-secondary">Income this month</span>
                <span className="text-h1 text-ink">{brl(entradas)}</span>
                <Inline gap={1} className="text-success"><ArrowUpRight className="size-4" /><span className="text-caption">+8% vs. previous month</span></Inline>
              </Stack>
              <span className="grid size-10 place-items-center rounded-md bg-success-bg text-success"><ArrowUpRight className="size-5" /></span>
            </Inline>
          </Card>

          <Card>
            <Inline justify="between" align="start">
              <Stack gap={1}>
                <span className="text-body-sm text-ink-secondary">Expenses this month</span>
                <span className="text-h1 text-ink">{brl(saidas)}</span>
                <Inline gap={1} className="text-danger"><ArrowDownRight className="size-4" /><span className="text-caption">+5% vs. previous month</span></Inline>
              </Stack>
              <span className="grid size-10 place-items-center rounded-md bg-danger-bg text-danger"><ArrowDownRight className="size-5" /></span>
            </Inline>
          </Card>
        </div>

        {/* middle: flow (area) + spending by category (donut) */}
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <Card>
            <Inline justify="between">
              <CardTitle>Income vs. Expenses</CardTitle>
              <Badge tone="success">Surplus {brl(entradas - saidas)}</Badge>
            </Inline>
            <div className="w-full">
              <AreaChart
                ariaLabel="Income and expenses by month"
                data={FLOW}
                xKey="mes"
                series={[
                  { key: 'receitas', label: 'Income', color: chartColors.success },
                  { key: 'despesas', label: 'Expenses', color: chartColors.danger },
                ]}
                showLegend
                height={260}
                valueFormatter={(v) => brl(Number(v))}
              />
            </div>
          </Card>

          <Card>
            <CardTitle>Spending by category</CardTitle>
            <div className="relative">
              <DonutChart
                ariaLabel="Distribution of spending by category"
                data={CATEGORIES.map((c) => ({ name: c.name, value: c.value, color: c.color }))}
                showLegend={false}
                height={220}
                valueFormatter={(v) => brl(Number(v))}
              />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-caption text-ink-secondary">Total</span>
                <span className="text-h3 text-ink">{brl(totalGastos)}</span>
              </div>
            </div>
            <Stack gap={2}>
              {CATEGORIES.map((c) => (
                <Inline key={c.name} justify="between">
                  <Inline gap={2}>
                    <span className="size-2.5 rounded-pill" style={{ background: c.color }} aria-hidden />
                    <span className="text-body-sm text-ink">{c.name}</span>
                  </Inline>
                  <span className="text-body-sm font-medium text-ink tabular-nums">{brl(c.value)}</span>
                </Inline>
              ))}
            </Stack>
          </Card>
        </div>

        {/* bottom: budgets + transactions */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <Card>
            <Inline justify="between">
              <CardTitle>Monthly budget</CardTitle>
              <span className="grid size-9 place-items-center rounded-md bg-sunken text-action"><PiggyBank className="size-5" /></span>
            </Inline>
            <Stack gap={4}>
              {BUDGETS.map((b) => {
                const pct = Math.round((b.spent / b.limit) * 100);
                const over = b.spent > b.limit;
                return (
                  <Stack key={b.name} gap={2}>
                    <Inline justify="between">
                      <span className="text-body-sm text-ink">{b.name}</span>
                      <span className={cn('text-caption tabular-nums', over ? 'text-danger' : 'text-ink-secondary')}>
                        {brl(b.spent)} / {brl(b.limit)}
                      </span>
                    </Inline>
                    <Progress variant="linear" value={Math.min(pct, 100)} max={100} label={`${b.name} budget`} />
                    {over && <span className="text-caption text-danger">Over limit by {brl(b.spent - b.limit)}</span>}
                  </Stack>
                );
              })}
            </Stack>
          </Card>

          <Card>
            <Inline justify="between">
              <CardTitle>Recent transactions</CardTitle>
              <IconButton aria-label="View all transactions" size="sm"><Plus className="size-4 rotate-45" /></IconButton>
            </Inline>
            <ul role="list" className="divide-y divide-border">
              {TRANSACTIONS.map((t) => {
                const income = t.amount > 0;
                return (
                  <li key={t.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <span className={cn('grid size-10 shrink-0 place-items-center rounded-pill', income ? 'bg-success-bg text-success' : 'bg-sunken text-ink-secondary')}>
                      <t.icon className="size-5" />
                    </span>
                    <Stack gap={0} className="min-w-0 flex-1">
                      <span className="truncate font-medium text-ink">{t.merchant}</span>
                      <span className="text-caption text-ink-secondary">{t.category} · {t.date}</span>
                    </Stack>
                    <span className={cn('text-body-sm font-semibold tabular-nums', income ? 'text-success' : 'text-ink')}>
                      {income ? '+' : '−'}{brl(Math.abs(t.amount))}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function FinancasPage() {
  return (
    <DocPage
      group="Templates"
      title="GOFI Finance - Personal finance"
      lead="A personal finance dashboard focused on clarity and hierarchy: balance in the spotlight, color semantics for income/expenses, spending by category, budgets and transactions."
      source="patterns/page-templates.md"
    >
      <Callout tone="info">
        Carefully crafted UI/UX: a hero number (balance), consistent semantic color (income = success,
        expense = danger), themed charts and generous whitespace. Everything responds to theme and brand color.
      </Callout>
      <DocSection title="Template">
        <FinancasApp />
      </DocSection>
    </DocPage>
  );
}
