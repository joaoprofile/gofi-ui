import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  Banknote,
  Bell,
  Boxes,
  Building2,
  CircleHelp,
  Download,
  Inbox,
  LayoutDashboard,
  Mail,
  Menu as MenuIcon,
  ChevronRight,
  MoreVertical,
  Package,
  Pencil,
  Percent,
  Plus,
  Scale,
  Search,
  Settings,
  ShoppingBag,
  Store,
  ShoppingCart,
  Tags,
  Trash2,
  FileText,
  TrendingUp,
  Truck,
  Users,
} from 'lucide-react';
import { Avatar, AvatarStack } from '@/components/Avatar';
import { Accordion } from '@/components/Accordion';
import { Badge, Chip, Tag } from '@/components/Badge';
import { Banner } from '@/components/Banner';
import { Button, IconButton } from '@/components/Button';
import { Card, CardTitle } from '@/components/Card';
import { BarChart, DonutChart } from '@/components/Charts';
import { DatePicker } from '@/components/DatePicker';
import { EmptyState } from '@/components/EmptyState';
import { Field } from '@/components/Field';
import { Skeleton } from '@/components/Feedback';
import { Input } from '@/components/Input';
import { Grid, Inline, Stack } from '@/components/Layout';
import { List, ListItem } from '@/components/List';
import { Menu, Popover } from '@/components/Menu';
import { ConfirmDialog, Drawer, Modal } from '@/components/Modal';
import { Pagination } from '@/components/Pagination';
import { Progress } from '@/components/Progress';
import { SegmentedControl } from '@/components/SegmentedControl';
import { MultiSelect, Select } from '@/components/Select';
import { Stepper } from '@/components/Stepper';
import { Table, type Column } from '@/components/Table';
import { Textarea } from '@/components/Textarea';
import { ToastProvider, useToast } from '@/components/Toast';
import { Checkbox, Radio, Switch } from '@/components/Toggle';
import { Tooltip } from '@/components/Tooltip';
import { DocPage, DocSection, Callout, Prose } from '../components';

/* ════════════════════════════════════════════════════════════════════════
 * Model
 * ══════════════════════════════════════════════════════════════════════ */

type RecordStatus = 'active' | 'pending' | 'blocked' | 'draft';

interface Person {
  id: string;
  name: string;
  email: string;
  /** Buying profile — Varejo, Indústria, Revenda… */
  segment: string;
  region: string;
  status: RecordStatus;
  skills: string[];
  since: string;
  notes?: string;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  reorderPoint: number;
  status: RecordStatus;
  supplier: string;
  unit: string;
  location: string;
  cost: number;
  description?: string;
  taxable: boolean;
}

interface Category {
  id: string;
  name: string;
  parent: string | null;
  products: number;
  margin: number;
  /** SLDS palette utilities for the object tile: background + foreground.
   * The foreground is picked per hue — white clears 4.5:1 on the `-50`
   * steps, but the amber tile needs the navy ink. */
  tile: string;
  tileFg: string;
}

interface Order {
  id: string;
  ref: string;
  supplier: string;
  items: number;
  total: number;
  placed: string;
  /** Index into ORDER_FLOW. */
  stage: number;
}

/* Tile foregrounds. Every `-50` step in the SLDS ramps is tuned to clear
 * 4.5:1 against white; the amber tile is the exception and takes the navy. */
const WHITE_FG = 'text-slds-neutral-100';
const NAVY_FG = 'text-lx-ink';

const STATUS_META: Record<
  RecordStatus,
  { label: string; tone: 'success' | 'warning' | 'danger' | 'neutral' }
> = {
  active: { label: 'Active', tone: 'success' },
  pending: { label: 'Pending', tone: 'warning' },
  blocked: { label: 'Blocked', tone: 'danger' },
  draft: { label: 'Draft', tone: 'neutral' },
};

const ORDER_FLOW = [
  { id: 'draft', label: 'Draft' },
  { id: 'approval', label: 'Approval' },
  { id: 'ordered', label: 'Ordered' },
  { id: 'received', label: 'Received' },
  { id: 'invoiced', label: 'Invoiced' },
];

const REGIONS = ['Sudeste', 'Sul', 'Nordeste', 'Norte', 'Centro-Oeste'];
const SEGMENTS = ['Varejo', 'Indústria', 'Revenda', 'Construção', 'Agro'];
const PRODUCT_UNITS = ['un', 'cx', 'kg', 'm', 'L'];
const WAREHOUSES = ['CD-01', 'CD-02', 'Loja Centro', 'Trânsito'];
const SUPPLIERS = ['Nordika Parts', 'FluidCore', 'Voltek', 'PetroLine'];
const CUSTOMER_TAGS = ['VIP', 'Recorrente', 'Atacado', 'Novo', 'Parceiro', 'Exportação'];

const PEOPLE: Person[] = [
  { id: 'p1', name: 'Metalúrgica Andrade', email: 'compras@andrade.com.br', segment: 'Indústria', region: 'Sudeste', status: 'active', skills: ['VIP', 'Recorrente'], since: '2021-03-08' },
  { id: 'p2', name: 'Distribuidora Mendes', email: 'carlos@dmendes.com.br', segment: 'Revenda', region: 'Sul', status: 'active', skills: ['Atacado'], since: '2019-11-02' },
  { id: 'p3', name: 'Rocha Construções', email: 'financeiro@rochaconstr.com.br', segment: 'Construção', region: 'Nordeste', status: 'pending', skills: ['Novo'], since: '2023-06-19' },
  { id: 'p4', name: 'Souza Agropecuária', email: 'edu@souzaagro.com.br', segment: 'Agro', region: 'Centro-Oeste', status: 'blocked', skills: ['Exportação'], since: '2022-01-24' },
  { id: 'p5', name: 'Dias Comércio', email: 'fernanda@diascom.com.br', segment: 'Varejo', region: 'Sudeste', status: 'active', skills: ['Recorrente', 'Parceiro'], since: '2020-08-11' },
  { id: 'p6', name: 'Prado Equipamentos', email: 'gustavo@pradoeq.com.br', segment: 'Indústria', region: 'Norte', status: 'draft', skills: ['Novo'], since: '2024-02-05' },
];

const PRODUCTS: Product[] = [
  { id: 'r1', sku: 'BRG-1042', name: 'Sealed ball bearing 42mm', category: 'Components', price: 38.9, stock: 1240, reorderPoint: 400, status: 'active', supplier: 'Nordika Parts', unit: 'un', location: 'CD-01', cost: 23.34, taxable: true },
  { id: 'r2', sku: 'HYD-0771', name: 'Hydraulic hose 3/4"', category: 'Hydraulics', price: 126.5, stock: 86, reorderPoint: 120, status: 'active', supplier: 'FluidCore', unit: 'un', location: 'CD-01', cost: 75.9, taxable: true },
  { id: 'r3', sku: 'ELC-2210', name: 'Three-phase contactor 25A', category: 'Electrical', price: 214, stock: 12, reorderPoint: 60, status: 'pending', supplier: 'Voltek', unit: 'un', location: 'CD-01', cost: 128.4, taxable: true },
  { id: 'r4', sku: 'LUB-0090', name: 'Synthetic lubricant 20L', category: 'Consumables', price: 480, stock: 310, reorderPoint: 150, status: 'active', supplier: 'PetroLine', unit: 'un', location: 'CD-01', cost: 288.0, taxable: true },
  { id: 'r5', sku: 'SFT-3301', name: 'Stainless steel shaft 1m', category: 'Components', price: 92.75, stock: 0, reorderPoint: 80, status: 'blocked', supplier: 'Nordika Parts', unit: 'un', location: 'CD-01', cost: 55.65, taxable: true },
  { id: 'r6', sku: 'PMP-5540', name: 'Centrifugal pump 5HP', category: 'Hydraulics', price: 3180, stock: 24, reorderPoint: 15, status: 'active', supplier: 'FluidCore', unit: 'un', location: 'CD-01', cost: 1908.0, taxable: true },
  { id: 'r7', sku: 'SNS-1180', name: 'Inductive proximity sensor', category: 'Electrical', price: 149.9, stock: 205, reorderPoint: 90, status: 'draft', supplier: 'Voltek', unit: 'un', location: 'CD-01', cost: 89.94, taxable: true },
];

const CATEGORIES: Category[] = [
  { id: 'c1', name: 'Components', parent: null, products: 148, margin: 34, tile: 'bg-slds-blue-50', tileFg: WHITE_FG },
  { id: 'c2', name: 'Hydraulics', parent: null, products: 62, margin: 41, tile: 'bg-slds-teal-50', tileFg: WHITE_FG },
  { id: 'c3', name: 'Electrical', parent: null, products: 97, margin: 28, tile: 'bg-slds-yellow-80', tileFg: NAVY_FG },
  { id: 'c4', name: 'Consumables', parent: null, products: 213, margin: 19, tile: 'bg-slds-pink-50', tileFg: WHITE_FG },
  { id: 'c5', name: 'Bearings', parent: 'Components', products: 44, margin: 37, tile: 'bg-slds-cloud-blue-50', tileFg: WHITE_FG },
  { id: 'c6', name: 'Seals & gaskets', parent: 'Components', products: 31, margin: 45, tile: 'bg-slds-neutral-50', tileFg: WHITE_FG },
];

const ORDERS: Order[] = [
  { id: 'o1', ref: 'PO-2026-0184', supplier: 'Nordika Parts', items: 12, total: 48200, placed: '2026-08-02', stage: 3 },
  { id: 'o2', ref: 'PO-2026-0185', supplier: 'FluidCore', items: 4, total: 15680, placed: '2026-08-05', stage: 1 },
  { id: 'o3', ref: 'PO-2026-0186', supplier: 'Voltek', items: 21, total: 92450, placed: '2026-08-09', stage: 2 },
  { id: 'o4', ref: 'PO-2026-0187', supplier: 'PetroLine', items: 6, total: 7300, placed: '2026-08-12', stage: 0 },
  { id: 'o5', ref: 'PO-2026-0188', supplier: 'Nordika Parts', items: 9, total: 26150, placed: '2026-08-14', stage: 4 },
];

const SPEND_BY_MONTH = [
  { month: 'Mar', direct: 182, indirect: 74 },
  { month: 'Apr', direct: 205, indirect: 81 },
  { month: 'May', direct: 168, indirect: 92 },
  { month: 'Jun', direct: 244, indirect: 88 },
  { month: 'Jul', direct: 231, indirect: 103 },
  { month: 'Aug', direct: 276, indirect: 97 },
];

const usd = (v: number) =>
  v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const usd2 = (v: number) =>
  v.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

/* ════════════════════════════════════════════════════════════════════════
 * Object metadata — drives the nav, the page header tile and the icons
 * ══════════════════════════════════════════════════════════════════════ */

/* The record views this demo actually implements. Everything else in the rail
 * is a real ERP module with a stub screen, so the navigation reads like a
 * product instead of a component gallery. */
type RecordView = 'people' | 'products' | 'categories' | 'orders';

const RECORDS: Record<
  RecordView,
  { plural: string; description: string; icon: typeof Users; tile: string; tileFg: string }
> = {
  people: { plural: 'Clientes', description: 'Adicione, remova ou edite as contas atendidas pela operação.', icon: Users, tile: 'bg-slds-blue-50', tileFg: WHITE_FG },
  products: { plural: 'Produtos', description: 'Catálogo, preço de lista e ponto de reposição de cada item.', icon: Package, tile: 'bg-slds-teal-50', tileFg: WHITE_FG },
  categories: { plural: 'Categorias', description: 'Hierarquia do catálogo e as regras de margem de cada nível.', icon: Tags, tile: 'bg-slds-yellow-80', tileFg: NAVY_FG },
  orders: { plural: 'Pedidos de compra', description: 'Acompanhe o fluxo de aprovação até o faturamento.', icon: ShoppingCart, tile: 'bg-slds-purple-50', tileFg: WHITE_FG },
};

/* Top navigation — only the two org-wide screens. Everything record-shaped
 * lives in the module rail. */
const TOP_NAV = [
  { id: 'home', label: 'Home', icon: LayoutDashboard, tile: 'bg-slds-cloud-blue-50', tileFg: WHITE_FG },
  { id: 'dashboard', label: 'Dashboard', icon: Activity, tile: 'bg-slds-blue-50', tileFg: WHITE_FG },
] as const;

type TopId = (typeof TOP_NAV)[number]['id'];

/* Left rail — the ERP modules and the records each one owns. Mirrors
 * .slds-vertical-navigation: a titled list where the selected row carries a
 * brand-coloured left bar, and the open module reveals its entries. */
interface ModuleItem {
  id: string;
  label: string;
  /** Set when the entry opens one of the implemented record views. */
  view?: RecordView;
}

const MODULES: ReadonlyArray<{
  id: string;
  label: string;
  icon: typeof Users;
  items: ModuleItem[];
}> = [
  {
    id: 'compras',
    label: 'Compras',
    icon: ShoppingBag,
    items: [
      { id: 'fornecedores', label: 'Fornecedores' },
      { id: 'pedidos-compra', label: 'Pedidos de compra', view: 'orders' },
      { id: 'cotacoes', label: 'Cotações' },
    ],
  },
  {
    id: 'logistica',
    label: 'Logística',
    icon: Truck,
    items: [
      { id: 'estoque', label: 'Estoque' },
      { id: 'expedicao', label: 'Expedição' },
      { id: 'transportadoras', label: 'Transportadoras' },
    ],
  },
  {
    id: 'vendas',
    label: 'Vendas',
    icon: TrendingUp,
    items: [
      { id: 'clientes', label: 'Clientes', view: 'people' },
      { id: 'pedidos-venda', label: 'Pedidos de venda' },
      { id: 'metas', label: 'Metas' },
    ],
  },
  {
    id: 'nota-fiscal',
    label: 'Nota fiscal',
    icon: FileText,
    items: [
      { id: 'nfe-emitidas', label: 'NF-e emitidas' },
      { id: 'nfe-recebidas', label: 'NF-e recebidas' },
      { id: 'series', label: 'Séries' },
    ],
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    icon: Banknote,
    items: [
      { id: 'contas-pagar', label: 'Contas a pagar' },
      { id: 'contas-receber', label: 'Contas a receber' },
      { id: 'fluxo-caixa', label: 'Fluxo de caixa' },
    ],
  },
  {
    id: 'marketplaces',
    label: 'Marketplaces',
    icon: Store,
    items: [
      { id: 'canais', label: 'Canais' },
      { id: 'anuncios', label: 'Anúncios' },
      { id: 'regras-envio', label: 'Regras de envio' },
    ],
  },
  {
    id: 'monitoramento',
    label: 'Monitoramento',
    icon: Activity,
    items: [
      { id: 'integracoes', label: 'Integrações' },
      { id: 'filas', label: 'Filas' },
      { id: 'logs', label: 'Logs' },
    ],
  },
  {
    id: 'precificacao',
    label: 'Precificação',
    icon: Percent,
    items: [
      { id: 'produtos', label: 'Produtos', view: 'products' },
      { id: 'categorias', label: 'Categorias', view: 'categories' },
      { id: 'regras-preco', label: 'Regras de preço' },
    ],
  },
  {
    id: 'conciliacao',
    label: 'Conciliação',
    icon: Scale,
    items: [
      { id: 'repasses', label: 'Repasses' },
      { id: 'divergencias', label: 'Divergências' },
      { id: 'extratos', label: 'Extratos' },
    ],
  },
];

type ModuleId = (typeof MODULES)[number]['id'];

/** What the content area is showing. */
type Route =
  | { kind: 'top'; id: TopId }
  | { kind: 'item'; module: ModuleId; item: string };

/* Icon buttons sitting on the blue app bar: inherit the bar's foreground and
 * hover with a translucent wash instead of the light-surface `bg-hover`. */
const BAR_ICON = 'text-on-secondary hover:bg-on-secondary/15';

/* ════════════════════════════════════════════════════════════════════════
 * Shell — global header + context bar + page header
 * ══════════════════════════════════════════════════════════════════════ */

function GlobalHeader({
  navCollapsed,
  onToggleNav,
}: {
  navCollapsed: boolean;
  onToggleNav: () => void;
}) {
  const { toast } = useToast();
  return (
    /* Solid blue app bar, white chrome — the header of the reference screens.
     * `bg-action` + `text-on-secondary` keeps the pair legible in both modes:
     * white on #0070D2 in light, navy on #57A3FD in dark. */
    <header className="flex flex-wrap items-center gap-2 bg-action px-3 py-2 text-on-secondary">
      <Tooltip label={navCollapsed ? 'Expand modules' : 'Collapse modules'}>
        <IconButton
          aria-label={navCollapsed ? 'Expand modules' : 'Collapse modules'}
          aria-expanded={!navCollapsed}
          size="md"
          variant="ghost"
          className={BAR_ICON}
          onClick={onToggleNav}
        >
          <MenuIcon className="size-[18px]" />
        </IconButton>
      </Tooltip>

      <Inline gap={2} align="center">
        <Boxes aria-hidden className="size-4" />
        <span className="text-body font-bold">GOFI ERP</span>
      </Inline>

      <span className="flex-1" />

      <Inline gap={0} align="center">
        <Popover
          align="end"
          /* The trigger must be the focusable element itself — Popover clones it
           * to attach aria-expanded and to return focus on close. */
          trigger={
            <IconButton aria-label="Notifications — 3 unread" size="md" variant="ghost" className={`relative ${BAR_ICON}`}>
              <Bell className="size-[18px]" />
              {/* NotificationBadge is sized for INLINE use next to a label — its
               * 20px min-width plus padding covers an icon this size. A corner
               * counter needs its own tight box: 16px, 10px numeral, and a ring
               * in the bar colour so the white chip reads as a cut-out (the
               * default `bg-action` would be the bar itself, i.e. invisible). */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-badge bg-card px-1 text-[10px] font-bold leading-none text-action ring-2 ring-action"
              >
                3
              </span>
            </IconButton>
          }
        >
          <Stack gap={3}>
            <span className="text-body font-bold text-ink">Notifications</span>
            <List>
              <ListItem
                title="PO-2026-0186 needs approval"
                subtitle="Voltek · $92,450"
                leading={<span className="grid size-8 place-items-center rounded-overlay bg-warning-bg text-warning"><ShoppingCart className="size-4" /></span>}
              />
              <ListItem
                title="SFT-3301 is out of stock"
                subtitle="Components · reorder point 80"
                leading={<span className="grid size-8 place-items-center rounded-overlay bg-danger-bg text-danger"><Package className="size-4" /></span>}
              />
              <ListItem
                title="Rocha Construções awaits onboarding"
                subtitle="Construção · pending since Jun 19"
                leading={<span className="grid size-8 place-items-center rounded-overlay bg-info-bg text-info"><Users className="size-4" /></span>}
              />
            </List>
          </Stack>
        </Popover>

        <Tooltip label="Setup">
          <IconButton aria-label="Setup" size="sm" variant="ghost" className={BAR_ICON}>
            <Settings className="size-[18px]" />
          </IconButton>
        </Tooltip>

        <Tooltip label="Help">
          <IconButton aria-label="Help" size="sm" variant="ghost" className={BAR_ICON}>
            <CircleHelp className="size-[18px]" />
          </IconButton>
        </Tooltip>

        {/* Separates the account control from the utility icons, the way the
         * reference bar does. Translucent white so it works in both modes. */}
        <span aria-hidden className="mx-2 h-5 w-px bg-on-secondary/30" />

        <Menu
          align="end"
          trigger={
            <button
              type="button"
              aria-label="Account menu — Ana Beatriz Lima"
              className="rounded-avatar ring-2 ring-on-secondary/40 transition-shadow hover:ring-on-secondary/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-secondary"
            >
              <Avatar name="Ana Beatriz Lima" size="sm" status="online" />
            </button>
          }
          items={[
            { id: 'profile', label: 'View profile', icon: <Users className="size-4" />, onSelect: () => toast({ tone: 'info', message: 'Profile opened.' }) },
            { id: 'settings', label: 'Org settings', icon: <Settings className="size-4" />, onSelect: () => toast({ tone: 'info', message: 'Settings opened.' }) },
            { id: 'logout', label: 'Log out', danger: true, onSelect: () => toast({ tone: 'warning', message: 'Signed out of the demo org.' }) },
          ]}
        />
      </Inline>
    </header>
  );
}

function ModuleNav({
  collapsed,
  route,
  openModule,
  onOpenModule,
  onSelect,
}: {
  collapsed: boolean;
  route: Route;
  openModule: ModuleId;
  onOpenModule: (id: ModuleId) => void;
  onSelect: (module: ModuleId, item: string) => void;
}) {
  const activeModule = route.kind === 'item' ? route.module : null;
  const activeItem = route.kind === 'item' ? route.item : null;

  /* Collapsed: a 56px icon rail. The modules stay reachable — clicking an icon
   * opens that module and expands the rail — instead of the navigation simply
   * disappearing, which is what "collapse" must never mean. */
  if (collapsed) {
    return (
      <nav
        aria-label="Módulos"
        className="hidden w-14 shrink-0 flex-col items-center gap-1 border-r border-border bg-card py-3 md:flex"
      >
        {MODULES.map((m) => {
          const on = m.id === activeModule;
          const Icon = m.icon;
          return (
            <Tooltip key={m.id} label={m.label} side="right">
              <button
                type="button"
                aria-label={m.label}
                aria-current={on ? 'page' : undefined}
                onClick={() => onOpenModule(m.id)}
                className={`grid size-9 place-items-center rounded-field border-l-[3px] transition-colors duration-100 ease-standard focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus ${
                  on ? 'border-accent bg-hover text-action' : 'border-transparent text-ink-secondary hover:bg-hover hover:text-ink'
                }`}
              >
                <Icon aria-hidden className="size-[18px]" />
              </button>
            </Tooltip>
          );
        })}
      </nav>
    );
  }

  return (
    <nav
      aria-label="Módulos"
      className="hidden w-60 shrink-0 overflow-y-auto border-r border-border bg-card py-3 md:block"
    >
      <span className="block px-4 pb-2 text-caption uppercase tracking-wide text-ink-secondary">
        Módulos
      </span>
      <ul className="flex flex-col">
        {MODULES.map((m) => {
          const isOpen = m.id === openModule;
          const Icon = m.icon;
          return (
            <li key={m.id}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => onOpenModule(m.id)}
                className={`flex w-full items-center gap-2 border-l-[3px] px-4 py-2 text-left text-body-sm transition-colors duration-100 ease-standard focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus ${
                  m.id === activeModule
                    ? 'border-accent bg-hover font-bold text-action'
                    : 'border-transparent text-ink hover:bg-hover'
                }`}
              >
                <Icon aria-hidden className="size-4 shrink-0 text-ink-secondary" />
                <span className="min-w-0 flex-1 truncate">{m.label}</span>
                <ChevronRight
                  aria-hidden
                  className={`size-4 shrink-0 text-ink-secondary transition-transform duration-100 ease-standard ${isOpen ? 'rotate-90' : ''}`}
                />
              </button>

              {isOpen && (
                <ul className="flex flex-col pb-1">
                  {m.items.map((it) => {
                    const on = m.id === activeModule && it.id === activeItem;
                    return (
                      <li key={it.id}>
                        <button
                          type="button"
                          aria-current={on ? 'page' : undefined}
                          onClick={() => onSelect(m.id, it.id)}
                          className={`flex w-full items-center gap-2 border-l-[3px] py-1.5 pl-10 pr-4 text-left text-body-sm transition-colors duration-100 ease-standard focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus ${
                            on
                              ? 'border-accent bg-hover font-bold text-action'
                              : 'border-transparent text-ink-secondary hover:bg-hover hover:text-ink'
                          }`}
                        >
                          <span className="min-w-0 flex-1 truncate">{it.label}</span>
                          {it.view && (
                            <span
                              aria-hidden
                              title="Implemented in this demo"
                              className="size-1.5 shrink-0 rounded-full bg-success"
                            />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* Top navigation — Home and Dashboard only. Plain buttons with aria-current
 * rather than a tablist: module navigation can leave both unselected, and a
 * tablist with nothing selected is a lie. Styled like the reference tabs. */
function TopNav({
  route,
  onSelect,
}: {
  route: Route;
  onSelect: (id: TopId) => void;
}) {
  return (
    <nav aria-label="ERP" className="flex items-center gap-1 border-b border-border bg-card px-4">
      {TOP_NAV.map((t) => {
        const on = route.kind === 'top' && route.id === t.id;
        return (
          <button
            key={t.id}
            type="button"
            aria-current={on ? 'page' : undefined}
            onClick={() => onSelect(t.id)}
            className={`-mb-px border-b-[length:var(--bw-tab)] px-4 py-2 text-body-sm uppercase tracking-wide transition-colors duration-100 ease-standard focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus ${
              on
                ? 'border-action font-bold text-action'
                : 'border-transparent text-ink-secondary hover:border-border hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}

function PageHeader({
  tile,
  tileFg,
  icon: Icon,
  title,
  crumb,
  description,
  count,
  children,
}: {
  tile: string;
  tileFg: string;
  icon: typeof Users;
  title: string;
  /** Breadcrumb tail after "GOFI ERP". */
  crumb: string;
  /** One line saying what the screen is for. */
  description?: string;
  count?: string;
  children?: React.ReactNode;
}) {
  return (
    /* Three bands instead of one crowded row: the breadcrumb gets its own
     * line, the title owns the second with the actions opposite it, and
     * filtering moved out entirely into <FilterBar>. */
    <div className="bg-card px-4 pt-3">
      <nav aria-label="Breadcrumb" className="text-caption uppercase tracking-wide text-ink-secondary">
        GOFI ERP &nbsp;›&nbsp; {crumb}
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-4 pb-4 pt-2">
        <Inline gap={3} align="start">
          <span className={`grid size-12 shrink-0 place-items-center rounded-overlay ${tile} ${tileFg}`}>
            <Icon aria-hidden className="size-6" />
          </span>
          <Stack gap={1}>
            {/* h2, not h1 — the docs page around the console already owns the
              * page's single h1, and heading levels must not be duplicated. */}
            <Inline gap={2} align="baseline" className="flex-wrap">
              <h2 className="text-h1 tracking-heading text-ink">{title}</h2>
              {count && <span className="text-body-sm text-ink-secondary">{count}</span>}
            </Inline>
            {description && (
              <p className="max-w-[60ch] text-body-sm text-ink-secondary">{description}</p>
            )}
          </Stack>
        </Inline>

        {children && <Inline gap={2} align="center" className="flex-wrap">{children}</Inline>}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
 * Filter bar — its own band under the page header
 *
 * Search, selects and chips were previously squeezed into the header row,
 * which left the title competing with a text field. They get their own strip
 * now: label, controls, and the view/apply actions pinned right.
 * ══════════════════════════════════════════════════════════════════════ */

function FilterBar({
  children,
  actions,
}: {
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-y border-border bg-sunken px-4 py-2.5">
      <span className="text-caption uppercase tracking-wide text-ink-secondary">Filtros</span>
      <div className="flex flex-1 flex-wrap items-center gap-2">{children}</div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/** Search input sized for the filter bar. */
function FilterSearch({
  value,
  onChange,
  label,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  placeholder: string;
}) {
  return (
    <div className="flex h-[var(--h-field)] w-64 items-center gap-2 rounded-field border border-border bg-card px-[var(--px-field)]">
      <Search aria-hidden className="size-4 text-ink-secondary" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-body-sm text-ink outline-none placeholder:text-ink-secondary"
      />
    </div>
  );
}

/** PageHeader for one of the implemented record views. */
function RecordHeader({
  view,
  crumb,
  count,
  children,
}: {
  view: RecordView;
  crumb: string;
  count?: string;
  children?: React.ReactNode;
}) {
  const meta = RECORDS[view];
  return (
    <PageHeader
      tile={meta.tile}
      tileFg={meta.tileFg}
      icon={meta.icon}
      title={meta.plural}
      crumb={crumb}
      description={meta.description}
      count={count}
    >
      {children}
    </PageHeader>
  );
}

/* ════════════════════════════════════════════════════════════════════════
 * Record form — the PAGE presentation
 *
 * Two ways to edit in this console, picked by field count:
 *   · few fields  → Modal (Categorias)
 *   · many fields → full page (Clientes, Produtos)
 * A page gives sections, a two-column grid and room to breathe; a modal keeps
 * a three-field edit in place. Both run the same DS form components.
 * ══════════════════════════════════════════════════════════════════════ */

/** Titled group of fields inside a form page. */
function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <Grid min="240px" gap={4}>
        {children}
      </Grid>
    </Card>
  );
}

/** Field that should span the whole row (textarea, long text). */
function FormWide({ children }: { children: React.ReactNode }) {
  return <div className="md:col-span-full">{children}</div>;
}

function FormPage({
  title,
  crumb,
  tile,
  tileFg,
  icon,
  onCancel,
  onSubmit,
  submitLabel,
  children,
}: {
  title: string;
  crumb: string;
  tile: string;
  tileFg: string;
  icon: typeof Users;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
  children: React.ReactNode;
}) {
  const Icon = icon;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex flex-wrap items-end justify-between gap-4 bg-card px-4 py-4">
        <Inline gap={3} align="center">
          <span className={`grid size-11 shrink-0 place-items-center rounded-overlay ${tile} ${tileFg}`}>
            <Icon aria-hidden className="size-6" />
          </span>
          <Stack gap={0}>
            <span className="text-caption uppercase tracking-wide text-ink-secondary">
              GOFI ERP &nbsp;›&nbsp; {crumb}
            </span>
            <span className="font-heading text-h1 tracking-heading text-ink">{title}</span>
          </Stack>
        </Inline>
        <Inline gap={2}>
          <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            {submitLabel}
          </Button>
        </Inline>
      </div>

      <Stack gap={4} className="p-4">
        {children}
      </Stack>

      {/* Repeated at the bottom: on a long form the header actions have
        * scrolled away by the time the last field is filled. */}
      <div className="sticky bottom-0 flex justify-end gap-3 border-t border-border bg-card px-4 py-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

/* Small KPI tile — the SLDS "summary detail" pattern. */
function Kpi({
  label,
  value,
  delta,
  tone,
  icon,
}: {
  label: string;
  value: string;
  delta?: string;
  tone: 'success' | 'warning' | 'danger' | 'info';
  icon: React.ReactNode;
}) {
  const toneBg = {
    success: 'bg-success-bg text-success',
    warning: 'bg-warning-bg text-warning',
    danger: 'bg-danger-bg text-danger',
    info: 'bg-info-bg text-info',
  }[tone];
  return (
    <Card>
      <Inline justify="between" align="start">
        <Stack gap={1}>
          <span className="text-caption text-ink-secondary">{label}</span>
          <span className="font-heading text-h2 text-ink tabular-nums">{value}</span>
          {delta && <span className="text-caption text-ink-secondary">{delta}</span>}
        </Stack>
        <span className={`grid size-9 shrink-0 place-items-center rounded-overlay ${toneBg}`}>
          {icon}
        </span>
      </Inline>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════════════
 * Home
 * ══════════════════════════════════════════════════════════════════════ */

function HomeView({ onOpenOrders }: { onOpenOrders: () => void }) {
  const [bannerOpen, setBannerOpen] = useState(true);
  const lowStock = PRODUCTS.filter((p) => p.stock < p.reorderPoint).length;

  return (
    <Stack gap={5}>
      {bannerOpen && (
        <Banner
          tone="warning"
          title="3 purchase orders are waiting on your approval"
          onDismiss={() => setBannerOpen(false)}
          action={
            <Button size="sm" variant="secondary" onClick={onOpenOrders}>
              Review orders
            </Button>
          }
        >
          Approvals older than 48h block the receiving queue at the warehouse.
        </Banner>
      )}

      <Grid min="220px" gap={4}>
        <Kpi label="Open purchase orders" value="18" delta="+4 vs last week" tone="info" icon={<ShoppingCart className="size-4" />} />
        <Kpi label="Spend this month" value={usd(276000)} delta="+13% vs Jul" tone="success" icon={<TrendingUp className="size-4" />} />
        <Kpi label="Below reorder point" value={String(lowStock)} delta="Across 3 categories" tone="warning" icon={<Package className="size-4" />} />
        <Kpi label="Blocked records" value="2" delta="1 supplier · 1 product" tone="danger" icon={<Truck className="size-4" />} />
      </Grid>

      <Card>
        <CardTitle>Recent activity</CardTitle>
        <List>
          <ListItem
            title="PO-2026-0188 was invoiced"
            subtitle="Nordika Parts · $26,150"
            leading={<span className="grid size-8 place-items-center rounded-overlay bg-success-bg text-success"><ShoppingCart className="size-4" /></span>}
            trailing={<Badge tone="success">Invoiced</Badge>}
          />
          <ListItem
            title="ELC-2210 fell below its reorder point"
            subtitle="Electrical · 12 units left of 60"
            leading={<span className="grid size-8 place-items-center rounded-overlay bg-warning-bg text-warning"><Package className="size-4" /></span>}
            trailing={<Badge tone="warning">Reorder</Badge>}
          />
          <ListItem
            title="Souza Agropecuária was blocked"
            subtitle="Agro · pending credit review"
            leading={<Avatar name="Souza Agropecuária" size="sm" />}
            trailing={<Badge tone="danger">Blocked</Badge>}
          />
        </List>
      </Card>
    </Stack>
  );
}

function DashboardView() {
  return (
    <Stack gap={5}>
      <Grid min="320px" gap={4}>
        <Card>
          <CardTitle>Spend by month</CardTitle>
          <p className="text-caption text-ink-secondary">Direct vs indirect, in thousands of USD.</p>
          <BarChart
            data={SPEND_BY_MONTH}
            xKey="month"
            series={[
              { key: 'direct', label: 'Direct' },
              { key: 'indirect', label: 'Indirect' },
            ]}
            stacked
            height={260}
            valueFormatter={(v) => `$${v}k`}
            ariaLabel="Monthly spend split between direct and indirect purchasing"
          />
        </Card>

        <Card>
          <CardTitle>Spend by category</CardTitle>
          <p className="text-caption text-ink-secondary">Share of the current quarter.</p>
          <DonutChart
            data={CATEGORIES.filter((c) => !c.parent).map((c) => ({ name: c.name, value: c.products }))}
            height={260}
            ariaLabel="Share of spend per product category"
          />
        </Card>
      </Grid>

      <Grid min="220px" gap={4}>
        <Kpi label="Purchase orders / month" value="42" delta="rolling 12-month average" tone="info" icon={<ShoppingCart className="size-4" />} />
        <Kpi label="On-time receipt rate" value="94%" delta="+2pp vs Jul" tone="success" icon={<Truck className="size-4" />} />
        <Kpi label="Average approval time" value="31h" delta="target 24h" tone="warning" icon={<Activity className="size-4" />} />
        <Kpi label="Price rule breaches" value="7" delta="across Precificação" tone="danger" icon={<Percent className="size-4" />} />
      </Grid>
    </Stack>
  );
}

/** Every module entry the demo does not implement lands here. */
function ModuleStub({ module, item }: { module: string; item: string }) {
  return (
    <EmptyState
      variant="first-use"
      icon={<Boxes className="size-8" />}
      title={`${item}`}
      description={`This entry belongs to the ${module} module. The demo implements Clientes, Produtos, Categorias and Pedidos de compra — the rest of the rail is here to show the navigation shape, not to be filled in.`}
    />
  );
}

/* ════════════════════════════════════════════════════════════════════════
 * People
 * ══════════════════════════════════════════════════════════════════════ */

interface PersonFormState {
  name: string;
  email: string;
  segment: string;
  region: string | null;
  status: RecordStatus;
  skills: string[];
  since: Date | null;
  notes: string;
  portalAccess: boolean;
  contract: 'clt' | 'pj';
}

const EMPTY_PERSON: PersonFormState = {
  name: '',
  email: '',
  segment: '',
  region: null,
  status: 'active',
  skills: [],
  since: null,
  notes: '',
  portalAccess: true,
  contract: 'clt',
};

function PersonFormPage({
  initial,
  crumb,
  onSubmit,
  onCancel,
}: {
  initial: Person | null;
  crumb: string;
  onSubmit: (data: Omit<Person, 'id'>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<PersonFormState>(
    initial
      ? {
          name: initial.name,
          email: initial.email,
          segment: initial.segment,
          region: initial.region,
          status: initial.status,
          skills: initial.skills,
          since: new Date(`${initial.since}T00:00:00`),
          notes: initial.notes ?? '',
          portalAccess: true,
          contract: 'clt',
        }
      : EMPTY_PERSON,
  );
  const [errors, setErrors] = useState<{ name?: string; email?: string; region?: string }>({});

  const set = <K extends keyof PersonFormState>(k: K, v: PersonFormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = 'Enter the customer name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid contact email.';
    if (!form.region) next.region = 'Select a region.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      segment: form.segment.trim() || 'Não classificado',
      region: form.region!,
      status: form.status,
      skills: form.skills,
      since: (form.since ?? new Date()).toISOString().slice(0, 10),
      notes: form.notes.trim() || undefined,
    });
  };

  return (
    <FormPage
      title={initial ? initial.name : 'New customer'}
      crumb={`${crumb} › ${initial ? 'Edit' : 'New'}`}
      tile={RECORDS.people.tile}
      tileFg={RECORDS.people.tileFg}
      icon={RECORDS.people.icon}
      onCancel={onCancel}
      onSubmit={submit}
      submitLabel={initial ? 'Save record' : 'Create customer'}
    >
      <FormSection title="Identification">
        <Field label="Customer name" htmlFor="pf-name" required error={errors.name}>
          <Input id="pf-name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Company or person" />
        </Field>
        <Field label="Contact email" htmlFor="pf-email" required error={errors.email}>
          <Input id="pf-email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="contato@empresa.com.br" iconStart={<Mail className="size-4" />} />
        </Field>
        <Field label="Segment" htmlFor="pf-segment" hint="Buying profile — drives the default price rule.">
          <Select
            id="pf-segment"
            value={form.segment || null}
            onChange={(v) => set('segment', v)}
            options={SEGMENTS.map((x) => ({ value: x, label: x }))}
            placeholder="Select a segment"
            searchable
          />
        </Field>
        <Field label="Region" htmlFor="pf-region" required error={errors.region}>
          <Select
            id="pf-region"
            value={form.region}
            onChange={(v) => set('region', v)}
            options={REGIONS.map((d) => ({ value: d, label: d }))}
            placeholder="Select a region"
            searchable
          />
        </Field>
      </FormSection>

      <FormSection title="Classification">
        <Field label="Status" htmlFor="pf-status">
          <Select
            id="pf-status"
            value={form.status}
            onChange={(v) => set('status', v as RecordStatus)}
            options={(Object.keys(STATUS_META) as RecordStatus[]).map((x) => ({
              value: x,
              label: STATUS_META[x].label,
            }))}
          />
        </Field>
        <Field label="Customer since" htmlFor="pf-since">
          <DatePicker id="pf-since" value={form.since} onChange={(d) => set('since', d)} placeholder="Pick a date" />
        </Field>
        <FormWide>
          <Field label="Tags" htmlFor="pf-tags" hint="Classifies the account for campaigns and price rules.">
            <MultiSelect
              id="pf-tags"
              value={form.skills}
              onChange={(v) => set('skills', v)}
              options={CUSTOMER_TAGS.map((x) => ({ value: x, label: x }))}
              placeholder="Add tags"
              searchable
            />
          </Field>
        </FormWide>
      </FormSection>

      <FormSection title="Account settings">
        <fieldset className="flex flex-col gap-2 border-0 p-0">
          <legend className="text-body-sm font-medium text-ink">Entity type</legend>
          <Radio id="pf-clt" name="pf-contract" label="Pessoa jurídica" checked={form.contract === 'clt'} onChange={() => set('contract', 'clt')} />
          <Radio id="pf-pj" name="pf-contract" label="Pessoa física" checked={form.contract === 'pj'} onChange={() => set('contract', 'pj')} />
        </fieldset>
        <Switch id="pf-portal" label="Grant customer-portal access" checked={form.portalAccess} onChange={(v) => set('portalAccess', v)} />
        <FormWide>
          <Field label="Notes" htmlFor="pf-notes" hint="Internal context about the account (optional).">
            <Textarea id="pf-notes" value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Notes…" />
          </Field>
        </FormWide>
      </FormSection>
    </FormPage>
  );
}

const PAGE_SIZE = 4;

function PeopleView({ crumb, container }: { crumb: string; container: HTMLElement | null }) {
  const { toast } = useToast();
  const [people, setPeople] = useState(PEOPLE);
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState<string>('all');
  const [view, setView] = useState<'table' | 'cards'>('table');
  const [page, setPage] = useState(1);
  /* 'list' | 'form' — the form is a full screen because the record has ten
   * fields across three sections. Compare with Categorias, which edits in a
   * modal because it has three. */
  const [mode, setMode] = useState<'list' | 'form'>('list');
  const [editing, setEditing] = useState<Person | null>(null);
  const [toDelete, setToDelete] = useState<Person | null>(null);
  const idRef = useRef(PEOPLE.length);

  const filtered = useMemo(
    () =>
      people.filter((p) => {
        const q = query.trim().toLowerCase();
        const matchQ =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.segment.toLowerCase().includes(q);
        return matchQ && (region === 'all' || p.region === region);
      }),
    [people, query, region],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const rowMenu = (p: Person) => [
    { id: 'edit', label: 'Edit', icon: <Pencil className="size-4" />, onSelect: () => { setEditing(p); setMode('form'); } },
    { id: 'del', label: 'Delete', icon: <Trash2 className="size-4" />, danger: true, onSelect: () => setToDelete(p) },
  ];

  const columns: Column<Person>[] = [
    {
      key: 'name',
      header: 'Customer',
      sortable: true,
      render: (p) => (
        <Inline gap={2} align="center">
          <Avatar name={p.name} size="sm" />
          <Stack gap={0}>
            <span className="font-medium text-action">{p.name}</span>
            <span className="text-caption text-action">{p.email}</span>
          </Stack>
        </Inline>
      ),
    },
    { key: 'segment', header: 'Segment', sortable: true, render: (p) => <span className="text-body-sm text-ink">{p.segment}</span> },
    { key: 'region', header: 'Region', sortable: true, render: (p) => <Tag>{p.region}</Tag> },
    { key: 'status', header: 'Status', render: (p) => <Badge tone={STATUS_META[p.status].tone}>{STATUS_META[p.status].label}</Badge> },
    {
      key: 'id',
      header: '',
      align: 'end',
      render: (p) => (
        <Menu align="end" items={rowMenu(p)} trigger={<IconButton aria-label={`Actions for ${p.name}`} size="sm"><MoreVertical className="size-4" /></IconButton>} />
      ),
    },
  ];

  const handleSubmit = (data: Omit<Person, 'id'>) => {
    if (editing) {
      setPeople((list) => list.map((p) => (p.id === editing.id ? { ...data, id: editing.id } : p)));
      toast({ tone: 'success', message: `${data.name} updated.` });
    } else {
      setPeople((list) => [{ ...data, id: `p${++idRef.current}` }, ...list]);
      toast({ tone: 'success', message: `${data.name} added to Clientes.` });
    }
    setMode('list');
    setEditing(null);
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    const removed = toDelete;
    setPeople((list) => list.filter((p) => p.id !== removed.id));
    setToDelete(null);
    toast({
      tone: 'success',
      message: `${removed.name} removed.`,
      action: { label: 'Undo', onClick: () => setPeople((list) => [removed, ...list]) },
    });
  };

  if (mode === 'form') {
    return (
      <PersonFormPage
        initial={editing}
        crumb={crumb}
        onSubmit={handleSubmit}
        onCancel={() => { setMode('list'); setEditing(null); }}
      />
    );
  }

  return (
    <>
      <RecordHeader view="people" crumb={crumb} count={`${filtered.length} de ${people.length}`}>
        <Button variant="secondary" size="sm" iconStart={<Download className="size-4" />}>Export</Button>
        <Button variant="primary" size="sm" iconStart={<Plus className="size-4" />} onClick={() => { setEditing(null); setMode('form'); }}>
          New customer
        </Button>
      </RecordHeader>

      <FilterBar
        actions={
          <SegmentedControl
            value={view}
            onChange={setView}
            options={[{ value: 'table', label: 'List' }, { value: 'cards', label: 'Cards' }]}
          />
        }
      >
        <FilterSearch
          value={query}
          onChange={(v) => { setQuery(v); setPage(1); }}
          label="Search customers"
          placeholder="Nome, e-mail ou segmento…"
        />
        <div className="w-44">
          <Select
            value={region}
            onChange={(v) => { setRegion(v); setPage(1); }}
            options={[{ value: 'all', label: 'Todas as regiões' }, ...REGIONS.map((d) => ({ value: d, label: d }))]}
          />
        </div>
        {(query || region !== 'all') && (
          <Chip onRemove={() => { setQuery(''); setRegion('all'); }}>
            {filtered.length} de {people.length}
          </Chip>
        )}
      </FilterBar>

      <Stack gap={4} className="p-4">
        {filtered.length === 0 ? (
          <EmptyState
            variant="no-results"
            icon={<Inbox className="size-8" />}
            title="No customers match this view"
            description="Adjust the search term or pick another region."
            action={<Button variant="secondary" onClick={() => { setQuery(''); setRegion('all'); }}>Clear filters</Button>}
          />
        ) : view === 'table' ? (
          <Card variant="outlined" className="p-0">
            <Table rowKey={(p) => p.id} columns={columns} rows={visible} selectable density="compact" />
          </Card>
        ) : (
          <Grid min="260px" gap={4}>
            {visible.map((p) => (
              <Card key={p.id}>
                <Inline justify="between" align="start">
                  <Inline gap={2}>
                    <Avatar name={p.name} size="md" />
                    <Stack gap={0}>
                      <CardTitle>{p.name}</CardTitle>
                      <span className="text-caption text-ink-secondary">{p.segment}</span>
                    </Stack>
                  </Inline>
                  <Menu align="end" items={rowMenu(p)} trigger={<IconButton aria-label={`Actions for ${p.name}`} size="sm"><MoreVertical className="size-4" /></IconButton>} />
                </Inline>
                <Inline gap={2}>
                  <Badge tone={STATUS_META[p.status].tone}>{STATUS_META[p.status].label}</Badge>
                  <Tag>{p.region}</Tag>
                </Inline>
                <Inline gap={1}>{p.skills.map((s) => <Tag key={s}>{s}</Tag>)}</Inline>
              </Card>
            ))}
          </Grid>
        )}

        {filtered.length > 0 && (
          <Inline justify="between" align="center" className="flex-wrap">
            <span className="text-caption text-ink-secondary">
              Showing {visible.length} of {filtered.length} records
            </span>
            <Pagination page={current} pageCount={pageCount} onChange={setPage} />
          </Inline>
        )}
      </Stack>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        container={container}
        title={`Delete ${toDelete?.name ?? ''}?`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={confirmDelete}
      >
        The record leaves this list view. You can undo right after.
      </ConfirmDialog>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════
 * Products
 * ══════════════════════════════════════════════════════════════════════ */

function stockTone(p: Product): 'success' | 'warning' | 'danger' {
  if (p.stock === 0) return 'danger';
  if (p.stock < p.reorderPoint) return 'warning';
  return 'success';
}

interface ProductFormState {
  sku: string;
  name: string;
  category: string | null;
  supplier: string | null;
  unit: string | null;
  location: string | null;
  price: string;
  cost: string;
  stock: string;
  reorderPoint: string;
  status: RecordStatus;
  taxable: boolean;
  description: string;
}

const EMPTY_PRODUCT: ProductFormState = {
  sku: '', name: '', category: null, supplier: null, unit: 'un', location: 'CD-01',
  price: '', cost: '', stock: '0', reorderPoint: '0', status: 'draft', taxable: true, description: '',
};

function ProductFormPage({
  initial,
  crumb,
  onSubmit,
  onCancel,
}: {
  initial: Product | null;
  crumb: string;
  onSubmit: (data: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ProductFormState>(
    initial
      ? {
          sku: initial.sku, name: initial.name, category: initial.category,
          supplier: initial.supplier, unit: initial.unit, location: initial.location,
          price: String(initial.price), cost: String(initial.cost),
          stock: String(initial.stock), reorderPoint: String(initial.reorderPoint),
          status: initial.status, taxable: initial.taxable, description: initial.description ?? '',
        }
      : EMPTY_PRODUCT,
  );
  const [errors, setErrors] = useState<{ sku?: string; name?: string; category?: string; price?: string }>({});

  const set = <K extends keyof ProductFormState>(k: K, v: ProductFormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const price = Number(form.price) || 0;
  const cost = Number(form.cost) || 0;
  const margin = price > 0 ? Math.round(((price - cost) / price) * 100) : 0;

  const submit = () => {
    const next: typeof errors = {};
    if (!/^[A-Z]{3}-\d{4}$/.test(form.sku.trim().toUpperCase())) next.sku = 'Use the AAA-0000 format.';
    if (!form.name.trim()) next.name = 'Enter the product name.';
    if (!form.category) next.category = 'Select a category.';
    if (price <= 0) next.price = 'Enter a price above zero.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSubmit({
      sku: form.sku.trim().toUpperCase(),
      name: form.name.trim(),
      category: form.category!,
      supplier: form.supplier ?? 'Nordika Parts',
      unit: form.unit ?? 'un',
      location: form.location ?? 'CD-01',
      price,
      cost,
      stock: Number(form.stock) || 0,
      reorderPoint: Number(form.reorderPoint) || 0,
      status: form.status,
      taxable: form.taxable,
      description: form.description.trim() || undefined,
    });
  };

  return (
    <FormPage
      title={initial ? initial.name : 'New product'}
      crumb={`${crumb} › ${initial ? 'Edit' : 'New'}`}
      tile={RECORDS.products.tile}
      tileFg={RECORDS.products.tileFg}
      icon={RECORDS.products.icon}
      onCancel={onCancel}
      onSubmit={submit}
      submitLabel={initial ? 'Save product' : 'Create product'}
    >
      <FormSection title="Identification">
        <Field label="SKU" htmlFor="rf-sku" required error={errors.sku} hint="Three letters, dash, four digits.">
          <Input id="rf-sku" value={form.sku} onChange={(e) => set('sku', e.target.value)} placeholder="BRG-1042" />
        </Field>
        <Field label="Product name" htmlFor="rf-name" required error={errors.name}>
          <Input id="rf-name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Sealed ball bearing 42mm" />
        </Field>
        <Field label="Category" htmlFor="rf-cat" required error={errors.category}>
          <Select
            id="rf-cat"
            value={form.category}
            onChange={(v) => set('category', v)}
            options={CATEGORIES.filter((c) => !c.parent).map((c) => ({ value: c.name, label: c.name }))}
            placeholder="Select a category"
            searchable
          />
        </Field>
        <Field label="Supplier" htmlFor="rf-sup">
          <Select
            id="rf-sup"
            value={form.supplier}
            onChange={(v) => set('supplier', v)}
            options={SUPPLIERS.map((x) => ({ value: x, label: x }))}
            placeholder="Select a supplier"
            searchable
          />
        </Field>
      </FormSection>

      <FormSection title="Pricing">
        <Field label="Unit price (USD)" htmlFor="rf-price" required error={errors.price}>
          <Input id="rf-price" type="number" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="0.00" />
        </Field>
        <Field label="Unit cost (USD)" htmlFor="rf-cost" hint="Feeds the margin below.">
          <Input id="rf-cost" type="number" step="0.01" value={form.cost} onChange={(e) => set('cost', e.target.value)} placeholder="0.00" />
        </Field>
        <Stack gap={1} justify="center">
          <span className="text-body-sm font-medium text-ink">Gross margin</span>
          <Progress value={Math.max(0, margin)} label={`${margin}% on a ${usd2(price)} list price`} />
        </Stack>
        <Switch id="rf-taxable" label="Taxable item" checked={form.taxable} onChange={(v) => set('taxable', v)} />
      </FormSection>

      <FormSection title="Inventory">
        <Field label="On hand" htmlFor="rf-stock">
          <Input id="rf-stock" type="number" value={form.stock} onChange={(e) => set('stock', e.target.value)} placeholder="0" />
        </Field>
        <Field label="Reorder point" htmlFor="rf-reorder" hint="Below this the item is flagged on Home.">
          <Input id="rf-reorder" type="number" value={form.reorderPoint} onChange={(e) => set('reorderPoint', e.target.value)} placeholder="0" />
        </Field>
        <Field label="Unit of measure" htmlFor="rf-unit">
          <Select id="rf-unit" value={form.unit} onChange={(v) => set('unit', v)} options={PRODUCT_UNITS.map((x) => ({ value: x, label: x }))} />
        </Field>
        <Field label="Warehouse" htmlFor="rf-loc">
          <Select id="rf-loc" value={form.location} onChange={(v) => set('location', v)} options={WAREHOUSES.map((x) => ({ value: x, label: x }))} />
        </Field>
      </FormSection>

      <FormSection title="Publication">
        <Field label="Status" htmlFor="rf-status">
          <Select
            id="rf-status"
            value={form.status}
            onChange={(v) => set('status', v as RecordStatus)}
            options={(Object.keys(STATUS_META) as RecordStatus[]).map((x) => ({ value: x, label: STATUS_META[x].label }))}
          />
        </Field>
        <FormWide>
          <Field label="Description" htmlFor="rf-desc" hint="Shown on marketplace listings (optional).">
            <Textarea id="rf-desc" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Technical description…" />
          </Field>
        </FormWide>
      </FormSection>
    </FormPage>
  );
}

function ProductsView({ crumb, container }: { crumb: string; container: HTMLElement | null }) {
  const { toast } = useToast();
  const [products, setProducts] = useState(PRODUCTS);
  const [cats, setCats] = useState<string[]>([]);
  const [onlyLow, setOnlyLow] = useState(false);
  const [view, setView] = useState<'table' | 'cards'>('cards');
  /* Same rule as Clientes: fourteen fields across four sections earn a page. */
  const [mode, setMode] = useState<'list' | 'form'>('list');
  const [editing, setEditing] = useState<Product | null>(null);
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const idRef = useRef(PRODUCTS.length);

  const roots = CATEGORIES.filter((c) => !c.parent).map((c) => c.name);
  const filtered = products.filter(
    (p) =>
      (cats.length === 0 || cats.includes(p.category)) &&
      (!onlyLow || p.stock < p.reorderPoint),
  );

  const handleSubmit = (data: Omit<Product, 'id'>) => {
    if (editing) {
      setProducts((list) => list.map((x) => (x.id === editing.id ? { ...data, id: editing.id } : x)));
      toast({ tone: 'success', message: `${data.name} updated.` });
    } else {
      setProducts((list) => [{ ...data, id: `r${++idRef.current}` }, ...list]);
      toast({ tone: 'success', message: `${data.name} created.` });
    }
    setMode('list');
    setEditing(null);
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    const removed = toDelete;
    setProducts((list) => list.filter((x) => x.id !== removed.id));
    setToDelete(null);
    toast({
      tone: 'success',
      message: `${removed.name} removed.`,
      action: { label: 'Undo', onClick: () => setProducts((list) => [removed, ...list]) },
    });
  };

  const rowMenu = (r: Product) => [
    { id: 'edit', label: 'Edit', icon: <Pencil className="size-4" />, onSelect: () => { setEditing(r); setMode('form'); } },
    { id: 'del', label: 'Delete', icon: <Trash2 className="size-4" />, danger: true, onSelect: () => setToDelete(r) },
  ];

  const columns: Column<Product>[] = [
    { key: 'sku', header: 'SKU', sortable: true, render: (p) => <span className="font-mono text-caption text-ink">{p.sku}</span> },
    {
      key: 'name',
      header: 'Product',
      sortable: true,
      render: (p) => (
        <Stack gap={0}>
          <span className="font-medium text-action">{p.name}</span>
          <span className="text-caption text-ink-secondary">{p.supplier}</span>
        </Stack>
      ),
    },
    { key: 'category', header: 'Category', render: (p) => <Tag>{p.category}</Tag> },
    { key: 'price', header: 'Unit price', align: 'end', sortable: true, render: (p) => <span className="tabular-nums text-ink">{usd2(p.price)}</span> },
    {
      key: 'stock',
      header: 'Stock',
      align: 'end',
      sortable: true,
      render: (p) => (
        <Inline gap={2} align="center" justify="end">
          <span className="tabular-nums text-ink">{p.stock}</span>
          <Badge tone={stockTone(p)}>
            {p.stock === 0 ? 'Out' : p.stock < p.reorderPoint ? 'Low' : 'OK'}
          </Badge>
        </Inline>
      ),
    },
    { key: 'status', header: 'Status', render: (p) => <Badge tone={STATUS_META[p.status].tone}>{STATUS_META[p.status].label}</Badge> },
    {
      key: 'id',
      header: '',
      align: 'end',
      render: (r) => (
        <Menu align="end" items={rowMenu(r)} trigger={<IconButton aria-label={`Actions for ${r.name}`} size="sm"><MoreVertical className="size-4" /></IconButton>} />
      ),
    },
  ];

  if (mode === 'form') {
    return (
      <ProductFormPage
        initial={editing}
        crumb={crumb}
        onSubmit={handleSubmit}
        onCancel={() => { setMode('list'); setEditing(null); }}
      />
    );
  }

  return (
    <>
      <RecordHeader view="products" crumb={crumb} count={`${filtered.length} de ${products.length}`}>
        <Button variant="secondary" size="sm" iconStart={<Download className="size-4" />}>Import</Button>
        <Button variant="primary" size="sm" iconStart={<Plus className="size-4" />} onClick={() => { setEditing(null); setMode('form'); }}>
          New product
        </Button>
      </RecordHeader>

      <FilterBar
        actions={
          <SegmentedControl
            value={view}
            onChange={setView}
            options={[{ value: 'cards', label: 'Cards' }, { value: 'table', label: 'List' }]}
          />
        }
      >
        {roots.map((c) => (
          <Chip
            key={c}
            selected={cats.includes(c)}
            onClick={() => setCats((list) => (list.includes(c) ? list.filter((x) => x !== c) : [...list, c]))}
          >
            {c}
          </Chip>
        ))}
        <span className="mx-1 h-5 w-px bg-border" aria-hidden />
        <Checkbox id="only-low" label="Abaixo do ponto de reposição" checked={onlyLow} onChange={setOnlyLow} />
      </FilterBar>

      <Stack gap={4} className="p-4">
        {filtered.length === 0 ? (
          <EmptyState
            variant="no-results"
            icon={<Package className="size-8" />}
            title="No products in this view"
            description="Clear the category chips or the reorder filter."
            action={<Button variant="secondary" onClick={() => { setCats([]); setOnlyLow(false); }}>Clear filters</Button>}
          />
        ) : view === 'table' ? (
          <Card variant="outlined" className="p-0">
            <Table rowKey={(p) => p.id} columns={columns} rows={filtered} density="compact" />
          </Card>
        ) : (
          <Grid min="280px" gap={4}>
            {filtered.map((p) => {
              const pct = Math.min(100, Math.round((p.stock / Math.max(p.reorderPoint * 2, 1)) * 100));
              return (
                <Card key={p.id}>
                  <Inline justify="between" align="start">
                    <Stack gap={0}>
                      <span className="font-mono text-caption text-ink-secondary">{p.sku}</span>
                      <CardTitle>{p.name}</CardTitle>
                    </Stack>
                    <Inline gap={1} align="center">
                      <Badge tone={STATUS_META[p.status].tone}>{STATUS_META[p.status].label}</Badge>
                      <Menu align="end" items={rowMenu(p)} trigger={<IconButton aria-label={`Actions for ${p.name}`} size="sm"><MoreVertical className="size-4" /></IconButton>} />
                    </Inline>
                  </Inline>
                  <Inline gap={2}>
                    <Tag>{p.category}</Tag>
                    <span className="text-caption text-ink-secondary">{p.supplier}</span>
                  </Inline>
                  <Progress
                    value={pct}
                    label={`Stock ${p.stock} · reorder at ${p.reorderPoint}`}
                  />
                  <Inline justify="between" align="center" className="border-t border-border pt-3">
                    <span className="text-caption text-ink-secondary">Unit price</span>
                    <span className="text-h3 tabular-nums text-ink">{usd2(p.price)}</span>
                  </Inline>
                </Card>
              );
            })}
          </Grid>
        )}
      </Stack>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        container={container}
        title={`Delete ${toDelete?.name ?? ''}?`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={confirmDelete}
      >
        The product leaves the catalogue. You can undo right after.
      </ConfirmDialog>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════
 * Categories
 * ══════════════════════════════════════════════════════════════════════ */

const TILE_CHOICES = [
  { value: 'bg-slds-blue-50', label: 'Azul' },
  { value: 'bg-slds-teal-50', label: 'Verde-água' },
  { value: 'bg-slds-yellow-80', label: 'Âmbar' },
  { value: 'bg-slds-pink-50', label: 'Rosa' },
  { value: 'bg-slds-cloud-blue-50', label: 'Ciano' },
  { value: 'bg-slds-neutral-50', label: 'Neutro' },
];

/* The MODAL presentation. Three fields plus a colour — a whole screen would be
 * more navigation than the edit is worth, so it stays in place over the list. */
function CategoryModal({
  open,
  initial,
  container,
  onClose,
  onSubmit,
}: {
  open: boolean;
  initial: Category | null;
  container: HTMLElement | null;
  onClose: () => void;
  onSubmit: (data: Omit<Category, 'id'>) => void;
}) {
  const [name, setName] = useState('');
  const [parent, setParent] = useState<string | null>(null);
  const [margin, setMargin] = useState('30');
  const [tile, setTile] = useState(TILE_CHOICES[0].value);
  const [error, setError] = useState<string | undefined>();

  /* Re-seed each time the dialog opens, so editing A then B doesn't show A. */
  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? '');
    setParent(initial?.parent ?? null);
    setMargin(String(initial?.margin ?? 30));
    setTile(initial?.tile ?? TILE_CHOICES[0].value);
    setError(undefined);
  }, [open, initial]);

  const submit = () => {
    if (!name.trim()) {
      setError('Enter the category name.');
      return;
    }
    onSubmit({
      name: name.trim(),
      parent,
      products: initial?.products ?? 0,
      margin: Math.min(100, Math.max(0, Number(margin) || 0)),
      tile,
      tileFg: tile === 'bg-slds-yellow-80' ? NAVY_FG : WHITE_FG,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      container={container}
      title={initial ? `Edit ${initial.name}` : 'New category'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={submit}>
            {initial ? 'Save category' : 'Create category'}
          </Button>
        </>
      }
    >
      <Stack gap={4}>
        <Field label="Category name" htmlFor="cm-name" required error={error}>
          <Input id="cm-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Hydraulics" />
        </Field>
        <Field label="Parent category" htmlFor="cm-parent" hint="Leave empty to create a top-level category.">
          <Select
            id="cm-parent"
            value={parent}
            onChange={(v) => setParent(v === '__none' ? null : v)}
            options={[
              { value: '__none', label: 'No parent (top level)' },
              ...CATEGORIES.filter((c) => !c.parent && c.id !== initial?.id).map((c) => ({ value: c.name, label: c.name })),
            ]}
            placeholder="No parent (top level)"
          />
        </Field>
        <Field label="Target margin (%)" htmlFor="cm-margin">
          <Input id="cm-margin" type="number" min="0" max="100" value={margin} onChange={(e) => setMargin(e.target.value)} />
        </Field>
        <Field label="Tile colour" htmlFor="cm-tile" hint="Identifies the category across the console.">
          <Select id="cm-tile" value={tile} onChange={setTile} options={TILE_CHOICES} />
        </Field>
        <Inline gap={3} align="center">
          <span className={`grid size-10 shrink-0 place-items-center rounded-overlay ${tile} ${tile === 'bg-slds-yellow-80' ? NAVY_FG : WHITE_FG}`}>
            <Tags aria-hidden className="size-5" />
          </span>
          <span className="text-caption text-ink-secondary">Preview of the category tile.</span>
        </Inline>
      </Stack>
    </Modal>
  );
}

function CategoriesView({ crumb, container }: { crumb: string; container: HTMLElement | null }) {
  const { toast } = useToast();
  const [categories, setCategories] = useState(CATEGORIES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [toDelete, setToDelete] = useState<Category | null>(null);
  const idRef = useRef(CATEGORIES.length);

  const handleSubmit = (data: Omit<Category, 'id'>) => {
    if (editing) {
      setCategories((list) => list.map((c) => (c.id === editing.id ? { ...data, id: editing.id } : c)));
      toast({ tone: 'success', message: `${data.name} updated.` });
    } else {
      setCategories((list) => [...list, { ...data, id: `c${++idRef.current}` }]);
      toast({ tone: 'success', message: `${data.name} created.` });
    }
    setModalOpen(false);
    setEditing(null);
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    const removed = toDelete;
    setCategories((list) => list.filter((c) => c.id !== removed.id));
    setToDelete(null);
    toast({
      tone: 'success',
      message: `${removed.name} removed.`,
      action: { label: 'Undo', onClick: () => setCategories((list) => [...list, removed]) },
    });
  };

  return (
    <>
      <RecordHeader view="categories" crumb={crumb} count={`${categories.length} registros`}>
        <Button variant="secondary" size="sm" iconStart={<Settings className="size-4" />}>Manage hierarchy</Button>
        <Button
          variant="primary"
          size="sm"
          iconStart={<Plus className="size-4" />}
          onClick={() => { setEditing(null); setModalOpen(true); }}
        >
          New category
        </Button>
      </RecordHeader>

      <Stack gap={4} className="p-4">
        <Grid min="240px" gap={4}>
          {categories.map((c) => (
            <Card key={c.id}>
              <Inline justify="between" align="start">
                <Inline gap={3} align="center">
                  <span className={`grid size-10 shrink-0 place-items-center rounded-overlay ${c.tile} ${c.tileFg}`}>
                    <Tags aria-hidden className="size-5" />
                  </span>
                  <Stack gap={0}>
                    <CardTitle>{c.name}</CardTitle>
                    <span className="text-caption text-ink-secondary">
                      {c.parent ? `Child of ${c.parent}` : 'Top level'}
                    </span>
                  </Stack>
                </Inline>
                <Menu
                  align="end"
                  items={[
                    { id: 'edit', label: 'Edit', icon: <Pencil className="size-4" />, onSelect: () => { setEditing(c); setModalOpen(true); } },
                    { id: 'del', label: 'Delete', icon: <Trash2 className="size-4" />, danger: true, onSelect: () => setToDelete(c) },
                  ]}
                  trigger={<IconButton aria-label={`Actions for ${c.name}`} size="sm"><MoreVertical className="size-4" /></IconButton>}
                />
              </Inline>
              <Progress value={c.margin} label={`Average margin · ${c.margin}%`} />
              <Inline justify="between" align="center" className="border-t border-border pt-3">
                <span className="text-caption text-ink-secondary">Products</span>
                <span className="text-h3 tabular-nums text-ink">{c.products}</span>
              </Inline>
            </Card>
          ))}
        </Grid>

        <Card>
          <CardTitle>Category rules</CardTitle>
          <Accordion
            mode="single"
            defaultOpen={['approval']}
            items={[
              {
                id: 'approval',
                title: 'Approval thresholds',
                content: (
                  <Prose>
                    <p>
                      Purchase orders above <strong>$50,000</strong> in a top-level category route to
                      the Procurement Lead. Child categories inherit the parent threshold unless they
                      define their own.
                    </p>
                  </Prose>
                ),
              },
              {
                id: 'margin',
                title: 'Margin floor',
                content: (
                  <Prose>
                    <p>
                      A category below its margin floor is flagged on the Home dashboard and blocks new
                      list prices until Finance signs off.
                    </p>
                  </Prose>
                ),
              },
              {
                id: 'reorder',
                title: 'Reorder policy',
                content: (
                  <Prose>
                    <p>
                      Reorder points are recomputed weekly from the trailing 90-day consumption. Items
                      marked <em>Blocked</em> are excluded from the calculation.
                    </p>
                  </Prose>
                ),
              },
            ]}
          />
        </Card>
      </Stack>

      <CategoryModal
        open={modalOpen}
        initial={editing}
        container={container}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        container={container}
        title={`Delete ${toDelete?.name ?? ''}?`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={confirmDelete}
      >
        Products in this category keep their records but lose the classification.
      </ConfirmDialog>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════
 * Orders
 * ══════════════════════════════════════════════════════════════════════ */

function OrdersView({ crumb, container }: { crumb: string; container: HTMLElement | null }) {
  const { toast } = useToast();
  const [orders, setOrders] = useState(ORDERS);
  const [query, setQuery] = useState('');
  const [stage, setStage] = useState<string>('all');
  const [open, setOpen] = useState<Order | null>(null);
  const [toReject, setToReject] = useState<Order | null>(null);

  const advance = (o: Order) => {
    setOrders((list) =>
      list.map((x) => (x.id === o.id ? { ...x, stage: Math.min(x.stage + 1, ORDER_FLOW.length - 1) } : x)),
    );
    toast({ tone: 'success', message: `${o.ref} moved to ${ORDER_FLOW[Math.min(o.stage + 1, ORDER_FLOW.length - 1)].label}.` });
    setOpen(null);
  };

  const reject = () => {
    if (!toReject) return;
    const r = toReject;
    setOrders((list) => list.map((x) => (x.id === r.id ? { ...x, stage: 0 } : x)));
    setToReject(null);
    setOpen(null);
    toast({ tone: 'warning', message: `${r.ref} sent back to Draft.` });
  };

  const visibleOrders = orders.filter((o) => {
    const q = query.trim().toLowerCase();
    const matchQ = !q || o.ref.toLowerCase().includes(q) || o.supplier.toLowerCase().includes(q);
    return matchQ && (stage === 'all' || String(o.stage) === stage);
  });

  const columns: Column<Order>[] = [
    { key: 'ref', header: 'Order', sortable: true, render: (o) => <span className="font-mono text-caption text-action">{o.ref}</span> },
    {
      key: 'supplier',
      header: 'Supplier',
      sortable: true,
      render: (o) => (
        <Inline gap={2} align="center">
          <span className="grid size-7 place-items-center rounded-overlay bg-sunken text-ink-secondary"><Building2 className="size-4" /></span>
          <span className="text-body-sm text-ink">{o.supplier}</span>
        </Inline>
      ),
    },
    { key: 'items', header: 'Items', align: 'end', render: (o) => <span className="tabular-nums text-ink">{o.items}</span> },
    { key: 'total', header: 'Total', align: 'end', sortable: true, render: (o) => <span className="font-medium tabular-nums text-ink">{usd(o.total)}</span> },
    {
      key: 'stage',
      header: 'Stage',
      render: (o) => {
        const tone = o.stage === 0 ? 'neutral' : o.stage === 1 ? 'warning' : o.stage === 4 ? 'success' : 'info';
        return <Badge tone={tone}>{ORDER_FLOW[o.stage].label}</Badge>;
      },
    },
    {
      key: 'id',
      header: '',
      align: 'end',
      render: (o) => (
        <Menu
          align="end"
          items={[
            { id: 'open', label: 'Open record', onSelect: () => setOpen(o) },
            { id: 'advance', label: 'Advance stage', disabled: o.stage === ORDER_FLOW.length - 1, onSelect: () => advance(o) },
            { id: 'reject', label: 'Send back to draft', danger: true, disabled: o.stage === 0, onSelect: () => setToReject(o) },
          ]}
          trigger={<IconButton aria-label={`Actions for ${o.ref}`} size="sm"><MoreVertical className="size-4" /></IconButton>}
        />
      ),
    },
  ];

  return (
    <>
      <RecordHeader view="orders" crumb={crumb} count={`${visibleOrders.length} de ${orders.length}`}>
        <AvatarStack
          max={3}
          items={[
            { name: 'Nordika Parts' },
            { name: 'FluidCore' },
            { name: 'Voltek' },
            { name: 'PetroLine' },
          ]}
        />
        <Button variant="primary" size="sm" iconStart={<Plus className="size-4" />}>New order</Button>
      </RecordHeader>

      <FilterBar>
        <FilterSearch
          value={query}
          onChange={setQuery}
          label="Search purchase orders"
          placeholder="Número ou fornecedor…"
        />
        <div className="w-44">
          <Select
            value={stage}
            onChange={setStage}
            options={[
              { value: 'all', label: 'Todos os estágios' },
              ...ORDER_FLOW.map((f, i) => ({ value: String(i), label: f.label })),
            ]}
          />
        </div>
        {(query || stage !== 'all') && (
          <Chip onRemove={() => { setQuery(''); setStage('all'); }}>
            {visibleOrders.length} de {orders.length}
          </Chip>
        )}
      </FilterBar>

      <Stack gap={4} className="p-4">
        {visibleOrders.length === 0 ? (
          <EmptyState
            variant="no-results"
            icon={<ShoppingCart className="size-8" />}
            title="Nenhum pedido nesta visão"
            description="Ajuste a busca ou escolha outro estágio."
            action={<Button variant="secondary" onClick={() => { setQuery(''); setStage('all'); }}>Limpar filtros</Button>}
          />
        ) : (
          <Card variant="outlined" className="p-0">
            <Table rowKey={(o) => o.id} columns={columns} rows={visibleOrders} density="compact" />
          </Card>
        )}
      </Stack>

      <Drawer
        open={Boolean(open)}
        onClose={() => setOpen(null)}
        container={container}
        title={open?.ref ?? ''}
        side="right"
        size="lg"
        footer={
          open && (
            <Inline justify="end" gap={3}>
              <Button variant="secondary" onClick={() => setToReject(open)} disabled={open.stage === 0}>
                Send back
              </Button>
              <Button variant="primary" onClick={() => advance(open)} disabled={open.stage === ORDER_FLOW.length - 1}>
                Advance stage
              </Button>
            </Inline>
          )
        }
      >
        {open && (
          <Stack gap={5}>
            <Stepper steps={ORDER_FLOW} current={open.stage} />

            <Grid min="180px" gap={4}>
              <Stack gap={0}>
                <span className="text-caption text-ink-secondary">Supplier</span>
                <span className="text-body text-ink">{open.supplier}</span>
              </Stack>
              <Stack gap={0}>
                <span className="text-caption text-ink-secondary">Placed</span>
                <span className="text-body text-ink">{open.placed}</span>
              </Stack>
              <Stack gap={0}>
                <span className="text-caption text-ink-secondary">Total</span>
                <span className="text-body tabular-nums text-ink">{usd(open.total)}</span>
              </Stack>
            </Grid>

            <Stack gap={2}>
              <span className="text-body font-bold text-ink">Line items</span>
              <List>
                {PRODUCTS.slice(0, 3).map((p) => (
                  <ListItem
                    key={p.id}
                    title={p.name}
                    subtitle={`${p.sku} · ${p.category}`}
                    leading={<span className="grid size-8 place-items-center rounded-overlay bg-sunken text-ink-secondary"><Package className="size-4" /></span>}
                    trailing={<span className="tabular-nums text-body-sm text-ink">{usd2(p.price)}</span>}
                  />
                ))}
              </List>
            </Stack>
          </Stack>
        )}
      </Drawer>

      <ConfirmDialog
        open={Boolean(toReject)}
        onClose={() => setToReject(null)}
        container={container}
        title={`Send ${toReject?.ref ?? ''} back to draft?`}
        confirmLabel="Send back"
        tone="danger"
        onConfirm={reject}
      >
        The approval trail is reset and the buyer has to resubmit the order.
      </ConfirmDialog>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════
 * Console
 * ══════════════════════════════════════════════════════════════════════ */

function ErpConsole() {
  /* Overlays portal to <body> by default, which would drop them OUT of the
   * `data-brand` wrapper and render them in the site's theme. Handing them
   * this element keeps them inside the skin. */
  const consoleRef = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  useEffect(() => setContainer(consoleRef.current), []);

  const [route, setRoute] = useState<Route>({ kind: 'top', id: 'home' });
  const [openModule, setOpenModule] = useState<ModuleId>('compras');
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 600);
    return () => clearTimeout(t);
  }, []);

  /* Opening a module from the collapsed rail also expands it — a collapsed
   * rail is a shortcut, not a dead end. */
  const openModuleAndExpand = (id: ModuleId) => {
    setOpenModule(id);
    setNavCollapsed(false);
  };

  const selectItem = (module: ModuleId, item: string) => {
    setOpenModule(module);
    setRoute({ kind: 'item', module, item });
  };

  /* Jump straight to a record view by the entry that owns it — used by the
   * Home banner so "Review orders" lands on Compras › Pedidos de compra. */
  const goToView = (view: RecordView) => {
    for (const m of MODULES) {
      const hit = m.items.find((i) => i.view === view);
      if (hit) return selectItem(m.id, hit.id);
    }
  };

  let crumb = '';
  let content: React.ReactNode = null;

  if (route.kind === 'top') {
    const top = TOP_NAV.find((t) => t.id === route.id)!;
    crumb = top.label;
    content = (
      <>
        <PageHeader
          tile={top.tile}
          tileFg={top.tileFg}
          icon={top.icon}
          title={top.label}
          crumb={crumb}
          description={
            route.id === 'home'
              ? 'Pendências, indicadores do mês e as últimas movimentações da operação.'
              : 'Gasto por mês e por categoria, com os indicadores de desempenho de compras.'
          }
        />
        <div className="p-4">
          {route.id === 'home' ? <HomeView onOpenOrders={() => goToView('orders')} /> : <DashboardView />}
        </div>
      </>
    );
  } else {
    const mod = MODULES.find((m) => m.id === route.module)!;
    const item = mod.items.find((i) => i.id === route.item)!;
    crumb = `${mod.label} › ${item.label}`;
    content =
      item.view === 'people' ? (
        <PeopleView crumb={crumb} container={container} />
      ) : item.view === 'products' ? (
        <ProductsView crumb={crumb} container={container} />
      ) : item.view === 'categories' ? (
        <CategoriesView crumb={crumb} container={container} />
      ) : item.view === 'orders' ? (
        <OrdersView crumb={crumb} container={container} />
      ) : (
        <>
          <PageHeader
            tile="bg-slds-neutral-50"
            tileFg={WHITE_FG}
            icon={mod.icon}
            title={item.label}
            crumb={crumb}
          />
          <div className="p-4">
            <ModuleStub module={mod.label} item={item.label} />
          </div>
        </>
      );
  }

  return (
    /* The whole console runs in the Salesforce skin. `data-brand` is just a
     * set of custom properties, so scoping it to this wrapper re-themes the
     * subtree without touching the docs site around it. */
    <div
      ref={consoleRef}
      data-brand="salesforce"
      className="relative overflow-hidden rounded-surface border border-border bg-page text-ink shadow-lg"
    >
      <ToastProvider container={container}>
      <GlobalHeader
        navCollapsed={navCollapsed}
        onToggleNav={() => setNavCollapsed((v) => !v)}
      />

      <div className="flex items-stretch">
        <ModuleNav
          collapsed={navCollapsed}
          route={route}
          openModule={openModule}
          onOpenModule={openModuleAndExpand}
          onSelect={selectItem}
        />

        <div className="min-w-0 flex-1">
          <TopNav route={route} onSelect={(id) => setRoute({ kind: 'top', id })} />

          {booting ? (
            <Stack gap={4} className="p-4">
              <Grid min="220px" gap={4}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}><Skeleton lines={3} height={16} /></Card>
                ))}
              </Grid>
              <Card><Skeleton lines={6} height={16} /></Card>
            </Stack>
          ) : (
            content
          )}
        </div>
        </div>
      </ToastProvider>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
 * Docs page
 * ══════════════════════════════════════════════════════════════════════ */

export function ErpPage() {
  return (
    <DocPage
      group="Templates"
      title="GOFI ERP - Salesforce theme"
      lead="A supply-chain console built entirely on gofi-ui and rendered in the Salesforce theme: blue app bar, collapsible module rail, list views, and record editing in both presentations — a modal for Categorias, a full page for Clientes and Produtos."
      source="foundations/tokens-web.md"
    >
      <Callout tone="info">
        The console below is wrapped in <code>data-brand="salesforce"</code> — nothing else. The
        surrounding docs site keeps whatever theme you picked in the header, which is the point:
        the theme is a set of custom properties, so it scopes to any subtree.
      </Callout>

      <DocSection title="Console">
        <ErpConsole />
      </DocSection>

      <DocSection title="What it demonstrates">
        <Prose>
          <ul className="flex list-inside list-disc flex-col gap-1">
            <li>
              <strong>Platform shell</strong> — the solid blue app bar (app launcher,
              notifications with <em>Popover</em> + <em>NotificationBadge</em>, avatar <em>Menu</em>),
              uppercase <em>Tabs</em> over a 3px active underline, and the white page-header card
              with breadcrumb, coloured object tile, record count and search.
            </li>
            <li>
              <strong>Module rail</strong> — the nine ERP modules with the records each one owns,
              mirroring <code>.slds-vertical-navigation</code>: the selected row carries a
              brand-coloured left bar. Collapsed, the rail becomes a 56px icon strip that still
              navigates — clicking an icon opens that module and expands it back.
            </li>
            <li>
              <strong>Top navigation is only Home and Dashboard.</strong> Everything record-shaped
              lives in a module: Clientes under Vendas, Produtos and Categorias under Precificação,
              Pedidos de compra under Compras. Entries with a green dot are the four the demo
              implements; the rest render a stub so the navigation reads like a product.
            </li>
            <li>
              <strong>Page header in three bands</strong> — breadcrumb on its own line, then the
              object tile with the title, record count and a one-line description, with the actions
              opposite. Filtering left the header entirely: it gets its own strip below, so the
              title never competes with a text field.
            </li>
            <li>
              <strong>List views</strong> — <em>Table</em> with sorting, selection and compact density,
              switchable to <em>Cards</em> via <em>SegmentedControl</em>, plus search, <em>Select</em>{' '}
              and <em>Chip</em> filters, <em>Pagination</em> and <em>EmptyState</em>.
            </li>
            <li>
              <strong>Two ways to edit, picked by field count.</strong> Categorias has three fields
              and a colour, so it edits in a <em>Modal</em> over the list. Clientes (ten fields) and
              Produtos (fourteen, including a live margin readout) get a full <strong>form page</strong>{' '}
              with titled sections, a two-column grid and actions repeated in a sticky footer. Both
              run the same Field, Input, Select, MultiSelect, DatePicker, Textarea, Radio and Switch,
              and both validate on submit.
            </li>
            <li>
              <strong>Overlays stay inside the theme.</strong> Modal, Drawer, ConfirmDialog and
              ToastProvider portal to <code>&lt;body&gt;</code> by default, which drops them out of a
              scoped <code>data-brand</code> wrapper. They now take a <code>container</code> prop,
              and the console hands them its own element.
            </li>
            <li>
              <strong>Flows</strong> — <em>Stepper</em> for the purchase-order stages,{' '}
              <em>ConfirmDialog</em> for destructive actions and <em>Toast</em> with undo.
            </li>
            <li>
              <strong>The whole palette</strong> — status through Badge tones (success, warning,
              danger, info, neutral), object tiles through the SLDS ramps
              (<code>bg-slds-cloud-blue-50</code>, <code>bg-slds-blue-50</code>,{' '}
              <code>bg-slds-teal-50</code>, <code>bg-slds-yellow-80</code>,{' '}
              <code>bg-slds-purple-50</code>, <code>bg-slds-pink-50</code>), each paired with the
              foreground that clears 4.5:1 on it, and Banner, Progress and Charts on the semantic
              tokens.
            </li>
          </ul>
        </Prose>
      </DocSection>

      <DocSection title="Scoping the theme">
        <Prose>
          <p>
            Any element can carry <code>data-brand</code>. Use the provider when the whole app is
            Salesforce; use a wrapper when only one region is — an embedded console, a partner
            surface, a side-by-side comparison.
          </p>
        </Prose>
      </DocSection>
    </DocPage>
  );
}
