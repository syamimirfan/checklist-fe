import type { ChecklistItem } from "../models/checklists.model";

export function indexById<T extends { id: string }>(list: T[]): Map<string, T> {
  const map = new Map<string, T>();
  for (const entry of list) map.set(entry.id, entry);
  return map;
}

export function groupBy<T>(list: T[], key: (entry: T) => string): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const entry of list) {
    const groupKey = key(entry);
    const group = groups.get(groupKey);
    if (group) group.push(entry);
    else groups.set(groupKey, [entry]);
  }
  return groups;
}

export function progressOf(items: ChecklistItem[]) {
  const done = items.filter((item) => item.isChecked).length;
  const total = items.length;
  return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
}

/** `rejected` thunks reject with a plain SerializedError, not an Error instance, so don't use `instanceof Error`. */
export function messageOf(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "message" in error) {
    const { message } = error;
    if (typeof message === "string" && message) return message;
  }
  return fallback;
}
