/**
 * Date helpers for the Calendar / DatePicker family.
 * Pure functions over the native `Date`, working in LOCAL time (we only ever
 * deal with year/month/day parts, never UTC) to avoid timezone drift.
 * Localization (month/weekday names, formatting) is delegated to `Intl`.
 */

/** 0 = Sunday … 6 = Saturday. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** A start/end selection. Either end may be null while the range is being built. */
export interface DateRange {
  start: Date | null;
  end: Date | null;
}

/** Midnight of the given date, in local time. */
export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** First day of the date's month. */
export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/** Last day of the date's month. */
export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

export function addYears(d: Date, amount: number): Date {
  return new Date(d.getFullYear() + amount, d.getMonth(), 1);
}

/** True when `a` is an earlier calendar day than `b`. */
export function isBefore(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

/** True when `day` falls within [start, end] inclusive (by calendar day). */
export function isInRange(day: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const t = startOfDay(day).getTime();
  return t >= startOfDay(start).getTime() && t <= startOfDay(end).getTime();
}

export function addDays(d: Date, amount: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + amount);
}

export function addMonths(d: Date, amount: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + amount, 1);
}

export function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/** True when `d` falls strictly outside the optional [min, max] range. */
export function isOutOfRange(d: Date, min?: Date | null, max?: Date | null): boolean {
  const day = startOfDay(d).getTime();
  if (min && day < startOfDay(min).getTime()) return true;
  if (max && day > startOfDay(max).getTime()) return true;
  return false;
}

/** Stable key (YYYY-MM-DD) used as a DOM hook and React key. */
export function toKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/**
 * 42 cells (6 weeks) covering `viewMonth`, padded with the trailing/leading
 * days of the adjacent months so the grid is always rectangular.
 */
export function buildMonthGrid(viewMonth: Date, weekStartsOn: Weekday): Date[] {
  const first = startOfMonth(viewMonth);
  const offset = (first.getDay() - weekStartsOn + 7) % 7;
  const gridStart = addDays(first, -offset);
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}

/** Localized weekday headers, ordered from `weekStartsOn`. */
export function getWeekdayNames(
  locale: string | undefined,
  weekStartsOn: Weekday,
  format: 'narrow' | 'short' | 'long' = 'short',
): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: format });
  // 2021-08-01 is a Sunday — a stable anchor for weekday ordering.
  const sunday = new Date(2021, 7, 1);
  return Array.from({ length: 7 }, (_, i) => fmt.format(addDays(sunday, (weekStartsOn + i) % 7)));
}

/** e.g. "June 2026" / "junho de 2026", per `locale`. */
export function formatMonthYear(d: Date, locale?: string): string {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(d);
}

/** Localized list of the 12 month names (January…December). */
export function getMonthNames(
  locale: string | undefined,
  format: 'short' | 'long' = 'short',
): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { month: format });
  return Array.from({ length: 12 }, (_, i) => fmt.format(new Date(2021, i, 1)));
}

/** Localized date string. Defaults to a medium date style. */
export function formatDate(
  d: Date,
  locale?: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
): string {
  return new Intl.DateTimeFormat(locale, options).format(d);
}
