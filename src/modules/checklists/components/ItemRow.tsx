import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Avatar, Icon, TagChip } from "../../../shared/components/ui";
import {
  dangerTextClasses,
  focusVisibleRingClasses,
  surface,
  text,
  toneClasses,
} from "../../../shared/styles/theme";
import { updateItem } from "../checklistsSlice";
import {
  commentsToggleAriaLabel,
  commentsToggleLabel,
  deleteItemIconLabel,
  dueLabel,
  editItemIconLabel,
  editItemLabel,
  toggleItemLabel,
} from "../constants/checklistItem.const";
import { useChecklistRole } from "../hooks/useChecklistRole";
import { useDeleteItem } from "../hooks/useDeleteItem";
import type { ItemRowProps } from "../models/checklistItem.model";
import type { Tag } from "../models/checklists.model";
import {
  selectCommentsByItemId,
  selectPeopleById,
  selectTagsById,
} from "../selectors";
import { formatDueDate, isOverdue } from "../utils/date";
import { CommentToggleButton } from "./CommentToggleButton";
import { DeleteIconButton } from "./DeleteIconButton";
import { EditIconButton } from "./EditIconButton";
import { ItemComments } from "./ItemComments";
import { ItemDetails } from "./ItemDetails";

/**
 * One checklist item: checkbox, title, a meta line (tags, assignee, due date) and, on the right,
 * its buttons. Everyone gets the checkbox and the comment button (which opens the comment box).
 * Admins and superusers also get the pencil (the edit section, for open items only) and, once the
 * item is completed, the trash icon. See `utils/permissions.ts`.
 */
export function ItemRow({ item, workspaceId }: ItemRowProps) {
  const dispatch = useAppDispatch();
  const peopleById = useAppSelector(selectPeopleById);
  const tagsById = useAppSelector(selectTagsById);
  const commentsByItemId = useAppSelector(selectCommentsByItemId);
  const [isEditing, setIsEditing] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const { canDelete, requestDelete } = useDeleteItem(item);
  const { canManageItems } = useChecklistRole(item.checklistId);

  const assignee = item.assignedTo ? peopleById.get(item.assignedTo) : undefined;
  const tags = item.tagIds
    .map((tagId) => tagsById.get(tagId))
    .filter((tag): tag is Tag => tag !== undefined);
  const commentCount = commentsByItemId.get(item.id)?.length ?? 0;
  const overdue =
    !item.isChecked && item.dueDate !== null && isOverdue(item.dueDate);
  const hasMeta = tags.length > 0 || assignee || item.dueDate !== null;

  return (
    <li className="flex items-start gap-3 py-3">
      <button
        type="button"
        role="checkbox"
        aria-checked={item.isChecked}
        aria-label={toggleItemLabel(item.content, item.isChecked)}
        onClick={() => {
          // A completed item can't be edited, so close its editor as it's ticked off.
          if (!item.isChecked) setIsEditing(false);
          dispatch(
            updateItem({ id: item.id, patch: { isChecked: !item.isChecked } }),
          );
        }}
        className={`mt-px flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-md border transition-colors ${focusVisibleRingClasses} ${
          item.isChecked
            ? `border-transparent ${toneClasses.violet.solid} ${text.onBrand}`
            : `${surface.borderInput} ${surface.hoverSubtle}`
        }`}
      >
        {item.isChecked && (
          <Icon name="check" className="h-3.5 w-3.5" strokeWidth={3} />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`wrap-break-word text-base ${
            item.isChecked ? `${text.disabled} line-through` : text.heading
          }`}
        >
          {item.content}
        </p>

        {hasMeta && (
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            {tags.map((tag) => (
              <TagChip key={tag.id} name={tag.name} color={tag.color} />
            ))}
            {assignee && <Avatar name={assignee.name} size="sm" />}
            {item.dueDate !== null && (
              <span
                className={`text-xs ${overdue ? dangerTextClasses : text.muted}`}
              >
                {dueLabel(formatDueDate(item.dueDate))}
              </span>
            )}
          </div>
        )}

        {/* Only people who can manage items get the edit section, and not for a completed item. */}
        {isEditing && canManageItems && !item.isChecked && (
          <ItemDetails item={item} workspaceId={workspaceId} />
        )}
        {isCommenting && <ItemComments item={item} />}
      </div>

      {/*
        Comment button for everyone. For people who manage items, two more 28px slots: the pencil
        (open items; completed ones can't be edited) and the trash icon (completed items; open ones
        can't be deleted, and its tooltip is the label, which names the item). The empty slot keeps
        the pencils, and the trash icons, each in one column.
      */}
      <div className="-mt-1 flex shrink-0 items-center">
        <CommentToggleButton
          label={commentsToggleAriaLabel(item.content, commentCount)}
          title={commentsToggleLabel(commentCount)}
          count={commentCount}
          expanded={isCommenting}
          onClick={() => setIsCommenting((open) => !open)}
        />
        {canManageItems && (
          <>
            {item.isChecked ? (
              <span className="h-7 w-7 shrink-0" aria-hidden="true" />
            ) : (
              <EditIconButton
                label={editItemIconLabel(item.content)}
                title={editItemLabel}
                expanded={isEditing}
                onClick={() => setIsEditing((editing) => !editing)}
              />
            )}
            {canDelete ? (
              <DeleteIconButton
                label={deleteItemIconLabel(item.content)}
                onClick={requestDelete}
              />
            ) : (
              <span className="h-7 w-7 shrink-0" aria-hidden="true" />
            )}
          </>
        )}
      </div>
    </li>
  );
}
