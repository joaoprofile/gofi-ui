import { Plus, ArrowRight } from 'lucide-react';
import { Button, IconButton } from '@/components/Button';
import { Inline } from '@/components/Layout';
import { DocPage, DocSection, Example, PropsTable, DoDont, type PropRow } from '../components';

const buttonProps: PropRow[] = [
  { name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'danger' | 'brand'", default: "'primary'", description: 'Action style. A single primary per visual context.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height: 32 / 40 / 48px.' },
  { name: 'full', type: 'boolean', default: 'false', description: 'Full width (common in forms/mobile).' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a spinner, disables and sets aria-busy. Keeps the label.' },
  { name: 'iconStart', type: 'ReactNode', description: 'Icon before the label (decorative, aria-hidden).' },
  { name: 'iconEnd', type: 'ReactNode', description: 'Icon after the label.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button.' },
  { name: 'type', type: "'button' | 'submit'", default: "'button'", description: 'Native element type.' },
  { name: 'children', type: 'ReactNode', required: true, description: 'Label, with an action verb ("save").' },
];

const iconButtonProps: PropRow[] = [
  { name: 'aria-label', type: 'string', required: true, description: 'Accessible label for the action — required.' },
  { name: 'variant', type: "'solid' | 'ghost' | 'outline'", default: "'ghost'", description: 'Style of the icon-only button.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Target size (32 / 40 / 48px).' },
  { name: 'children', type: 'ReactNode', required: true, description: 'The icon (rendered with aria-hidden).' },
];

export function ButtonPage() {
  return (
    <DocPage
      group="Atoms"
      title="Button"
      lead="User action. The primary is a filled pill with bg-action; contrast affordance over white."
      source="components/button.md"
    >
      <DocSection title="Variants" description="Each variant has a role; don't mix them with the same weight.">
        <Example
          align="center"
          code={`<Button variant="primary">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">See more</Button>
<Button variant="danger">Delete</Button>
<Button variant="brand">Get started</Button>`}
        >
          <Button variant="primary">Save</Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="ghost">See more</Button>
          <Button variant="danger">Delete</Button>
          <Button variant="brand">Get started</Button>
        </Example>
      </DocSection>

      <DocSection title="Sizes">
        <Example
          align="center"
          code={`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}
        >
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Example>
      </DocSection>

      <DocSection title="With icon & states">
        <Example
          align="center"
          code={`<Button iconStart={<Plus className="size-4" />}>Add</Button>
<Button iconEnd={<ArrowRight className="size-4" />}>Next</Button>
<Button loading>Saving</Button>
<Button disabled>Unavailable</Button>`}
        >
          <Button iconStart={<Plus className="size-4" />}>Add</Button>
          <Button iconEnd={<ArrowRight className="size-4" />}>Next</Button>
          <Button loading>Saving</Button>
          <Button disabled>Unavailable</Button>
        </Example>
      </DocSection>

      <DocSection title="Full width">
        <Example
          code={`<Button full>Sign in</Button>`}
        >
          <div className="w-full max-w-sm">
            <Button full>Sign in</Button>
          </div>
        </Example>
      </DocSection>

      <DocSection title="IconButton" description="Icon-only action. aria-label is required.">
        <Example
          align="center"
          code={`<IconButton aria-label="Add" variant="solid"><Plus className="size-5" /></IconButton>
<IconButton aria-label="Next" variant="outline"><ArrowRight className="size-5" /></IconButton>
<IconButton aria-label="Next"><ArrowRight className="size-5" /></IconButton>`}
        >
          <Inline>
            <IconButton aria-label="Add" variant="solid"><Plus className="size-5" /></IconButton>
            <IconButton aria-label="Next" variant="outline"><ArrowRight className="size-5" /></IconButton>
            <IconButton aria-label="Next"><ArrowRight className="size-5" /></IconButton>
          </Inline>
        </Example>
      </DocSection>

      <DocSection title="Best practices">
        <DoDont
          dos={[
            'Use an action verb in the label: "save", "sign in", "add".',
            'A single primary action per visual context.',
            'Keep the label during loading (don\'t swap it for "loading…").',
          ]}
          donts={[
            'White text over the brand variant (#AAD7FF fails AA).',
            'Disabling without explaining why — prefer validating and showing an error.',
            'Using <div onClick> — always the native <button>.',
          ]}
        />
      </DocSection>

      <DocSection title="Properties">
        <PropsTable title="ButtonProps" rows={buttonProps} />
        <PropsTable title="IconButtonProps" rows={iconButtonProps} />
      </DocSection>
    </DocPage>
  );
}
