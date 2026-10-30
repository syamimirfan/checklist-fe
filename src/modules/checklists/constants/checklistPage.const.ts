import type { ChecklistTab } from "../models/checklistPage.model";
import type { ToneName } from "../../../shared/styles/theme";
import type { ChecklistRole, GrantedRole } from "../models/checklists.model";

export const defaultTab: ChecklistTab = "items";

export const tabs: { id: ChecklistTab; label: string }[] = [
  { id: "items", label: "Items" },
  { id: "activity", label: "Activity" },
  { id: "members", label: "Members" },
];

export const editChecklistLabel = "Edit checklist";
export const editChecklistIconLabel = (title: string) =>
  `Edit checklist ${title}`;
export const addItemButtonLabel = "Add item";
export const templateBadge = "Template";
export const completedSummary = (done: number, total: number) =>
  `${done} of ${total} completed`;
export const dueSummary = (date: string) => `Due ${date}`;

// delete checklist
export const deleteChecklistHeading = "Delete this checklist";
export const deleteChecklistLabel = "Delete checklist";
export const deleteChecklistIconLabel = (title: string) =>
  `Delete checklist “${title}”`;
export const deleteChecklistRule =
  "A checklist can be deleted once it has no items, or every item is completed.";
export const deleteChecklistBlocked = (remaining: number) =>
  `Complete the remaining ${remaining} item${remaining === 1 ? "" : "s"} to delete this checklist.`;
// `{name}` becomes the checklist's title, in bold (see the shared `ConfirmDialog`).
export const deleteChecklistConfirmTitle = "Delete checklist?";
export const deleteChecklistConfirmMessage =
  "Are you sure you want to delete {name}? Its items and comments will be deleted too. This can't be undone.";

export const notFoundTitle = "Checklist not found";
export const notFoundText =
  "It may have been removed, or you may not have access to its workspace.";
export const backToChecklistsLabel = "Back to my checklists";

// items tab
export const todoHeading = "To do";
export const completedHeading = "Completed";
export const emptyItemsText = "Nothing here yet. Add the first item to get started.";
/** For people who can't add items. */
export const emptyItemsReadOnlyText = "Nothing here yet.";

// activity tab
export const activityEmptyText = "No activity yet.";
export const activityCreated = (name: string) => `${name} created this checklist`;
export const activityCreatedAnonymous = "This checklist was created";
export const activityAdded = (content: string) => `Added “${content}”`;
export const activityCompleted = (content: string) => `Completed “${content}”`;
export const activityCommented = (name: string, content: string) =>
  `${name} commented on “${content}”`;
export const activityRoleGranted = (
  grantor: string,
  name: string,
  role: GrantedRole,
) => `${grantor} made ${name} ${role === "admin" ? "an admin" : "a superuser"}`;

// members tab
export const membersEmptyText = "No members yet.";
export const inviteMembersLabel = "Invite people";
export const joinedText = (date: string) => `Joined ${date}`;
export const assignedCountText = (count: number) =>
  count === 0 ? "No items assigned" : `${count} item${count === 1 ? "" : "s"} assigned`;

export const youSuffix = "(you)";
export const roleSelectAriaLabel = (name: string) => `Role of ${name}`;

/** A person's standing on this one checklist (not their workspace role). */
export const roleLabels: Record<ChecklistRole, string> = {
  creator: "Creator",
  admin: "Admin",
  superuser: "Superuser",
  user: "User",
};

export const roleColors: Record<ChecklistRole, ToneName> = {
  creator: "violet",
  admin: "fuchsia",
  superuser: "pink",
  user: "purple",
};

/** What each role can do, shown when hovering its badge. Keep in step with `utils/permissions.ts`. */
export const roleDescriptions: Record<ChecklistRole, string> = {
  creator:
    "Created this checklist, so is always one of its admins and can't be demoted.",
  admin:
    "Can add new checklists, edit and delete this one, add, edit and delete items, make or remove admins and superusers, tick items off and comment.",
  superuser:
    "Can add, edit and delete items, make or remove superusers, tick items off and comment.",
  user: "Can tick items off and comment.",
};
export const roleInfoAriaLabel = (label: string, description: string) =>
  `${label}: ${description}`;
