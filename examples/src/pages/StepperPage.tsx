import { useState } from 'react';
import { Stepper, type Step } from '@/components/Stepper';
import { Button } from '@/components/Button';
import { DocPage, DocSection, Example, PropsTable, DoDont, type PropRow } from '../components';

/* ─── Demo data ─── */

const CHECKOUT_STEPS: Step[] = [
  { id: 'dados', label: 'Personal details' },
  { id: 'endereco', label: 'Address' },
  { id: 'pagamento', label: 'Payment' },
  { id: 'revisao', label: 'Review' },
];

const ERROR_STEPS: Step[] = [
  { id: 'upload', label: 'File upload' },
  { id: 'validacao', label: 'Validation', status: 'error' },
  { id: 'processamento', label: 'Processing' },
  { id: 'conclusao', label: 'Completion' },
];

const VERTICAL_STEPS: Step[] = [
  { id: 'conta', label: 'Create account' },
  { id: 'empresa', label: 'Company details', optional: true },
  { id: 'plano', label: 'Choose plan' },
  { id: 'confirmacao', label: 'Confirmation' },
];

/* ─── Demo: interactive horizontal ─── */

function HorizontalDemo() {
  const [current, setCurrent] = useState(1);

  return (
    <div className="flex w-full flex-col gap-6">
      <Stepper
        steps={CHECKOUT_STEPS}
        current={current}
        onStepClick={(i) => setCurrent(i)}
      />
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
        >
          Back
        </Button>
        <span className="text-body-sm text-ink-secondary">
          Step {current + 1} of {CHECKOUT_STEPS.length}
        </span>
        <Button
          onClick={() => setCurrent((c) => Math.min(CHECKOUT_STEPS.length - 1, c + 1))}
          disabled={current === CHECKOUT_STEPS.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

/* ─── Props ─── */

const stepperProps: PropRow[] = [
  { name: 'steps', type: 'Step[]', required: true, description: 'List of steps in the flow.' },
  { name: 'current', type: 'number', required: true, description: '0-based index of the active step.' },
  { name: 'orientation', type: '"horizontal" | "vertical"', default: '"horizontal"', description: 'Orientation of the stepper.' },
  { name: 'onStepClick', type: '(index: number) => void', description: 'Callback when clicking a completed step (backward navigation).' },
  { name: 'className', type: 'string', description: 'Extra class on the list.' },
];

const stepProps: PropRow[] = [
  { name: 'id', type: 'string', required: true, description: 'Unique identifier of the step.' },
  { name: 'label', type: 'string', required: true, description: 'Descriptive label of the step.' },
  { name: 'optional', type: 'boolean', description: 'Marks the step as optional with a caption.' },
  { name: 'status', type: '"error"', description: 'Shows an error icon and the text "Attention required".' },
];

export function StepperPage() {
  return (
    <DocPage
      group="Containers & Data"
      title="Stepper"
      lead="Sequential multi-step flow with completed, current, next and error states. Horizontal and vertical orientations. Optional backward navigation by click."
      source="components/stepper.md"
    >
      <DocSection title="Interactive horizontal" description="Click completed steps to navigate. Back/Next buttons control the progress.">
        <Example
          code={`const [current, setCurrent] = useState(1);

<Stepper
  steps={[
    { id: 'details', label: 'Personal details' },
    { id: 'address', label: 'Address' },
    { id: 'payment', label: 'Payment' },
    { id: 'review', label: 'Review' },
  ]}
  current={current}
  onStepClick={(i) => setCurrent(i)}
/>`}
        >
          <div className="w-full">
            <HorizontalDemo />
          </div>
        </Example>
      </DocSection>

      <DocSection title="With a step in error" description="status='error' signals that the step needs attention before moving on.">
        <Example
          code={`<Stepper
  steps={[
    { id: 'upload', label: 'File upload' },
    { id: 'validation', label: 'Validation', status: 'error' },
    { id: 'processing', label: 'Processing' },
    { id: 'completion', label: 'Completion' },
  ]}
  current={1}
/>`}
        >
          <div className="w-full">
            <Stepper steps={ERROR_STEPS} current={1} />
          </div>
        </Example>
      </DocSection>

      <DocSection title="Vertical with an optional step" description="Vertical orientation for sidebars or long flows. Optional steps are marked with a caption.">
        <Example
          code={`<Stepper
  orientation="vertical"
  steps={[
    { id: 'account', label: 'Create account' },
    { id: 'company', label: 'Company details', optional: true },
    { id: 'plan', label: 'Choose plan' },
    { id: 'confirmation', label: 'Confirmation' },
  ]}
  current={2}
/>`}
        >
          <Stepper orientation="vertical" steps={VERTICAL_STEPS} current={2} />
        </Example>
      </DocSection>

      <DocSection title="Best practices">
        <DoDont
          dos={[
            'Use short labels in the imperative: "Create account", "Choose plan".',
            'Enable onStepClick to allow correcting previous steps.',
            'Show a textual "Step X of Y" alongside — do not rely on visual position alone.',
            'Use status="error" when detecting a problem before moving on.',
          ]}
          donts={[
            'Do not use more than 6 horizontal steps — break them into vertical groups.',
            'Do not advance automatically without an explicit user action.',
            'Do not use Stepper for general navigation — use Tabs or nav.',
          ]}
        />
      </DocSection>

      <DocSection title="Properties">
        <PropsTable title="StepperProps" rows={stepperProps} />
        <PropsTable title="Step" rows={stepProps} />
      </DocSection>
    </DocPage>
  );
}
