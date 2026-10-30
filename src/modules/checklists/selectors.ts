import { createSelector } from "@reduxjs/toolkit";
import type { ChecklistsState } from "./models/checklists.model";
import { groupBy, indexById } from "./utils/checklistUtils";

/** Typed against the slice, not RootState, so the slice never has to import the store. */
type State = { checklists: ChecklistsState };

const selectPeople = (state: State) => state.checklists.people;
export const selectWorkspaces = (state: State) => state.checklists.workspaces;
const selectMembers = (state: State) => state.checklists.members;
const selectTags = (state: State) => state.checklists.tags;
export const selectChecklists = (state: State) => state.checklists.checklists;
const selectChecklistRoles = (state: State) => state.checklists.checklistRoles;
const selectItems = (state: State) => state.checklists.items;
const selectComments = (state: State) => state.checklists.comments;

export const selectChecklistsStatus = (state: State) => state.checklists.status;
export const selectChecklistsError = (state: State) => state.checklists.error;
export const selectMutationError = (state: State) =>
  state.checklists.mutationError;

// The lookups below are memoized, so rows that call them don't rebuild a Map each.
export const selectPeopleById = createSelector([selectPeople], indexById);
export const selectWorkspacesById = createSelector(
  [selectWorkspaces],
  indexById,
);
export const selectTagsById = createSelector([selectTags], indexById);
export const selectChecklistsById = createSelector(
  [selectChecklists],
  indexById,
);

/** Roles given on each checklist (admins and superusers). Doesn't include the creator, who is always an admin. */
export const selectRoleGrantsByChecklistId = createSelector(
  [selectChecklistRoles],
  (grants) => groupBy(grants, (grant) => grant.checklistId),
);

export const selectMembersByWorkspaceId = createSelector(
  [selectMembers],
  (members) => groupBy(members, (member) => member.workspaceId),
);

export const selectTagsByWorkspaceId = createSelector([selectTags], (tags) =>
  groupBy(tags, (tag) => tag.workspaceId),
);

/** Items per checklist, in `position` order. */
export const selectItemsByChecklistId = createSelector([selectItems], (items) => {
  const groups = groupBy(items, (item) => item.checklistId);
  for (const group of groups.values()) {
    group.sort((a, b) => a.position - b.position);
  }
  return groups;
});

/** Comments per item, oldest first. */
export const selectCommentsByItemId = createSelector(
  [selectComments],
  (comments) => {
    const groups = groupBy(comments, (comment) => comment.checklistItemId);
    for (const group of groups.values()) {
      group.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    }
    return groups;
  },
);
