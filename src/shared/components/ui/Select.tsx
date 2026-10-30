import { useRef } from "react";
import {
  compactFieldClasses,
  roomyFieldClasses,
  text,
} from "../../styles/theme";
import { ClearButton } from "./ClearButton";
import { Icon } from "./Icon";
import type { SelectProps } from "./models/select.model";

/**
 * Native <select> with our own chevron. The browser's built-in arrow ignores the
 * field's padding and sits flush against the edge, so it's switched off
 * (`appearance-none`) and a chevron is drawn inset instead. The dropdown list itself
 * is still the native one.
 *
 * Pass `onClear` and `clearLabel` for a "×" beside the chevron once something is chosen: it
 * resets the select to its empty option (`value=""`, e.g. "Unassigned") and puts focus back on it.
 */
export function Select({
  variant = "compact",
  className = "",
  children,
  onClear,
  clearLabel,
  ...rest
}: SelectProps) {
  const selectRef = useRef<HTMLSelectElement>(null);
  const fieldClasses =
    variant === "roomy" ? roomyFieldClasses : compactFieldClasses;
  const hasValue = String(rest.value ?? "") !== "";
  const showClear =
    onClear !== undefined && hasValue && !rest.disabled;

  return (
    <div className="relative">
      <select
        ref={selectRef}
        className={`${fieldClasses} cursor-pointer appearance-none ${showClear ? "pr-16" : "pr-10"} ${className}`}
        {...rest}
      >
        {children}
      </select>
      <Icon
        name="chevron-down"
        className={`pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${text.muted}`}
      />
      {showClear && (
        <div className="absolute inset-y-0 right-9 flex items-center">
          <ClearButton
            label={clearLabel}
            onClick={() => {
              onClear();
              selectRef.current?.focus();
            }}
          />
        </div>
      )}
    </div>
  );
}
