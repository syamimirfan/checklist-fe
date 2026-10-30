import { useAppSelector } from "../../../app/hooks";
import type { Tag } from "../models/checklists.model";
import { selectChecklistsById, selectTagsById } from "../selectors";

/** The tags a checklist has: the only ones its items can use. */
export function useChecklistTags(checklistId: string): Tag[] {
  const checklistsById = useAppSelector(selectChecklistsById);
  const tagsById = useAppSelector(selectTagsById);
  return (checklistsById.get(checklistId)?.tagIds ?? [])
    .map((tagId) => tagsById.get(tagId))
    .filter((tag): tag is Tag => tag !== undefined);
}
