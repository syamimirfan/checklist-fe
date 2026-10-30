import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { Alert, Button, Input, Modal } from "../../../shared/components/ui";
import { routes } from "../../../shared/constants/routes";
import { createWorkspace } from "../checklistsSlice";
import { defaultErrorMessage } from "../constants/checklists.const";
import {
  cancelLabel,
  createWorkspaceLabel,
  newWorkspaceTitle,
  workspaceNameLabel,
  workspaceNamePlaceholder,
  workspaceNameRequired,
} from "../constants/checklistDialogs.const";
import type { NewWorkspaceDialogProps } from "../models/checklistDialogs.model";
import { messageOf } from "../utils/checklistUtils";

export function NewWorkspaceDialog({
  open,
  onClose,
  owner,
  onCreated,
}: NewWorkspaceDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={newWorkspaceTitle}>
      <NewWorkspaceForm onClose={onClose} owner={owner} onCreated={onCreated} />
    </Modal>
  );
}

/** Split from the dialog so its state starts fresh each time the (child-unmounting) Modal reopens. */
function NewWorkspaceForm({
  onClose,
  owner,
  onCreated,
}: Omit<NewWorkspaceDialogProps, "open">) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      setError(workspaceNameRequired);
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const { workspace } = await dispatch(
        createWorkspace({ name: name.trim(), owner }),
      ).unwrap();
      onClose();
      navigate(routes.workspace(workspace.id));
      onCreated?.();
    } catch (caught) {
      setError(messageOf(caught, defaultErrorMessage));
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {error && <Alert variant="error">{error}</Alert>}
      <Input
        label={workspaceNameLabel}
        placeholder={workspaceNamePlaceholder}
        value={name}
        onChange={(event) => setName(event.target.value)}
        autoFocus
        required
      />
      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {createWorkspaceLabel}
        </Button>
      </div>
    </form>
  );
}
