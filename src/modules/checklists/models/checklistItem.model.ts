import type { ChecklistItem } from "./checklists.model";

export interface ItemRowProps {
  item: ChecklistItem;
  /** Workspace the item's checklist belongs to; scopes the assignee options. */
  workspaceId: string;
}

export interface ItemDetailsProps {
  item: ChecklistItem;
  workspaceId: string;
}

export interface ItemCommentsProps {
  item: ChecklistItem;
}

export interface AddItemRowProps {
  checklistId: string;
  /** `position` for the new item: one past the current last item. */
  nextPosition: number;
  isAdding: boolean;
  onAddingChange: (isAdding: boolean) => void;
}

export interface ChecklistTagListProps {
  checklistId: string;
  selectedIds: string[];
  onToggle: (tagId: string) => void;
}
