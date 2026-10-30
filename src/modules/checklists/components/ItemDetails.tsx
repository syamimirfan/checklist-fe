import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { ClearableInput, Select } from "../../../shared/components/ui";
import {
  compactFieldClasses,
  surface,
  text,
} from "../../../shared/styles/theme";
import { updateItem } from "../checklistsSlice";
import {
  assigneeLabel,
  clearAssigneeLabel,
  clearDueDateLabel,
  dueDateLabel,
  tagsLabel,
  unassignedOption,
} from "../constants/checklistItem.const";
import {
  isWithinDueDateMax,
  useItemDueDateMax,
} from "../hooks/useItemDueDateMax";
import type { ItemDetailsProps } from "../models/checklistItem.model";
import type { ItemPatch } from "../models/checklists.model";
import { selectMembersByWorkspaceId, selectPeopleById } from "../selectors";
import { ChecklistTagList } from "./ChecklistTagList";

const labelClasses = `text-sm font-medium ${text.label}`;

/**
 * Inline editor under an item: assignee, due date and tags. Only shown to people who can edit
 * items (admins and superusers), so there's no read-only version. Comments aren't here: they have
 * their own box (`ItemComments`), which every role can use.
 */
export function ItemDetails({ item, workspaceId }: ItemDetailsProps) {
  const dispatch = useAppDispatch();
  const peopleById = useAppSelector(selectPeopleById);
  const membersByWorkspaceId = useAppSelector(selectMembersByWorkspaceId);

  const members = membersByWorkspaceId.get(workspaceId) ?? [];
  const maxDueDate = useItemDueDateMax(item.checklistId);

  const patch = (changes: ItemPatch) =>
    dispatch(updateItem({ id: item.id, patch: changes }));

  const toggleTag = (tagId: string) =>
    patch({
      tagIds: item.tagIds.includes(tagId)
        ? item.tagIds.filter((id) => id !== tagId)
        : [...item.tagIds, tagId],
    });

  return (
    <div
      className={`mt-3 flex flex-col gap-5 rounded-xl border p-4 ${surface.border} ${surface.pageMuted}`}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className={labelClasses}>{assigneeLabel}</span>
          <Select
            value={item.assignedTo ?? ""}
            onChange={(event) =>
              patch({ assignedTo: event.target.value || null })
            }
            onClear={() => patch({ assignedTo: null })}
            clearLabel={clearAssigneeLabel}
          >
            <option value="">{unassignedOption}</option>
            {members.map((member) => (
              <option key={member.userId} value={member.userId}>
                {peopleById.get(member.userId)?.name ?? member.userId}
              </option>
            ))}
          </Select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelClasses}>{dueDateLabel}</span>
          <ClearableInput
            type="date"
            value={item.dueDate ?? ""}
            max={maxDueDate}
            onChange={(event) => {
              // The picker greys these dates out; this also stops one being typed in.
              if (!isWithinDueDateMax(event.target.value, maxDueDate)) return;
              patch({ dueDate: event.target.value || null });
            }}
            onClear={() => patch({ dueDate: null })}
            clearLabel={clearDueDateLabel}
            wrapperClassName=""
            className={compactFieldClasses}
          />
        </label>
      </div>

      <section className="flex flex-col gap-2">
        <h3 className={labelClasses}>{tagsLabel}</h3>
        <ChecklistTagList
          checklistId={item.checklistId}
          selectedIds={item.tagIds}
          onToggle={toggleTag}
        />
      </section>
    </div>
  );
}
