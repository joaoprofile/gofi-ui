export interface NavItem {
  id: string;
  label: string;
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

/** Sidebar menu structure — groups components by taxonomy. */
export const NAV: NavGroup[] = [
  {
    group: 'Getting Started',
    items: [
      { id: 'introducao', label: 'Introduction' },
      { id: 'instalacao', label: 'Installation' },
      { id: 'tokens', label: 'Tokens' },
      { id: 'cores', label: 'Colors' },
      { id: 'tipografia', label: 'Typography' },
      { id: 'tema', label: 'Theme & Dark mode' },
    ],
  },
  {
    group: 'Layout',
    items: [{ id: 'layout', label: 'Stack · Inline · Grid · Container' }],
  },
  {
    group: 'Atoms',
    items: [
      { id: 'button', label: 'Button' },
      { id: 'badge', label: 'Badge · Tag · Chip' },
      { id: 'avatar', label: 'Avatar' },
      { id: 'feedback', label: 'Spinner · Skeleton' },
      { id: 'progress', label: 'Progress' },
      { id: 'tooltip', label: 'Tooltip' },
    ],
  },
  {
    group: 'Forms',
    items: [
      { id: 'field', label: 'Field' },
      { id: 'input', label: 'Input' },
      { id: 'textarea', label: 'Textarea' },
      { id: 'select', label: 'Select · Combobox' },
      { id: 'datepicker', label: 'Date & Time' },
      { id: 'toggle', label: 'Checkbox · Radio · Switch' },
      { id: 'segmented-control', label: 'Segmented Control' },
    ],
  },
  {
    group: 'Containers & Data',
    items: [
      { id: 'card', label: 'Card' },
      { id: 'list', label: 'List' },
      { id: 'table', label: 'Table' },
      { id: 'tabs', label: 'Tabs' },
      { id: 'accordion', label: 'Accordion' },
      { id: 'stepper', label: 'Stepper' },
      { id: 'pagination', label: 'Pagination' },
      { id: 'empty-state', label: 'Empty State' },
    ],
  },
  {
    group: 'Overlay & Feedback',
    items: [
      { id: 'modal', label: 'Modal · Drawer · Confirm' },
      { id: 'toast', label: 'Toast' },
      { id: 'banner', label: 'Banner' },
      { id: 'menu', label: 'Menu · Popover' },
    ],
  },
  {
    group: 'Charts',
    items: [{ id: 'charts', label: 'Charts (Recharts)' }],
  },
  {
    group: 'Showcase',
    items: [
      { id: 'showcase', label: 'Overview' },
      { id: 'learn', label: 'GOFI Learn - Courses' },
      { id: 'crm', label: 'GOFI CRM - CRUD' },
      { id: 'financas', label: 'GOFI Finance - Personal' },
      { id: 'vendas', label: 'GOFI Sales - Dashboard' },
      { id: 'indicadores', label: 'GOFI Metrics - KPIs' },
      { id: 'app-shell', label: 'Student Portal' },
    ],
  },
];
