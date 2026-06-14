import { useState } from 'react';
import { Badge, NotificationBadge, Tag, Chip } from '@/components/Badge';
import { Inline } from '@/components/Layout';
import { DocPage, DocSection, Example, PropsTable, DoDont, type PropRow } from '../components';

function ChipDemo() {
  const [selected, setSelected] = useState<string[]>([]);
  const [chips, setChips] = useState(['React', 'TypeScript', 'Tailwind', 'Vite']);

  const toggle = (label: string) =>
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );

  const remove = (label: string) => {
    setChips((prev) => prev.filter((l) => l !== label));
    setSelected((prev) => prev.filter((l) => l !== label));
  };

  return (
    <Inline>
      {chips.map((label) => (
        <Chip
          key={label}
          selected={selected.includes(label)}
          onClick={() => toggle(label)}
          onRemove={() => remove(label)}
        >
          {label}
        </Chip>
      ))}
    </Inline>
  );
}

const badgeProps: PropRow[] = [
  { name: 'tone', type: "'success' | 'warning' | 'danger' | 'info' | 'neutral'", default: "'neutral'", description: 'Semantic color tone.' },
  { name: 'children', type: 'ReactNode', required: true, description: 'Short status label.' },
];

const notificationBadgeProps: PropRow[] = [
  { name: 'count', type: 'number', required: true, description: 'Number of notifications. Shows "99+" above 99.' },
  { name: 'label', type: 'string', description: 'Accessible label. Default: "{count} notifications".' },
];

const tagProps: PropRow[] = [
  { name: 'href', type: 'string', description: 'When provided, renders as an <a>.' },
  { name: 'children', type: 'ReactNode', required: true, description: 'Category/metadata text.' },
];

const chipProps: PropRow[] = [
  { name: 'selected', type: 'boolean', default: 'false', description: 'Selected state — action background + white text.' },
  { name: 'onClick', type: '() => void', description: 'Toggle callback when clicking the chip.' },
  { name: 'onRemove', type: '() => void', description: 'Shows a ✕ button and fires on removal.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all interactions.' },
  { name: 'children', type: 'ReactNode', required: true, description: 'Filter label.' },
];

export function BadgePage() {
  return (
    <DocPage
      group="Atoms"
      title="Badge · Tag · Chip"
      lead="Short labels for status, category and selectable filters. Badge is not interactive; Chip is."
      source="components/badge-tag.md"
    >
      <DocSection title="Badge - status tones" description="One tone per state; don't rely on color alone, include text.">
        <Example
          align="center"
          code={`<Badge tone="success">Active</Badge>
<Badge tone="warning">Pending</Badge>
<Badge tone="danger">Canceled</Badge>
<Badge tone="info">New</Badge>
<Badge tone="neutral">Draft</Badge>`}
        >
          <Badge tone="success">Active</Badge>
          <Badge tone="warning">Pending</Badge>
          <Badge tone="danger">Canceled</Badge>
          <Badge tone="info">New</Badge>
          <Badge tone="neutral">Draft</Badge>
        </Example>
      </DocSection>

      <DocSection title="NotificationBadge" description="Numeric notification counter; aria-label required.">
        <Example
          align="center"
          code={`<NotificationBadge count={3} />
<NotificationBadge count={12} label="12 unread messages" />
<NotificationBadge count={100} />`}
        >
          <NotificationBadge count={3} />
          <NotificationBadge count={12} label="12 unread messages" />
          <NotificationBadge count={100} />
        </Example>
      </DocSection>

      <DocSection title="Tag - category" description="Neutral category label. With href it becomes a link.">
        <Example
          align="center"
          code={`<Tag>Design System</Tag>
<Tag>React</Tag>
<Tag href="/category/finance">Finance</Tag>`}
        >
          <Tag>Design System</Tag>
          <Tag>React</Tag>
          <Tag href="/categoria/financas">Finance</Tag>
        </Example>
      </DocSection>

      <DocSection title="Chip - selectable and removable filter" description="Click to toggle on/off; ✕ to remove from the list.">
        <Example
          align="center"
          code={`const [selected, setSelected] = useState<string[]>([]);
const [chips, setChips] = useState(['React', 'TypeScript', 'Tailwind', 'Vite']);

{chips.map((label) => (
  <Chip
    key={label}
    selected={selected.includes(label)}
    onClick={() => toggle(label)}
    onRemove={() => remove(label)}
  >
    {label}
  </Chip>
))}`}
        >
          <ChipDemo />
        </Example>
      </DocSection>

      <DocSection title="Best practices">
        <DoDont
          dos={[
            'Status tone consistent with the system\'s semantic colors.',
            'NotificationBadge with a descriptive aria-label: "3 unread", not just "3".',
            'Removable chip with aria-label "Remove {label}" on the ✕ button.',
          ]}
          donts={[
            'Badge as a button — use Button for actions.',
            'Long text in a badge (it\'s a short label, not a sentence).',
            'Relying on color alone to convey status — include text.',
          ]}
        />
      </DocSection>

      <DocSection title="Properties">
        <PropsTable title="BadgeProps" rows={badgeProps} />
        <PropsTable title="NotificationBadgeProps" rows={notificationBadgeProps} />
        <PropsTable title="TagProps" rows={tagProps} />
        <PropsTable title="ChipProps" rows={chipProps} />
      </DocSection>
    </DocPage>
  );
}
