import { Icon, Tooltip } from "../../../shared/components/ui";
import {
  focusVisibleRingClasses,
  text,
  toneClasses,
} from "../../../shared/styles/theme";
import { iconToggleClasses } from "../constants/editIconButton.const";
import type { CommentToggleButtonProps } from "../models/commentToggleButton.model";

/**
 * Speech-bubble button on an item row that opens its comment box. It is separate from the
 * pencil (the edit section) because anyone can comment, but only some people can edit.
 * The count is a badge on the corner, so the button keeps the same size with or without one.
 */
export function CommentToggleButton({
  label,
  title,
  count,
  expanded,
  onClick,
}: CommentToggleButtonProps) {
  return (
    <Tooltip content={title} className="shrink-0">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-expanded={expanded}
        className={`relative inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-colors ${focusVisibleRingClasses} ${iconToggleClasses(expanded)}`}
      >
        <Icon name="comment" className="h-4 w-4" />
        {count > 0 && (
          <span
            aria-hidden="true"
            className={`absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none ${toneClasses.violet.solid} ${text.onBrand}`}
          >
            {count}
          </span>
        )}
      </button>
    </Tooltip>
  );
}
