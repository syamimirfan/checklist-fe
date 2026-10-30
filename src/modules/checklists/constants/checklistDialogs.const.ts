import { roomyFieldClasses } from "../../../shared/styles/theme";

/** Date input / tag input sized to match the roomy `Input` used in the dialogs. */
export const dialogFieldClasses = roomyFieldClasses;

export const cancelLabel = "Cancel";

// new checklist
export const newChecklistTitle = "New checklist";
export const checklistTitleLabel = "Title";
export const checklistTitlePlaceholder = "e.g. Q4 planning";
export const checklistTitleRequired = "Give your checklist a title.";
export const checklistWorkspaceLabel = "Workspace";
export const workspacePlaceholder = "Select a workspace";
export const clearWorkspaceLabel = "Clear workspace";
export const checklistWorkspaceRequired =
  "Choose a workspace for this checklist.";
export const checklistDueDateLabel = "Due date (optional)";
export const checklistTemplateLabel = "Save as a template";
export const createChecklistLabel = "Create checklist";
export const noWorkspaceForChecklist =
  "Create a workspace first, using the + next to Workspaces in the sidebar.";

// edit checklist (the fields reuse the labels above)
export const editChecklistTitle = "Edit checklist";
export const saveChecklistLabel = "Save";
export const dueDateItemsHint = (count: number, newLatest: string) =>
  `${count} item${count === 1 ? "" : "s"} due on or after this date will be moved to ${newLatest}.`;
export const workspaceChangeHint =
  "Moving a checklist clears its tags, and unassigns items whose assignee isn't in the new workspace.";

// new workspace
export const newWorkspaceTitle = "New workspace";
export const workspaceNameLabel = "Workspace name";
export const workspaceNamePlaceholder = "e.g. Product team";
export const workspaceNameRequired = "Give your workspace a name.";
export const createWorkspaceLabel = "Create workspace";

// share
export const shareTitle = "Share this checklist";
export const shareDescription = (workspaceName: string) =>
  `Checklists belong to a workspace, so anyone you invite gets access to everything in ${workspaceName}.`;
export const inviteEmailLabel = "Email address";
export const inviteEmailPlaceholder = "colleague@company.com";
export const inviteEmailRequired = "Enter an email address.";
export const inviteLabel = "Invite";
export const alreadyMemberMessage = "That person is already in this workspace.";
export const invitedMessage = (name: string, workspaceName: string) =>
  `${name} now has access to ${workspaceName}.`;
export const copyLinkLabel = "Copy link";
export const linkCopiedMessage = "Link copied.";
export const linkCopyFailedMessage =
  "Couldn't copy automatically. Copy the link from the address bar instead.";
