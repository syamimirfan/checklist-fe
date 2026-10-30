import { Icon, Tooltip } from "../../../shared/components/ui";
import {
  dangerTextClasses,
  focusVisibleRingClasses,
} from "../../../shared/styles/theme";
import type { DeleteIconButtonProps } from "../models/deleteIconButton.model";

/**
 * Red trash icon button for list rows and cards, with a hover tooltip (the reason, while it's
 * disabled). The wrapper is `relative z-10` so it stays above a stretched link (see `ChecklistCard`),
 * so clicking it deletes instead of opening the card. `className` is applied to that wrapper.
 */
export function DeleteIconButton({
  label,
  onClick,
  disabled = false,
  title,
  className = "",
}: DeleteIconButtonProps) {
  return (
    <Tooltip
      content={title ?? label}
      align="end"
      className={`z-10 shrink-0 ${className}`}
    >
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors ${dangerTextClasses} ${focusVisibleRingClasses} enabled:cursor-pointer enabled:hover:bg-brand-rose-soft enabled:hover:text-brand-rose-dark dark:enabled:hover:bg-brand-rose/15 dark:enabled:hover:text-brand-rose-light disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <Icon name="trash" className="h-4 w-4" />
      </button>
    </Tooltip>
  );
}
