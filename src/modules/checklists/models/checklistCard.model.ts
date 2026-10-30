import type { Checklist } from "./checklists.model";

export interface ChecklistCardProps {
  checklist: Checklist;
  /** Show the workspace name above the title. Off on a workspace's own page, where it's redundant. */
  showWorkspace?: boolean;
}
