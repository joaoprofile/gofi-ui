import { Info, RefreshCw, Settings, Trash2 } from 'lucide-react';
import { Tooltip } from '@/components/Tooltip';
import { IconButton } from '@/components/Button';
import { Inline } from '@/components/Layout';
import { DocPage, DocSection, Example, PropsTable, DoDont, Callout, type PropRow } from '../components';

const tooltipProps: PropRow[] = [
  { name: 'label', type: 'string', required: true, description: 'Short hint text shown in the tooltip.' },
  { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'top'", description: 'Tooltip position relative to the child.' },
  { name: 'children', type: 'ReactElement', required: true, description: 'Single focusable child — receives aria-describedby automatically.' },
];

export function TooltipPage() {
  return (
    <DocPage
      group="Atoms"
      title="Tooltip"
      lead="Short hint shown on hover and focus. It complements, it never carries essential information."
      source="components/tooltip.md"
    >
      <DocSection title="Positions" description="Appears above, below, to the right or to the left of the child element.">
        <Example
          align="center"
          code={`<Tooltip label="Sync data" side="top">
  <IconButton aria-label="Sync"><RefreshCw className="size-4" /></IconButton>
</Tooltip>
<Tooltip label="Settings" side="right">
  <IconButton aria-label="Settings"><Settings className="size-4" /></IconButton>
</Tooltip>
<Tooltip label="More information" side="bottom">
  <IconButton aria-label="Information"><Info className="size-4" /></IconButton>
</Tooltip>
<Tooltip label="Delete permanently" side="left">
  <IconButton aria-label="Delete"><Trash2 className="size-4" /></IconButton>
</Tooltip>`}
        >
          <Inline>
            <Tooltip label="Sync data" side="top">
              <IconButton aria-label="Sync"><RefreshCw className="size-4" /></IconButton>
            </Tooltip>
            <Tooltip label="Settings" side="right">
              <IconButton aria-label="Settings"><Settings className="size-4" /></IconButton>
            </Tooltip>
            <Tooltip label="More information" side="bottom">
              <IconButton aria-label="Information"><Info className="size-4" /></IconButton>
            </Tooltip>
            <Tooltip label="Delete permanently" side="left">
              <IconButton aria-label="Delete"><Trash2 className="size-4" /></IconButton>
            </Tooltip>
          </Inline>
        </Example>
      </DocSection>

      <DocSection title="Hover and focus" description="The tooltip appears on mouse hover AND keyboard focus. Press Tab to test.">
        <Example
          align="center"
          code={`<Tooltip label="Synced 2 min ago">
  <IconButton aria-label="Sync status">
    <RefreshCw className="size-4" />
  </IconButton>
</Tooltip>`}
        >
          <Tooltip label="Synced 2 min ago">
            <IconButton aria-label="Sync status">
              <RefreshCw className="size-4" />
            </IconButton>
          </Tooltip>
        </Example>
      </DocSection>

      <DocSection title="Caution">
        <Callout tone="warning">
          The tooltip disappears on leave and does not exist on touch. Never put
          critical information only in the tooltip — use a visible label or Popover for rich content.
        </Callout>
      </DocSection>

      <DocSection title="Best practices">
        <DoDont
          dos={[
            'Clarify icons and abbreviations with short text.',
            'The child always needs its own aria-label — the tooltip is a complement.',
            'The tooltip dismisses with Esc — behavior already built in.',
          ]}
          donts={[
            'Critical information only in the tooltip (touch and screen readers may not reach it).',
            'Using it on a non-focusable element (div, span without tabIndex).',
            'Long text or interactive content — use Popover in those cases.',
          ]}
        />
      </DocSection>

      <DocSection title="Properties">
        <PropsTable title="TooltipProps" rows={tooltipProps} />
      </DocSection>
    </DocPage>
  );
}
