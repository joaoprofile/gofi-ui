import { Sparkles, Accessibility, Palette, Component } from 'lucide-react';
import { Card, CardTitle } from '@/components/Card';
import { Grid } from '@/components/Layout';
import { DocPage, DocSection, Prose } from '../components';

const PILLARS = [
  {
    icon: Accessibility,
    title: 'Accessible from the start',
    body: 'Every component is born with a label, visible focus, keyboard navigation and AA contrast. A11y is not a final layer.',
  },
  {
    icon: Palette,
    title: 'Token, never literal',
    body: 'Color, spacing, radius and type come from tokens. Changing the brand or theme means changing the single source — not each component.',
  },
  {
    icon: Component,
    title: 'TypeScript-first',
    body: 'Typed props, type-safe variants with CVA and forwardRef. The editor guides you, the compiler protects you.',
  },
  {
    icon: Sparkles,
    title: 'Rounded geometry',
    body: 'Generous radius, pill-shaped buttons, breathing room on the 4/8 scale and soft shadows — faithful to the Student Portal model.',
  },
];

export function IntroducaoPage() {
  return (
    <DocPage
      group="Get started"
      title="GOFI Design System"
      lead="A web design system in React + TypeScript + Tailwind."
    >
      <DocSection title="Philosophy" description="Four principles guide every component.">
        <Grid min="240px" gap={4}>
          {PILLARS.map((p) => (
            <Card key={p.title}>
              <p.icon aria-hidden className="size-6 text-action" />
              <CardTitle>{p.title}</CardTitle>
              <p className="text-body-sm text-ink-secondary">{p.body}</p>
            </Card>
          ))}
        </Grid>
      </DocSection>

      <DocSection
        title="What's in here"
        description="Tokens, layout primitives and ~25 accessible components, each documented with variations, props and copyable code."
      >
        <Prose>
          <p>
            Browse the side menu. Each page shows the component in use, its variations, the
            typed properties table and the code ready to paste. Use the theme selector at the
            top to see everything in <strong>light and dark</strong>.
          </p>
        </Prose>
      </DocSection>

      <DocSection title="Stack" description="The technical choices and why.">
        <Prose>
          <ul className="flex list-inside list-disc flex-col gap-1">
            <li><strong>React 18 + TypeScript</strong> — typed components, forwardRef, generics.</li>
            <li><strong>Tailwind v4</strong> — the GOFI tokens become utilities (<code>bg-action</code>, <code>rounded-pill</code>).</li>
            <li><strong>class-variance-authority</strong> — type-safe component variants.</li>
            <li><strong>lucide-react</strong> — a single icon set, consistent stroke.</li>
            <li><strong>Vite</strong> — dev server and build.</li>
          </ul>
        </Prose>
      </DocSection>
    </DocPage>
  );
}
