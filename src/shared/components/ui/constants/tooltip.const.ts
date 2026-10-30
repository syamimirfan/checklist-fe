import type { TooltipAlign } from "../models/tooltip.model";

export const tooltipAlignClasses: Record<TooltipAlign, string> = {
  start: "left-0",
  center: "left-1/2 -translate-x-1/2",
  end: "right-0",
};
