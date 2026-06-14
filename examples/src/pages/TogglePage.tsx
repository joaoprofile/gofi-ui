import { useState } from 'react';
import { Checkbox } from '@/components/Toggle';
import { Radio } from '@/components/Toggle';
import { Switch } from '@/components/Toggle';
import { DocPage, DocSection, Example, PropsTable, DoDont, type PropRow } from '../components';

/* ── Demos ── */

function CheckboxDemo() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(true);
  const [c, setC] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <Checkbox id="cb-a" checked={a} onChange={setA} label="Receive email notifications" />
      <Checkbox id="cb-b" checked={b} onChange={setB} label="Accept terms of use" />
      <Checkbox id="cb-c" checked={c} onChange={setC} label="Disabled option" disabled />
    </div>
  );
}

function IndeterminateDemo() {
  const [items, setItems] = useState([false, true, false]);
  const allChecked = items.every(Boolean);
  const someChecked = items.some(Boolean) && !allChecked;

  function toggleAll(checked: boolean) {
    setItems(items.map(() => checked));
  }

  function toggle(i: number, checked: boolean) {
    const next = [...items];
    next[i] = checked;
    setItems(next);
  }

  return (
    <div className="flex flex-col gap-2">
      <Checkbox
        id="cb-all"
        checked={allChecked}
        indeterminate={someChecked}
        onChange={toggleAll}
        label="Select all"
      />
      <div className="ml-6 flex flex-col gap-1">
        {items.map((v, i) => (
          <Checkbox
            key={i}
            id={`cb-item-${i}`}
            checked={v}
            onChange={(checked) => toggle(i, checked)}
            label={`Item ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function RadioDemo() {
  const [value, setValue] = useState('monthly');
  return (
    <fieldset className="flex flex-col gap-2 border-0 p-0">
      <legend className="mb-2 text-body-sm font-medium text-ink">Billing plan</legend>
      <Radio
        id="radio-monthly"
        name="billing"
        checked={value === 'monthly'}
        onChange={() => setValue('monthly')}
        label="Monthly"
      />
      <Radio
        id="radio-annual"
        name="billing"
        checked={value === 'annual'}
        onChange={() => setValue('annual')}
        label="Annual (save 20%)"
      />
      <Radio
        id="radio-lifetime"
        name="billing"
        checked={value === 'lifetime'}
        onChange={() => setValue('lifetime')}
        label="Lifetime"
        disabled
      />
    </fieldset>
  );
}

function SwitchDemo() {
  const [notif, setNotif] = useState(true);
  const [dark, setDark] = useState(false);
  const [beta, setBeta] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <Switch id="sw-notif" checked={notif} onChange={setNotif} label="Push notifications" />
      <Switch id="sw-dark" checked={dark} onChange={setDark} label="Dark mode" />
      <Switch id="sw-beta" checked={beta} onChange={setBeta} label="Beta access (disabled)" disabled />
    </div>
  );
}

/* ── Props ── */

const checkboxProps: PropRow[] = [
  { name: 'id', type: 'string', required: true, description: 'Associates the input with the label via htmlFor.' },
  { name: 'checked', type: 'boolean', required: true, description: 'Checked state (controlled).' },
  { name: 'onChange', type: '(checked: boolean) => void', required: true, description: 'Callback when checked/unchecked.' },
  { name: 'label', type: 'string', required: true, description: 'Visible label associated with the checkbox.' },
  { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Intermediate state — "select all" partially checked.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction.' },
  { name: 'invalid', type: 'boolean', default: 'false', description: 'Applies aria-invalid and an error border.' },
];

const radioProps: PropRow[] = [
  { name: 'id', type: 'string', required: true, description: 'Unique identifier of the radio.' },
  { name: 'checked', type: 'boolean', required: true, description: 'Selected state (controlled).' },
  { name: 'onChange', type: '(checked: boolean) => void', required: true, description: 'Callback when selected.' },
  { name: 'label', type: 'string', required: true, description: 'Visible label of the radio.' },
  { name: 'name', type: 'string', description: 'Groups exclusive radios (same string within the group).' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the radio.' },
  { name: 'invalid', type: 'boolean', default: 'false', description: 'Applies aria-invalid.' },
];

const switchProps: PropRow[] = [
  { name: 'id', type: 'string', required: true, description: 'Associates the input with the label.' },
  { name: 'checked', type: 'boolean', required: true, description: 'On/off state (controlled).' },
  { name: 'onChange', type: '(checked: boolean) => void', required: true, description: 'Callback when toggled.' },
  { name: 'label', type: 'string', required: true, description: 'Descriptive label of the switch effect.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the switch.' },
  { name: 'invalid', type: 'boolean', default: 'false', description: 'Applies aria-invalid and an error tone on the track.' },
];

export function TogglePage() {
  return (
    <DocPage
      group="Form"
      title="Toggle"
      lead="Selection controls: Checkbox for independent choices (0..N), Radio for mutual exclusion (1 of N), Switch for immediate effect."
      source="components/checkbox-radio-switch.md"
    >
      <DocSection title="Checkbox" description="Use for independent options — the user can check several.">
        <Example
          code={`const [accepted, setAccepted] = useState(false);

<Checkbox
  id="cb-termos"
  checked={accepted}
  onChange={setAccepted}
  label="Accept terms of use"
/>`}
        >
          <CheckboxDemo />
        </Example>
      </DocSection>

      <DocSection title="Indeterminate checkbox" description="Useful for 'select all' when only part of the items is checked.">
        <Example
          code={`const allChecked = items.every(Boolean);
const someChecked = items.some(Boolean) && !allChecked;

<Checkbox
  id="cb-all"
  checked={allChecked}
  indeterminate={someChecked}
  onChange={toggleAll}
  label="Select all"
/>`}
        >
          <IndeterminateDemo />
        </Example>
      </DocSection>

      <DocSection title="Radio" description="Use inside <fieldset>+<legend> for groups of mutually exclusive options.">
        <Example
          code={`const [billing, setBilling] = useState('monthly');

<fieldset>
  <legend>Billing plan</legend>
  <Radio
    id="radio-monthly"
    name="billing"
    checked={billing === 'monthly'}
    onChange={() => setBilling('monthly')}
    label="Monthly"
  />
  <Radio
    id="radio-annual"
    name="billing"
    checked={billing === 'annual'}
    onChange={() => setBilling('annual')}
    label="Annual (save 20%)"
  />
</fieldset>`}
        >
          <RadioDemo />
        </Example>
      </DocSection>

      <DocSection title="Switch" description="Use for settings with immediate effect — no confirmation needed.">
        <Example
          code={`const [notif, setNotif] = useState(true);

<Switch
  id="sw-notif"
  checked={notif}
  onChange={setNotif}
  label="Push notifications"
/>`}
        >
          <SwitchDemo />
        </Example>
      </DocSection>

      <DocSection title="Best practices">
        <DoDont
          dos={[
            'Use Radio inside <fieldset>+<legend> for correct a11y.',
            'Use Switch only for immediate actions (auto-save on toggle).',
            'Use Checkbox for independent multiple selections.',
          ]}
          donts={[
            'Do not replace Switch with Checkbox in forms that require confirmation — prefer Checkbox + a "Save" button.',
            'Do not omit the label — placeholder does not replace the label in any control.',
            'Do not use Radio for more than 5 options — prefer Select.',
          ]}
        />
      </DocSection>

      <DocSection title="Properties">
        <PropsTable title="CheckboxProps" rows={checkboxProps} />
        <PropsTable title="RadioProps" rows={radioProps} />
        <PropsTable title="SwitchProps" rows={switchProps} />
      </DocSection>
    </DocPage>
  );
}
