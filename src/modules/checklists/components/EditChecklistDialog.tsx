import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Modal } from "../../../shared/components/ui";
import { updateChecklist } from "../checklistsSlice";
import {
  dueDateItemsHint,
  editChecklistTitle,
  saveChecklistLabel,
  workspaceChangeHint,
} from "../constants/checklistDialogs.const";
import { useCreatableWorkspaces } from "../hooks/useCreatableWorkspaces";
import type {
  ChecklistFormValues,
  EditChecklistDialogProps,
} from "../models/checklistDialogs.model";
import type { Checklist, ChecklistPatch } from "../models/checklists.model";
import { selectItemsByChecklistId } from "../selectors";
import { dayBefore, formatDueDate } from "../utils/date";
import { ChecklistForm } from "./ChecklistForm";

/** Edit a checklist's title, workspace, tags, due date and whether it's a template. */
export function EditChecklistDialog({
  open,
  onClose,
  checklist,
}: EditChecklistDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={editChecklistTitle}>
      <EditChecklistForm onClose={onClose} checklist={checklist} />
    </Modal>
  );
}

const sameIds = (a: string[], b: string[]) =>
  a.length === b.length && a.every((id) => b.includes(id));

/** Only the fields the user actually changed. */
function changesTo(
  checklist: Checklist,
  values: ChecklistFormValues,
): ChecklistPatch {
  const patch: ChecklistPatch = {};
  if (values.title !== checklist.title) patch.title = values.title;
  if (values.workspaceId !== checklist.workspaceId)
    patch.workspaceId = values.workspaceId;
  if (values.dueDate !== checklist.dueDate) patch.dueDate = values.dueDate;
  if (values.isTemplate !== checklist.isTemplate)
    patch.isTemplate = values.isTemplate;
  if (!sameIds(values.tagIds, checklist.tagIds)) patch.tagIds = values.tagIds;
  return patch;
}

/** Split from the dialog so its state starts fresh each time the (child-unmounting) Modal reopens. */
function EditChecklistForm({
  onClose,
  checklist,
}: Omit<EditChecklistDialogProps, "open">) {
  const dispatch = useAppDispatch();
  // Moving a checklist is adding it to another workspace, so the same places are on offer as for a new one.
  const workspaces = useCreatableWorkspaces();
  const items = useAppSelector(selectItemsByChecklistId).get(checklist.id) ?? [];

  // Saving an earlier due date pulls later item dates back (see `updateChecklist.fulfilled`), so say so first.
  const dueDateHint = (dueDate: string) => {
    if (!dueDate) return null;
    const affected = items.filter(
      (item) => item.dueDate !== null && item.dueDate >= dueDate,
    ).length;
    return affected > 0
      ? dueDateItemsHint(affected, formatDueDate(dayBefore(dueDate)))
      : null;
  };

  async function handleSubmit(values: ChecklistFormValues) {
    const patch = changesTo(checklist, values);
    // Nothing changed: just close.
    if (Object.keys(patch).length > 0) {
      await dispatch(updateChecklist({ id: checklist.id, patch })).unwrap();
    }
    onClose();
  }

  return (
    <ChecklistForm
      workspaces={workspaces}
      initial={{
        title: checklist.title,
        workspaceId: checklist.workspaceId,
        dueDate: checklist.dueDate ?? "",
        isTemplate: checklist.isTemplate,
        tagIds: checklist.tagIds,
      }}
      submitLabel={saveChecklistLabel}
      onSubmit={handleSubmit}
      onClose={onClose}
      workspaceChangeHint={workspaceChangeHint}
      dueDateHint={dueDateHint}
    />
  );
}
