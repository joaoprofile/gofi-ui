import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import {
  addDays,
  addMonths,
  addYears,
  buildMonthGrid,
  formatMonthYear,
  getMonthNames,
  getWeekdayNames,
  isBefore,
  isInRange,
  isOutOfRange,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  toKey,
  type DateRange,
  type Weekday,
} from './dateUtils';

/** Translatable strings for screen readers and navigation controls. */
export interface CalendarLabels {
  previousMonth: string;
  nextMonth: string;
  previousYear: string;
  nextYear: string;
  /** Accessible name of the header button that switches to month/year view. */
  switchView: string;
}

const DEFAULT_LABELS: CalendarLabels = {
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  previousYear: 'Previous year',
  nextYear: 'Next year',
  switchView: 'Switch view',
};

interface CalendarBaseProps {
  /** `day` (full day grid) or `month` (month/year only picker). */
  granularity?: 'day' | 'month';
  /** Uncontrolled initial month in view. Defaults to the value or today. */
  defaultMonth?: Date;
  /** Controlled month in view. */
  month?: Date;
  onMonthChange?: (month: Date) => void;
  /** BCP-47 locale that drives month/weekday names and ordering, e.g. 'pt-BR'. */
  locale?: string;
  /** First column of the week (0 = Sunday, 1 = Monday…). Default 0. */
  weekStartsOn?: Weekday;
  minDate?: Date | null;
  maxDate?: Date | null;
  /** Disables individual days (e.g. weekends, holidays). */
  isDateDisabled?: (date: Date) => boolean;
  /** Override the built-in (English) accessibility/navigation strings. */
  labels?: Partial<CalendarLabels>;
  /** Focus the active day on mount (used when opened from a popover). */
  autoFocus?: boolean;
  className?: string;
}

export interface CalendarSingleProps extends CalendarBaseProps {
  mode?: 'single';
  value?: Date | null;
  onChange?: (date: Date) => void;
}

export interface CalendarRangeProps extends CalendarBaseProps {
  mode: 'range';
  value?: DateRange | null;
  onChange?: (range: DateRange) => void;
}

export type CalendarProps = CalendarSingleProps | CalendarRangeProps;

type View = 'days' | 'months' | 'years';

const cellBase =
  'inline-flex size-9 items-center justify-center rounded-md text-body-sm tabular-nums ' +
  'transition-colors duration-100 ease-standard ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

/**
 * Configurable calendar — the core of the DatePicker family.
 *
 * - `mode="single"` selects one date; `mode="range"` selects a start/end range.
 * - `granularity="month"` turns it into a month/year picker.
 * - Fully localized through `locale` (Intl) with translatable `labels`.
 *
 * Keyboard (day grid): arrows move by day/week, PageUp/Down by month,
 * Home/End to week edges, Enter/Space selects.
 */
export function Calendar(props: CalendarProps) {
  const {
    granularity = 'day',
    defaultMonth,
    month: controlledMonth,
    onMonthChange,
    locale,
    weekStartsOn = 0,
    minDate,
    maxDate,
    isDateDisabled,
    labels: labelsProp,
    autoFocus = false,
    className,
  } = props;

  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const isRange = props.mode === 'range';
  const range: DateRange = isRange
    ? (props.value as DateRange | null | undefined) ?? { start: null, end: null }
    : { start: null, end: null };
  const single = !isRange ? ((props.value as Date | null | undefined) ?? null) : null;

  const today = startOfDay(new Date());
  const initialMonth = controlledMonth ?? defaultMonth ?? single ?? range.start ?? today;

  const [uncontrolledMonth, setUncontrolledMonth] = useState<Date>(startOfMonth(initialMonth));
  const viewMonth = controlledMonth ? startOfMonth(controlledMonth) : uncontrolledMonth;

  const [view, setView] = useState<View>(granularity === 'month' ? 'months' : 'days');
  const [focusedDate, setFocusedDate] = useState<Date>(startOfDay(initialMonth));
  const [hovered, setHovered] = useState<Date | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const focusKeyRef = useRef<string | null>(autoFocus ? toKey(startOfDay(initialMonth)) : null);

  // After a keyboard move (or autoFocus), move DOM focus to the day button.
  useEffect(() => {
    if (!focusKeyRef.current || !gridRef.current) return;
    const el = gridRef.current.querySelector<HTMLButtonElement>(
      `[data-day="${focusKeyRef.current}"]`,
    );
    el?.focus();
    focusKeyRef.current = null;
  });

  function changeViewMonth(next: Date) {
    const normalized = startOfMonth(next);
    if (!controlledMonth) setUncontrolledMonth(normalized);
    onMonthChange?.(normalized);
  }

  function commitDay(day: Date) {
    if (isOutOfRange(day, minDate, maxDate) || isDateDisabled?.(day)) return;
    if (isRange) {
      const r = range;
      const next: DateRange =
        !r.start || (r.start && r.end)
          ? { start: day, end: null }
          : isBefore(day, r.start)
            ? { start: day, end: r.start }
            : { start: r.start, end: day };
      (props.onChange as ((r: DateRange) => void) | undefined)?.(next);
    } else {
      (props.onChange as ((d: Date) => void) | undefined)?.(day);
    }
  }

  function moveFocus(next: Date) {
    setFocusedDate(next);
    if (!isSameMonth(next, viewMonth)) changeViewMonth(next);
    focusKeyRef.current = toKey(next);
  }

  function onGridKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const f = focusedDate;
    switch (e.key) {
      case 'ArrowLeft': e.preventDefault(); return moveFocus(addDays(f, -1));
      case 'ArrowRight': e.preventDefault(); return moveFocus(addDays(f, 1));
      case 'ArrowUp': e.preventDefault(); return moveFocus(addDays(f, -7));
      case 'ArrowDown': e.preventDefault(); return moveFocus(addDays(f, 7));
      case 'Home': e.preventDefault(); return moveFocus(addDays(f, -((f.getDay() - weekStartsOn + 7) % 7)));
      case 'End': e.preventDefault(); return moveFocus(addDays(f, 6 - ((f.getDay() - weekStartsOn + 7) % 7)));
      case 'PageUp': e.preventDefault(); return moveFocus(addMonths(f, -1));
      case 'PageDown': e.preventDefault(); return moveFocus(addMonths(f, 1));
      case 'Enter':
      case ' ': e.preventDefault(); return commitDay(f);
    }
  }

  /* ── Header ─────────────────────────────────────────── */

  const headerLabel =
    view === 'days'
      ? formatMonthYear(viewMonth, locale)
      : view === 'months'
        ? String(viewMonth.getFullYear())
        : `${yearRangeStart(viewMonth)} – ${yearRangeStart(viewMonth) + 11}`;

  function onPrev() {
    if (view === 'days') changeViewMonth(addMonths(viewMonth, -1));
    else if (view === 'months') changeViewMonth(addYears(viewMonth, -1));
    else changeViewMonth(addYears(viewMonth, -12));
  }
  function onNext() {
    if (view === 'days') changeViewMonth(addMonths(viewMonth, 1));
    else if (view === 'months') changeViewMonth(addYears(viewMonth, 1));
    else changeViewMonth(addYears(viewMonth, 12));
  }

  const navLabel =
    view === 'days'
      ? { prev: labels.previousMonth, next: labels.nextMonth }
      : { prev: labels.previousYear, next: labels.nextYear };

  return (
    <div className={cn('w-72 select-none', className)}>
      {/* Navigation header */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <NavButton ariaLabel={navLabel.prev} onClick={onPrev}>
          <ChevronLeft className="size-5" aria-hidden />
        </NavButton>

        <button
          type="button"
          onClick={() => setView(view === 'days' ? 'months' : view === 'months' ? 'years' : 'days')}
          aria-label={labels.switchView}
          className="rounded-md px-2 py-1 text-body-sm font-semibold capitalize text-ink hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          {headerLabel}
        </button>

        <NavButton ariaLabel={navLabel.next} onClick={onNext}>
          <ChevronRight className="size-5" aria-hidden />
        </NavButton>
      </div>

      {/* Day grid */}
      {view === 'days' && (
        <div>
          <div className="mb-1 grid grid-cols-7" role="presentation">
            {getWeekdayNames(locale, weekStartsOn, 'short').map((w, i) => (
              <span key={i} className="grid h-8 place-items-center text-caption font-medium text-ink-secondary">
                {w}
              </span>
            ))}
          </div>

          <div
            ref={gridRef}
            role="grid"
            aria-label={formatMonthYear(viewMonth, locale)}
            onKeyDown={onGridKeyDown}
            className="grid grid-cols-7 gap-y-0.5"
          >
            {buildMonthGrid(viewMonth, weekStartsOn).map((day) => {
              const outside = !isSameMonth(day, viewMonth);
              const disabled = isOutOfRange(day, minDate, maxDate) || Boolean(isDateDisabled?.(day));
              const selected = isRange
                ? isSameDay(day, range.start) || isSameDay(day, range.end)
                : isSameDay(day, single);
              const previewEnd = isRange && range.start && !range.end ? hovered : range.end;
              const inRange = isRange && isInRange(day, range.start, previewEnd);
              const isToday = isSameDay(day, today);
              const isFocusTarget = isSameDay(day, focusedDate);

              return (
                <div key={toKey(day)} role="gridcell" className="grid place-items-center">
                  <button
                    type="button"
                    data-day={toKey(day)}
                    tabIndex={isFocusTarget ? 0 : -1}
                    disabled={disabled}
                    aria-pressed={selected}
                    aria-current={isToday ? 'date' : undefined}
                    onClick={() => { setFocusedDate(day); commitDay(day); }}
                    onMouseEnter={() => isRange && setHovered(day)}
                    className={cn(
                      cellBase,
                      selected && 'bg-action font-semibold text-white hover:bg-action-hover',
                      !selected && inRange && 'bg-action/15 rounded-none text-ink',
                      !selected && !inRange && !disabled && 'text-ink hover:bg-hover',
                      !selected && outside && 'text-ink-secondary/60',
                      !selected && isToday && 'ring-1 ring-inset ring-action',
                      disabled && 'cursor-not-allowed text-ink-secondary/40',
                    )}
                  >
                    {day.getDate()}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Month grid */}
      {view === 'months' && (
        <div className="grid grid-cols-3 gap-1">
          {getMonthNames(locale, 'short').map((name, i) => {
            const monthDate = new Date(viewMonth.getFullYear(), i, 1);
            const monthSelected =
              granularity === 'month' &&
              (isRange
                ? isSameMonth(monthDate, range.start ?? new Date(0)) || isSameMonth(monthDate, range.end ?? new Date(0))
                : single != null && isSameMonth(monthDate, single));
            const monthDisabled = isMonthOutOfRange(monthDate, minDate, maxDate);
            return (
              <button
                key={i}
                type="button"
                disabled={monthDisabled}
                aria-pressed={monthSelected}
                onClick={() => {
                  if (granularity === 'month') commitDay(monthDate);
                  else { changeViewMonth(monthDate); setView('days'); }
                }}
                className={cn(
                  'h-10 rounded-md text-body-sm capitalize transition-colors duration-100 ease-standard',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                  monthSelected ? 'bg-action font-semibold text-white' : 'text-ink hover:bg-hover',
                  monthDisabled && 'cursor-not-allowed text-ink-secondary/40',
                )}
              >
                {name}
              </button>
            );
          })}
        </div>
      )}

      {/* Year grid */}
      {view === 'years' && (
        <div className="grid grid-cols-4 gap-1">
          {Array.from({ length: 12 }, (_, i) => yearRangeStart(viewMonth) + i).map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => {
                changeViewMonth(new Date(year, viewMonth.getMonth(), 1));
                setView('months');
              }}
              className={cn(
                'h-10 rounded-md text-body-sm tabular-nums transition-colors duration-100 ease-standard',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                year === viewMonth.getFullYear() ? 'bg-action font-semibold text-white' : 'text-ink hover:bg-hover',
              )}
            >
              {year}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── helpers local to the component ── */

function yearRangeStart(d: Date): number {
  const y = d.getFullYear();
  return y - (y % 12);
}

/** A whole month is out of range when it ends before `min` or starts after `max`. */
function isMonthOutOfRange(monthStart: Date, min?: Date | null, max?: Date | null): boolean {
  const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
  if (min && isBefore(monthEnd, min)) return true;
  if (max && isBefore(max, monthStart)) return true;
  return false;
}

function NavButton({
  ariaLabel,
  onClick,
  children,
}: {
  ariaLabel: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="inline-flex size-9 items-center justify-center rounded-full bg-hover text-ink-secondary transition-colors duration-100 ease-standard hover:bg-border hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      {children}
    </button>
  );
}
