import { Inbox, SearchX, CheckCircle2 } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/Button';
import { DocPage, DocSection, Example, PropsTable, DoDont, type PropRow } from '../components';

/* ── Props ── */

const emptyStateProps: PropRow[] = [
  { name: 'title', type: 'string', required: true, description: 'Empty state title (h3 heading).' },
  { name: 'variant', type: "'first-use' | 'no-results' | 'all-done'", default: "'first-use'", description: 'Semantic context of the emptiness — defines the visual tone of the icon.' },
  { name: 'icon', type: 'ReactNode', description: 'Decorative icon (automatic aria-hidden).' },
  { name: 'description', type: 'string', description: 'Short description guiding the next action.' },
  { name: 'action', type: 'ReactNode', description: 'Real CTA (Button or link) below the description.' },
  { name: 'className', type: 'string', description: 'Extra CSS class for the container.' },
];

export function EmptyStatePage() {
  return (
    <DocPage
      group="Containers & Data"
      title="EmptyState"
      lead="Communicates the empty state of a collection or area. Three variants cover the contexts: first use, no results and all done."
      source="components/empty-state.md"
    >
      <DocSection
        title="First use"
        description="The user has not created any item yet — encourage the first action."
      >
        <Example
          align="center"
          code={`<EmptyState
  variant="first-use"
  icon={<Inbox className="size-8" />}
  title="No transactions yet"
  description="Add your first transaction to start tracking your balance."
  action={<Button variant="primary">Add transaction</Button>}
/>`}
        >
          <EmptyState
            variant="first-use"
            icon={<Inbox className="size-8" />}
            title="No transactions yet"
            description="Add your first transaction to start tracking your balance."
            action={<Button variant="primary">Add transaction</Button>}
          />
        </Example>
      </DocSection>

      <DocSection
        title="No results"
        description="The search or filter returned no items — guide the user to adjust the criteria."
      >
        <Example
          align="center"
          code={`<EmptyState
  variant="no-results"
  icon={<SearchX className="size-8" />}
  title="No results found"
  description='We did not find anything for "savings". Try other terms or remove the filters.'
  action={<Button variant="secondary">Clear filters</Button>}
/>`}
        >
          <EmptyState
            variant="no-results"
            icon={<SearchX className="size-8" />}
            title="No results found"
            description='We did not find anything for "savings". Try other terms or remove the filters.'
            action={<Button variant="secondary">Clear filters</Button>}
          />
        </Example>
      </DocSection>

      <DocSection
        title="All done"
        description="The list is empty because the user resolved everything — positive, congratulatory tone."
      >
        <Example
          align="center"
          code={`<EmptyState
  variant="all-done"
  icon={<CheckCircle2 className="size-8" />}
  title="All caught up!"
  description="You have no pending items at the moment. Keep it up."
  action={<Button variant="ghost">View history</Button>}
/>`}
        >
          <EmptyState
            variant="all-done"
            icon={<CheckCircle2 className="size-8" />}
            title="All caught up!"
            description="You have no pending items at the moment. Keep it up."
            action={<Button variant="ghost">View history</Button>}
          />
        </Example>
      </DocSection>

      <DocSection
        title="No action"
        description="When there is nothing the user can do, omit the action."
      >
        <Example
          align="center"
          code={`<EmptyState
  variant="no-results"
  icon={<SearchX className="size-8" />}
  title="No statements available"
  description="The selected period has no recorded movements."
/>`}
        >
          <EmptyState
            variant="no-results"
            icon={<SearchX className="size-8" />}
            title="No statements available"
            description="The selected period has no recorded movements."
          />
        </Example>
      </DocSection>

      <DocSection title="Best practices">
        <DoDont
          dos={[
            'Use specific microcopy — say what is empty and why.',
            'Provide a clear action when the user can resolve the situation.',
            'Use variant="all-done" with a positive tone — reinforce the desired behavior.',
          ]}
          donts={[
            'Do not use generic text like "No data" — say exactly what is missing.',
            'Do not show an action when the user has nothing to do (e.g., a server error).',
            'Do not mix variants — choose the one that best reflects the real context.',
          ]}
        />
      </DocSection>

      <DocSection title="Properties">
        <PropsTable title="EmptyStateProps" rows={emptyStateProps} />
      </DocSection>
    </DocPage>
  );
}
