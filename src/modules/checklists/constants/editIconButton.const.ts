import { surface, text, toneClasses } from "../../../shared/styles/theme";
import type { EditIconButtonSize } from "../models/editIconButton.model";

export const editIconButtonSizeClasses: Record<
  EditIconButtonSize,
  { button: string; icon: string }
> = {
  // Same box and icon as `DeleteIconButton`, so the two sit alike in a row.
  sm: { button: "h-7 w-7", icon: "h-4 w-4" },
  md: { button: "h-8 w-8", icon: "h-5 w-5" },
};

/** Colors of a small icon button: muted until hovered, violet while the thing it opens is open. */
export const iconToggleClasses = (isActive: boolean) =>
  isActive
    ? `${toneClasses.violet.bg} ${toneClasses.violet.text}`
    : `${text.muted} ${surface.hoverSubtle} hover:text-neutral-900 dark:hover:text-neutral-50`;
