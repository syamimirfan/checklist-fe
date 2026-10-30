import { surface } from "../../styles/theme";
import type { CardProps } from "./models/card.model";

export function Card({ children, className = "", ...rest }: CardProps) {
  return (
    <div
      className={`rounded-2xl border ${surface.border} ${surface.page} p-6 shadow-sm shadow-neutral-900/5 dark:shadow-none ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
