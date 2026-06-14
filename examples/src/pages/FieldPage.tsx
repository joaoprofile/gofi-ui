import { Field } from '@/components/Field';
import { Input } from '@/components/Input';
import { DocPage, DocSection, Example, PropsTable, DoDont, Callout, type PropRow } from '../components';

const fieldProps: PropRow[] = [
  { name: 'label', type: 'string', required: true, description: 'Label always visible — placeholder does NOT replace the label.' },
  { name: 'htmlFor', type: 'string', required: true, description: 'id of the inner control (a11y association via htmlFor).' },
  { name: 'hint', type: 'string', description: 'Neutral supporting text shown below the control.' },
  { name: 'error', type: 'string', description: 'Specific error message. Replaces the hint when present.' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Visual mark (*) + aria-required on the control.' },
  { name: 'children', type: 'ReactNode', required: true, description: 'The form control (Input, Textarea, Select…).' },
];

export function FieldPage() {
  return (
    <DocPage
      group="Form"
      title="Field"
      lead="Required wrapper for every form control. Ensures label, hint, and error are associated via aria."
      source="components/field.md"
    >
      <DocSection title="Default field with hint">
        <Example
          code={`<Field label="Email" htmlFor="email-hint" hint="We use it to send your access.">
  <Input id="email-hint" type="email" placeholder="you@example.com" />
</Field>`}
        >
          <div className="w-full max-w-sm">
            <Field label="Email" htmlFor="email-hint" hint="We use it to send your access.">
              <Input id="email-hint" type="email" placeholder="you@example.com" />
            </Field>
          </div>
        </Example>
      </DocSection>

      <DocSection title="Required field">
        <Example
          code={`<Field label="Full name" htmlFor="nome" required>
  <Input id="nome" type="text" placeholder="John Smith" />
</Field>`}
        >
          <div className="w-full max-w-sm">
            <Field label="Full name" htmlFor="nome" required>
              <Input id="nome" type="text" placeholder="John Smith" />
            </Field>
          </div>
        </Example>
      </DocSection>

      <DocSection title="Error state" description="The error message replaces the hint and activates aria-invalid on the control.">
        <Example
          code={`<Field
  label="Email"
  htmlFor="email-error"
  error="Enter a valid email (e.g. you@example.com)."
  required
>
  <Input id="email-error" type="email" defaultValue="invalid-email" />
</Field>`}
        >
          <div className="w-full max-w-sm">
            <Field
              label="Email"
              htmlFor="email-error"
              error="Enter a valid email (e.g. you@example.com)."
              required
            >
              <Input id="email-error" type="email" defaultValue="invalid-email" />
            </Field>
          </div>
        </Example>
      </DocSection>

      <DocSection title="Valid vs. error state side by side">
        <Example
          code={`<Field label="Password" htmlFor="senha-ok" hint="Minimum of 8 characters.">
  <Input id="senha-ok" type="password" defaultValue="securepassword123" />
</Field>

<Field label="Confirm password" htmlFor="senha-erro" error="Passwords do not match.">
  <Input id="senha-erro" type="password" defaultValue="differentpassword" />
</Field>`}
        >
          <div className="flex w-full max-w-xl flex-col gap-4">
            <Field label="Password" htmlFor="senha-ok" hint="Minimum of 8 characters.">
              <Input id="senha-ok" type="password" defaultValue="securepassword123" />
            </Field>
            <Field label="Confirm password" htmlFor="senha-erro" error="Passwords do not match.">
              <Input id="senha-erro" type="password" defaultValue="differentpassword" />
            </Field>
          </div>
        </Example>
      </DocSection>

      <DocSection title="Note">
        <Callout tone="info">
          The child control (Input, Textarea…) automatically inherits id, aria-invalid,
          aria-required, and aria-describedby from the Field when nested — there is no need
          to duplicate these props manually.
        </Callout>
      </DocSection>

      <DocSection title="Best practices">
        <DoDont
          dos={[
            'Specific, actionable error message: "enter a valid email", not "invalid field".',
            'Error appears after interaction (blur/submit), not while the user types the first character.',
            'Label always visible — placeholder is a complement, not a substitute.',
          ]}
          donts={[
            'Placeholder as label — it disappears on typing and hurts usability.',
            'Error shown only by a red border without explanatory text.',
            'Required field without the required prop (the asterisk and aria-required will not be shown).',
          ]}
        />
      </DocSection>

      <DocSection title="Properties">
        <PropsTable title="FieldProps" rows={fieldProps} />
      </DocSection>
    </DocPage>
  );
}
