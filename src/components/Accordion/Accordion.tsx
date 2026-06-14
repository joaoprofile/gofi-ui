import { useCallback, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

/* ─────────────────────────────────────────────
 * Types
 * ───────────────────────────────────────────── */

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** single: only one open at a time; multiple: several open. */
  mode?: 'single' | 'multiple';
  /** IDs open initially. */
  defaultOpen?: string[];
  className?: string;
}

/* ─────────────────────────────────────────────
 * AccordionPanel — height transition via grid trick
 *
 * Technique: grid-rows animates from 0fr → 1fr, avoiding JS to measure height.
 * Respects prefers-reduced-motion via the global rule in theme.css.
 * ───────────────────────────────────────────── */

interface AccordionPanelProps {
  open: boolean;
  itemId: string;
  children: ReactNode;
}

function AccordionPanel({ open, itemId, children }: AccordionPanelProps) {
  return (
    <div
      id={`acc-panel-${itemId}`}
      role="region"
      aria-labelledby={`acc-btn-${itemId}`}
      /* grid trick: animates grid-template-rows from 0fr ↔ 1fr without JS */
      style={{
        display: 'grid',
        gridTemplateRows: open ? '1fr' : '0fr',
        transition: 'grid-template-rows 200ms var(--ease-standard)',
      }}
    >
      {/* overflow:hidden on the inner child is the secret of the technique */}
      <div style={{ overflow: 'hidden' }}>
        <div className="px-4 pb-4 pt-2 text-body text-ink-secondary">{children}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
 * Accordion
 * ───────────────────────────────────────────── */

/**
 * Expandable sections to reveal content on demand.
 * The header is a `<button aria-expanded aria-controls>`, the panel uses `role="region"`.
 * Height transition via CSS grid trick — no JS measurement, no flash.
 * Respects `prefers-reduced-motion` via a global CSS rule.
 */
export function Accordion({
  items,
  mode = 'single',
  defaultOpen = [],
  className,
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(defaultOpen));

  const toggle = useCallback(
    (id: string) => {
      setOpenIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (mode === 'single') next.clear();
          next.add(id);
        }
        return next;
      });
    },
    [mode],
  );

  return (
    <div
      className={cn(
        'flex flex-col divide-y divide-border rounded-md border border-border bg-card',
        className,
      )}
    >
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <div key={item.id}>
            {/* Header — semantic button with h3 for heading hierarchy */}
            <h3 className="m-0">
              <button
                id={`acc-btn-${item.id}`}
                type="button"
                aria-expanded={isOpen}
                aria-controls={`acc-panel-${item.id}`}
                className={cn(
                  'flex w-full items-center justify-between gap-3 px-4 py-4',
                  'text-body font-semibold text-ink',
                  'transition-colors duration-100 ease-standard hover:bg-hover',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                  'first:rounded-t-md',
                )}
                onClick={() => toggle(item.id)}
              >
                {item.title}
                {/* Decorative chevron — aria-hidden, rotates on open */}
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    'size-5 shrink-0 text-ink-secondary',
                    'transition-transform duration-200 ease-standard',
                    isOpen && 'rotate-180',
                  )}
                />
              </button>
            </h3>

            {/* Expandable panel */}
            <AccordionPanel open={isOpen} itemId={item.id}>
              {item.content}
            </AccordionPanel>
          </div>
        );
      })}
    </div>
  );
}
