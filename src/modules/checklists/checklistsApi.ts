/**
 * Mock checklists API. Simulates network latency over dummy data so the UI/Redux
 * flow is realistic without a real backend. Replace the bodies of these functions
 * with real HTTP calls later — the function signatures are the contract the rest
 * of the app depends on.
 *
 * The mock is stateless: it builds fresh data on every load and hands back the
 * created/updated record, leaving Redux as the only copy. Nothing survives a reload.
 */

import type {
  Checklist,
  ChecklistItem,
  ChecklistPatch,
  ChecklistRoleGrant,
  Comment,
  InviteMemberInput,
  ItemPatch,
  NewChecklistInput,
  NewCommentInput,
  NewItemInput,
  NewTagInput,
  NewWorkspaceInput,
  Person,
  SetChecklistRoleInput,
  Tag,
  Workspace,
  WorkspaceData,
  WorkspaceMember,
} from "./models/checklists.model";
import { buildDummyData, dummyDirectory } from "./data/dummyData";
import {
  delay,
  newId,
  unknownInviteeError,
} from "./constants/checklistsApi.const";

/** Loads the workspaces `user` belongs to, plus everything inside them. */
export async function fetchWorkspaceData(user: Person): Promise<WorkspaceData> {
  await delay();
  const data = buildDummyData();

  const workspaceIds = new Set(
    data.members
      .filter((member) => member.userId === user.id)
      .map((member) => member.workspaceId),
  );
  const workspaces = data.workspaces.filter((workspace) =>
    workspaceIds.has(workspace.id),
  );
  const members = data.members.filter((member) =>
    workspaceIds.has(member.workspaceId),
  );
  const tags = data.tags.filter((tag) => workspaceIds.has(tag.workspaceId));
  const checklists = data.checklists.filter((checklist) =>
    workspaceIds.has(checklist.workspaceId),
  );
  const checklistIds = new Set(checklists.map((checklist) => checklist.id));
  const checklistRoles = data.checklistRoles.filter((grant) =>
    checklistIds.has(grant.checklistId),
  );
  const items = data.items.filter((item) => checklistIds.has(item.checklistId));
  const itemIds = new Set(items.map((item) => item.id));
  const comments = data.comments.filter((comment) =>
    itemIds.has(comment.checklistItemId),
  );

  const personIds = new Set(members.map((member) => member.userId));
  const people = data.people.filter((person) => personIds.has(person.id));
  // Someone who just signed up isn't in the directory yet; they still need to exist as a person.
  if (!people.some((person) => person.id === user.id)) {
    people.push({ id: user.id, name: user.name, email: user.email });
  }

  return {
    people,
    workspaces,
    members,
    tags,
    checklists,
    checklistRoles,
    items,
    comments,
  };
}

export async function createWorkspaceRequest(
  input: NewWorkspaceInput,
): Promise<{ workspace: Workspace; member: WorkspaceMember; owner: Person }> {
  await delay();
  const now = new Date().toISOString();
  const workspace: Workspace = {
    id: newId(),
    ownerId: input.owner.id,
    name: input.name,
    createdAt: now,
  };
  const member: WorkspaceMember = {
    id: newId(),
    workspaceId: workspace.id,
    userId: input.owner.id,
    role: "owner",
    joinedAt: now,
  };
  return { workspace, member, owner: input.owner };
}

export async function createChecklistRequest(
  input: NewChecklistInput,
): Promise<Checklist> {
  await delay();
  return {
    id: newId(),
    workspaceId: input.workspaceId,
    createdBy: input.createdBy,
    title: input.title,
    isTemplate: input.isTemplate,
    dueDate: input.dueDate,
    tagIds: input.tagIds,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Returns the patch as the server would apply it. A real backend must also keep the rest
 * consistent when the tags, due date or workspace change: items only keep tags the checklist
 * still has, item due dates are pulled back to the day before an earlier checklist due date,
 * and after a move to another workspace, assignees and admins who aren't members there are
 * dropped. The slice does that here (see `updateChecklist.fulfilled`).
 */
export async function updateChecklistRequest(
  id: string,
  patch: ChecklistPatch,
): Promise<{ id: string; patch: ChecklistPatch }> {
  await delay();
  return { id, patch };
}

/**
 * A real backend must refuse unless the checklist has no items or every item is
 * completed (the UI only offers the button then, but that is a courtesy, not a guard).
 */
export async function deleteChecklistRequest(_id: string): Promise<void> {
  await delay();
}

export async function createItemRequest(
  input: NewItemInput,
): Promise<ChecklistItem> {
  await delay();
  return {
    id: newId(),
    checklistId: input.checklistId,
    assignedTo: null,
    content: input.content,
    isChecked: false,
    position: input.position,
    dueDate: input.dueDate,
    tagIds: input.tagIds,
    completedAt: null,
    createdAt: new Date().toISOString(),
  };
}

/** Returns the patch as the server would apply it: `completedAt` follows `isChecked`. */
export async function updateItemRequest(
  id: string,
  patch: ItemPatch,
): Promise<{ id: string; patch: ItemPatch }> {
  await delay();
  const applied: ItemPatch = { ...patch };
  if (patch.isChecked !== undefined) {
    applied.completedAt = patch.isChecked ? new Date().toISOString() : null;
  }
  return { id, patch: applied };
}

export async function deleteItemRequest(_id: string): Promise<void> {
  await delay();
}

export async function createCommentRequest(
  input: NewCommentInput,
): Promise<Comment> {
  await delay();
  return {
    id: newId(),
    checklistItemId: input.checklistItemId,
    userId: input.userId,
    body: input.body,
    createdAt: new Date().toISOString(),
  };
}

export async function createTagRequest(input: NewTagInput): Promise<Tag> {
  await delay();
  return {
    id: newId(),
    workspaceId: input.workspaceId,
    name: input.name,
    color: input.color,
  };
}

/**
 * Giving someone a role on a checklist (admin or superuser) or taking it away (`user`), which
 * replaces whatever role they had. A real backend must check the caller's own role (admins
 * manage admins and superusers, superusers only superusers) and refuse to touch the creator;
 * this mock trusts the UI, which only offers what `canChangeRole` allows.
 * `grant` is the new row, or `null` when the person is back to a plain user.
 */
export async function setChecklistRoleRequest(
  input: SetChecklistRoleInput,
): Promise<{ checklistId: string; userId: string; grant: ChecklistRoleGrant | null }> {
  await delay();
  const { checklistId, userId, role, grantedBy } = input;
  return {
    checklistId,
    userId,
    grant:
      role === "user"
        ? null
        : {
            id: newId(),
            checklistId,
            userId,
            role,
            grantedBy,
            grantedAt: new Date().toISOString(),
          },
  };
}

/** Adds an existing account to a workspace. Unknown emails are rejected rather than invited. */
export async function inviteMemberRequest(
  input: InviteMemberInput,
): Promise<{ person: Person; member: WorkspaceMember }> {
  await delay();
  const email = input.email.trim().toLowerCase();
  const person = dummyDirectory.find(
    (candidate) => candidate.email.toLowerCase() === email,
  );
  if (!person) {
    throw new Error(unknownInviteeError);
  }
  return {
    person: { ...person },
    member: {
      id: newId(),
      workspaceId: input.workspaceId,
      userId: person.id,
      role: "member",
      joinedAt: new Date().toISOString(),
    },
  };
}
