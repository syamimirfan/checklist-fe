import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  type SerializedError,
} from "@reduxjs/toolkit";
import { logout } from "../auth";
import {
  createChecklistRequest,
  createCommentRequest,
  createItemRequest,
  createTagRequest,
  createWorkspaceRequest,
  deleteChecklistRequest,
  deleteItemRequest,
  fetchWorkspaceData,
  inviteMemberRequest,
  setChecklistRoleRequest,
  updateChecklistRequest,
  updateItemRequest,
} from "./checklistsApi";
import {
  checklistsSliceName,
  createChecklistActionType,
  createCommentActionType,
  createItemActionType,
  createTagActionType,
  createWorkspaceActionType,
  defaultErrorMessage,
  deleteChecklistActionType,
  deleteItemActionType,
  initialState,
  inviteMemberActionType,
  loadWorkspaceDataActionType,
  setChecklistRoleActionType,
  updateChecklistActionType,
  updateItemActionType,
} from "./constants/checklists.const";
import type {
  ChecklistPatch,
  ChecklistsState,
  InviteMemberInput,
  ItemPatch,
  NewChecklistInput,
  NewCommentInput,
  NewItemInput,
  NewTagInput,
  NewWorkspaceInput,
  Person,
  SetChecklistRoleInput,
} from "./models/checklists.model";
import { dayBefore } from "./utils/date";

// A rejected thunk's `action.error` is a plain SerializedError object, not an Error
// instance, so `instanceof Error` would always be false and hide the real message.
function errorMessage(error: SerializedError): string {
  return error.message || defaultErrorMessage;
}

export const loadWorkspaceData = createAsyncThunk(
  loadWorkspaceDataActionType,
  (user: Person) => fetchWorkspaceData(user),
  {
    // Skip a load that's already running or done. React StrictMode runs effects twice
    // in dev, which would otherwise fire two loads and let the later one overwrite edits.
    condition: (_user, { getState }) => {
      const { status } = (getState() as { checklists: ChecklistsState })
        .checklists;
      return status === "idle" || status === "failed";
    },
  },
);

export const createWorkspace = createAsyncThunk(
  createWorkspaceActionType,
  (input: NewWorkspaceInput) => createWorkspaceRequest(input),
);

export const createChecklist = createAsyncThunk(
  createChecklistActionType,
  (input: NewChecklistInput) => createChecklistRequest(input),
);

export const updateChecklist = createAsyncThunk(
  updateChecklistActionType,
  (args: { id: string; patch: ChecklistPatch }) =>
    updateChecklistRequest(args.id, args.patch),
);

export const deleteChecklist = createAsyncThunk(
  deleteChecklistActionType,
  async (id: string) => {
    await deleteChecklistRequest(id);
    return id;
  },
);

export const createItem = createAsyncThunk(
  createItemActionType,
  (input: NewItemInput) => createItemRequest(input),
);

export const updateItem = createAsyncThunk(
  updateItemActionType,
  (args: { id: string; patch: ItemPatch }) =>
    updateItemRequest(args.id, args.patch),
);

export const deleteItem = createAsyncThunk(
  deleteItemActionType,
  async (id: string) => {
    await deleteItemRequest(id);
    return id;
  },
);

export const createComment = createAsyncThunk(
  createCommentActionType,
  (input: NewCommentInput) => createCommentRequest(input),
);

export const createTag = createAsyncThunk(
  createTagActionType,
  (input: NewTagInput) => createTagRequest(input),
);

export const setChecklistRole = createAsyncThunk(
  setChecklistRoleActionType,
  (input: SetChecklistRoleInput) => setChecklistRoleRequest(input),
);

export const inviteMember = createAsyncThunk(
  inviteMemberActionType,
  (input: InviteMemberInput) => inviteMemberRequest(input),
);

const checklistsSlice = createSlice({
  name: checklistsSliceName,
  initialState,
  reducers: {
    dismissMutationError(state) {
      state.mutationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // The next account to sign in must not see this one's data.
      .addCase(logout, () => initialState)
      .addCase(loadWorkspaceData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadWorkspaceData.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
        state.status = "succeeded";
      })
      .addCase(loadWorkspaceData.rejected, (state, action) => {
        // A `condition` skip also lands here (as meta.condition) and must not flip the state.
        if (action.meta.condition) return;
        state.status = "failed";
        state.error = errorMessage(action.error);
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        const { workspace, member, owner } = action.payload;
        state.workspaces.push(workspace);
        state.members.push(member);
        if (!state.people.some((person) => person.id === owner.id)) {
          state.people.push(owner);
        }
      })
      .addCase(createChecklist.fulfilled, (state, action) => {
        state.checklists.push(action.payload);
      })
      .addCase(updateChecklist.fulfilled, (state, action) => {
        const { id, patch } = action.payload;
        const checklist = state.checklists.find(
          (candidate) => candidate.id === id,
        );
        if (!checklist) return;
        const previousWorkspaceId = checklist.workspaceId;
        Object.assign(checklist, patch);
        const hasMoved = checklist.workspaceId !== previousWorkspaceId;
        const checklistItems = state.items.filter(
          (item) => item.checklistId === id,
        );

        // Items only use tags the checklist has, so a tag taken off the checklist leaves its items too.
        if (patch.tagIds !== undefined || hasMoved) {
          for (const item of checklistItems) {
            item.tagIds = item.tagIds.filter((tagId) =>
              checklist.tagIds.includes(tagId),
            );
          }
        }

        // Items are due before their checklist. If the checklist's due date moved earlier, any item due
        // on or after it is pulled back to the day before; items already earlier keep their date.
        if (patch.dueDate !== undefined && checklist.dueDate !== null) {
          const latestItemDueDate = dayBefore(checklist.dueDate);
          for (const item of checklistItems) {
            if (item.dueDate !== null && item.dueDate > latestItemDueDate) {
              item.dueDate = latestItemDueDate;
            }
          }
        }

        // Only members of the checklist's workspace can be assigned or hold a role, so a move drops the rest.
        if (hasMoved) {
          const memberIds = new Set(
            state.members
              .filter((member) => member.workspaceId === checklist.workspaceId)
              .map((member) => member.userId),
          );
          for (const item of checklistItems) {
            if (item.assignedTo && !memberIds.has(item.assignedTo)) {
              item.assignedTo = null;
            }
          }
          state.checklistRoles = state.checklistRoles.filter(
            (grant) => grant.checklistId !== id || memberIds.has(grant.userId),
          );
        }
      })
      .addCase(deleteChecklist.fulfilled, (state, action) => {
        const checklistId = action.payload;
        // Everything that hangs off the checklist goes with it. Tags stay: they belong to the workspace.
        const itemIds = new Set(
          state.items
            .filter((item) => item.checklistId === checklistId)
            .map((item) => item.id),
        );
        state.checklists = state.checklists.filter(
          (checklist) => checklist.id !== checklistId,
        );
        state.items = state.items.filter(
          (item) => item.checklistId !== checklistId,
        );
        state.comments = state.comments.filter(
          (comment) => !itemIds.has(comment.checklistItemId),
        );
        state.checklistRoles = state.checklistRoles.filter(
          (grant) => grant.checklistId !== checklistId,
        );
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const item = state.items.find(
          (candidate) => candidate.id === action.payload.id,
        );
        if (item) Object.assign(item, action.payload.patch);
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.comments = state.comments.filter(
          (comment) => comment.checklistItemId !== action.payload,
        );
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.tags.push(action.payload);
      })
      .addCase(setChecklistRole.fulfilled, (state, action) => {
        const { checklistId, userId, grant } = action.payload;
        // One role per person per checklist: the new one replaces the old.
        state.checklistRoles = state.checklistRoles.filter(
          (existing) =>
            !(existing.checklistId === checklistId && existing.userId === userId),
        );
        if (grant) state.checklistRoles.push(grant);
      })
      .addCase(inviteMember.fulfilled, (state, action) => {
        const { person, member } = action.payload;
        state.members.push(member);
        if (!state.people.some((candidate) => candidate.id === person.id)) {
          state.people.push(person);
        }
      })
      // Item-level changes have no form to show an error in, so they share one page banner.
      // The dialogs (workspace, checklist, invite) show their own error instead.
      .addMatcher(
        isAnyOf(
          createItem.rejected,
          updateItem.rejected,
          deleteItem.rejected,
          createComment.rejected,
          createTag.rejected,
          setChecklistRole.rejected,
          deleteChecklist.rejected,
        ),
        (state, action) => {
          state.mutationError = errorMessage(action.error);
        },
      );
  },
});

export const { dismissMutationError } = checklistsSlice.actions;
export default checklistsSlice.reducer;
