import { useState } from 'react';
import {
  MoreHorizontal,
  Edit2,
  Copy,
  Archive,
  Trash2,
  Settings,
  Bell,
  LogOut,
  ChevronDown,
  SlidersHorizontal,
} from 'lucide-react';
import { Menu } from '@/components/Menu';
import { Popover } from '@/components/Menu';
import { Button } from '@/components/Button';
import { IconButton } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { DocPage, DocSection, Example, PropsTable, DoDont, type PropRow } from '../components';

/* ─── Demo: actions menu ─── */

function ActionMenuDemo() {
  const [lastAction, setLastAction] = useState<string | null>(null);
  return (
    <div className="flex items-center gap-6">
      <Menu
        trigger={
          <IconButton aria-label="More options" variant="ghost">
            <MoreHorizontal className="size-5" />
          </IconButton>
        }
        items={[
          { id: 'editar', label: 'Edit', icon: <Edit2 className="size-4" />, onSelect: () => setLastAction('Edit') },
          { id: 'duplicar', label: 'Duplicate', icon: <Copy className="size-4" />, onSelect: () => setLastAction('Duplicate') },
          { id: 'arquivar', label: 'Archive', icon: <Archive className="size-4" />, onSelect: () => setLastAction('Archive') },
          { id: 'excluir', label: 'Delete', icon: <Trash2 className="size-4" />, danger: true, onSelect: () => setLastAction('Delete') },
        ]}
      />
      {lastAction && (
        <span className="text-body-sm text-ink-secondary">Action: <strong>{lastAction}</strong></span>
      )}
    </div>
  );
}

/* ─── Demo: menu with Button trigger and align end ─── */

function UserMenuDemo() {
  return (
    <Menu
      align="end"
      trigger={
        <Button variant="secondary" iconEnd={<ChevronDown className="size-4" />}>
          My account
        </Button>
      }
      items={[
        { id: 'configuracoes', label: 'Settings', icon: <Settings className="size-4" />, onSelect: () => {} },
        { id: 'notificacoes', label: 'Notifications', icon: <Bell className="size-4" />, onSelect: () => {} },
        { id: 'sair', label: 'Sign out', icon: <LogOut className="size-4" />, danger: true, onSelect: () => {} },
      ]}
    />
  );
}

/* ─── Demo: Popover with arbitrary content ─── */

function FilterPopoverDemo() {
  const [selected, setSelected] = useState<string[]>([]);
  const options = ['Active', 'At risk', 'Overdue', 'Completed'];

  function toggle(v: string) {
    setSelected((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Popover
        trigger={
          <Button variant="secondary" iconStart={<SlidersHorizontal className="size-4" />}>
            Filter status
            {selected.length > 0 && (
              <Badge tone="info" className="ml-1">{selected.length}</Badge>
            )}
          </Button>
        }
      >
        <div className="flex flex-col gap-3">
          <p className="text-body-sm font-semibold text-ink">Project status</p>
          <div className="flex flex-col gap-2">
            {options.map((opt) => (
              <label key={opt} className="flex cursor-pointer items-center gap-2 text-body-sm text-ink">
                <input
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => toggle(opt)}
                  className="size-4 accent-action"
                />
                {opt}
              </label>
            ))}
          </div>
          {selected.length > 0 && (
            <Button size="sm" variant="ghost" onClick={() => setSelected([])}>
              Clear filters
            </Button>
          )}
        </div>
      </Popover>
      {selected.length > 0 && (
        <span className="text-body-sm text-ink-secondary">
          Filtering: {selected.join(', ')}
        </span>
      )}
    </div>
  );
}

/* ─── Props ─── */

const menuProps: PropRow[] = [
  { name: 'trigger', type: 'ReactNode', required: true, description: 'Element that opens the menu. Receives aria-haspopup and aria-expanded automatically.' },
  { name: 'items', type: 'MenuItem[]', required: true, description: 'List of action items.' },
  { name: 'align', type: '"start" | "end"', default: '"start"', description: 'Dropdown alignment relative to the trigger.' },
];

const menuItemProps: PropRow[] = [
  { name: 'id', type: 'string', required: true, description: 'Unique identifier for the item.' },
  { name: 'label', type: 'string', required: true, description: 'Option text.' },
  { name: 'icon', type: 'ReactNode', description: 'Decorative icon to the left of the label.' },
  { name: 'danger', type: 'boolean', description: 'Colors the item red and adds a divider above the destructive group.' },
  { name: 'disabled', type: 'boolean', description: 'Disables the item for interaction.' },
  { name: 'onSelect', type: '() => void', required: true, description: 'Called on click or keyboard activation.' },
];

const popoverProps: PropRow[] = [
  { name: 'trigger', type: 'ReactNode', required: true, description: 'Element that opens the popover. Receives aria-expanded automatically.' },
  { name: 'children', type: 'ReactNode', required: true, description: 'Arbitrary content of the floating panel.' },
  { name: 'align', type: '"start" | "end"', default: '"start"', description: 'Panel alignment relative to the trigger.' },
];

export function MenuPage() {
  return (
    <DocPage
      group="Overlay & Feedback"
      title="Menu · Popover"
      lead="Menu is an actions dropdown with keyboard navigation and full ARIA semantics. Popover shows arbitrary floating content anchored to a trigger element."
      source="components/menu-popover.md"
    >
      <DocSection title="Actions menu with a destructive item" description="Items with danger=true go at the end with a divider. Keyboard: ↑↓ navigates, Enter/Space selects, Esc closes.">
        <Example
          align="center"
          code={`<Menu
  trigger={
    <IconButton aria-label="More options" variant="ghost">
      <MoreHorizontal className="size-5" />
    </IconButton>
  }
  items={[
    { id: 'editar', label: 'Edit', icon: <Edit2 className="size-4" />, onSelect: () => {} },
    { id: 'duplicar', label: 'Duplicate', icon: <Copy className="size-4" />, onSelect: () => {} },
    { id: 'arquivar', label: 'Archive', icon: <Archive className="size-4" />, onSelect: () => {} },
    { id: 'excluir', label: 'Delete', icon: <Trash2 className="size-4" />, danger: true, onSelect: () => {} },
  ]}
/>`}
        >
          <ActionMenuDemo />
        </Example>
      </DocSection>

      <DocSection title="Menu with Button trigger and align end" description="align='end' aligns the dropdown to the right of the trigger — useful in top bars.">
        <Example
          align="center"
          code={`<Menu
  align="end"
  trigger={
    <Button variant="secondary" iconEnd={<ChevronDown className="size-4" />}>
      My account
    </Button>
  }
  items={[
    { id: 'configuracoes', label: 'Settings', icon: <Settings className="size-4" />, onSelect: () => {} },
    { id: 'notificacoes', label: 'Notifications', icon: <Bell className="size-4" />, onSelect: () => {} },
    { id: 'sair', label: 'Sign out', icon: <LogOut className="size-4" />, danger: true, onSelect: () => {} },
  ]}
/>`}
        >
          <UserMenuDemo />
        </Example>
      </DocSection>

      <DocSection title="Popover - arbitrary content" description="Use Popover for panels with filters, pickers or quick forms. Focus trap enters the panel; Esc closes and returns focus.">
        <Example
          align="center"
          code={`<Popover
  trigger={
    <Button variant="secondary" iconStart={<SlidersHorizontal className="size-4" />}>
      Filter status
    </Button>
  }
>
  <div className="flex flex-col gap-3">
    <p className="text-body-sm font-semibold text-ink">Project status</p>
    {options.map((opt) => (
      <label key={opt} className="flex items-center gap-2 text-body-sm">
        <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)} />
        {opt}
      </label>
    ))}
  </div>
</Popover>`}
        >
          <FilterPopoverDemo />
        </Example>
      </DocSection>

      <DocSection title="Best practices">
        <DoDont
          dos={[
            'Group destructive items at the end with danger=true — the divider is automatic.',
            'Use IconButton as the trigger for a context menu (three dots).',
            'Use Popover for rich content (filters, pickers) and Menu for action lists.',
            'Make sure the trigger is a focusable element — IconButton or Button.',
          ]}
          donts={[
            'Do not put more than 8 items in the menu — split into submenus or pages.',
            'Do not use Menu for route navigation — use native links.',
            'Do not open a Popover inside a Popover — it creates confusing depth.',
          ]}
        />
      </DocSection>

      <DocSection title="Properties">
        <PropsTable title="MenuProps" rows={menuProps} />
        <PropsTable title="MenuItem" rows={menuItemProps} />
        <PropsTable title="PopoverProps" rows={popoverProps} />
      </DocSection>
    </DocPage>
  );
}
