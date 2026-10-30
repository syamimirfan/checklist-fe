import type { KeyboardEvent } from "react";
import { Button, ClearableInput, TagChip } from "../../../shared/components/ui";
import {
  focusVisibleRingClasses,
  roundedControlClasses,
  text,
} from "../../../shared/styles/theme";
import { dialogFieldClasses } from "../constants/checklistDialogs.const";
import {
  addTagFieldLabel,
  chooseWorkspaceForTagsText,
  clearTagLabel,
  noWorkspaceTagsText,
  removeNewTagLabel,
  tagFieldInputLabel,
  tagFieldLabel,
  tagFieldPlaceholder,
} from "../constants/tagField.const";
import type { TagFieldProps } from "../models/tagField.model";
import { TagToggleList } from "./TagToggleList";

/** Tag picker for the checklist form: workspace tags to tick, plus an input for new ones. Driven by `useTagSelection`. */
export function TagField({ selection }: TagFieldProps) {
  const {
    isEnabled,
    workspaceTags,
    selectedTagIds,
    newTagNames,
    draft,
    setDraft,
    newTagColor,
    toggleTag,
    addFromDraft,
    removeNewTag,
  } = selection;
  const hasChips = workspaceTags.length > 0 || newTagNames.length > 0;

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    // Enter here adds the tag; without this it would submit the surrounding form.
    event.preventDefault();
    addFromDraft();
  }

  return (
    <div
      role="group"
      aria-label={tagFieldLabel}
      className="flex flex-col gap-2"
    >
      <span className={`text-sm font-medium ${text.label}`}>
        {tagFieldLabel}
      </span>
      {!isEnabled ? (
        <p className={`text-sm ${text.muted}`}>{chooseWorkspaceForTagsText}</p>
      ) : hasChips ? (
        <TagToggleList
          tags={workspaceTags}
          selectedIds={selectedTagIds}
          onToggle={toggleTag}
        >
          {newTagNames.map((name, index) => (
            <button
              key={name}
              type="button"
              onClick={() => removeNewTag(name)}
              aria-label={removeNewTagLabel(name)}
              className={`cursor-pointer rounded-full ${focusVisibleRingClasses}`}
            >
              <TagChip
                name={`${name} ×`}
                color={newTagColor(index)}
                className="ring-2 ring-current"
              />
            </button>
          ))}
        </TagToggleList>
      ) : (
        <p className={`text-sm ${text.muted}`}>{noWorkspaceTagsText}</p>
      )}
      <div className="flex gap-2">
        <ClearableInput
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onClear={() => setDraft("")}
          clearLabel={clearTagLabel}
          onKeyDown={handleKeyDown}
          placeholder={tagFieldPlaceholder}
          aria-label={tagFieldInputLabel}
          maxLength={30}
          disabled={!isEnabled}
          className={`${dialogFieldClasses} disabled:cursor-not-allowed disabled:opacity-60`}
        />
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={`shrink-0 whitespace-nowrap ${roundedControlClasses}`}
          disabled={!isEnabled || !draft.trim()}
          onClick={addFromDraft}
        >
          {addTagFieldLabel}
        </Button>
      </div>
    </div>
  );
}
