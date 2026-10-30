import { useState, type SubmitEvent } from "react";
import {
  Alert,
  Button,
  Checkbox,
  ClearableInput,
  Input,
  Select,
} from "../../../shared/components/ui";
import { text } from "../../../shared/styles/theme";
import { defaultErrorMessage } from "../constants/checklists.const";
import {
  cancelLabel,
  checklistDueDateLabel,
  checklistTemplateLabel,
  checklistTitleLabel,
  checklistTitlePlaceholder,
  checklistTitleRequired,
  checklistWorkspaceLabel,
  checklistWorkspaceRequired,
  clearWorkspaceLabel,
  dialogFieldClasses,
  noWorkspaceForChecklist,
  workspacePlaceholder,
} from "../constants/checklistDialogs.const";
import { clearDueDateLabel } from "../constants/checklistItem.const";
import { useTagSelection } from "../hooks/useTagSelection";
import type { ChecklistFormProps } from "../models/checklistDialogs.model";
import { messageOf } from "../utils/checklistUtils";
import { daysFromNow } from "../utils/date";
import { TagField } from "./TagField";

/**
 * The fields of a checklist: title, workspace, tags, due date and "Save as a template". Shared by
 * the New and Edit dialogs, which only differ in where it starts and what happens on submit.
 * Its state is local, so mount it fresh each time a dialog opens (the `Modal` does that).
 */
export function ChecklistForm({
  workspaces,
  initial,
  submitLabel,
  onSubmit,
  onClose,
  workspaceChangeHint,
  dueDateHint,
}: ChecklistFormProps) {
  const [title, setTitle] = useState(initial.title);
  // Nothing is chosen until the user picks one (or the dialog was opened from a workspace page).
  const [workspaceId, setWorkspaceId] = useState<string | null>(
    initial.workspaceId,
  );
  const [dueDate, setDueDate] = useState(initial.dueDate);
  const [isTemplate, setIsTemplate] = useState(initial.isTemplate);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const tags = useTagSelection(workspaceId, initial.tagIds);

  function changeWorkspace(nextWorkspaceId: string | null) {
    setWorkspaceId(nextWorkspaceId);
    tags.clearSelection();
    if (error === checklistWorkspaceRequired) setError(null);
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) {
      setError(checklistTitleRequired);
      return;
    }
    if (workspaceId === null) {
      setError(checklistWorkspaceRequired);
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const tagIds = await tags.resolveTagIds();
      await onSubmit({
        title: title.trim(),
        workspaceId,
        dueDate: dueDate || null,
        isTemplate,
        tagIds,
      });
    } catch (caught) {
      setError(messageOf(caught, defaultErrorMessage));
      setIsSubmitting(false);
    }
  }

  if (workspaces.length === 0) {
    return <Alert variant="info">{noWorkspaceForChecklist}</Alert>;
  }

  const today = daysFromNow(0);
  const dueDateNote = dueDateHint?.(dueDate) ?? null;
  // Only once another workspace is actually picked (not while it's cleared).
  const hasMoved =
    initial.workspaceId !== null &&
    workspaceId !== null &&
    workspaceId !== initial.workspaceId;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {error && <Alert variant="error">{error}</Alert>}

      <Input
        label={checklistTitleLabel}
        placeholder={checklistTitlePlaceholder}
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
          // The "needs a title" error is about this field, so it shouldn't outlive the fix.
          if (error === checklistTitleRequired) setError(null);
        }}
        data-autofocus
        required
      />

      <div className="flex flex-col gap-2">
        <label className="flex flex-col gap-2">
          <span className={`text-sm font-medium ${text.label}`}>
            {checklistWorkspaceLabel}
          </span>
          <Select
            variant="roomy"
            value={workspaceId ?? ""}
            onChange={(event) => changeWorkspace(event.target.value || null)}
            onClear={() => changeWorkspace(null)}
            clearLabel={clearWorkspaceLabel}
          >
            <option value="">{workspacePlaceholder}</option>
            {workspaces.map((workspace) => (
              <option key={workspace.id} value={workspace.id}>
                {workspace.name}
              </option>
            ))}
          </Select>
        </label>
        {hasMoved && workspaceChangeHint && (
          <p className={`text-sm ${text.muted}`}>{workspaceChangeHint}</p>
        )}
      </div>

      <TagField selection={tags} />

      <div className="flex flex-col gap-2">
        <label className="flex flex-col gap-2">
          <span className={`text-sm font-medium ${text.label}`}>
            {checklistDueDateLabel}
          </span>
          <ClearableInput
            type="date"
            value={dueDate}
            min={today}
            onChange={(event) => {
              const next = event.target.value;
              // The picker greys out past days; this also stops one being typed in. A past due
              // date the checklist already has (it's overdue) can stay, so it can still be renamed.
              if (next !== "" && next < today && next !== initial.dueDate) return;
              setDueDate(next);
            }}
            onClear={() => setDueDate("")}
            clearLabel={clearDueDateLabel}
            wrapperClassName=""
            className={dialogFieldClasses}
          />
        </label>
        {dueDateNote && (
          <p className={`text-sm ${text.muted}`}>{dueDateNote}</p>
        )}
      </div>

      <Checkbox
        label={checklistTemplateLabel}
        checked={isTemplate}
        onChange={(event) => setIsTemplate(event.target.checked)}
      />

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
