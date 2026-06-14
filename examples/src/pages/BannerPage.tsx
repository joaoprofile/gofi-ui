import { useState } from 'react';
import { Banner } from '@/components/Banner';
import { Button } from '@/components/Button';
import { DocPage, DocSection, Example, PropsTable, DoDont, type PropRow } from '../components';

/* ─── Demo: all tones ─── */

function TonesDemo() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Banner tone="info" title="Update available">
        A new version of the platform will be deployed in 15 minutes. Save your work.
      </Banner>
      <Banner tone="success" title="Payment confirmed">
        Your Pro plan was activated successfully. The receipt was sent by email.
      </Banner>
      <Banner tone="warning" title="Integration disconnected">
        The connection to Google Drive has expired. Reconnect to keep syncing.
      </Banner>
      <Banner tone="danger" title="Critical data error">
        We could not save the changes. Check your connection and try again.
      </Banner>
    </div>
  );
}

/* ─── Demo: with action ─── */

function ActionDemo() {
  return (
    <div className="w-full">
      <Banner
        tone="warning"
        title="Storage limit almost reached"
        action={<Button size="sm">Upgrade</Button>}
      >
        You have used 92% of the available space. Upgrade to keep storing files.
      </Banner>
    </div>
  );
}

/* ─── Demo: with dismiss ─── */

function DismissDemo() {
  const [visible, setVisible] = useState(true);
  return (
    <div className="w-full">
      {visible ? (
        <Banner
          tone="info"
          title="New: batch export"
          onDismiss={() => setVisible(false)}
        >
          You can now export up to 500 records at once. Open Exports in the side menu.
        </Banner>
      ) : (
        <div className="flex items-center gap-3">
          <span className="text-body-sm text-ink-secondary">Banner closed.</span>
          <Button size="sm" variant="secondary" onClick={() => setVisible(true)}>
            Show again
          </Button>
        </div>
      )}
    </div>
  );
}

/* ─── Demo: no title (inline) ─── */

function InlineDemo() {
  return (
    <div className="w-full">
      <Banner tone="danger">
        Your data was not saved. The session expired — log in again.
      </Banner>
    </div>
  );
}

/* ─── Props ─── */

const bannerProps: PropRow[] = [
  { name: 'tone', type: '"success" | "warning" | "danger" | "info"', required: true, description: 'Visual and semantic tone. Danger uses role="alert"; the others use role="status".' },
  { name: 'title', type: 'string', description: 'Bold title above the body (optional).' },
  { name: 'children', type: 'ReactNode', required: true, description: 'Message body.' },
  { name: 'action', type: 'ReactNode', description: 'Resolution action (e.g., <Button>). Rendered below the body.' },
  { name: 'onDismiss', type: '() => void', description: 'When set, shows a "Close" button (ghost IconButton).' },
];

export function BannerPage() {
  return (
    <DocPage
      group="Overlay & Feedback"
      title="Banner"
      lead="Persistent, contextual notice placed at the top of a section or page. Always visible until dismissed. Use for states that require ongoing attention."
      source="components/toast-banner.md"
    >
      <DocSection title="Tones" description="Each tone carries an icon and semantic background. tone='danger' uses role='alert' for screen readers.">
        <Example
          code={`<Banner tone="info" title="Update available">
  A new version will be deployed in 15 minutes.
</Banner>
<Banner tone="success" title="Payment confirmed">
  Your Pro plan was activated successfully.
</Banner>
<Banner tone="warning" title="Integration disconnected">
  Reconnect Google Drive to sync.
</Banner>
<Banner tone="danger" title="Critical data error">
  We could not save. Check your connection.
</Banner>`}
        >
          <TonesDemo />
        </Example>
      </DocSection>

      <DocSection title="With action" description="Add an action with a Button to offer immediate resolution of the problem.">
        <Example
          code={`<Banner
  tone="warning"
  title="Storage limit almost reached"
  action={<Button size="sm">Upgrade</Button>}
>
  You have used 92% of the available space.
</Banner>`}
        >
          <ActionDemo />
        </Example>
      </DocSection>

      <DocSection title="With close (dismiss)" description="onDismiss shows an X button. The visibility state is managed by the parent.">
        <Example
          code={`const [visible, setVisible] = useState(true);

{visible && (
  <Banner
    tone="info"
    title="New: batch export"
    onDismiss={() => setVisible(false)}
  >
    Export up to 500 records at once.
  </Banner>
)}`}
        >
          <DismissDemo />
        </Example>
      </DocSection>

      <DocSection title="No title (inline)" description="The title is optional — useful for short, direct notices.">
        <Example
          code={`<Banner tone="danger">
  Your data was not saved. The session expired.
</Banner>`}
        >
          <InlineDemo />
        </Example>
      </DocSection>

      <DocSection title="Best practices">
        <DoDont
          dos={[
            'Use Banner for states that persist until the user acts (e.g., expiring session, broken integration).',
            'Always offer an exit route: a resolution action or a close button.',
            'Keep the title to 1 line and the body to ≤ 2 lines.',
            'Use tone="danger" only for errors that block the flow.',
          ]}
          donts={[
            'Do not stack more than 2 banners — prioritize and resolve one at a time.',
            'Do not use Banner for temporary feedback — use Toast.',
            'Do not omit the text content (children) relying on the title alone.',
          ]}
        />
      </DocSection>

      <DocSection title="Properties">
        <PropsTable title="BannerProps" rows={bannerProps} />
      </DocSection>
    </DocPage>
  );
}
