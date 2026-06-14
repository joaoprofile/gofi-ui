import { useState } from 'react';
import { Pagination } from '@/components/Pagination';
import { DocPage, DocSection, Example, PropsTable, DoDont, type PropRow } from '../components';

/* ── Demos ── */

const ITEMS_PER_PAGE = 10;
const TOTAL_ITEMS = 240;
const PAGE_COUNT = Math.ceil(TOTAL_ITEMS / ITEMS_PER_PAGE);

function BasicDemo() {
  const [page, setPage] = useState(1);
  const start = (page - 1) * ITEMS_PER_PAGE + 1;
  const end = Math.min(page * ITEMS_PER_PAGE, TOTAL_ITEMS);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-body-sm text-ink-secondary">
        Showing <strong className="text-ink">{start}–{end}</strong> of{' '}
        <strong className="text-ink">{TOTAL_ITEMS}</strong> transactions
      </p>
      <Pagination page={page} pageCount={PAGE_COUNT} onChange={setPage} />
    </div>
  );
}

function FewPagesDemo() {
  const [page, setPage] = useState(1);
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-body-sm text-ink-secondary">
        Page <strong className="text-ink">{page}</strong> of <strong className="text-ink">5</strong>
      </p>
      <Pagination page={page} pageCount={5} onChange={setPage} />
    </div>
  );
}

function WideDemo() {
  const [page, setPage] = useState(7);
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-body-sm text-ink-secondary">
        Page <strong className="text-ink">{page}</strong> of <strong className="text-ink">24</strong>
      </p>
      <Pagination page={page} pageCount={24} onChange={setPage} siblingCount={2} />
    </div>
  );
}

/* ── Props ── */

const paginationProps: PropRow[] = [
  { name: 'page', type: 'number', required: true, description: 'Current page (1-based).' },
  { name: 'pageCount', type: 'number', required: true, description: 'Total number of pages.' },
  { name: 'onChange', type: '(page: number) => void', required: true, description: 'Called with the new page when navigating.' },
  { name: 'siblingCount', type: 'number', default: '1', description: 'Number of sibling pages around the current page.' },
  { name: 'className', type: 'string', description: 'Extra CSS class for the <nav>.' },
];

export function PaginationPage() {
  return (
    <DocPage
      group="Containers & Data"
      title="Pagination"
      lead="Page navigation through a collection. Renders <nav aria-label='Pagination'> with a semantic list, previous/next buttons and automatic ellipsis."
      source="components/pagination.md"
    >
      <DocSection
        title="Pattern with counter"
        description="Show 'X–Y of N' next to the pagination to give the user context."
      >
        <Example
          align="center"
          code={`const ITEMS_PER_PAGE = 10;
const TOTAL_ITEMS = 240;
const PAGE_COUNT = Math.ceil(TOTAL_ITEMS / ITEMS_PER_PAGE);

const [page, setPage] = useState(1);
const start = (page - 1) * ITEMS_PER_PAGE + 1;
const end = Math.min(page * ITEMS_PER_PAGE, TOTAL_ITEMS);

<p>Showing {start}–{end} of {TOTAL_ITEMS} transactions</p>
<Pagination page={page} pageCount={PAGE_COUNT} onChange={setPage} />`}
        >
          <BasicDemo />
        </Example>
      </DocSection>

      <DocSection title="Few pages" description="With a small pageCount, all pages are shown without ellipsis.">
        <Example
          align="center"
          code={`const [page, setPage] = useState(1);

<Pagination page={page} pageCount={5} onChange={setPage} />`}
        >
          <FewPagesDemo />
        </Example>
      </DocSection>

      <DocSection
        title="Expanded siblingCount"
        description="Increase siblingCount to show more pages around the current one."
      >
        <Example
          align="center"
          code={`const [page, setPage] = useState(7);

<Pagination
  page={page}
  pageCount={24}
  onChange={setPage}
  siblingCount={2}
/>`}
        >
          <WideDemo />
        </Example>
      </DocSection>

      <DocSection title="Best practices">
        <DoDont
          dos={[
            'Always show the "X–Y of N" counter alongside the pagination.',
            'Reset scroll to the top when changing pages.',
            'Prefer pageCount derived from Math.ceil(total / perPage) on the server.',
          ]}
          donts={[
            'Do not use pagination for lists with fewer than 20 items — use scrolling.',
            'Do not jump pages without updating the URL (it would break the browser back button).',
            'Do not render Pagination with pageCount <= 1 — the component already returns null.',
          ]}
        />
      </DocSection>

      <DocSection title="Properties">
        <PropsTable title="PaginationProps" rows={paginationProps} />
      </DocSection>
    </DocPage>
  );
}
