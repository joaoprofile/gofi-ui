import { useState } from 'react';
import { Table, type Column } from '@/components/Table';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { Progress } from '@/components/Progress';
import { DocPage, DocSection, Example, PropsTable, DoDont, type PropRow } from '../components';

/* ─── Demo types and data ─── */

type StatusTone = 'success' | 'warning' | 'danger' | 'neutral';

interface ProjectRow {
  id: string;
  name: string;
  owner: string;
  status: string;
  statusTone: StatusTone;
  tasks: number;
  totalTasks: number;
  budget: number;
}

const PROJECT_ROWS: ProjectRow[] = [
  { id: '1', name: 'App Redesign', owner: 'Anna Lee', status: 'Active', statusTone: 'success', tasks: 14, totalTasks: 22, budget: 48000 },
  { id: '2', name: 'API Gateway', owner: 'Bruno Souza', status: 'At risk', statusTone: 'warning', tasks: 5, totalTasks: 18, budget: 32000 },
  { id: '3', name: 'Data Lake', owner: 'Carla Melo', status: 'Delayed', statusTone: 'danger', tasks: 2, totalTasks: 12, budget: 95000 },
  { id: '4', name: 'HR Portal', owner: 'Diego Costa', status: 'Completed', statusTone: 'neutral', tasks: 22, totalTasks: 22, budget: 18500 },
  { id: '5', name: 'BI Dashboard', owner: 'Eva Santos', status: 'Active', statusTone: 'success', tasks: 9, totalTasks: 15, budget: 61000 },
];

const PROJECT_COLUMNS: Column<ProjectRow>[] = [
  {
    key: 'name',
    header: 'Project',
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar name={row.owner} size="sm" />
        <div>
          <p className="font-semibold text-ink">{row.name}</p>
          <p className="text-caption text-ink-secondary">{row.owner}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <Badge tone={row.statusTone}>{row.status}</Badge>,
  },
  {
    key: 'tasks',
    header: 'Tasks',
    render: (row) => (
      <Progress value={row.tasks} max={row.totalTasks} showValue label="Tasks" />
    ),
  },
  {
    key: 'budget',
    header: 'Budget',
    sortable: true,
    align: 'end',
    render: (row) =>
      row.budget.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
  },
];

/* ─── Demo: rich table (sort + selectable) ─── */

function RichTableDemo() {
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' }>({ key: 'name', dir: 'asc' });

  const sorted = [...PROJECT_ROWS].sort((a, b) => {
    const v = sort.key === 'budget'
      ? a.budget - b.budget
      : a.name.localeCompare(b.name, 'en-US');
    return sort.dir === 'asc' ? v : -v;
  });

  function handleSort(key: string) {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' },
    );
  }

  return (
    <Table<ProjectRow>
      columns={PROJECT_COLUMNS}
      rows={sorted}
      rowKey={(r) => r.id}
      sort={sort}
      onSort={handleSort}
      selectable
    />
  );
}

/* ─── Props table ─── */

const tableProps: PropRow[] = [
  { name: 'columns', type: 'Column<T>[]', required: true, description: 'Definition of each column: key, header, sort, render.' },
  { name: 'rows', type: 'T[]', required: true, description: 'Data to display.' },
  { name: 'rowKey', type: '(row: T) => string', required: true, description: 'Extracts a unique key per row (React key + selection).' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a 5-row skeleton with aria-busy.' },
  { name: 'sort', type: '{ key: string; dir: "asc" | "desc" }', description: 'Active sort column and direction (controlled).' },
  { name: 'onSort', type: '(key: string) => void', description: 'Called when clicking a sortable header.' },
  { name: 'selectable', type: 'boolean', default: 'false', description: 'Adds a checkbox column with "select all".' },
  { name: 'emptyState', type: 'ReactNode', description: 'Content shown when rows is empty.' },
  { name: 'density', type: '"comfortable" | "compact"', default: '"comfortable"', description: 'Padding density in cells.' },
  { name: 'className', type: 'string', description: 'Extra class on the wrapper.' },
];

const columnProps: PropRow[] = [
  { name: 'key', type: 'keyof T', required: true, description: 'Field of the data object.' },
  { name: 'header', type: 'string', required: true, description: 'Header text.' },
  { name: 'sortable', type: 'boolean', description: 'Enables sorting on this column.' },
  { name: 'align', type: '"start" | "end"', default: '"start"', description: 'Aligns text — use "end" for numbers.' },
  { name: 'render', type: '(row: T) => ReactNode', description: 'Custom cell rendering.' },
];

export function TablePage() {
  return (
    <DocPage
      group="Containers & Data"
      title="Table"
      lead="Generic data table with controlled sort, multiple selection, loading skeleton and empty state. Native HTML semantics with full accessibility."
      source="components/table.md"
    >
      <DocSection title="Full table" description="Columns with avatar+name, status Badge, task Progress and a sortable currency value. Multiple-selection checkboxes.">
        <Example
          code={`<Table<ProjectRow>
  columns={columns}
  rows={sortedRows}
  rowKey={(r) => r.id}
  sort={sort}
  onSort={handleSort}
  selectable
/>`}
        >
          <div className="w-full">
            <RichTableDemo />
          </div>
        </Example>
      </DocSection>

      <DocSection title="Loading state">
        <Example
          code={`<Table columns={columns} rows={[]} rowKey={(r) => r.id} loading />`}
        >
          <div className="w-full">
            <Table<ProjectRow>
              columns={PROJECT_COLUMNS}
              rows={[]}
              rowKey={(r) => r.id}
              loading
            />
          </div>
        </Example>
      </DocSection>

      <DocSection title="Empty state">
        <Example
          code={`<Table
  columns={columns}
  rows={[]}
  rowKey={(r) => r.id}
/>`}
        >
          <div className="w-full">
            <Table<ProjectRow>
              columns={PROJECT_COLUMNS}
              rows={[]}
              rowKey={(r) => r.id}
            />
          </div>
        </Example>
      </DocSection>

      <DocSection title="Compact density">
        <Example
          code={`<Table columns={columns} rows={rows} rowKey={(r) => r.id} density="compact" />`}
        >
          <div className="w-full">
            <Table<ProjectRow>
              columns={PROJECT_COLUMNS}
              rows={PROJECT_ROWS.slice(0, 3)}
              rowKey={(r) => r.id}
              density="compact"
            />
          </div>
        </Example>
      </DocSection>

      <DocSection title="Best practices">
        <DoDont
          dos={[
            'Use render for rich cells: avatar+name, Badge, Progress.',
            'Provide a stable rowKey (database ID) to avoid unnecessary re-renders.',
            'Combine controlled sort: the parent manages the sorting logic.',
            'Use align="end" with tabular-nums on numeric columns.',
          ]}
          donts={[
            'Do not use the array index as rowKey — it breaks selection when reordering.',
            'Do not display more than 8 columns without planned horizontal scroll.',
            'Do not omit emptyState — the user needs to know why there is no data.',
          ]}
        />
      </DocSection>

      <DocSection title="Properties">
        <PropsTable title="TableProps<T>" rows={tableProps} />
        <PropsTable title="Column<T>" rows={columnProps} />
      </DocSection>
    </DocPage>
  );
}
