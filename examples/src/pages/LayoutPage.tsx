import { Stack, Inline, Grid, Container, Divider } from '@/components/Layout';
import { DocPage, DocSection, Example, PropsTable, type PropRow } from '../components';

const box = (label: string) => (
  <div className="grid h-14 min-w-14 place-items-center rounded-md bg-brand px-4 text-on-brand text-body-sm">
    {label}
  </div>
);

const stackProps: PropRow[] = [
  { name: 'gap', type: '0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16', default: '4', description: 'Space between children (4/8 scale → N*4px).' },
  { name: 'align', type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", description: 'Alignment on the cross axis.' },
  { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around'", description: 'Distribution on the main axis.' },
  { name: 'as', type: 'ElementType', default: "'div'", description: 'Rendered element.' },
];

const gridProps: PropRow[] = [
  { name: 'min', type: 'string', default: "'240px'", description: 'Minimum width of each column (auto-fit).' },
  { name: 'cols', type: 'number', description: 'Fixed number of columns (overrides min).' },
  { name: 'gap', type: 'Gap', default: '4', description: 'Space between cells.' },
];

const containerProps: PropRow[] = [
  { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | 'full'", default: "'xl'", description: 'Maximum content width.' },
];

export function LayoutPage() {
  return (
    <DocPage
      group="Layout"
      title="Layout primitives"
      lead="Stack, Inline, Grid and Container compose any screen with consistent spacing — mobile-first, no loose inline CSS."
      source="foundations/spacing-layout.md"
    >
      <DocSection title="Stack" description="Stacks vertically with consistent gap.">
        <Example code={`<Stack gap={3}>
  {box('1')}{box('2')}{box('3')}
</Stack>`}>
          <Stack gap={3}>{box('1')}{box('2')}{box('3')}</Stack>
        </Example>
      </DocSection>

      <DocSection title="Inline" description="Row with gap and wrap — toolbars, chip/button groups.">
        <Example code={`<Inline gap={3}>
  {box('A')}{box('B')}{box('C')}{box('D')}
</Inline>`}>
          <Inline gap={3}>{box('A')}{box('B')}{box('C')}{box('D')}</Inline>
        </Example>
      </DocSection>

      <DocSection title="Grid" description="Responsive auto-fit grid by default.">
        <Example code={`<Grid min="120px" gap={4}>
  {box('1')}{box('2')}{box('3')}{box('4')}{box('5')}
</Grid>`}>
          <div className="w-full">
            <Grid min="120px" gap={4}>{box('1')}{box('2')}{box('3')}{box('4')}{box('5')}</Grid>
          </div>
        </Example>
      </DocSection>

      <DocSection title="Container & Divider">
        <Example code={`<Container size="sm">centered content</Container>
<Divider />`}>
          <div className="w-full">
            <Container size="sm">
              <div className="rounded-md bg-sunken p-4 text-center text-body-sm text-ink-secondary">
                Container size="sm" — max width + centering
              </div>
            </Container>
            <Divider className="my-4" />
          </div>
        </Example>
      </DocSection>

      <DocSection title="Properties">
        <PropsTable title="StackProps / InlineProps" rows={stackProps} />
        <PropsTable title="GridProps" rows={gridProps} />
        <PropsTable title="ContainerProps" rows={containerProps} />
      </DocSection>
    </DocPage>
  );
}
