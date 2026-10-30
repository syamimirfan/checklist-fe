export const toggleItemLabel = (content: string, isChecked: boolean) =>
  `Mark "${content}" as ${isChecked ? "not done" : "done"}`;
export const dueLabel = (date: string) => `Due ${date}`;

// item details (the edit section)
export const assigneeLabel = "Assignee";
export const unassignedOption = "Unassigned";
export const clearAssigneeLabel = "Clear assignee";
export const dueDateLabel = "Due date";
export const tagsLabel = "Tags";
export const noChecklistTagsText =
  "This checklist has no tags. Add some by editing the checklist.";
export const clearDueDateLabel = "Clear due date";
export const clearCommentLabel = "Clear comment";
export const clearItemTitleLabel = "Clear item title";

// comment box (separate from the edit section, open to every role)
export const commentsLabel = "Comments";
export const commentsToggleLabel = (count: number) =>
  count === 0 ? "Comments" : `${count} comment${count === 1 ? "" : "s"}`;
export const commentsToggleAriaLabel = (content: string, count: number) =>
  `Comments on ${content} (${count})`;
export const noCommentsText = "No comments yet. Start the conversation.";
export const commentLabel = "Write a comment";
export const commentPlaceholder = "Write a comment…";
export const postCommentLabel = "Post";
export const editItemLabel = "Edit item";
export const editItemIconLabel = (content: string) => `Edit item ${content}`;
// `{name}` becomes the item's text, in bold (see the shared `ConfirmDialog`).
export const deleteItemConfirmTitle = "Delete item?";
export const deleteItemConfirmMessage =
  "Are you sure you want to delete {name}? Its comments will be deleted too. This can't be undone.";
export const deleteItemConfirmLabel = "Delete item";
export const deleteItemIconLabel = (content: string) =>
  `Delete item ${content}`;

// add item
export const addItemLabel = "Add item";
export const addItemPlaceholder = "What needs to be done?";
export const addItemSubmitLabel = "Add";
export const addItemDueDateLabel = "Due date (optional)";
export const cancelLabel = "Cancel";
