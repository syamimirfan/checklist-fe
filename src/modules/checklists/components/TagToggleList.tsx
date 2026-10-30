import { TagChip } from "../../../shared/components/ui";
import { focusVisibleRingClasses } from "../../../shared/styles/theme";
import type { TagToggleListProps } from "../models/tagToggleList.model";

/** Workspace tags as pressable chips. A selected tag has a ring; an unselected one is dimmed. */
export function TagToggleList({
  tags,
  selectedIds,
  onToggle,
  children,
}: TagToggleListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const isSelected = selectedIds.includes(tag.id);
        return (
          <button
            key={tag.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onToggle(tag.id)}
            className={`cursor-pointer rounded-full ${focusVisibleRingClasses}`}
          >
            <TagChip
              name={tag.name}
              color={tag.color}
              className={
                isSelected ? "ring-2 ring-current" : "opacity-60 hover:opacity-100"
              }
            />
          </button>
        );
      })}
      {children}
    </div>
  );
}
