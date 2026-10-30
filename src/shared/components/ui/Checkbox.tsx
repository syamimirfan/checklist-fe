import { useId } from "react";
import {
  checkboxAccentClasses,
  focusVisibleRingClasses,
  text,
} from "../../styles/theme";
import type { CheckboxProps } from "./models/checkbox.model";

export function Checkbox({
  label,
  error,
  id,
  className = "",
  ...rest
}: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center gap-3">
        <input
          id={inputId}
          type="checkbox"
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={`h-5 w-5 shrink-0 cursor-pointer rounded ${checkboxAccentClasses} ${focusVisibleRingClasses}`}
          {...rest}
        />
        <label
          htmlFor={inputId}
          className={`cursor-pointer text-sm ${text.body}`}
        >
          {label}
        </label>
      </div>
      {error && (
        <p
          id={errorId}
          className="text-sm text-brand-rose-dark dark:text-brand-rose-light"
        >
          {error}
        </p>
      )}
    </div>
  );
}
