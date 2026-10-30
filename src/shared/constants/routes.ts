/** Paths for the logged-in app. Build links with these instead of hand-writing template strings. */
export const routes = {
  dashboard: "/dashboard",
  dueSoon: "/due-soon",
  templates: "/templates",
  assigned: "/assigned",
  workspace: (workspaceId: string) => `/workspaces/${workspaceId}`,
  checklist: (checklistId: string) => `/checklists/${checklistId}`,
} as const;

/** `<Route path>` patterns matching the builders above. */
export const workspaceRoutePattern = "/workspaces/:workspaceId";
export const checklistRoutePattern = "/checklists/:checklistId";
