import { Icon, Tooltip } from "../../../shared/components/ui";
import {
  focusVisibleRingClasses,
  toneClasses,
} from "../../../shared/styles/theme";
import {
  roleColors,
  roleDescriptions,
  roleInfoAriaLabel,
  roleLabels,
} from "../constants/checklistPage.const";
import type { RoleBadgeProps } from "../models/roleBadge.model";

/**
 * A role's name as a badge with an "i": hover it (or focus it, by keyboard or tap) to see what
 * that role can do. It's a button only so it can be focused; it doesn't do anything when clicked.
 */
export function RoleBadge({ role }: RoleBadgeProps) {
  const tone = toneClasses[roleColors[role]];
  const label = roleLabels[role];
  const description = roleDescriptions[role];

  return (
    <Tooltip content={description} align="start">
      <button
        type="button"
        aria-label={roleInfoAriaLabel(label, description)}
        className={`inline-flex cursor-help items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${tone.bg} ${tone.text} ${focusVisibleRingClasses}`}
      >
        {label}
        <Icon name="info" className="h-3.5 w-3.5" />
      </button>
    </Tooltip>
  );
}
