import { useState } from 'react';
import { Select, MultiSelect, type SelectOption } from '@/components/Select';
import { Field } from '@/components/Field';
import { DocPage, DocSection, Example, PropsTable, DoDont, type PropRow } from '../components';

/* ── Demos ── */

const fruitOptions: SelectOption<string>[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'orange', label: 'Orange' },
];

const cityOptions: SelectOption<string>[] = [
  { value: 'sp', label: 'São Paulo' },
  { value: 'rj', label: 'Rio de Janeiro' },
  { value: 'bh', label: 'Belo Horizonte' },
  { value: 'curitiba', label: 'Curitiba' },
  { value: 'fortaleza', label: 'Fortaleza' },
  { value: 'manaus', label: 'Manaus' },
  { value: 'recife', label: 'Recife' },
  { value: 'salvador', label: 'Salvador' },
];

function BasicDemo() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <div className="w-72">
      <Select<string>
        value={value}
        options={fruitOptions}
        onChange={setValue}
        placeholder="Select a fruit"
      />
    </div>
  );
}

function SearchableDemo() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <div className="w-72">
      <Select<string>
        value={value}
        options={cityOptions}
        onChange={setValue}
        searchable
        placeholder="Search city…"
      />
    </div>
  );
}

function LoadingDemo() {
  return (
    <div className="w-72">
      <Select<string>
        value={null}
        options={[]}
        onChange={() => undefined}
        loading
        placeholder="Loading options…"
      />
    </div>
  );
}

function FieldDemo() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <div className="w-72">
      <Field
        label="Favorite fruit"
        htmlFor="select-field-demo"
        error="Select at least one option."
        required
      >
        <Select<string>
          id="select-field-demo"
          value={value}
          options={fruitOptions}
          onChange={setValue}
          placeholder="Select…"
        />
      </Field>
    </div>
  );
}

/* ── Props ── */

const selectOptionProps: PropRow[] = [
  { name: 'value', type: 'T', required: true, description: 'Unique value of the option (string | number).' },
  { name: 'label', type: 'string', required: true, description: 'Label shown in the list and on the trigger.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the option individually.' },
];

const selectProps: PropRow[] = [
  { name: 'value', type: 'T | null', required: true, description: 'Currently selected value.' },
  { name: 'options', type: 'SelectOption<T>[]', required: true, description: 'List of available options.' },
  { name: 'onChange', type: '(value: T) => void', required: true, description: 'Callback when an option is selected.' },
  { name: 'searchable', type: 'boolean', default: 'false', description: 'Enables filtering by typing (Combobox mode).' },
  { name: 'multiple', type: 'boolean', default: 'false', description: 'Allows selecting multiple values.' },
  { name: 'placeholder', type: 'string', default: "'Select…'", description: 'Text shown when no value is selected.' },
  { name: 'invalid', type: 'boolean', description: 'Overrides the error state (inherited from the Field by default).' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a spinner and disables the list.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the entire control.' },
  { name: 'id', type: 'string', description: 'id of the trigger (inherited from the Field when omitted).' },
  { name: 'className', type: 'string', description: 'Extra CSS class for the container.' },
];

const skillOptions: SelectOption<string>[] = [
  { value: 'react', label: 'React' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'node', label: 'Node.js' },
  { value: 'go', label: 'Go' },
  { value: 'sql', label: 'SQL' },
  { value: 'figma', label: 'Figma' },
];

function MultiDemo() {
  const [value, setValue] = useState<string[]>(['react', 'ts']);
  return (
    <div className="w-72">
      <MultiSelect<string>
        value={value}
        onChange={setValue}
        options={skillOptions}
        searchable
        placeholder="Select skills"
      />
    </div>
  );
}

const multiSelectProps: PropRow[] = [
  { name: 'value', type: 'T[]', required: true, description: 'Selected values.' },
  { name: 'options', type: 'SelectOption<T>[]', required: true, description: 'Available options.' },
  { name: 'onChange', type: '(value: T[]) => void', required: true, description: 'Receives the new array of selected values.' },
  { name: 'searchable', type: 'boolean', default: 'false', description: 'Enables filtering by typing.' },
  { name: 'maxTags', type: 'number', default: '3', description: 'Chips shown before collapsing into "+N".' },
  { name: 'placeholder', type: 'string', default: "'Select…'", description: 'Text when nothing is selected.' },
  { name: 'invalid', type: 'boolean', description: 'Marks the control as invalid.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the control.' },
];

export function SelectPage() {
  return (
    <DocPage
      group="Form"
      title="Select"
      lead="Accessible selection control. Becomes a Combobox with search when searchable. Integrates with Field to inherit label, hint, and error via aria."
      source="components/select.md"
    >
      <DocSection title="Basic" description="Simple Select with a fixed list of options.">
        <Example
          code={`const [value, setValue] = useState<string | null>(null);

<Select<string>
  value={value}
  options={fruitOptions}
  onChange={setValue}
  placeholder="Select a fruit"
/>`}
        >
          <BasicDemo />
        </Example>
      </DocSection>

      <DocSection title="Combobox with search" description="Add searchable to allow filtering by typing.">
        <Example
          code={`const [value, setValue] = useState<string | null>(null);

<Select<string>
  value={value}
  options={cityOptions}
  onChange={setValue}
  searchable
  placeholder="Search city…"
/>`}
        >
          <SearchableDemo />
        </Example>
      </DocSection>

      <DocSection title="Loading state" description="Use loading while the options are being fetched from the API.">
        <Example
          code={`<Select<string>
  value={null}
  options={[]}
  onChange={() => undefined}
  loading
  placeholder="Loading options…"
/>`}
        >
          <LoadingDemo />
        </Example>
      </DocSection>

      <DocSection title="Inside a Field" description="Wrap in a Field to connect label, hint, and error message.">
        <Example
          code={`const [value, setValue] = useState<string | null>(null);

<Field
  label="Favorite fruit"
  htmlFor="select-fruta"
  error="Select at least one option."
  required
>
  <Select<string>
    id="select-fruta"
    value={value}
    options={fruitOptions}
    onChange={setValue}
    placeholder="Select…"
  />
</Field>`}
        >
          <FieldDemo />
        </Example>
      </DocSection>

      <DocSection
        title="Multiple selection (MultiSelect)"
        description="Choose several values; each item becomes a removable chip on the trigger, with “+N” overflow and optional search."
      >
        <Example
          code={`const [value, setValue] = useState<string[]>(['react', 'ts']);

<MultiSelect<string>
  value={value}
  onChange={setValue}
  options={skillOptions}
  searchable
  placeholder="Select skills"
/>`}
        >
          <MultiDemo />
        </Example>
      </DocSection>

      <DocSection title="Best practices">
        <DoDont
          dos={[
            'Always wrap in a <Field> with a visible label and a hint or error message.',
            'Use searchable when the list has more than 7 options.',
            'Use a placeholder with an action verb ("Select…", "Choose…").',
          ]}
          donts={[
            'Do not use the placeholder as a substitute for the label.',
            'Do not render lists with more than ~200 items without virtualization.',
            'Do not hide the error state with invalid={false} manually without a semantic reason.',
          ]}
        />
      </DocSection>

      <DocSection title="Properties">
        <PropsTable title="SelectProps<T>" rows={selectProps} />
        <PropsTable title="SelectOption<T>" rows={selectOptionProps} />
        <PropsTable title="MultiSelectProps<T>" rows={multiSelectProps} />
      </DocSection>
    </DocPage>
  );
}
