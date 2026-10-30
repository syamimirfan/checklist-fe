import { useNavigate } from "react-router-dom";
import { useAppDispatch, useCurrentUser } from "../../../app/hooks";
import { Modal } from "../../../shared/components/ui";
import { routes } from "../../../shared/constants/routes";
import { createChecklist } from "../checklistsSlice";
import {
  createChecklistLabel,
  newChecklistTitle,
} from "../constants/checklistDialogs.const";
import { useCreatableWorkspaces } from "../hooks/useCreatableWorkspaces";
import type {
  ChecklistFormValues,
  NewChecklistDialogProps,
} from "../models/checklistDialogs.model";
import { ChecklistForm } from "./ChecklistForm";

export function NewChecklistDialog({
  open,
  onClose,
  defaultWorkspaceId,
  defaultIsTemplate = false,
}: NewChecklistDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={newChecklistTitle}>
      <NewChecklistForm
        onClose={onClose}
        defaultWorkspaceId={defaultWorkspaceId}
        defaultIsTemplate={defaultIsTemplate}
      />
    </Modal>
  );
}

/** Split from the dialog so its state starts fresh each time the (child-unmounting) Modal reopens. */
function NewChecklistForm({
  onClose,
  defaultWorkspaceId,
  defaultIsTemplate,
}: Required<Pick<NewChecklistDialogProps, "defaultIsTemplate">> &
  Pick<NewChecklistDialogProps, "onClose" | "defaultWorkspaceId">) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useCurrentUser();
  const workspaces = useCreatableWorkspaces();

  async function handleSubmit(values: ChecklistFormValues) {
    const created = await dispatch(
      createChecklist({ ...values, createdBy: user.id }),
    ).unwrap();
    onClose();
    navigate(routes.checklist(created.id));
  }

  return (
    <ChecklistForm
      workspaces={workspaces}
      initial={{
        title: "",
        workspaceId: defaultWorkspaceId ?? null,
        dueDate: "",
        isTemplate: defaultIsTemplate,
        tagIds: [],
      }}
      submitLabel={createChecklistLabel}
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  );
}
