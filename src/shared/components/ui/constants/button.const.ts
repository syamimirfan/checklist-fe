import { focusVisibleRingClasses } from "../../../styles/theme";
import type { Size } from "../models/button.model";

export const baseClasses =
  `inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-medium transition-colors ` +
  `${focusVisibleRingClasses} disabled:cursor-not-allowed disabled:opacity-60`;

export const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};
