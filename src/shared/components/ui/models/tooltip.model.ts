import type { ReactNode } from "react";

/** Which edge of the wrapped control the bubble lines up with. */
export type TooltipAlign = "start" | "center" | "end";

export interface TooltipProps {
  /** What to say. When empty, nothing is rendered, so callers can pass a reason only while it applies. */
  content?: ReactNode;
  align?: TooltipAlign;
  className?: string;
  children: ReactNode;
}
