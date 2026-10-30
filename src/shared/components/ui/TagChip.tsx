import { toneClasses } from "../../styles/theme";
import type { TagChipProps } from "./models/tagChip.model";

export function TagChip({ name, color, className = "" }: TagChipProps) {
  const tone = toneClasses[color];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tone.bg} ${tone.text} ${className}`}
    >
      {name}
    </span>
  );
}
