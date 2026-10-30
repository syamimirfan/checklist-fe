import type { ToneName } from "../../../shared/styles/theme";

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

/** The ERD lists `workspace_members.role` as an enum without values; these are assumed. */
export type MemberRole = "owner" | "admin" | "member";

/** The public part of a USERS row (never the password hash or tokens). */
export interface Person {
  id: string;
  name: string;
  email: string;
}

export interface Workspace {
  id: string;
  ownerId: string;
  name: string;
  createdAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: MemberRole;
  joinedAt: string;
}

export interface Tag {
  id: string;
  workspaceId: string;
  name: string;
  color: ToneName;
}

export interface Checklist {
  id: string;
  workspaceId: string;
  createdBy: string;
  title: string;
  isTemplate: boolean;
  /** `YYYY-MM-DD`, local calendar date. */
  dueDate: string | null;
  /** CHECKLIST_TAGS rows for this checklist. */
  tagIds: string[];
  createdAt: string;
}

/**
 * `dueDate` and `tagIds` are not in the ERD's CHECKLIST_ITEMS table — the UI mockup
 * shows both on every item, so the backend needs `checklist_items.due_date` and an
 * item-level tag join table before this can be wired up for real.
 */
export interface ChecklistItem {
  id: string;
  checklistId: string;
  assignedTo: string | null;
  content: string;
  isChecked: boolean;
  position: number;
  dueDate: string | null;
  tagIds: string[];
  completedAt: string | null;
  createdAt: string;
}

export interface Comment {
  id: string;
  checklistItemId: string;
  userId: string;
  body: string;
  createdAt: string;
}

/** The two roles a person can be given on a checklist; everyone else there is a plain `user`. */
export type GrantedRole = "admin" | "superuser";

/**
 * A role someone was given on one checklist (the default, `user`, has no row). Not in the ERD,
 * which only has workspace-level roles; the backend needs something like
 * `checklist_roles(checklist_id, user_id, role, granted_by, granted_at)`, one row per person
 * per checklist. The creator (`Checklist.createdBy`) is always an admin and has no row here.
 */
export interface ChecklistRoleGrant {
  id: string;
  checklistId: string;
  userId: string;
  role: GrantedRole;
  grantedBy: string;
  grantedAt: string;
}

/**
 * Someone's standing on one checklist, highest first. See `utils/permissions.ts` for what each can do:
 * creator and admin manage the checklist, superuser manages its items, user can only tick items and comment.
 */
export type ChecklistRole = "creator" | GrantedRole | "user";

/** Everything the app loads for one user: their workspaces and all that hangs off them. */
export interface WorkspaceData {
  people: Person[];
  workspaces: Workspace[];
  members: WorkspaceMember[];
  tags: Tag[];
  checklists: Checklist[];
  checklistRoles: ChecklistRoleGrant[];
  items: ChecklistItem[];
  comments: Comment[];
}

export interface ChecklistsState extends WorkspaceData {
  status: RequestStatus;
  /** Why the initial load failed. */
  error: string | null;
  /** Why the last item/comment/tag change failed; shown as a dismissible banner. */
  mutationError: string | null;
}

/** Fields of a checklist that can be edited after it's created. */
export type ChecklistPatch = Partial<
  Pick<Checklist, "title" | "workspaceId" | "isTemplate" | "dueDate" | "tagIds">
>;

export type ItemPatch = Partial<
  Pick<
    ChecklistItem,
    "content" | "isChecked" | "assignedTo" | "dueDate" | "tagIds" | "completedAt"
  >
>;

export interface NewWorkspaceInput {
  name: string;
  owner: Person;
}

export interface NewChecklistInput {
  workspaceId: string;
  createdBy: string;
  title: string;
  isTemplate: boolean;
  dueDate: string | null;
  /** Ids of existing tags in `workspaceId` (CHECKLIST_TAGS rows to create alongside the checklist). */
  tagIds: string[];
}

export interface NewItemInput {
  checklistId: string;
  content: string;
  position: number;
  /** `YYYY-MM-DD`. See the note on `ChecklistItem`: the ERD has no item due date yet. */
  dueDate: string | null;
  /** Ids of existing tags in the checklist's workspace. */
  tagIds: string[];
}

export interface NewCommentInput {
  checklistItemId: string;
  userId: string;
  body: string;
}

export interface NewTagInput {
  workspaceId: string;
  name: string;
  color: ToneName;
}

export interface SetChecklistRoleInput {
  checklistId: string;
  userId: string;
  /** `user` takes any granted role away. */
  role: GrantedRole | "user";
  /** Whoever is making the change. */
  grantedBy: string;
}

export interface InviteMemberInput {
  workspaceId: string;
  email: string;
}
