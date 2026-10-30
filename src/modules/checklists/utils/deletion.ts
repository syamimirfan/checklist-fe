import type { ChecklistItem } from "../models/checklists.model";

/** An item can only be deleted once it's completed. */
export const canDeleteItem = (item: ChecklistItem) => item.isChecked;

/** A checklist can only be deleted when it has no items, or every item is completed. */
export const canDeleteChecklist = (items: ChecklistItem[]) =>
  items.every(canDeleteItem);
