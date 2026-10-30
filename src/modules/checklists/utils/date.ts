/**
 * Due dates are calendar dates (`YYYY-MM-DD`), not instants. Parsing them with
 * `new Date("2026-05-10")` would read them as UTC midnight and show the wrong day
 * west of Greenwich, so everything here works in local time.
 */

const pad = (value: number) => String(value).padStart(2, "0");

export function toDateInputValue(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Today's date plus `offset` days (negative for the past), as `YYYY-MM-DD`. */
export function daysFromNow(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return toDateInputValue(date);
}

/** An ISO timestamp `hours` hours in the past. */
export function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function parseDateOnly(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** The calendar day before `value` (both `YYYY-MM-DD`). */
export function dayBefore(value: string): string {
  const date = parseDateOnly(value);
  date.setDate(date.getDate() - 1);
  return toDateInputValue(date);
}

/** "May 10" */
export function formatDueDate(value: string): string {
  return parseDateOnly(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/** "May 10, 2026" */
export function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Strictly before today. ISO dates sort lexically, so a string compare is enough. */
export function isOverdue(dueDate: string): boolean {
  return dueDate < daysFromNow(0);
}

/** Due today, within the next `days` days, or already overdue. */
export function isDueWithin(dueDate: string, days: number): boolean {
  return dueDate <= daysFromNow(days);
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** "just now", "5m ago", "3h ago", "2d ago", then a plain date after a week. */
export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < MINUTE) return "just now";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h ago`;
  if (diff < 7 * DAY) return `${Math.floor(diff / DAY)}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
