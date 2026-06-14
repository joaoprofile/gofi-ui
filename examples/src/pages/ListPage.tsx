import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { List, ListItem } from '@/components/List';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { DocPage, DocSection, Example, PropsTable, DoDont, type PropRow } from '../components';

/* ── Demos ── */

function BasicListDemo() {
  return (
    <div className="w-full max-w-md rounded-lg border border-border overflow-hidden">
      <List>
        <ListItem
          leading={<Avatar name="Anna Carter" size="sm" />}
          title="Anna Carter"
          subtitle="anna@example.com"
          trailing={<ChevronRight className="size-4" />}
          href="#"
        />
        <ListItem
          leading={<Avatar name="Bruno Lee" size="sm" />}
          title="Bruno Lee"
          subtitle="bruno@example.com"
          trailing={<ChevronRight className="size-4" />}
          href="#"
        />
        <ListItem
          leading={<Avatar name="Carla Dias" size="sm" />}
          title="Carla Dias"
          subtitle="carla@example.com"
          trailing={<ChevronRight className="size-4" />}
          href="#"
        />
      </List>
    </div>
  );
}

function WithBadgeDemo() {
  return (
    <div className="w-full max-w-md rounded-lg border border-border overflow-hidden">
      <List>
        <ListItem
          title="June invoice"
          subtitle="Due 07/10"
          trailing={<Badge tone="warning">Pending</Badge>}
        />
        <ListItem
          title="May invoice"
          subtitle="Paid 06/08"
          trailing={<Badge tone="success">Paid</Badge>}
        />
        <ListItem
          title="April invoice"
          subtitle="Overdue 05/10"
          trailing={<Badge tone="danger">Late</Badge>}
        />
      </List>
    </div>
  );
}

function SelectableDemo() {
  const [selected, setSelected] = useState('pix');

  const options = [
    { id: 'pix', label: 'Instant Transfer', subtitle: 'Instant transfer' },
    { id: 'wire', label: 'Wire Transfer', subtitle: 'Up to 1 business day' },
    { id: 'ach', label: 'ACH Transfer', subtitle: 'Up to 2 business days' },
  ];

  return (
    <div className="w-full max-w-md rounded-lg border border-border overflow-hidden">
      <List>
        {options.map((opt) => (
          <ListItem
            key={opt.id}
            title={opt.label}
            subtitle={opt.subtitle}
            selected={selected === opt.id}
            onClick={() => setSelected(opt.id)}
          />
        ))}
      </List>
    </div>
  );
}

function DisabledDemo() {
  return (
    <div className="w-full max-w-md rounded-lg border border-border overflow-hidden">
      <List>
        <ListItem
          leading={<Avatar name="Diego Faria" size="sm" status="online" />}
          title="Diego Faria"
          subtitle="Available"
          trailing={<ChevronRight className="size-4" />}
          href="#"
        />
        <ListItem
          leading={<Avatar name="Eva Santos" size="sm" />}
          title="Eva Santos"
          subtitle="Account deactivated"
          trailing={<ChevronRight className="size-4" />}
          href="#"
          disabled
        />
      </List>
    </div>
  );
}

/* ── Props ── */

const listProps: PropRow[] = [
  { name: 'children', type: 'ReactNode', required: true, description: 'List items — must be ListItem elements.' },
  { name: 'className', type: 'string', description: 'Extra CSS class for the <ul> element.' },
];

const listItemProps: PropRow[] = [
  { name: 'title', type: 'string', required: true, description: 'Main text of the item.' },
  { name: 'subtitle', type: 'string', description: 'Secondary text below the title.' },
  { name: 'leading', type: 'ReactNode', description: 'Element on the left: Avatar, icon, etc.' },
  { name: 'trailing', type: 'ReactNode', description: 'Element on the right: Badge, chevron, meta, etc.' },
  { name: 'href', type: 'string', description: 'Makes the item a link (<a>).' },
  { name: 'onClick', type: '() => void', description: 'Makes the item a clickable button (ignored if href is also passed).' },
  { name: 'selected', type: 'boolean', default: 'false', description: 'Marks the item as selected/active.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction and applies a dimmed appearance.' },
  { name: 'className', type: 'string', description: 'Extra CSS class.' },
];

export function ListPage() {
  return (
    <DocPage
      group="Containers & Data"
      title="List"
      lead="Semantic vertical collection (<ul role='list'>). Each ListItem can be a link, button or static, with optional leading/trailing."
      source="components/list.md"
    >
      <DocSection title="With Avatar and chevron" description="Contact list pattern — leading with Avatar, trailing with a navigation arrow.">
        <Example
          code={`<List>
  <ListItem
    leading={<Avatar name="Anna Carter" size="sm" />}
    title="Anna Carter"
    subtitle="anna@example.com"
    trailing={<ChevronRight className="size-4" />}
    href="/contacts/anna"
  />
</List>`}
        >
          <BasicListDemo />
        </Example>
      </DocSection>

      <DocSection title="With status Badge" description="Trailing with a Badge to communicate the state of each item.">
        <Example
          code={`<List>
  <ListItem
    title="June invoice"
    subtitle="Due 07/10"
    trailing={<Badge tone="warning">Pending</Badge>}
  />
  <ListItem
    title="May invoice"
    subtitle="Paid 06/08"
    trailing={<Badge tone="success">Paid</Badge>}
  />
</List>`}
        >
          <WithBadgeDemo />
        </Example>
      </DocSection>

      <DocSection title="Selectable" description="Use onClick + selected for single-choice lists.">
        <Example
          code={`const [selected, setSelected] = useState('pix');

<List>
  {options.map((opt) => (
    <ListItem
      key={opt.id}
      title={opt.label}
      subtitle={opt.subtitle}
      selected={selected === opt.id}
      onClick={() => setSelected(opt.id)}
    />
  ))}
</List>`}
        >
          <SelectableDemo />
        </Example>
      </DocSection>

      <DocSection title="Disabled item" description="Use disabled for temporarily unavailable items.">
        <Example
          code={`<ListItem
  title="Eva Santos"
  subtitle="Account deactivated"
  href="/contacts/eva"
  disabled
/>`}
        >
          <DisabledDemo />
        </Example>
      </DocSection>

      <DocSection title="Best practices">
        <DoDont
          dos={[
            'Use href for navigation items — the native <a> element guarantees a11y.',
            'Use onClick for actions — the native <button> element guarantees a11y.',
            'Combine leading+trailing to give quick context without opening the item.',
          ]}
          donts={[
            'Do not use <div onClick> on ListItem — always pass href or onClick.',
            'Do not omit title — it is the only required field and anchors the item a11y.',
            'Do not nest interactive lists inside links — it will create <a> inside <a>.',
          ]}
        />
      </DocSection>

      <DocSection title="Properties">
        <PropsTable title="ListProps" rows={listProps} />
        <PropsTable title="ListItemProps" rows={listItemProps} />
      </DocSection>
    </DocPage>
  );
}
