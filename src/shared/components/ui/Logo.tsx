import { brandGradient, text } from "../../styles/theme";
import type { LogoProps } from "./models/logo.model";

export function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${text.onBrand}`}
        style={{ background: brandGradient }}
        aria-hidden="true"
      >
        C
      </span>
      <span className={`text-lg font-semibold ${text.heading}`}>Checklist</span>
    </div>
  );
}
