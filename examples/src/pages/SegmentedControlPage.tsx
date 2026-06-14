import { useState } from 'react';
import { SegmentedControl, type SegmentOption } from '@/components/SegmentedControl';
import { DocPage, DocSection, Example, PropsTable, DoDont, type PropRow } from '../components';

/* ── Demos ── */

const viewOptions: SegmentOption<string>[] = [
  { value: 'list', label: 'List' },
  { value: 'grid', label: 'Grid' },
];

function TwoSegmentDemo() {
  const [view, setView] = useState<string>('list');
  return <SegmentedControl<string> value={view} onChange={setView} options={viewOptions} />;
}

const periodOptions: SegmentOption<string>[] = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
  { value: 'all', label: 'All' },
];

function FourSegmentDemo() {
  const [period, setPeriod] = useState<string>('30d');
  return <SegmentedControl<string> value={period} onChange={setPeriod} options={periodOptions} />;
}

const taskOptions: SegmentOption<string>[] = [
  { value: 'active', label: 'In progress', count: 12 },
  { value: 'done', label: 'Completed', count: 47 },
];

function WithCountDemo() {
  const [status, setStatus] = useState<string>('active');
  return <SegmentedControl<string> value={status} onChange={setStatus} options={taskOptions} />;
}

const typeOptions: SegmentOption<string>[] = [
  { value: 'income', label: 'Income', count: 8 },
  { value: 'expense', label: 'Expenses', count: 23 },
  { value: 'transfer', label: 'Transfers', count: 5 },
];

function ThreeWithCountDemo() {
  const [type, setType] = useState<string>('expense');
  return <SegmentedControl<string> value={type} onChange={setType} options={typeOptions} />;
}

/* ── Props ── */

const segmentOptionProps: PropRow[] = [
  { name: 'value', type: 'T', required: true, description: 'Unique value of the segment.' },
  { name: 'label', type: 'string', required: true, description: 'Label shown on the segment.' },
  { name: 'count', type: 'number', description: 'Count shown next to the label (e.g. items in the category).' },
];

const segmentedControlProps: PropRow[] = [
  { name: 'value', type: 'T', required: true, description: 'Currently selected segment.' },
  { name: 'onChange', type: '(value: T) => void', required: true, description: 'Callback when a segment is selected.' },
  { name: 'options', type: 'SegmentOption<T>[]', required: true, description: 'Between 2 and 4 segments.' },
  { name: 'className', type: 'string', description: 'Extra CSS class for the container.' },
];

export function SegmentedControlPage() {
  return (
    <DocPage
      group="Form"
      title="SegmentedControl"
      lead="Switches between mutually exclusive views or filters in the same place. Keyboard navigation with the ← → arrows. Use only with 2–4 short-label segments."
      source="components/segmented-control.md"
    >
      <DocSection title="2 segments" description="Minimal case — switches between two view modes.">
        <Example
          align="center"
          code={`const [view, setView] = useState<string>('list');

<SegmentedControl<string>
  value={view}
  onChange={setView}
  options={[
    { value: 'list', label: 'List' },
    { value: 'grid', label: 'Grid' },
  ]}
/>`}
        >
          <TwoSegmentDemo />
        </Example>
      </DocSection>

      <DocSection title="4 segments" description="Recommended maximum — labels must be short.">
        <Example
          align="center"
          code={`const [period, setPeriod] = useState<string>('30d');

<SegmentedControl<string>
  value={period}
  onChange={setPeriod}
  options={[
    { value: '7d', label: '7 days' },
    { value: '30d', label: '30 days' },
    { value: '90d', label: '90 days' },
    { value: 'all', label: 'All' },
  ]}
/>`}
        >
          <FourSegmentDemo />
        </Example>
      </DocSection>

      <DocSection title="With count" description="Show count to display how many items exist in each category.">
        <Example
          align="center"
          code={`const [status, setStatus] = useState<string>('active');

<SegmentedControl<string>
  value={status}
  onChange={setStatus}
  options={[
    { value: 'active', label: 'In progress', count: 12 },
    { value: 'done', label: 'Completed', count: 47 },
  ]}
/>`}
        >
          <WithCountDemo />
        </Example>
      </DocSection>

      <DocSection title="3 segments with count">
        <Example
          align="center"
          code={`const [type, setType] = useState<string>('expense');

<SegmentedControl<string>
  value={type}
  onChange={setType}
  options={[
    { value: 'income', label: 'Income', count: 8 },
    { value: 'expense', label: 'Expenses', count: 23 },
    { value: 'transfer', label: 'Transfers', count: 5 },
  ]}
/>`}
        >
          <ThreeWithCountDemo />
        </Example>
      </DocSection>

      <DocSection title="Best practices">
        <DoDont
          dos={[
            'Use short labels (1–2 words) to fit the space.',
            'Prefer SegmentedControl over Tabs when the content changes in place (inline filter).',
            'Use count to give a sense of quantity without opening the view.',
          ]}
          donts={[
            'Do not use more than 4 segments — prefer Select or Tabs.',
            'Do not use it for actions — use Button. SegmentedControl is for navigation/filtering.',
            'Do not mix options with and without count in the same control.',
          ]}
        />
      </DocSection>

      <DocSection title="Properties">
        <PropsTable title="SegmentedControlProps<T>" rows={segmentedControlProps} />
        <PropsTable title="SegmentOption<T>" rows={segmentOptionProps} />
      </DocSection>
    </DocPage>
  );
}
