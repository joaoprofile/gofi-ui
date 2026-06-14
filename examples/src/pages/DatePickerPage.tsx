import { useState } from 'react';
import {
  DatePicker,
  DateRangePicker,
  DateTimePicker,
  TimePicker,
  type DateRange,
  type DateRangePreset,
} from '@/components/DatePicker';
import { Field } from '@/components/Field';
import { DocPage, DocSection, Example, PropsTable, DoDont, type PropRow } from '../components';

/* ── Demos ── */

function SingleDemo() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <div className="w-72">
      <DatePicker value={date} onChange={setDate} placeholder="Select a date" />
    </div>
  );
}

function MonthDemo() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <div className="w-72">
      <DatePicker granularity="month" value={date} onChange={setDate} placeholder="Select month/year" />
    </div>
  );
}

function RangeDemo() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div className="w-80">
      <DateRangePicker value={range} onChange={setRange} placeholder="Select a period" />
    </div>
  );
}

// Custom, translated presets (pt-BR).
const ptPresets: DateRangePreset[] = [
  { label: 'Últimos 15 dias', range: () => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14);
    return { start, end: today };
  } },
  { label: 'Últimos 30 dias', range: () => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29);
    return { start, end: today };
  } },
];

function LocalizedRangeDemo() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <div className="w-80">
      <DateRangePicker
        value={range}
        onChange={setRange}
        locale="pt-BR"
        weekStartsOn={0}
        presets={ptPresets}
        placeholder="Selecione um período"
        labels={{ previousMonth: 'Mês anterior', nextMonth: 'Próximo mês' }}
      />
    </div>
  );
}

function TimeDemo() {
  const [time, setTime] = useState<string | null>('09:30');
  return <TimePicker value={time} onChange={setTime} minuteStep={15} />;
}

function DateTimeDemo() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <div className="w-[26rem]">
      <DateTimePicker value={date} onChange={setDate} locale="pt-BR" placeholder="Selecione data" />
    </div>
  );
}

function FieldDemo() {
  const [date, setDate] = useState<Date | null>(null);
  return (
    <div className="w-72">
      <Field label="Birth date" htmlFor="dp-field" error="This field is required." required>
        <DatePicker id="dp-field" value={date} onChange={setDate} placeholder="dd/mm/yyyy" />
      </Field>
    </div>
  );
}

/* ── Props ── */

const datePickerProps: PropRow[] = [
  { name: 'value', type: 'Date | null', required: true, description: 'Currently selected date.' },
  { name: 'onChange', type: '(date: Date) => void', required: true, description: 'Called when a date is picked.' },
  { name: 'granularity', type: "'day' | 'month'", default: "'day'", description: "'month' turns it into a month/year picker." },
  { name: 'locale', type: 'string', description: "BCP-47 locale for names/format, e.g. 'pt-BR'." },
  { name: 'weekStartsOn', type: '0 | 1 | … | 6', default: '0', description: 'First weekday column (0 = Sunday).' },
  { name: 'minDate / maxDate', type: 'Date | null', description: 'Selectable bounds.' },
  { name: 'isDateDisabled', type: '(date: Date) => boolean', description: 'Disable individual days (weekends, holidays…).' },
  { name: 'displayFormat', type: 'Intl.DateTimeFormatOptions', description: 'Format of the text shown in the trigger.' },
  { name: 'labels', type: 'Partial<CalendarLabels>', description: 'Translate navigation/aria strings.' },
  { name: 'placeholder / disabled / invalid / id', type: '…', description: 'Standard control props (inherited from Field when nested).' },
];

const rangeProps: PropRow[] = [
  { name: 'value', type: 'DateRange', required: true, description: '{ start: Date | null; end: Date | null }.' },
  { name: 'onChange', type: '(range: DateRange) => void', required: true, description: 'Called as start/end are chosen.' },
  { name: 'presets', type: 'DateRangePreset[]', description: 'Quick shortcuts. Defaults to Today / 7 / 15 / 30 days / This month.' },
  { name: 'showPresets', type: 'boolean', default: 'true', description: 'Hide the preset column.' },
  { name: 'locale / weekStartsOn / minDate / maxDate / labels', type: '…', description: 'Same as DatePicker.' },
];

const timeProps: PropRow[] = [
  { name: 'value', type: 'string | null', required: true, description: '24-hour "HH:mm" string.' },
  { name: 'onChange', type: '(value: string) => void', required: true, description: 'Receives the new "HH:mm".' },
  { name: 'minuteStep', type: 'number', default: '5', description: 'Step between selectable minutes.' },
  { name: 'labels', type: 'Partial<TimePickerLabels>', description: 'Translate the hours/minutes aria-labels.' },
];

export function DatePickerPage() {
  return (
    <DocPage
      group="Form"
      title="Date & Time"
      lead="Configurable date selection: single date, range with presets, month/year picker, time and date-time. Fully localized through the locale prop (Intl) with translatable labels. Integrates with Field."
    >
      <DocSection title="Single date" description="Pick one date. The header label switches between day → month → year for fast navigation.">
        <Example
          code={`const [date, setDate] = useState<Date | null>(null);

<DatePicker value={date} onChange={setDate} placeholder="Select a date" />`}
        >
          <SingleDemo />
        </Example>
      </DocSection>

      <DocSection title="Month / year only" description="Set granularity='month' for a month picker (returns the first day of the month).">
        <Example
          code={`<DatePicker
  granularity="month"
  value={date}
  onChange={setDate}
  placeholder="Select month/year"
/>`}
        >
          <MonthDemo />
        </Example>
      </DocSection>

      <DocSection title="Date range with presets" description="Click a start day then an end day; presets (Today, Last 7/15/30 days, This month) fill both at once.">
        <Example
          code={`const [range, setRange] = useState<DateRange>({ start: null, end: null });

<DateRangePicker value={range} onChange={setRange} placeholder="Select a period" />`}
        >
          <RangeDemo />
        </Example>
      </DocSection>

      <DocSection
        title="Localization (i18n)"
        description="Pass locale for names/formatting and translate labels and presets. Here: pt-BR with custom 15/30-day presets."
      >
        <Example
          code={`const presets: DateRangePreset[] = [
  { label: 'Últimos 15 dias', range: () => ({ start: subDays(today, 14), end: today }) },
  { label: 'Últimos 30 dias', range: () => ({ start: subDays(today, 29), end: today }) },
];

<DateRangePicker
  value={range}
  onChange={setRange}
  locale="pt-BR"
  presets={presets}
  placeholder="Selecione um período"
  labels={{ previousMonth: 'Mês anterior', nextMonth: 'Próximo mês' }}
/>`}
        >
          <LocalizedRangeDemo />
        </Example>
      </DocSection>

      <DocSection title="Time" description="Compact 24-hour picker. minuteStep controls the granularity.">
        <Example
          code={`const [time, setTime] = useState<string | null>('09:30');

<TimePicker value={time} onChange={setTime} minuteStep={15} />`}
        >
          <TimeDemo />
        </Example>
      </DocSection>

      <DocSection title="Date + time" description="Combines a calendar and a time picker over a single Date value.">
        <Example
          code={`const [date, setDate] = useState<Date | null>(null);

<DateTimePicker value={date} onChange={setDate} locale="pt-BR" />`}
        >
          <DateTimeDemo />
        </Example>
      </DocSection>

      <DocSection title="Inside a Field" description="Wrap in a Field to connect label, hint and error message.">
        <Example
          code={`<Field label="Birth date" htmlFor="dp-field" error="This field is required." required>
  <DatePicker id="dp-field" value={date} onChange={setDate} placeholder="dd/mm/yyyy" />
</Field>`}
        >
          <FieldDemo />
        </Example>
      </DocSection>

      <DocSection title="Best practices">
        <DoDont
          dos={[
            'Set locale (and translate labels/presets) to match the user’s language.',
            'Use a range with presets for analytics/report filters (Last 7/15/30 days).',
            'Use granularity="month" when only the month matters (billing, statements).',
            'Constrain selection with minDate/maxDate or isDateDisabled.',
          ]}
          donts={[
            'Do not rely on a placeholder instead of a visible <Field> label.',
            'Do not hardcode month/weekday names — let locale render them.',
            'Do not use a date-time control when only a date is needed.',
          ]}
        />
      </DocSection>

      <DocSection title="Properties">
        <PropsTable title="DatePickerProps" rows={datePickerProps} />
        <PropsTable title="DateRangePickerProps" rows={rangeProps} />
        <PropsTable title="TimePickerProps" rows={timeProps} />
      </DocSection>
    </DocPage>
  );
}
