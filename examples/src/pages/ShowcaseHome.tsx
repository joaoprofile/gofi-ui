import { type ComponentType } from 'react';
import {
  GraduationCap,
  Users,
  Wallet,
  TrendingUp,
  Gauge,
  LayoutDashboard,
  ArrowRight,
  type LucideProps,
} from 'lucide-react';
import { DocPage } from '../components';

interface ShowcaseItem {
  id: string;
  name: string;
  tag: string;
  description: string;
  Icon: ComponentType<LucideProps>;
}

/** Every template/example screen built end-to-end with gofi-ui. */
const EXAMPLES: ShowcaseItem[] = [
  {
    id: 'learn',
    name: 'GOFI Learn',
    tag: 'Courses',
    description:
      'Course portal: navigation sidebar, top bar with search, a rich table (progress + avatar stack), pagination and recommendation cards.',
    Icon: GraduationCap,
  },
  {
    id: 'crm',
    name: 'GOFI CRM',
    tag: 'Full CRUD',
    description:
      'List in cards or table, create/edit in a drawer with multi-select, delete with confirm + undo, search, filters and the 4 states.',
    Icon: Users,
  },
  {
    id: 'financas',
    name: 'GOFI Finance',
    tag: 'Personal',
    description:
      'Personal finance: balance in the spotlight, income/expense color semantics, spending by category, budgets and transactions.',
    Icon: Wallet,
  },
  {
    id: 'vendas',
    name: 'GOFI Sales',
    tag: 'Dashboard',
    description:
      'Sales dashboard combining KPIs, area / donut / bar charts and a top-products table — all themed by the tokens.',
    Icon: TrendingUp,
  },
  {
    id: 'indicadores',
    name: 'GOFI Metrics',
    tag: 'KPIs',
    description:
      'Business-health panel: MRR, churn, NPS, LTV/CAC, revenue distribution and operational metrics in one interactive view.',
    Icon: Gauge,
  },
  {
    id: 'app-shell',
    name: 'Student Portal',
    tag: 'App Shell',
    description:
      'The components brought together in a real screen: sidebar, top bar, brand hero, progress cards, schedule and a rich table.',
    Icon: LayoutDashboard,
  },
];

/** Showcase landing — a card per real example screen. */
export function ShowcaseHomePage() {
  return (
    <DocPage
      group="Showcase"
      title="Showcase"
      lead="Real screens built end-to-end with gofi-ui components and themed charts. Each example reacts live to dark mode and the brand-color switch. Open one to see the design system in context."
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {EXAMPLES.map(({ id, name, tag, description, Icon }) => (
          <a
            key={id}
            href={`#/${id}`}
            onClick={() => window.scrollTo({ top: 0 })}
            className="group flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-12 place-items-center rounded-md bg-brand text-on-brand">
                <Icon className="size-6" aria-hidden />
              </span>
              <span className="rounded-pill bg-hover px-2.5 py-1 text-caption font-medium text-ink-secondary">
                {tag}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-h3 font-semibold text-ink">{name}</h3>
              <p className="text-body-sm text-ink-secondary">{description}</p>
            </div>
            <span className="mt-auto inline-flex items-center gap-1 text-body-sm font-semibold text-action">
              View example
              <ArrowRight className="size-4 transition-transform duration-100 group-hover:translate-x-0.5" aria-hidden />
            </span>
          </a>
        ))}
      </div>
    </DocPage>
  );
}
