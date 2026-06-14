import { Spinner, Skeleton } from '@/components/Feedback';
import { Inline } from '@/components/Layout';
import { DocPage, DocSection, Example, PropsTable, Callout, type PropRow } from '../components';

const spinnerProps: PropRow[] = [
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Spinner size: 16 / 24 / 32px.' },
  { name: 'label', type: 'string', default: "'Loading'", description: 'Accessible label read by the screen reader.' },
];

const skeletonProps: PropRow[] = [
  { name: 'width', type: 'string | number', description: 'Block width. Accepts a CSS value or a number (px).' },
  { name: 'height', type: 'string | number', default: "'1rem'", description: 'Height of the block or of each line.' },
  { name: 'radius', type: "'sm' | 'md' | 'lg' | 'pill'", default: "'md'", description: 'Border radius of the block.' },
  { name: 'lines', type: 'number', description: 'Renders N stacked lines (last one 75% width).' },
];

export function FeedbackPage() {
  return (
    <DocPage
      group="Atoms"
      title="Loading feedback"
      lead="Spinner for one-off actions; Skeleton for content with a known layout. Never a blank screen during loading."
      source="components/skeleton-spinner.md"
    >
      <DocSection title="Spinner - sizes" description="Use in loading buttons or short overlays without a defined layout.">
        <Example
          align="center"
          code={`<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />`}
        >
          <Inline>
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </Inline>
        </Example>
      </DocSection>

      <DocSection title="Spinner - accessible label" description="The label is visible only to screen readers.">
        <Example
          align="center"
          code={`<Spinner label="Saving data" />`}
        >
          <Spinner label="Saving data" />
        </Example>
      </DocSection>

      <DocSection title="Skeleton - single block" description="Represents a layout element while the real content loads.">
        <Example
          code={`<Skeleton width={200} height={16} />
<Skeleton width="100%" height={48} radius="lg" />
<Skeleton width={48} height={48} radius="pill" />`}
        >
          <div className="flex w-full max-w-xs flex-col gap-3" aria-busy="true">
            <Skeleton width={200} height={16} />
            <Skeleton width="100%" height={48} radius="lg" />
            <Skeleton width={48} height={48} radius="pill" />
          </div>
        </Example>
      </DocSection>

      <DocSection title="Skeleton - multiple lines" description="Simulates a block of text. The last line is 75% shorter.">
        <Example
          code={`<Skeleton lines={4} height={14} />`}
        >
          <div className="w-full max-w-sm" aria-busy="true">
            <Skeleton lines={4} height={14} />
          </div>
        </Example>
      </DocSection>

      <DocSection title="When to use each">
        <Callout tone="info">
          Prefer <strong>Skeleton</strong> when the content layout is known (cards, lists, tables).
          Use <strong>Spinner</strong> for one-off actions without a predicted layout (loading button, short overlay).
        </Callout>
      </DocSection>

      <DocSection title="Properties">
        <PropsTable title="SpinnerProps" rows={spinnerProps} />
        <PropsTable title="SkeletonProps" rows={skeletonProps} />
      </DocSection>
    </DocPage>
  );
}
