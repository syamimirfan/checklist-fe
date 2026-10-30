import type { ChecklistsState } from "../models/checklists.model";

export const initialState: ChecklistsState = {
  people: [],
  workspaces: [],
  members: [],
  tags: [],
  checklists: [],
  checklistRoles: [],
  items: [],
  comments: [],
  status: "idle",
  error: null,
  mutationError: null,
};

export const checklistsSliceName = "checklists";

// thunk action types
export const loadWorkspaceDataActionType = "checklists/loadWorkspaceData";
export const createWorkspaceActionType = "checklists/createWorkspace";
export const createChecklistActionType = "checklists/createChecklist";
export const updateChecklistActionType = "checklists/updateChecklist";
export const deleteChecklistActionType = "checklists/deleteChecklist";
export const createItemActionType = "checklists/createItem";
export const updateItemActionType = "checklists/updateItem";
export const deleteItemActionType = "checklists/deleteItem";
export const createCommentActionType = "checklists/createComment";
export const createTagActionType = "checklists/createTag";
export const setChecklistRoleActionType = "checklists/setChecklistRole";
export const inviteMemberActionType = "checklists/inviteMember";

// message used when a rejected thunk carries no error message
export const defaultErrorMessage = "Something went wrong. Please try again.";
