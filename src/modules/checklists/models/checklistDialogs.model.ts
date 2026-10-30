import type { Checklist, Person, Workspace } from "./checklists.model";

export interface NewChecklistDialogProps {
  open: boolean;
  onClose: () => void;
  /** Preselects this workspace, e.g. when opened from a workspace page. */
  defaultWorkspaceId?: string;
  /** Preticks "Save as a template", e.g. when opened from the Templates page. */
  defaultIsTemplate?: boolean;
}

/** What the checklist form collects once it's valid: new tag names are already turned into ids. */
export interface ChecklistFormValues {
  title: string;
  workspaceId: string;
  dueDate: string | null;
  isTemplate: boolean;
  tagIds: string[];
}

export interface ChecklistFormProps {
  /** The workspaces on offer: the ones the person may add checklists to. */
  workspaces: Workspace[];
  /** Starting values. `workspaceId` is `null` until one is picked; `dueDate` is `YYYY-MM-DD` or an empty string. */
  initial: {
    title: string;
    workspaceId: string | null;
    dueDate: string;
    isTemplate: boolean;
    tagIds: string[];
  };
  submitLabel: string;
  /** Runs once the form is valid. Close the dialog (and navigate) on success; throw to show the error in the form. */
  onSubmit: (values: ChecklistFormValues) => Promise<void>;
  onClose: () => void;
  /** Shown under the workspace field once it differs from the one the form started with. */
  workspaceChangeHint?: string;
  /** Given the due date as typed (`YYYY-MM-DD`, or empty), returns a note to show under that field, or `null`. */
  dueDateHint?: (dueDate: string) => string | null;
}

export interface EditChecklistDialogProps {
  open: boolean;
  onClose: () => void;
  checklist: Checklist;
}

export interface NewWorkspaceDialogProps {
  open: boolean;
  onClose: () => void;
  owner: Person;
  /** Called once the workspace exists and we've navigated to it. */
  onCreated?: () => void;
}

export interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  workspaceId: string;
}
