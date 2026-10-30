import { useRef, useState, type SubmitEvent } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { Button, ClearableInput, Icon } from "../../../shared/components/ui";
import {
  compactFieldClasses,
  focusVisibleRingClasses,
  surface,
  text,
} from "../../../shared/styles/theme";
import { createItem } from "../checklistsSlice";
import {
  addItemDueDateLabel,
  addItemLabel,
  addItemPlaceholder,
  addItemSubmitLabel,
  cancelLabel,
  clearDueDateLabel,
  clearItemTitleLabel,
} from "../constants/checklistItem.const";
import { useChecklistTags } from "../hooks/useChecklistTags";
import {
  isWithinDueDateMax,
  useItemDueDateMax,
} from "../hooks/useItemDueDateMax";
import type { AddItemRowProps } from "../models/checklistItem.model";
import { tagFieldLabel } from "../constants/tagField.const";
import { ChecklistTagList } from "./ChecklistTagList";

/**
 * The "+ Add item" row at the bottom of "To do": a title, plus an optional due date and tags.
 * The tags on offer are the checklist's own; items can't introduce new ones.
 * Stays open after adding so several items can be typed in a row; the extras reset each time.
 */
export function AddItemRow({
  checklistId,
  nextPosition,
  isAdding,
  onAddingChange,
}: AddItemRowProps) {
  const dispatch = useAppDispatch();
  const contentRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const checklistTags = useChecklistTags(checklistId);
  const maxDueDate = useItemDueDateMax(checklistId);

  function toggleTag(tagId: string) {
    setSelectedTagIds((ids) =>
      ids.includes(tagId) ? ids.filter((id) => id !== tagId) : [...ids, tagId],
    );
  }

  function close() {
    setContent("");
    setDueDate("");
    setSelectedTagIds([]);
    onAddingChange(false);
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || isSaving) return;
    setIsSaving(true);
    try {
      await dispatch(
        createItem({
          checklistId,
          content: trimmed,
          position: nextPosition,
          dueDate: dueDate || null,
          // Skip any ticked tag the checklist has lost in the meantime (e.g. via its edit dialog).
          tagIds: checklistTags
            .filter((tag) => selectedTagIds.includes(tag.id))
            .map((tag) => tag.id),
        }),
      ).unwrap();
      setContent("");
      setDueDate("");
      setSelectedTagIds([]);
      contentRef.current?.focus();
    } catch {
      // A failed createItem already set the page-level error banner. Keep what
      // was typed so the user can just press Add again.
    } finally {
      setIsSaving(false);
    }
  }

  if (!isAdding) {
    return (
      <button
        type="button"
        onClick={() => onAddingChange(true)}
        className={`flex w-full cursor-pointer items-center gap-3 rounded-lg py-3 text-left text-base ${text.body} ${surface.hoverSubtle} ${focusVisibleRingClasses}`}
      >
        <Icon name="plus" className="h-5 w-5" />
        {addItemLabel}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 py-2">
      <div className="flex items-center gap-2">
        <ClearableInput
          ref={contentRef}
          type="text"
          autoFocus
          value={content}
          onChange={(event) => setContent(event.target.value)}
          onClear={() => setContent("")}
          clearLabel={clearItemTitleLabel}
          onKeyDown={(event) => {
            if (event.key === "Escape") close();
          }}
          placeholder={addItemPlaceholder}
          aria-label={addItemLabel}
          className={compactFieldClasses}
        />
        <Button
          type="submit"
          size="sm"
          className="shrink-0 whitespace-nowrap"
          isLoading={isSaving}
          disabled={!content.trim()}
        >
          {addItemSubmitLabel}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="shrink-0 whitespace-nowrap"
          onClick={close}
        >
          {cancelLabel}
        </Button>
      </div>

      <div
        className={`flex flex-col gap-4 rounded-xl border p-4 ${surface.border} ${surface.pageMuted}`}
      >
        <label className="flex flex-col gap-1.5 sm:max-w-56">
          <span className={`text-sm font-medium ${text.label}`}>
            {addItemDueDateLabel}
          </span>
          <ClearableInput
            type="date"
            value={dueDate}
            max={maxDueDate}
            onChange={(event) => {
              // The picker greys these dates out; this also stops one being typed in.
              if (isWithinDueDateMax(event.target.value, maxDueDate)) {
                setDueDate(event.target.value);
              }
            }}
            onClear={() => setDueDate("")}
            clearLabel={clearDueDateLabel}
            wrapperClassName=""
            className={compactFieldClasses}
          />
        </label>
        <div
          role="group"
          aria-label={tagFieldLabel}
          className="flex flex-col gap-2"
        >
          <span className={`text-sm font-medium ${text.label}`}>
            {tagFieldLabel}
          </span>
          <ChecklistTagList
            checklistId={checklistId}
            selectedIds={selectedTagIds}
            onToggle={toggleTag}
          />
        </div>
      </div>
    </form>
  );
}
