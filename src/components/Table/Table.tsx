import {
  useState,
  type ReactNode,
  type ChangeEvent,
} from 'react';
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import { EmptyState } from '@/components/EmptyState';

/* ─────────────────────────────────────────────
 * Public types
 * ───────────────────────────────────────────── */

export interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  /** Cell alignment: text on the left (default), number on the right. */
  align?: 'start' | 'end';
  /** Custom cell rendering (avatar+name, Badge, Progress, etc.). */
  render?: (row: T) => ReactNode;
}

export interface TableProps<T> {
  columns: Column<T>[];
  rows: T[];
  /** Extracts a unique key per row (for React key and selection). */
  rowKey: (row: T) => string;
  /** Shows a loading skeleton with aria-busy. */
  loading?: boolean;
  /** Active sort column and direction. */
  sort?: { key: string; dir: 'asc' | 'desc' };
  /** Called with the column key when clicking the sortable header. */
  onSort?: (key: string) => void;
  /** Enables a checkbox column with "select all". */
  selectable?: boolean;
  /** Content shown when `rows` is empty and not loading. */
  emptyState?: ReactNode;
  /** Row density. */
  density?: 'comfortable' | 'compact';
  className?: string;
}

/* ─────────────────────────────────────────────
 * Skeleton row (loading rows)
 * ───────────────────────────────────────────── */

function SkeletonRow({ colCount }: { colCount: number }) {
  return (
    <tr aria-hidden="true">
      {Array.from({ length: colCount }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 w-full animate-pulse rounded-sm bg-hover" />
        </td>
      ))}
    </tr>
  );
}

/* ─────────────────────────────────────────────
 * Sort icon
 * ───────────────────────────────────────────── */

function SortIcon({ active, dir }: { active: boolean; dir?: 'asc' | 'desc' }) {
  if (!active) {
    return <ArrowUpDown aria-hidden="true" className="size-4 text-ink-secondary" />;
  }
  if (dir === 'asc') {
    return <ChevronUp aria-hidden="true" className="size-4 text-action" />;
  }
  return <ChevronDown aria-hidden="true" className="size-4 text-action" />;
}

/* ─────────────────────────────────────────────
 * Table
 * ───────────────────────────────────────────── */

/**
 * Generic data table with sort, selection, loading skeleton and empty state.
 * Native HTML semantics: `<table>`, `<thead>`, `<tbody>`, `<th scope="col">`.
 * Accessibility: aria-sort on sortable headers, aria-busy on loading,
 * indeterminate on the select-all checkbox, tabular-nums on numeric columns.
 */
export function Table<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  sort,
  onSort,
  selectable = false,
  emptyState,
  density = 'comfortable',
  className,
}: TableProps<T>) {
  /* ── Internal selection state ── */
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allKeys = rows.map(rowKey);
  const allSelected = allKeys.length > 0 && allKeys.every((k) => selected.has(k));
  const someSelected = allKeys.some((k) => selected.has(k)) && !allSelected;

  function toggleAll(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      setSelected(new Set(allKeys));
    } else {
      setSelected(new Set());
    }
  }

  function toggleRow(key: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  /* ── Padding by density ── */
  const cellPad = density === 'compact' ? 'px-3 py-2' : 'px-4 py-3';

  /* ── Total columns (includes checkbox) ── */
  const totalCols = columns.length + (selectable ? 1 : 0);

  /* ── aria-sort mapped ── */
  function ariaSortValue(col: Column<T>): 'ascending' | 'descending' | 'none' {
    if (!col.sortable) return 'none';
    if (sort?.key === String(col.key)) {
      return sort.dir === 'asc' ? 'ascending' : 'descending';
    }
    return 'none';
  }

  return (
    <div className={cn('w-full overflow-x-auto rounded-surface border border-border bg-card', className)}>
      <table
        className="w-full border-collapse text-body-sm"
        aria-busy={loading || undefined}
      >
        <thead>
          <tr className="border-b border-border bg-sunken">
            {/* "Select all" checkbox */}
            {selectable && (
              <th scope="col" className={cn(cellPad, 'w-10 text-start')}>
                <input
                  type="checkbox"
                  aria-label="Select all"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={toggleAll}
                  className="size-4 cursor-pointer accent-action focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                />
                {someSelected && (
                  <span className="sr-only">{selected.size} selected</span>
                )}
              </th>
            )}

            {columns.map((col) => {
              const isActive = sort?.key === String(col.key);
              const sortVal = ariaSortValue(col);
              return (
                <th
                  key={String(col.key)}
                  scope="col"
                  aria-sort={col.sortable ? sortVal : undefined}
                  className={cn(
                    cellPad,
                    'font-table-head text-ink-secondary whitespace-nowrap',
                    col.align === 'end' ? 'text-end' : 'text-start',
                  )}
                >
                  {col.sortable && onSort ? (
                    <button
                      type="button"
                      onClick={() => onSort(String(col.key))}
                      className={cn(
                        'inline-flex items-center gap-1',
                        col.align === 'end' ? 'flex-row-reverse' : 'flex-row',
                        'hover:text-ink transition-colors duration-100',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus rounded-sm',
                        isActive && 'text-ink',
                      )}
                    >
                      {col.header}
                      <SortIcon active={isActive} dir={sort?.dir} />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            /* ── Skeleton: 5 placeholder rows ── */
            Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} colCount={totalCols} />
            ))
          ) : rows.length === 0 ? (
            /* ── Empty state ── */
            <tr>
              <td colSpan={totalCols}>
                {emptyState ?? (
                  <EmptyState
                    variant="no-results"
                    title="No data found"
                    description="Try adjusting the filters or add new items."
                  />
                )}
              </td>
            </tr>
          ) : (
            /* ── Data rows ── */
            rows.map((row) => {
              const key = rowKey(row);
              const isSelected = selected.has(key);
              return (
                <tr
                  key={key}
                  aria-selected={selectable ? isSelected : undefined}
                  className={cn(
                    'border-b border-border last:border-0',
                    'hover:bg-hover transition-colors duration-100 ease-standard',
                    isSelected && 'bg-brand/20',
                  )}
                >
                  {selectable && (
                    <td className={cn(cellPad, 'w-10')}>
                      <input
                        type="checkbox"
                        aria-label={`Select row`}
                        checked={isSelected}
                        onChange={() => toggleRow(key)}
                        className="size-4 cursor-pointer accent-action focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                      />
                    </td>
                  )}

                  {columns.map((col) => {
                    const value = row[col.key];
                    return (
                      <td
                        key={String(col.key)}
                        className={cn(
                          cellPad,
                          'text-ink',
                          col.align === 'end'
                            ? 'text-end tabular-nums'
                            : 'text-start',
                        )}
                      >
                        {col.render ? col.render(row) : String(value ?? '')}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
