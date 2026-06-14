import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface DocPageProps {
  /** Group (e.g. "Forms") shown as an eyebrow above the title. */
  group?: string;
  title: string;
  /** One-sentence description — what it is and when to use it. */
  lead: string;
  /** Spec/source path (e.g. "components/button.md"). */
  source?: string;
  children: ReactNode;
}

/** Shell of a component page: header + spaced sections. */
export function DocPage({ group, title, lead, source, children }: DocPageProps) {
  return (
    <article className="flex flex-col gap-10 pb-24">
      <header className="flex flex-col gap-3 border-b border-border pb-8">
        {group && (
          <span className="text-caption font-semibold uppercase tracking-wider text-action">
            {group}
          </span>
        )}
        <h1 className="text-display text-ink">{title}</h1>
        <p className="max-w-[65ch] text-body text-ink-secondary">{lead}</p>
        {source && (
          <p className="text-caption text-ink-secondary">
            Spec: <code className="font-mono">{source}</code>
          </p>
        )}
      </header>
      {children}
    </article>
  );
}

export interface DocSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/** Thematic section within a page (with an anchor id derived from the title). */
export function DocSection({ title, description, children, className }: DocSectionProps) {
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return (
    <section id={id} className={cn('flex scroll-mt-24 flex-col gap-4', className)}>
      <div className="flex flex-col gap-1">
        <h2 className="text-h2 text-ink">{title}</h2>
        {description && <p className="max-w-[65ch] text-body-sm text-ink-secondary">{description}</p>}
      </div>
      {children}
    </section>
  );
}

/** Running-text block (a11y, do/don't, notes) with reading width. */
export function Prose({ children }: { children: ReactNode }) {
  return <div className="flex max-w-[65ch] flex-col gap-2 text-body-sm text-ink-secondary">{children}</div>;
}

export interface CalloutProps {
  tone?: 'info' | 'warning' | 'success' | 'danger';
  children: ReactNode;
}

const calloutTone = {
  info: 'bg-info-bg text-info',
  warning: 'bg-warning-bg text-warning',
  success: 'bg-success-bg text-success',
  danger: 'bg-danger-bg text-danger',
} as const;

/** Highlight for a rule/note within the docs. */
export function Callout({ tone = 'info', children }: CalloutProps) {
  return (
    <div className={cn('rounded-md px-4 py-3 text-body-sm', calloutTone[tone])}>
      <span className="text-ink">{children}</span>
    </div>
  );
}

/** Side-by-side "do / don't" list. */
export function DoDont({ dos, donts }: { dos: string[]; donts: string[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-border bg-success-bg/40 p-4">
        <p className="mb-2 text-body-sm font-semibold text-success">✓ Do</p>
        <ul className="flex list-inside list-disc flex-col gap-1 text-body-sm text-ink">
          {dos.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-border bg-danger-bg/40 p-4">
        <p className="mb-2 text-body-sm font-semibold text-danger">✕ Don't</p>
        <ul className="flex list-inside list-disc flex-col gap-1 text-body-sm text-ink">
          {donts.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
