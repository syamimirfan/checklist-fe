import { Icon, Tooltip } from "../../../shared/components/ui";
import { focusVisibleRingClasses } from "../../../shared/styles/theme";
import {
  editIconButtonSizeClasses,
  iconToggleClasses,
} from "../constants/editIconButton.const";
import type { EditIconButtonProps } from "../models/editIconButton.model";

/** Pencil button that sits right beside a name (checklist title, item content) to edit it. */
export function EditIconButton({
  label,
  onClick,
  title,
  expanded,
  size = "sm",
  className = "",
}: EditIconButtonProps) {
  const sizeClasses = editIconButtonSizeClasses[size];

  return (
    <Tooltip content={title ?? label} className={`shrink-0 ${className}`}>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-expanded={expanded}
        className={`inline-flex ${sizeClasses.button} cursor-pointer items-center justify-center rounded-md transition-colors ${focusVisibleRingClasses} ${iconToggleClasses(Boolean(expanded))}`}
      >
        <Icon name="edit" className={sizeClasses.icon} />
      </button>
    </Tooltip>
  );
}
