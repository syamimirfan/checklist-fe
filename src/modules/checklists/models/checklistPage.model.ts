import type { Checklist, ChecklistItem, GrantedRole } from "./checklists.model";

export type ChecklistTab = "items" | "activity" | "members";

export interface ItemsTabProps {
  checklist: Checklist;
  /** Items of this checklist, already in `position` order. */
  items: ChecklistItem[];
  isAddingItem: boolean;
  onAddingItemChange: (isAdding: boolean) => void;
}

export interface ActivityTabProps {
  checklist: Checklist;
  items: ChecklistItem[];
}

export interface MembersTabProps {
  checklist: Checklist;
  items: ChecklistItem[];
  onInvite: () => void;
}

export type ActivityEvent =
  | { id: string; at: string; kind: "created"; actorName: string | null }
  | { id: string; at: string; kind: "added"; itemContent: string }
  | { id: string; at: string; kind: "completed"; itemContent: string }
  | {
      id: string;
      at: string;
      kind: "roleGranted";
      actorName: string;
      personName: string;
      role: GrantedRole;
    }
  | {
      id: string;
      at: string;
      kind: "commented";
      actorName: string;
      itemContent: string;
      body: string;
    };
