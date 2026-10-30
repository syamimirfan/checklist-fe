import type {
  Checklist,
  ChecklistRole,
  ChecklistRoleGrant,
  GrantedRole,
  MemberRole,
} from "../models/checklists.model";

/**
 * What each role can do on a checklist. This file is the one place the rules live.
 *
 * - **Admin** (the creator counts as one): add and edit and delete items, edit and delete the
 *   checklist, add new checklists, and give or take away the Admin and Superuser roles.
 * - **Superuser**: add, edit and delete items, and give or take away the Superuser role.
 * - **User**: nothing beyond what every role can do.
 * - **Everyone**: tick items off as completed, and comment on any item.
 *
 * These checks only decide what the UI offers; a real backend has to enforce the same rules
 * on every request.
 */

/** Someone's standing on one checklist: the creator, a role they were given, or a plain user. */
export function checklistRoleOf(
  checklist: Checklist,
  grantsOfChecklist: ChecklistRoleGrant[],
  userId: string,
): ChecklistRole {
  if (checklist.createdBy === userId) return "creator";
  return grantsOfChecklist.find((grant) => grant.userId === userId)?.role ?? "user";
}

/** How far up the hierarchy a role is: the lower the number, the more it can do. */
const roleRank: Record<ChecklistRole, number> = {
  creator: 0,
  admin: 1,
  superuser: 2,
  user: 3,
};

/** For sorting people from the top of the hierarchy (creator, admin, superuser) down to plain users. */
export const compareRoles = (a: ChecklistRole, b: ChecklistRole) =>
  roleRank[a] - roleRank[b];

/**
 * The badges shown next to someone's name, for everyone to see. The creator owns the checklist and
 * is also its Admin, so they get both; everyone else gets their one role.
 */
export function roleBadgesFor(role: ChecklistRole): ChecklistRole[] {
  return role === "creator" ? ["creator", "admin"] : [role];
}

/** The creator has every admin ability, and can't be demoted. */
export const isAdminRole = (role: ChecklistRole) =>
  role === "creator" || role === "admin";

/** Edit or delete the checklist itself. */
export const canManageChecklist = isAdminRole;

/** Add, edit (assignee, due date, tags) and delete items. */
export const canManageItems = (role: ChecklistRole) => role !== "user";

/** The roles someone may give to others, or take away from them. */
export function grantableRoles(role: ChecklistRole): GrantedRole[] {
  if (isAdminRole(role)) return ["admin", "superuser"];
  if (role === "superuser") return ["superuser"];
  return [];
}

/** The role picker's values: what someone can be made on a checklist. */
export type AssignableRole = GrantedRole | "user";

/**
 * Whether `viewerRole` may change someone from `targetRole` to `nextRole`. Both the role being
 * taken away and the one being given must be ones the viewer manages (`user` is just having no
 * role, so anyone may be put back to it). The creator never changes.
 */
export function canChangeRole(
  viewerRole: ChecklistRole,
  targetRole: ChecklistRole,
  nextRole: AssignableRole,
): boolean {
  if (targetRole === "creator" || targetRole === nextRole) return false;
  const grantable = grantableRoles(viewerRole);
  const isManaged = (role: AssignableRole) =>
    role === "user" || grantable.includes(role);
  return isManaged(targetRole) && isManaged(nextRole);
}

const rolePickerOrder: AssignableRole[] = ["user", "superuser", "admin"];

/** The options of someone's role picker: their current role, plus any the viewer may switch them to. */
export function roleOptionsFor(
  viewerRole: ChecklistRole,
  targetRole: ChecklistRole,
): AssignableRole[] {
  if (targetRole === "creator") return [];
  return rolePickerOrder.filter(
    (role) => role === targetRole || canChangeRole(viewerRole, targetRole, role),
  );
}

/**
 * Whether someone may add checklists in a workspace. Admin is a role on a checklist, and there is
 * none yet to hold it when you add the first one, so it's also open to whoever owns or administers
 * the workspace. `checklistRoles` are the person's roles on the checklists already in that workspace.
 */
export function canCreateChecklistIn(
  workspaceRole: MemberRole | null,
  checklistRoles: ChecklistRole[],
): boolean {
  const administersWorkspace =
    workspaceRole === "owner" || workspaceRole === "admin";
  return administersWorkspace || checklistRoles.some(isAdminRole);
}
