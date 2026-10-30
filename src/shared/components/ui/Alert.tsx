import { alertToneMap, toneClasses } from "../../styles/theme";
import type { AlertProps } from "./models/alert.model";

export function Alert({ variant = "info", children }: AlertProps) {
  const tone = toneClasses[alertToneMap[variant]];
  return (
    <div
      role="status"
      className={`rounded-lg px-4 py-3 text-sm ${tone.bg} ${tone.text}`}
    >
      {children}
    </div>
  );
}
