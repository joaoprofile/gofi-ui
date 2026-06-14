import { useToast } from '@/components/Toast';
import { Button } from '@/components/Button';
import { DocPage, DocSection, Example, PropsTable, DoDont, type PropRow } from '../components';

/* ─── Demo: buttons by tone ─── */

function ToneDemo() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="secondary"
        onClick={() => toast({ tone: 'success', message: 'Project saved successfully.' })}
      >
        Success
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ tone: 'info', message: 'Sync started in the background.' })}
      >
        Info
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ tone: 'warning', message: '80% of the plan limit reached.' })}
      >
        Warning
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ tone: 'danger', message: 'Failed to upload the file. Try again.' })}
      >
        Error
      </Button>
    </div>
  );
}

/* ─── Demo: with "Undo" action ─── */

function ActionDemo() {
  const { toast } = useToast();
  return (
    <Button
      onClick={() =>
        toast({
          tone: 'info',
          message: 'Item moved to trash.',
          action: { label: 'Undo', onClick: () => console.log('undone') },
        })
      }
    >
      Move to trash
    </Button>
  );
}

/* ─── Demo: custom duration ─── */

function DurationDemo() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="secondary"
        onClick={() => toast({ tone: 'success', message: 'Closes in 2 s.', duration: 2000 })}
      >
        2 seconds
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ tone: 'info', message: 'Persistent toast.', duration: 0 })}
      >
        Persistent
      </Button>
    </div>
  );
}

/* ─── Props ─── */

const toastOptionsProps: PropRow[] = [
  { name: 'tone', type: '"success" | "info" | "warning" | "danger"', required: true, description: 'Visual and semantic tone of the toast.' },
  { name: 'message', type: 'string', required: true, description: 'Displayed message. Keep it short (≤ 80 characters).' },
  { name: 'action', type: 'ToastAction', description: 'Reversal action — label + onClick. Closes after running.' },
  { name: 'duration', type: 'number', default: '5000', description: 'Auto-dismiss in ms. 0 = persistent until manual close.' },
];

const toastActionProps: PropRow[] = [
  { name: 'label', type: 'string', required: true, description: 'Action button text (e.g., "Undo").' },
  { name: 'onClick', type: '() => void', required: true, description: 'Called when the action is clicked. The toast closes automatically.' },
];

const toastProviderProps: PropRow[] = [
  { name: 'children', type: 'ReactNode', required: true, description: 'Application tree wrapped by the provider.' },
];

export function ToastPage() {
  return (
    <DocPage
      group="Overlay & Feedback"
      title="Toast"
      lead="Ephemeral feedback messages shown in the top-right corner. Up to 3 at a time, configurable auto-dismiss, pause on hover and a reversal action."
      source="components/toast-banner.md"
    >
      <DocSection title="Tones" description="Each tone carries an icon + semantic color. The useToast() hook is available because ToastProvider already wraps the application.">
        <Example
          align="center"
          code={`function Demo() {
  const { toast } = useToast();
  return (
    <>
      <Button onClick={() => toast({ tone: 'success', message: 'Project saved successfully.' })}>
        Success
      </Button>
      <Button onClick={() => toast({ tone: 'info', message: 'Sync started.' })}>
        Info
      </Button>
      <Button onClick={() => toast({ tone: 'warning', message: '80% limit reached.' })}>
        Warning
      </Button>
      <Button onClick={() => toast({ tone: 'danger', message: 'Failed to send.' })}>
        Error
      </Button>
    </>
  );
}`}
        >
          <ToneDemo />
        </Example>
      </DocSection>

      <DocSection title="With action (Undo)" description="Add an action with label and onClick for reversible operations. The toast closes automatically when the action is clicked.">
        <Example
          align="center"
          code={`const { toast } = useToast();

toast({
  tone: 'info',
  message: 'Item moved to trash.',
  action: {
    label: 'Undo',
    onClick: () => restoreItem(),
  },
});`}
        >
          <ActionDemo />
        </Example>
      </DocSection>

      <DocSection title="Duration" description="duration in ms controls the auto-dismiss. Pass 0 for a persistent toast (manual close only).">
        <Example
          align="center"
          code={`// Closes in 2 seconds
toast({ tone: 'success', message: 'Saved!', duration: 2000 });

// Persistent (does not close on its own)
toast({ tone: 'info', message: 'Awaiting confirmation...', duration: 0 });`}
        >
          <DurationDemo />
        </Example>
      </DocSection>

      <DocSection title="Best practices">
        <DoDont
          dos={[
            'Keep messages short and in the past tense: "Project saved", "File sent".',
            'Use tone="danger" for errors that need immediate attention (aria-live assertive).',
            'Offer action="Undo" for reversible destructive operations.',
            'Prefer a long duration (8000+) for messages with an action.',
          ]}
          donts={[
            'Do not use toast for form errors — use inline messages on the field.',
            'Do not stack more than 3 toasts — the provider discards the oldest ones automatically.',
            'Do not show critical information only in a toast — it disappears.',
          ]}
        />
      </DocSection>

      <DocSection title="Properties">
        <PropsTable title="ToastOptions" rows={toastOptionsProps} />
        <PropsTable title="ToastAction" rows={toastActionProps} />
        <PropsTable title="ToastProviderProps" rows={toastProviderProps} />
      </DocSection>
    </DocPage>
  );
}
