import { Progress } from '@/components/Progress';
import { DocPage, DocSection, Example, PropsTable, DoDont, type PropRow } from '../components';

const progressProps: PropRow[] = [
  { name: 'value', type: 'number', description: 'Current value. Omit = indeterminate mode.' },
  { name: 'max', type: 'number', default: '100', description: 'Maximum value.' },
  { name: 'variant', type: "'linear' | 'circular'", default: "'linear'", description: 'Shape of the progress bar.' },
  { name: 'label', type: 'string', description: 'Descriptive label (aria-label).' },
  { name: 'showValue', type: 'boolean', description: 'Shows the textual "current / max" value beside it (linear) or "%" in the center (circular).' },
];

export function ProgressPage() {
  return (
    <DocPage
      group="Atoms"
      title="Progress"
      lead="Progress bar or circle. Supports determinate (known %) and indeterminate modes."
      source="components/progress.md"
    >
      <DocSection title="Linear - with value" description="showValue displays the numeric label; don't rely on the bar alone.">
        <Example
          code={`<Progress value={14} max={22} label="Questions answered" showValue />
<Progress value={60} label="Upload" showValue />
<Progress value={33} label="Progress" />`}
        >
          <div className="flex w-full max-w-sm flex-col gap-6">
            <Progress value={14} max={22} label="Questions answered" showValue />
            <Progress value={60} label="Upload" showValue />
            <Progress value={33} label="Progress" />
          </div>
        </Example>
      </DocSection>

      <DocSection title="Linear - indeterminate" description="Operation with no known percentage. Prefer Skeleton for content loading.">
        <Example
          code={`<Progress label="Processing" />`}
        >
          <div className="w-full max-w-sm">
            <Progress label="Processing" />
          </div>
        </Example>
      </DocSection>

      <DocSection title="Linear - 100% complete" description="The fill changes to bg-success when it reaches 100%.">
        <Example
          code={`<Progress value={100} label="Done" showValue />`}
        >
          <div className="w-full max-w-sm">
            <Progress value={100} label="Done" showValue />
          </div>
        </Example>
      </DocSection>

      <DocSection title="Circular" description="Compact progress for upload avatars or tight spaces.">
        <Example
          align="center"
          code={`<Progress variant="circular" value={25} label="Uploading" />
<Progress variant="circular" value={60} label="Progress" showValue />
<Progress variant="circular" value={100} label="Done" showValue />
<Progress variant="circular" label="Loading" />`}
        >
          <Progress variant="circular" value={25} label="Uploading" />
          <Progress variant="circular" value={60} label="Progress" showValue />
          <Progress variant="circular" value={100} label="Done" showValue />
          <Progress variant="circular" label="Loading" />
        </Example>
      </DocSection>

      <DocSection title="Best practices">
        <DoDont
          dos={[
            'Use showValue + label when the number matters ("14 of 22").',
            'Completion color (success) when reaching 100% — already applied automatically.',
            'Always provide a descriptive label for screen readers.',
          ]}
          donts={[
            'A bar without a numeric label in a data context.',
            'Endless indeterminate with no state message.',
            'Using Progress for content loading with a layout — prefer Skeleton.',
          ]}
        />
      </DocSection>

      <DocSection title="Properties">
        <PropsTable title="ProgressProps" rows={progressProps} />
      </DocSection>
    </DocPage>
  );
}
