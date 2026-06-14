import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { CodeBlock } from './CodeBlock';

export interface ExampleProps {
  /** Variation title (e.g. "Variants", "Sizes"). */
  title?: string;
  /** Short description of what the variation demonstrates. */
  description?: string;
  /** Source code shown below the preview (string). */
  code?: string;
  /** Preview alignment. */
  align?: 'start' | 'center';
  /** Preview on the page background (true) or card background (false, default). */
  surface?: 'card' | 'page';
  children: ReactNode;
}

/**
 * Example block in the style of popular docs: live component preview +
 * copyable code right below it.
 */
export function Example({
  title,
  description,
  code,
  align = 'start',
  surface = 'card',
  children,
}: ExampleProps) {
  return (
    <section className="flex flex-col gap-3">
      {title && <h3 className="text-h3 text-ink">{title}</h3>}
      {description && <p className="text-body-sm text-ink-secondary">{description}</p>}
      <div className="overflow-hidden rounded-lg border border-border">
        <div
          className={cn(
            'flex flex-wrap gap-4 p-8',
            surface === 'page' ? 'bg-page' : 'bg-card',
            align === 'center' ? 'items-center justify-center' : 'items-start',
          )}
        >
          {children}
        </div>
        {code && (
          <div className="border-t border-border">
            <CodeBlock code={code} />
          </div>
        )}
      </div>
    </section>
  );
}
