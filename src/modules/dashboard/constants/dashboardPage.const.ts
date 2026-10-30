import type { DashboardView } from "../models/dashboardPage.model";

/** "Due soon" shows unfinished checklists due within this many days, plus anything already overdue. */
export const dueSoonWindowDays = 7;

export const newChecklistLabel = "New checklist";

export const viewCopy: Record<
  Exclude<DashboardView, "workspace">,
  { title: string; subtitle: string; empty: string }
> = {
  all: {
    title: "My checklists",
    subtitle: "Every checklist across your workspaces.",
    empty: "You don't have any checklists yet. Create one to get started.",
  },
  dueSoon: {
    title: "Due soon",
    subtitle: "Unfinished checklists due this week, or already overdue.",
    empty: "Nothing is due soon. Enjoy the breathing room.",
  },
  templates: {
    title: "Templates",
    subtitle: "Reusable checklists you've saved as templates.",
    empty: "No templates yet. Tick “Save as a template” when creating a checklist.",
  },
  assigned: {
    title: "Assigned to me",
    subtitle: "Items across all checklists that are assigned to you.",
    empty: "Nothing is assigned to you right now.",
  },
};

export const workspaceSubtitle = "Checklists in this workspace.";
export const workspaceEmpty = "No checklists in this workspace yet.";
export const workspaceNotFoundTitle = "Workspace not found";
export const workspaceNotFoundText =
  "It may have been removed, or you may not be a member of it.";
