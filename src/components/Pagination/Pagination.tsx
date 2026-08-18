import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

/* ─────────────────────────────────────────────
 * Types
 * ───────────────────────────────────────────── */

export interface PaginationProps {
  /** Current page (1-based). */
  page: number;
  /** Total number of pages. */
  pageCount: number;
  /** Called with the new page when navigating. */
  onChange: (page: number) => void;
  /** Number of sibling pages around the current page (default 1). */
  siblingCount?: number;
  className?: string;
}

/* ─────────────────────────────────────────────
 * Utility: generate page range with "..."
 * ───────────────────────────────────────────── */

function buildPages(page: number, pageCount: number, siblingCount: number): Array<number | '...'> {
  /* Always show: 1, last, current ± siblings */
  const siblings = siblingCount;
  const leftSibling = Math.max(2, page - siblings);
  const rightSibling = Math.min(pageCount - 1, page + siblings);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < pageCount - 1;

  const pages: Array<number | '...'> = [1];

  if (showLeftDots) {
    pages.push('...');
  } else {
    for (let i = 2; i < leftSibling; i++) pages.push(i);
  }

  for (let i = leftSibling; i <= rightSibling; i++) pages.push(i);

  if (showRightDots) {
    pages.push('...');
  } else {
    for (let i = rightSibling + 1; i < pageCount; i++) pages.push(i);
  }

  if (pageCount > 1) pages.push(pageCount);

  return pages;
}

/* ─────────────────────────────────────────────
 * Pagination
 * ───────────────────────────────────────────── */

/**
 * Page navigation for a collection.
 * `<nav aria-label="Pagination">` with a semantic list.
 * Current page with `aria-current="page"` and `bg-action` background.
 */
export function Pagination({
  page,
  pageCount,
  onChange,
  siblingCount = 1,
  className,
}: PaginationProps) {
  if (pageCount <= 1) return null;

  const pages = buildPages(page, pageCount, siblingCount);
  const hasPrev = page > 1;
  const hasNext = page < pageCount;

  const pageButtonClass = (p: number) =>
    cn(
      'inline-flex size-9 items-center justify-center rounded-control text-body-sm font-control',
      'transition-colors duration-100 ease-standard tabular-nums',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
      p === page
        ? 'bg-action text-on-secondary'
        : 'text-ink hover:bg-hover',
    );

  const arrowClass = (enabled: boolean) =>
    cn(
      'inline-flex size-9 shrink-0 items-center justify-center rounded-control',
      'bg-hover text-ink-secondary',
      'transition-colors duration-100 ease-standard',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
      enabled ? 'hover:bg-border hover:text-ink' : 'pointer-events-none opacity-40',
    );

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex w-full items-center justify-between gap-2', className)}
    >
      {/* Previous button */}
      <button
        type="button"
        aria-label="Previous page"
        disabled={!hasPrev}
        onClick={() => hasPrev && onChange(page - 1)}
        className={arrowClass(hasPrev)}
      >
        <ChevronLeft aria-hidden="true" className="size-5" />
      </button>

      {/* Page list */}
      <ol className="flex items-center gap-1" aria-label="Page list">
        {pages.map((p, i) =>
          p === '...' ? (
            <li key={`dots-${i}`} aria-hidden="true">
              <span className="inline-flex size-9 items-center justify-center text-body-sm text-ink-secondary select-none">
                …
              </span>
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                aria-label={`Page ${p}`}
                aria-current={p === page ? 'page' : undefined}
                onClick={() => onChange(p)}
                className={pageButtonClass(p)}
              >
                {p}
              </button>
            </li>
          ),
        )}
      </ol>

      {/* Next button */}
      <button
        type="button"
        aria-label="Next page"
        disabled={!hasNext}
        onClick={() => hasNext && onChange(page + 1)}
        className={arrowClass(hasNext)}
      >
        <ChevronRight aria-hidden="true" className="size-5" />
      </button>
    </nav>
  );
}
