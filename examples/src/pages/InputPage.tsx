import { useState } from 'react';
import { Eye, EyeOff, Mail, Search, X } from 'lucide-react';
import { Input } from '@/components/Input';
import { Field } from '@/components/Field';
import { DocPage, DocSection, Example, PropsTable, DoDont, type PropRow } from '../components';

function PasswordInput() {
  const [show, setShow] = useState(false);
  return (
    <Field label="Password" htmlFor="input-password" hint="Minimum of 8 characters.">
      <Input
        id="input-password"
        type={show ? 'text' : 'password'}
        placeholder="••••••••"
        iconEnd={
          <button
            type="button"
            aria-label={show ? 'Hide password' : 'Show password'}
            onClick={() => setShow((v) => !v)}
            className="inline-flex items-center text-ink-secondary hover:text-ink"
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        }
      />
    </Field>
  );
}

function SearchInput() {
  const [value, setValue] = useState('');
  return (
    <Input
      id="input-search"
      type="search"
      placeholder="Search students…"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      iconStart={<Search className="size-4" />}
      iconEnd={
        value ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setValue('')}
            className="inline-flex items-center text-ink-secondary hover:text-ink"
          >
            <X className="size-4" />
          </button>
        ) : undefined
      }
    />
  );
}

const inputProps: PropRow[] = [
  { name: 'type', type: 'string', default: "'text'", description: 'Native input type (text, email, password, search, tel, url, number…).' },
  { name: 'invalid', type: 'boolean', description: 'Marks the field as invalid (danger border + aria-invalid).' },
  { name: 'iconStart', type: 'ReactNode', description: 'Icon before the text (decorative, aria-hidden).' },
  { name: 'iconEnd', type: 'ReactNode', description: 'Icon/action after the text (e.g. show password, clear).' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field.' },
  { name: 'placeholder', type: 'string', description: 'Example text — a complement, never a substitute for the label.' },
];

export function InputPage() {
  return (
    <DocPage
      group="Form"
      title="Input"
      lead="Text input. Always use it inside a Field to ensure accessible label, hint, and error."
      source="components/input.md"
    >
      <DocSection title="Types" description="The correct type activates the right keyboard on mobile and the browser's autofill.">
        <Example
          code={`<Field label="Name" htmlFor="input-text">
  <Input id="input-text" type="text" placeholder="John Smith" />
</Field>
<Field label="Email" htmlFor="input-email">
  <Input id="input-email" type="email" placeholder="you@example.com"
    iconStart={<Mail className="size-4" />} />
</Field>`}
        >
          <div className="flex w-full max-w-xl flex-col gap-4">
            <Field label="Name" htmlFor="input-text">
              <Input id="input-text" type="text" placeholder="John Smith" />
            </Field>
            <Field label="Email" htmlFor="input-email">
              <Input
                id="input-email"
                type="email"
                placeholder="you@example.com"
                iconStart={<Mail className="size-4" />}
              />
            </Field>
          </div>
        </Example>
      </DocSection>

      <DocSection title="Password with show/hide" description="The iconEnd button toggles visibility with a descriptive aria-label.">
        <Example
          code={`function PasswordInput() {
  const [show, setShow] = useState(false);
  return (
    <Field label="Password" htmlFor="input-password" hint="Minimum of 8 characters.">
      <Input
        id="input-password"
        type={show ? 'text' : 'password'}
        placeholder="••••••••"
        iconEnd={
          <button type="button" aria-label={show ? 'Hide password' : 'Show password'}
            onClick={() => setShow((v) => !v)}>
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        }
      />
    </Field>
  );
}`}
        >
          <div className="w-full max-w-sm">
            <PasswordInput />
          </div>
        </Example>
      </DocSection>

      <DocSection title="Search with clear" description="iconStart for the magnifier icon; iconEnd with a ✕ button while typing.">
        <Example
          code={`<Input
  type="search"
  placeholder="Search students…"
  iconStart={<Search className="size-4" />}
  iconEnd={value ? <button aria-label="Clear search"><X className="size-4" /></button> : undefined}
/>`}
        >
          <div className="w-full max-w-sm">
            <SearchInput />
          </div>
        </Example>
      </DocSection>

      <DocSection title="Invalid state" description="The invalid prop activates a danger border and aria-invalid. Combine with Field error for the message.">
        <Example
          code={`<Field label="Tax ID" htmlFor="input-invalid" error="Invalid tax ID — use numbers only.">
  <Input id="input-invalid" type="text" defaultValue="123.abc" />
</Field>`}
        >
          <div className="w-full max-w-sm">
            <Field label="Tax ID" htmlFor="input-invalid" error="Invalid tax ID — use numbers only.">
              <Input id="input-invalid" type="text" defaultValue="123.abc" />
            </Field>
          </div>
        </Example>
      </DocSection>

      <DocSection title="Disabled">
        <Example
          code={`<Field label="Access code" htmlFor="input-disabled">
  <Input id="input-disabled" type="text" defaultValue="GOFI-2024" disabled />
</Field>`}
        >
          <div className="w-full max-w-sm">
            <Field label="Access code" htmlFor="input-disabled">
              <Input id="input-disabled" type="text" defaultValue="GOFI-2024" disabled />
            </Field>
          </div>
        </Example>
      </DocSection>

      <DocSection title="Best practices">
        <DoDont
          dos={[
            'Always wrap the Input in a Field with a visible label.',
            'Use the correct type (email, tel, number) to improve the mobile keyboard and autofill.',
            'Validate on blur or submit — not on every keystroke.',
          ]}
          donts={[
            'Placeholder as label — it disappears on typing and hurts accessibility.',
            'Validating on every keystroke while the user is still typing.',
            'Using a generic iconEnd without an aria-label when it is a button.',
          ]}
        />
      </DocSection>

      <DocSection title="Properties">
        <PropsTable title="InputProps" rows={inputProps} />
      </DocSection>
    </DocPage>
  );
}
