import { useState } from 'react';
import { Tabs, TabPanel } from '@/components/Tabs';
import { DocPage, DocSection, Example, PropsTable, DoDont, type PropRow } from '../components';

/* ─── Demo: underline with content ─── */

function UnderlineDemo() {
  const [active, setActive] = useState('visao-geral');
  return (
    <Tabs
      value={active}
      onChange={setActive}
      tabs={[
        { id: 'visao-geral', label: 'Overview' },
        { id: 'atividade', label: 'Activity', badge: 4 },
        { id: 'configuracoes', label: 'Settings' },
        { id: 'arquivados', label: 'Archived', disabled: true },
      ]}
    >
      <TabPanel tabId="visao-geral" activeTabId={active} className="pt-4">
        <p className="text-body text-ink-secondary">Project overview panel with metrics and charts.</p>
      </TabPanel>
      <TabPanel tabId="atividade" activeTabId={active} className="pt-4">
        <p className="text-body text-ink-secondary">4 recent events recorded in the last 24 hours.</p>
      </TabPanel>
      <TabPanel tabId="configuracoes" activeTabId={active} className="pt-4">
        <p className="text-body text-ink-secondary">Adjust permissions, integrations and project preferences.</p>
      </TabPanel>
      <TabPanel tabId="arquivados" activeTabId={active} className="pt-4">
        <p className="text-body text-ink-secondary">Archived items.</p>
      </TabPanel>
    </Tabs>
  );
}

/* ─── Demo: pill ─── */

function PillDemo() {
  const [active, setActive] = useState('semana');
  return (
    <Tabs
      value={active}
      onChange={setActive}
      variant="pill"
      tabs={[
        { id: 'dia', label: 'Day' },
        { id: 'semana', label: 'Week' },
        { id: 'mes', label: 'Month' },
        { id: 'ano', label: 'Year' },
      ]}
    />
  );
}

/* ─── Demo: vertical ─── */

function VerticalDemo() {
  const [active, setActive] = useState('perfil');
  return (
    <Tabs
      value={active}
      onChange={setActive}
      variant="vertical"
      tabs={[
        { id: 'perfil', label: 'Profile' },
        { id: 'seguranca', label: 'Security' },
        { id: 'notificacoes', label: 'Notifications' },
        { id: 'faturamento', label: 'Billing' },
      ]}
    >
      <TabPanel tabId="perfil" activeTabId={active}>
        <p className="text-body text-ink-secondary">Edit name, photo and contact information.</p>
      </TabPanel>
      <TabPanel tabId="seguranca" activeTabId={active}>
        <p className="text-body text-ink-secondary">Change password and set up two-factor authentication.</p>
      </TabPanel>
      <TabPanel tabId="notificacoes" activeTabId={active}>
        <p className="text-body text-ink-secondary">Choose which alerts to receive by email and push.</p>
      </TabPanel>
      <TabPanel tabId="faturamento" activeTabId={active}>
        <p className="text-body text-ink-secondary">Manage plan, payment method and history.</p>
      </TabPanel>
    </Tabs>
  );
}

/* ─── Props ─── */

const tabsProps: PropRow[] = [
  { name: 'value', type: 'string', required: true, description: 'ID of the active tab (controlled).' },
  { name: 'onChange', type: '(id: string) => void', required: true, description: 'Called when a different tab is selected.' },
  { name: 'tabs', type: 'TabItem[]', required: true, description: 'List of tabs to render.' },
  { name: 'variant', type: '"underline" | "pill" | "vertical"', default: '"underline"', description: 'Visual variant.' },
  { name: 'children', type: 'ReactNode', description: 'Content panels — use <TabPanel>.' },
  { name: 'className', type: 'string', description: 'Extra class on the tablist.' },
];

const tabItemProps: PropRow[] = [
  { name: 'id', type: 'string', required: true, description: 'Unique tab identifier.' },
  { name: 'label', type: 'string', required: true, description: 'Visible label.' },
  { name: 'badge', type: 'number', description: 'Notification counter shown on the tab.' },
  { name: 'disabled', type: 'boolean', description: 'Disables the tab for interaction.' },
];

const tabPanelProps: PropRow[] = [
  { name: 'tabId', type: 'string', required: true, description: 'ID of the corresponding tab.' },
  { name: 'activeTabId', type: 'string', required: true, description: 'ID of the currently active tab — passed by the parent.' },
  { name: 'children', type: 'ReactNode', required: true, description: 'Panel content.' },
];

export function TabsPage() {
  return (
    <DocPage
      group="Containers & Data"
      title="Tabs"
      lead="Tab navigation with underline, pill and vertical variants. Supports badge, disabled tab, content panels and full keyboard support (←→ / ↑↓, Home, End)."
      source="components/tabs.md"
    >
      <DocSection title="Underline (default)" description="Bottom-border indicator. Ideal in section headers. Supports badge and disabled tab.">
        <Example
          code={`const [active, setActive] = useState('overview');

<Tabs
  value={active}
  onChange={setActive}
  tabs={[
    { id: 'overview', label: 'Overview' },
    { id: 'activity', label: 'Activity', badge: 4 },
    { id: 'settings', label: 'Settings' },
    { id: 'archived', label: 'Archived', disabled: true },
  ]}
>
  <TabPanel tabId="overview" activeTabId={active} className="pt-4">
    Project overview panel.
  </TabPanel>
  <TabPanel tabId="activity" activeTabId={active} className="pt-4">
    4 recent events recorded.
  </TabPanel>
  <TabPanel tabId="settings" activeTabId={active} className="pt-4">
    Adjust permissions and preferences.
  </TabPanel>
</Tabs>`}
        >
          <div className="w-full">
            <UnderlineDemo />
          </div>
        </Example>
      </DocSection>

      <DocSection title="Pill" description="Tabs in a highlighted pill. Suitable for filters and period selectors.">
        <Example
          align="center"
          code={`<Tabs
  value={active}
  onChange={setActive}
  variant="pill"
  tabs={[
    { id: 'day', label: 'Day' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' },
  ]}
/>`}
        >
          <PillDemo />
        </Example>
      </DocSection>

      <DocSection title="Vertical" description="Side list with content on the right. Common on settings pages.">
        <Example
          code={`<Tabs
  value={active}
  onChange={setActive}
  variant="vertical"
  tabs={[
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' },
  ]}
>
  <TabPanel tabId="profile" activeTabId={active}>
    Edit name, photo and contact information.
  </TabPanel>
</Tabs>`}
        >
          <div className="w-full">
            <VerticalDemo />
          </div>
        </Example>
      </DocSection>

      <DocSection title="Best practices">
        <DoDont
          dos={[
            'Keep the active state in the parent — Tabs is controlled.',
            'Use badge for unread item counters, not for status.',
            'Prefer short labels (1–2 words) so they fit on smaller screens.',
            'Pass <TabPanel> as a child of <Tabs> for automatic aria association.',
          ]}
          donts={[
            'Do not nest Tabs inside Tabs — it confuses the navigation hierarchy.',
            'Do not use tabs for sequential flows — use Stepper.',
            'Do not omit tabId/activeTabId on TabPanel — the native hidden depends on them.',
          ]}
        />
      </DocSection>

      <DocSection title="Properties">
        <PropsTable title="TabsProps" rows={tabsProps} />
        <PropsTable title="TabItem" rows={tabItemProps} />
        <PropsTable title="TabPanelProps" rows={tabPanelProps} />
      </DocSection>
    </DocPage>
  );
}
