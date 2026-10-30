import { useAppSelector } from "../../../app/hooks";
import { selectChecklistsById } from "../selectors";
import { dayBefore } from "../utils/date";

/**
 * The latest due date an item of this checklist may have: the day before the checklist's own
 * due date, so the due date itself and anything after it can't be picked (use it as the date
 * input's `max`). `undefined` when the checklist has no due date, which means no limit.
 */
export function useItemDueDateMax(checklistId: string): string | undefined {
  const checklistsById = useAppSelector(selectChecklistsById);
  const checklistDueDate = checklistsById.get(checklistId)?.dueDate;
  return checklistDueDate ? dayBefore(checklistDueDate) : undefined;
}

/** Whether `value` (`YYYY-MM-DD`, or empty for none) is within `max`. ISO dates sort lexically. */
export const isWithinDueDateMax = (value: string, max: string | undefined) =>
  value === "" || max === undefined || value <= max;
