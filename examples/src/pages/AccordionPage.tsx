import { Accordion, type AccordionItem } from '@/components/Accordion';
import { DocPage, DocSection, Example, PropsTable, DoDont, type PropRow } from '../components';

/* ─── Demo data ─── */

const FAQ_ITEMS: AccordionItem[] = [
  {
    id: 'o-que-e',
    title: 'What is the GOFI Design System?',
    content:
      'GOFI DS is GOFI\'s React component library, based on Tailwind v4, that ensures visual consistency and accessibility across all products on the platform.',
  },
  {
    id: 'como-instalar',
    title: 'How do I install and configure it?',
    content:
      'Add the package via npm, import theme.css in the entry point and use the components directly. All typography and tokens are registered automatically.',
  },
  {
    id: 'suporte-temas',
    title: 'Does the system support dark mode?',
    content:
      'Yes. All semantic tokens respond to the .dark class on the document root. Just toggle the class to switch the theme instantly.',
  },
  {
    id: 'acessibilidade',
    title: 'Which accessibility standards are followed?',
    content:
      'We follow WCAG 2.1 AA and the W3C APG pattern. Each component includes the correct ARIA roles, states and properties, plus full keyboard navigation.',
  },
];

const MULTIPLE_ITEMS: AccordionItem[] = [
  {
    id: 'entrega',
    title: 'Delivery policy',
    content: 'Deliveries made within 5 business days for major cities and 10 business days for other locations. Tracking available by email after confirmation.',
  },
  {
    id: 'devolucao',
    title: 'Exchanges and returns',
    content: 'We accept returns within 30 days of receipt. The product must be unused and in its original packaging.',
  },
  {
    id: 'pagamento',
    title: 'Payment methods',
    content: 'Credit card (up to 12 installments), debit, instant transfer and bank slip with a 5% discount.',
  },
];

/* ─── Props ─── */

const accordionProps: PropRow[] = [
  { name: 'items', type: 'AccordionItem[]', required: true, description: 'List of expandable sections.' },
  { name: 'mode', type: '"single" | "multiple"', default: '"single"', description: 'single: only one open at a time; multiple: several at once.' },
  { name: 'defaultOpen', type: 'string[]', default: '[]', description: 'IDs of the sections open on mount.' },
  { name: 'className', type: 'string', description: 'Extra class on the container.' },
];

const accordionItemProps: PropRow[] = [
  { name: 'id', type: 'string', required: true, description: 'Unique identifier of the item.' },
  { name: 'title', type: 'string', required: true, description: 'Text of the clickable header.' },
  { name: 'content', type: 'ReactNode', required: true, description: 'Content revealed when opened.' },
];

export function AccordionPage() {
  return (
    <DocPage
      group="Containers & Data"
      title="Accordion"
      lead="Expandable sections to reveal content on demand. single (one at a time) and multiple (several at once) modes. Height animation via the CSS grid trick without JS measurement."
      source="components/accordion.md"
    >
      <DocSection title="Single mode (FAQ)" description="When a section opens, the previous one closes automatically. Ideal for frequently asked questions.">
        <Example
          code={`<Accordion
  items={[
    {
      id: 'what-is',
      title: 'What is the GOFI Design System?',
      content: 'GOFI DS is GOFI\\'s React component library...',
    },
    {
      id: 'how-to-install',
      title: 'How do I install and configure it?',
      content: 'Add the package via npm...',
    },
  ]}
/>`}
        >
          <div className="w-full max-w-2xl">
            <Accordion items={FAQ_ITEMS} />
          </div>
        </Example>
      </DocSection>

      <DocSection title="Multiple mode" description="Several sections can be open at the same time. Useful for long FAQs or settings.">
        <Example
          code={`<Accordion
  mode="multiple"
  defaultOpen={['delivery']}
  items={[
    { id: 'delivery', title: 'Delivery policy', content: '...' },
    { id: 'returns', title: 'Exchanges and returns', content: '...' },
    { id: 'payment', title: 'Payment methods', content: '...' },
  ]}
/>`}
        >
          <div className="w-full max-w-2xl">
            <Accordion mode="multiple" defaultOpen={['entrega']} items={MULTIPLE_ITEMS} />
          </div>
        </Example>
      </DocSection>

      <DocSection title="Open by default">
        <Example
          code={`<Accordion
  defaultOpen={['accessibility']}
  items={items}
/>`}
        >
          <div className="w-full max-w-2xl">
            <Accordion defaultOpen={['acessibilidade']} items={FAQ_ITEMS} />
          </div>
        </Example>
      </DocSection>

      <DocSection title="Best practices">
        <DoDont
          dos={[
            'Use mode="single" for FAQs — it reduces cognitive load.',
            'Use mode="multiple" when the user needs to compare sections simultaneously.',
            'Titles should be complete, self-explanatory sentences without opening the panel.',
            'Place actions (links, buttons) inside the content, never in the title.',
          ]}
          donts={[
            'Do not use an accordion for main navigation — use Tabs or nav.',
            'Do not nest accordions — it creates a confusing hierarchy.',
            'Do not hide critical information (errors, alerts) in a closed panel.',
          ]}
        />
      </DocSection>

      <DocSection title="Properties">
        <PropsTable title="AccordionProps" rows={accordionProps} />
        <PropsTable title="AccordionItem" rows={accordionItemProps} />
      </DocSection>
    </DocPage>
  );
}
