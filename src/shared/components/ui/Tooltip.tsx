import { tooltipClasses } from "../../styles/theme";
import { tooltipAlignClasses } from "./constants/tooltip.const";
import type { TooltipProps } from "./models/tooltip.model";

/**
 * Hover tooltip above the wrapped control. Meant for explaining why a control is disabled:
 * a disabled button swallows mouse events (and a native `title` is slow and unstyled), so the
 * hover is tracked on this wrapper with CSS only, which works whether or not the control is
 * disabled. It also shows when focus is inside, for controls that can be focused.
 */
export function Tooltip({
  content,
  align = "center",
  className = "",
  children,
}: TooltipProps) {
  return (
    <span className={`group/tooltip relative inline-flex ${className}`}>
      {children}
      {content && (
        <span
          role="tooltip"
          className={`pointer-events-none invisible absolute bottom-full z-20 mb-2 w-max max-w-64 wrap-break-word rounded-lg px-3 py-2 text-xs font-medium leading-snug opacity-0 shadow-lg transition-opacity duration-150 group-hover/tooltip:visible group-hover/tooltip:opacity-100 group-focus-within/tooltip:visible group-focus-within/tooltip:opacity-100 ${tooltipAlignClasses[align]} ${tooltipClasses}`}
        >
          {content}
        </span>
      )}
    </span>
  );
}
