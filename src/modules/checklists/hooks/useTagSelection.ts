import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { toneNames } from "../../../shared/styles/theme";
import { createTag } from "../checklistsSlice";
import { selectTagsByWorkspaceId } from "../selectors";

const sameName = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

/**
 * State for choosing a checklist's tags (when creating or editing one) in `workspaceId`:
 * tick existing tags, or type new ones. `initialTagIds` are ticked to start with, e.g. the
 * checklist's current tags. New names are only turned into real tags by `resolveTagIds()`,
 * which the caller runs on submit — so cancelling leaves nothing behind.
 * `workspaceId` is `null` until the user has picked a workspace; tags belong to one, so
 * there is nothing to tick or create until then (`isEnabled` is false).
 *
 * Items don't use this: they can only take tags the checklist already has.
 */
export function useTagSelection(
  workspaceId: string | null,
  initialTagIds: string[] = [],
) {
  const dispatch = useAppDispatch();
  const tagsByWorkspaceId = useAppSelector(selectTagsByWorkspaceId);
  const workspaceTags =
    workspaceId === null ? [] : (tagsByWorkspaceId.get(workspaceId) ?? []);

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialTagIds);
  const [newTagNames, setNewTagNames] = useState<string[]>([]);
  const [draft, setDraft] = useState("");

  // Not-yet-created tags continue the same color cycle `createTag` callers use elsewhere.
  const newTagColor = (index: number) =>
    toneNames[(workspaceTags.length + index) % toneNames.length];

  function toggleTag(tagId: string) {
    setSelectedTagIds((ids) =>
      ids.includes(tagId) ? ids.filter((id) => id !== tagId) : [...ids, tagId],
    );
  }

  function addFromDraft() {
    const name = draft.trim();
    if (!name) return;
    const existing = workspaceTags.find((tag) => sameName(tag.name, name));
    if (existing) {
      // Typing the name of a tag that already exists ticks it instead of making a duplicate.
      setSelectedTagIds((ids) =>
        ids.includes(existing.id) ? ids : [...ids, existing.id],
      );
    } else if (!newTagNames.some((candidate) => sameName(candidate, name))) {
      setNewTagNames((names) => [...names, name]);
    }
    setDraft("");
  }

  function removeNewTag(name: string) {
    setNewTagNames((names) => names.filter((candidate) => candidate !== name));
  }

  /** Ticked tags belong to one workspace, so drop them when the caller switches workspace. */
  function clearSelection() {
    setSelectedTagIds([]);
  }

  /** Creates any typed-in tags that don't exist yet and returns the ids of every chosen tag. */
  async function resolveTagIds(): Promise<string[]> {
    // No workspace picked means no tags can exist yet; callers validate the workspace first.
    if (workspaceId === null) return [];

    // A tag typed but not yet added with the button still counts.
    const pending = draft.trim();
    const names =
      pending && !newTagNames.some((name) => sameName(name, pending))
        ? [...newTagNames, pending]
        : newTagNames;

    const tagIds = [...selectedTagIds];
    let createdCount = 0;
    for (const name of names) {
      const existing = workspaceTags.find((tag) => sameName(tag.name, name));
      if (existing) {
        if (!tagIds.includes(existing.id)) tagIds.push(existing.id);
        continue;
      }
      const tag = await dispatch(
        createTag({ workspaceId, name, color: newTagColor(createdCount) }),
      ).unwrap();
      createdCount += 1;
      tagIds.push(tag.id);
    }
    return tagIds;
  }

  return {
    isEnabled: workspaceId !== null,
    workspaceTags,
    selectedTagIds,
    newTagNames,
    draft,
    setDraft,
    newTagColor,
    toggleTag,
    addFromDraft,
    removeNewTag,
    clearSelection,
    resolveTagIds,
  };
}

export type TagSelection = ReturnType<typeof useTagSelection>;
