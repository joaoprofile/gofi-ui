import { useState } from 'react';
import { Modal, Drawer, ConfirmDialog } from '@/components/Modal';
import { Button } from '@/components/Button';
import { DocPage, DocSection, Example, PropsTable, DoDont, type PropRow } from '../components';

/* ─── Demo: Modal by size ─── */

function ModalSizesDemo() {
  const [open, setOpen] = useState<'sm' | 'md' | 'lg' | null>(null);

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="secondary" onClick={() => setOpen('sm')}>Modal sm</Button>
      <Button variant="secondary" onClick={() => setOpen('md')}>Modal md</Button>
      <Button variant="secondary" onClick={() => setOpen('lg')}>Modal lg</Button>

      <Modal
        open={open === 'sm'}
        onClose={() => setOpen(null)}
        title="Add member"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(null)}>Cancel</Button>
            <Button onClick={() => setOpen(null)}>Add</Button>
          </>
        }
      >
        <p className="text-ink-secondary">Enter the member's email to send the access invitation.</p>
      </Modal>

      <Modal
        open={open === 'md'}
        onClose={() => setOpen(null)}
        title="Edit project"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(null)}>Discard</Button>
            <Button onClick={() => setOpen(null)}>Save changes</Button>
          </>
        }
      >
        <p className="text-ink-secondary">Update the project's name, description and access settings.</p>
      </Modal>

      <Modal
        open={open === 'lg'}
        onClose={() => setOpen(null)}
        title="Report details"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(null)}>Close</Button>
            <Button onClick={() => setOpen(null)}>Export PDF</Button>
          </>
        }
      >
        <p className="text-ink-secondary">Review the consolidated data for the period before exporting. The wide modal comfortably accommodates tables and charts.</p>
      </Modal>
    </div>
  );
}

/* ─── Demo: Drawer by side ─── */

function DrawerDemo() {
  const [side, setSide] = useState<'right' | 'left' | 'bottom' | null>(null);

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="secondary" onClick={() => setSide('right')}>Drawer right</Button>
      <Button variant="secondary" onClick={() => setSide('left')}>Drawer left</Button>
      <Button variant="secondary" onClick={() => setSide('bottom')}>Drawer bottom</Button>

      <Drawer
        open={side !== null}
        onClose={() => setSide(null)}
        title={side === 'right' ? 'Details panel' : side === 'left' ? 'Navigation menu' : 'Filters'}
        side={side ?? 'right'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setSide(null)}>Close</Button>
            <Button onClick={() => setSide(null)}>Apply</Button>
          </>
        }
      >
        <p className="text-ink-secondary">Side panel content. May contain forms, lists or detail information for the selected item.</p>
      </Drawer>
    </div>
  );
}

/* ─── Demo: ConfirmDialog danger ─── */

function ConfirmDemo() {
  const [open, setOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="danger" onClick={() => setOpen(true)}>Delete account</Button>
      {deleted && <span className="text-body-sm text-danger">Account deleted.</span>}
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete account permanently?"
        confirmLabel="Delete"
        tone="danger"
        onConfirm={() => setDeleted(true)}
      >
        <p className="text-ink-secondary">
          This action is irreversible. All data, projects and integrations will be permanently removed.
        </p>
      </ConfirmDialog>
    </div>
  );
}

/* ─── Props ─── */

const modalProps: PropRow[] = [
  { name: 'open', type: 'boolean', required: true, description: 'Controls modal visibility.' },
  { name: 'onClose', type: '() => void', required: true, description: 'Called on close (Esc, backdrop, X button).' },
  { name: 'title', type: 'string', required: true, description: 'Accessible title — becomes aria-labelledby.' },
  { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Maximum width: 384 / 512 / 672px.' },
  { name: 'footer', type: 'ReactNode', description: 'Right-aligned actions (Cancel + Confirm buttons).' },
  { name: 'dismissable', type: 'boolean', default: 'true', description: 'Allows closing via Esc and backdrop click.' },
  { name: 'children', type: 'ReactNode', required: true, description: 'Modal body.' },
];

const drawerProps: PropRow[] = [
  { name: 'open', type: 'boolean', required: true, description: 'Controls drawer visibility.' },
  { name: 'onClose', type: '() => void', required: true, description: 'Called on close.' },
  { name: 'title', type: 'string', required: true, description: 'Accessible title.' },
  { name: 'side', type: '"right" | "left" | "bottom"', default: '"right"', description: 'Side the drawer slides in from.' },
  { name: 'size', type: '"sm" | "md" | "lg"', default: '"md"', description: 'Width (side) or maximum height (bottom).' },
  { name: 'footer', type: 'ReactNode', description: 'Actions pinned to the base of the panel.' },
  { name: 'dismissable', type: 'boolean', default: 'true', description: 'Allows closing via Esc and backdrop.' },
  { name: 'children', type: 'ReactNode', required: true, description: 'Drawer body.' },
];

const confirmProps: PropRow[] = [
  { name: 'open', type: 'boolean', required: true, description: 'Controls visibility.' },
  { name: 'onClose', type: '() => void', required: true, description: 'Called on cancel or close.' },
  { name: 'onConfirm', type: '() => void', required: true, description: 'Called when the action is confirmed.' },
  { name: 'title', type: 'string', required: true, description: 'Confirmation question.' },
  { name: 'confirmLabel', type: 'string', required: true, description: 'Action verb (e.g., "Delete"). Never "OK".' },
  { name: 'cancelLabel', type: 'string', default: '"Cancel"', description: 'Cancel button label.' },
  { name: 'tone', type: '"danger" | "default"', default: '"default"', description: 'danger: red button + not closable via backdrop.' },
  { name: 'children', type: 'ReactNode', required: true, description: 'Description of the consequence of the action.' },
];

export function ModalPage() {
  return (
    <DocPage
      group="Overlay & Feedback"
      title="Modal · Drawer · ConfirmDialog"
      lead="Overlays with focus trap, scroll lock and focus return. Centered Modal, side Drawer or bottom sheet, ConfirmDialog for destructive actions."
      source="components/modal-drawer.md"
    >
      <DocSection title="Modal - sizes" description="sm, md and lg differ in maximum width. Click the backdrop or press Esc to close.">
        <Example
          align="center"
          code={`const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open modal</Button>

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Edit project"
  size="md"
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={() => setOpen(false)}>Save</Button>
    </>
  }
>
  <p>Modal content.</p>
</Modal>`}
        >
          <ModalSizesDemo />
        </Example>
      </DocSection>

      <DocSection title="Drawer - sides" description="right (default), left and bottom. Slide animation from the corresponding edge.">
        <Example
          align="center"
          code={`const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open drawer</Button>

<Drawer
  open={open}
  onClose={() => setOpen(false)}
  title="Details panel"
  side="right"
>
  <p>Drawer content.</p>
</Drawer>`}
        >
          <DrawerDemo />
        </Example>
      </DocSection>

      <DocSection title="ConfirmDialog - destructive action" description="tone='danger' uses a red button and disables backdrop dismissal — the user decides explicitly.">
        <Example
          align="center"
          code={`const [open, setOpen] = useState(false);

<Button variant="danger" onClick={() => setOpen(true)}>Delete account</Button>

<ConfirmDialog
  open={open}
  onClose={() => setOpen(false)}
  title="Delete account permanently?"
  confirmLabel="Delete"
  tone="danger"
  onConfirm={() => { /* call API */ }}
>
  This action is irreversible.
</ConfirmDialog>`}
        >
          <ConfirmDemo />
        </Example>
      </DocSection>

      <DocSection title="Best practices">
        <DoDont
          dos={[
            'Manage the open/onClose state in the parent — all are controlled.',
            'Use ConfirmDialog (not Modal) for irreversible destructive actions.',
            'Place the primary action (CTA) on the right in the footer.',
            'Use confirmLabel with a specific verb: "Delete", "Archive", "Send".',
          ]}
          donts={[
            'Do not open a modal inside a modal — use a Drawer or a new route.',
            'Do not disable backdrop dismissal on informational modals.',
            'Do not use "OK" as confirmLabel — be specific about the action.',
          ]}
        />
      </DocSection>

      <DocSection title="Properties">
        <PropsTable title="ModalProps" rows={modalProps} />
        <PropsTable title="DrawerProps" rows={drawerProps} />
        <PropsTable title="ConfirmDialogProps" rows={confirmProps} />
      </DocSection>
    </DocPage>
  );
}
