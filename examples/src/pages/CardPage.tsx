import { useState } from 'react';
import { Star } from 'lucide-react';
import { Card, CardTitle } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Tag } from '@/components/Badge';
import { Button } from '@/components/Button';
import { DocPage, DocSection, Example, PropsTable, DoDont, type PropRow } from '../components';

/* ── Demos ── */

function VariantsDemo() {
  return (
    <>
      <Card variant="default" className="w-56">
        <CardTitle>Default</CardTitle>
        <p className="text-body-sm text-ink-secondary">Standard surface with a light shadow.</p>
      </Card>
      <Card variant="brand" className="w-56">
        <CardTitle>Brand</CardTitle>
        <p className="text-body-sm">Highlight with a brand background.</p>
      </Card>
      <Card variant="outlined" className="w-56">
        <CardTitle>Outlined</CardTitle>
        <p className="text-body-sm text-ink-secondary">No shadow — borders as the delimiter.</p>
      </Card>
    </>
  );
}

function InteractiveDemo() {
  const [clicked, setClicked] = useState('');
  return (
    <div className="flex flex-col gap-3 w-full max-w-md">
      {['Investment A', 'Investment B'].map((name) => (
        <Card
          key={name}
          as="a"
          href="#"
          variant="interactive"
          onClick={(e) => { e.preventDefault(); setClicked(name); }}
        >
          <CardTitle>{name}</CardTitle>
          <p className="text-body-sm text-ink-secondary">Yield: 12.4% p.a.</p>
        </Card>
      ))}
      {clicked && (
        <p className="text-body-sm text-ink-secondary text-center">You clicked on: {clicked}</p>
      )}
    </div>
  );
}

function WithHeaderFooterDemo() {
  return (
    <Card
      className="w-72"
      header={
        <>
          <CardTitle>Monthly summary</CardTitle>
          <Badge tone="success">Positive</Badge>
        </>
      }
      footer={
        <Button variant="secondary" size="sm">View details</Button>
      }
    >
      <p className="text-body-sm text-ink-secondary">Current balance: <strong className="text-ink">$4,320.00</strong></p>
      <p className="text-body-sm text-ink-secondary">Income: <strong className="text-success">$8,500.00</strong></p>
      <p className="text-body-sm text-ink-secondary">Expenses: <strong className="text-danger">$4,180.00</strong></p>
    </Card>
  );
}

function RecommendationDemo() {
  return (
    <Card variant="default" className="w-72">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <CardTitle>CD Bank XYZ</CardTitle>
          <div className="flex gap-1.5 flex-wrap">
            <Tag>Fixed Income</Tag>
            <Tag>Low risk</Tag>
          </div>
        </div>
        <Star className="size-5 text-warning shrink-0 mt-0.5" />
      </div>
      <p className="text-body-sm text-ink-secondary">Yield of <strong className="text-success text-body">12.5% p.a.</strong> with daily liquidity.</p>
      <Button variant="primary" size="sm">Invest now</Button>
    </Card>
  );
}

/* ── Props ── */

const cardProps: PropRow[] = [
  { name: 'variant', type: "'default' | 'brand' | 'outlined' | 'interactive'", default: "'default'", description: 'Visual appearance of the card.' },
  { name: 'as', type: "'div' | 'article' | 'a'", default: "'div'", description: "Root element. Use 'a' with href for a clickable card." },
  { name: 'href', type: 'string', description: "Destination URL — required when as='a'." },
  { name: 'header', type: 'ReactNode', description: 'Header content (title + action/badge).' },
  { name: 'footer', type: 'ReactNode', description: 'Footer content (secondary actions).' },
  { name: 'media', type: 'ReactNode', description: 'Image/video that bleeds to the top edges.' },
  { name: 'children', type: 'ReactNode', required: true, description: 'Main body of the card.' },
  { name: 'className', type: 'string', description: 'Extra CSS class.' },
];

const cardTitleProps: PropRow[] = [
  { name: 'children', type: 'ReactNode', required: true, description: 'Title text (rendered as h3).' },
  { name: 'className', type: 'string', description: 'Extra CSS class.' },
];

export function CardPage() {
  return (
    <DocPage
      group="Containers & Data"
      title="Card"
      lead="Surface that groups related content — the base block of dashboards and lists. A clickable card uses as='a' + variant='interactive'."
      source="components/card.md"
    >
      <DocSection title="Variants" description="Each variant communicates a different visual hierarchy.">
        <Example
          align="center"
          code={`<Card variant="default">
  <CardTitle>Default</CardTitle>
  <p>Standard surface with a light shadow.</p>
</Card>

<Card variant="brand">
  <CardTitle>Brand</CardTitle>
  <p>Highlight with a brand background.</p>
</Card>

<Card variant="outlined">
  <CardTitle>Outlined</CardTitle>
  <p>No shadow — borders as the delimiter.</p>
</Card>`}
        >
          <VariantsDemo />
        </Example>
      </DocSection>

      <DocSection title="Interactive" description="Use as='a' + variant='interactive' for clickable cards. Never div+onClick.">
        <Example
          code={`<Card as="a" href="/investments/a" variant="interactive">
  <CardTitle>Investment A</CardTitle>
  <p>Yield: 12.4% p.a.</p>
</Card>`}
        >
          <InteractiveDemo />
        </Example>
      </DocSection>

      <DocSection title="With header and footer" description="Use header for title+badge and footer for secondary actions.">
        <Example
          code={`<Card
  header={
    <>
      <CardTitle>Monthly summary</CardTitle>
      <Badge tone="success">Positive</Badge>
    </>
  }
  footer={<Button variant="secondary" size="sm">View details</Button>}
>
  <p>Current balance: <strong>$4,320.00</strong></p>
  <p>Income: <strong>$8,500.00</strong></p>
  <p>Expenses: <strong>$4,180.00</strong></p>
</Card>`}
        >
          <WithHeaderFooterDemo />
        </Example>
      </DocSection>

      <DocSection title="Recommendation card" description="Combination of CardTitle, Tag and Button to highlight a product.">
        <Example
          code={`<Card variant="default">
  <div className="flex items-start justify-between gap-2">
    <div className="flex flex-col gap-1">
      <CardTitle>CD Bank XYZ</CardTitle>
      <div className="flex gap-1.5">
        <Tag>Fixed Income</Tag>
        <Tag>Low risk</Tag>
      </div>
    </div>
    <Star className="size-5 text-warning" />
  </div>
  <p>Yield of <strong>12.5% p.a.</strong> with daily liquidity.</p>
  <Button variant="primary" size="sm">Invest now</Button>
</Card>`}
        >
          <RecommendationDemo />
        </Example>
      </DocSection>

      <DocSection title="Best practices">
        <DoDont
          dos={[
            "Use as='a' + variant='interactive' for clickable cards — never div+onClick.",
            'Use header/footer to keep spacing and alignment consistent.',
            'One primary action per card — use secondary for complementary actions.',
          ]}
          donts={[
            'Do not nest interactive cards inside other interactive cards.',
            'Do not mix the brand variant with long content — use it for short highlights.',
            'Do not omit CardTitle — cards without a title hurt scannability.',
          ]}
        />
      </DocSection>

      <DocSection title="Properties">
        <PropsTable title="CardProps" rows={cardProps} />
        <PropsTable title="CardTitleProps" rows={cardTitleProps} />
      </DocSection>
    </DocPage>
  );
}
