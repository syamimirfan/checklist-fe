import { text } from "../../../shared/styles/theme";
import { noChecklistTagsText } from "../constants/checklistItem.const";
import { useChecklistTags } from "../hooks/useChecklistTags";
import type { ChecklistTagListProps } from "../models/checklistItem.model";
import { TagToggleList } from "./TagToggleList";

/**
 * The checklist's tags as chips to tick for one of its items. Items can only use tags the
 * checklist has; new tags are added by editing the checklist, not from here.
 */
export function ChecklistTagList({
  checklistId,
  selectedIds,
  onToggle,
}: ChecklistTagListProps) {
  const tags = useChecklistTags(checklistId);

  if (tags.length === 0) {
    return <p className={`text-sm ${text.muted}`}>{noChecklistTagsText}</p>;
  }
  return (
    <TagToggleList tags={tags} selectedIds={selectedIds} onToggle={onToggle} />
  );
}
