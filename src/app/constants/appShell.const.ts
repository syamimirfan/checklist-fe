import type { IconName } from "../../shared/components/ui/models/icon.model";
import { routes } from "../../shared/constants/routes";

export const menuHeading = "Menu";
export const workspacesHeading = "Workspaces";
export const noWorkspacesText = "No workspaces yet.";
export const newWorkspaceLabel = "New workspace";
export const logOutLabel = "Log out";
export const openMenuLabel = "Open menu";
export const closeMenuLabel = "Close menu";
export const loadingText = "Loading your checklists…";
export const loadFailedText = "We couldn't load your checklists.";
export const retryLabel = "Try again";
export const dismissLabel = "Dismiss";

export const menuItems: { label: string; to: string; icon: IconName }[] = [
  { label: "My checklists", to: routes.dashboard, icon: "grid" },
  { label: "Due soon", to: routes.dueSoon, icon: "clock" },
  { label: "Templates", to: routes.templates, icon: "star" },
  { label: "Assigned to me", to: routes.assigned, icon: "user-check" },
];
