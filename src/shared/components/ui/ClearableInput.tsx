import { forwardRef, useImperativeHandle, useRef } from "react";
import { ClearButton } from "./ClearButton";
import type { ClearableInputProps } from "./models/clearableInput.model";

/**
 * Bare input with a "×" inside it once there's a value (text, date, …). Pass the field's
 * own look through `className` (e.g. `compactFieldClasses`); this adds right padding for
 * the button and puts the cursor back in the field after clearing.
 */
export const ClearableInput = forwardRef<HTMLInputElement, ClearableInputProps>(
  (
    {
      value,
      onClear,
      clearLabel,
      wrapperClassName = "min-w-0 flex-1",
      className = "",
      ...rest
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
    const hasValue = value.length > 0;

    return (
      <div className={`relative ${wrapperClassName}`}>
        <input
          ref={inputRef}
          value={value}
          className={`${className} ${hasValue ? "pr-10" : ""}`}
          {...rest}
        />
        {hasValue && !rest.disabled && !rest.readOnly && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            <ClearButton
              label={clearLabel}
              onClick={() => {
                onClear();
                inputRef.current?.focus();
              }}
            />
          </div>
        )}
      </div>
    );
  },
);

ClearableInput.displayName = "ClearableInput";
