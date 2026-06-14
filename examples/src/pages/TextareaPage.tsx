import { Textarea } from '@/components/Textarea';
import { Field } from '@/components/Field';
import { DocPage, DocSection, Example, PropsTable, DoDont, type PropRow } from '../components';

const textareaProps: PropRow[] = [
  { name: 'invalid', type: 'boolean', description: 'Marks the field as invalid (danger border + aria-invalid).' },
  { name: 'autoResize', type: 'boolean', default: 'false', description: 'Automatically adjusts the height as the content grows.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field.' },
  { name: 'placeholder', type: 'string', description: 'Example text — a complement, never a substitute for the label.' },
  { name: 'rows', type: 'number', description: 'Number of visible rows (initial height).' },
];

export function TextareaPage() {
  return (
    <DocPage
      group="Form"
      title="Textarea"
      lead="Multiline text field. Always use it inside a Field for accessible label, hint, and error."
      source="components/input.md"
    >
      <DocSection title="Default">
        <Example
          code={`<Field label="Message" htmlFor="textarea-default" hint="Be concise and clear.">
  <Textarea id="textarea-default" placeholder="Write your message…" />
</Field>`}
        >
          <div className="w-full max-w-lg">
            <Field label="Message" htmlFor="textarea-default" hint="Be concise and clear.">
              <Textarea id="textarea-default" placeholder="Write your message…" />
            </Field>
          </div>
        </Example>
      </DocSection>

      <DocSection title="Auto-resize" description="The height grows with the content; the minimum height is always preserved.">
        <Example
          code={`<Field label="Description" htmlFor="textarea-autoresize"
  hint="The field grows as you type.">
  <Textarea id="textarea-autoresize" autoResize placeholder="Type to watch it grow…" />
</Field>`}
        >
          <div className="w-full max-w-lg">
            <Field label="Description" htmlFor="textarea-autoresize" hint="The field grows as you type.">
              <Textarea id="textarea-autoresize" autoResize placeholder="Type to watch it grow…" />
            </Field>
          </div>
        </Example>
      </DocSection>

      <DocSection title="Invalid state" description="Combine with the error prop on the Field to show the error message.">
        <Example
          code={`<Field
  label="Justification"
  htmlFor="textarea-invalid"
  error="The justification must be at least 20 characters."
>
  <Textarea id="textarea-invalid" defaultValue="Short" />
</Field>`}
        >
          <div className="w-full max-w-lg">
            <Field
              label="Justification"
              htmlFor="textarea-invalid"
              error="The justification must be at least 20 characters."
            >
              <Textarea id="textarea-invalid" defaultValue="Short" />
            </Field>
          </div>
        </Example>
      </DocSection>

      <DocSection title="Required and disabled">
        <Example
          code={`<Field label="Notes" htmlFor="textarea-required" required>
  <Textarea id="textarea-required" placeholder="Required fields have an asterisk…" />
</Field>

<Field label="History" htmlFor="textarea-disabled">
  <Textarea id="textarea-disabled" defaultValue="Read-only field." disabled />
</Field>`}
        >
          <div className="flex w-full max-w-lg flex-col gap-4">
            <Field label="Notes" htmlFor="textarea-required" required>
              <Textarea id="textarea-required" placeholder="Required fields have an asterisk…" />
            </Field>
            <Field label="History" htmlFor="textarea-disabled">
              <Textarea id="textarea-disabled" defaultValue="Read-only field." disabled />
            </Field>
          </div>
        </Example>
      </DocSection>

      <DocSection title="Best practices">
        <DoDont
          dos={[
            'Always wrap the Textarea in a Field with a visible label.',
            'Use autoResize for fields where the content can grow (descriptions, comments).',
            'Provide a hint when the format or character limit matters.',
          ]}
          donts={[
            'Placeholder as label — it disappears on typing and hurts accessibility.',
            'A fixed-height Textarea that is too small for the expected content.',
            'Error shown only by a red border without a text message.',
          ]}
        />
      </DocSection>

      <DocSection title="Properties">
        <PropsTable title="TextareaProps" rows={textareaProps} />
      </DocSection>
    </DocPage>
  );
}
