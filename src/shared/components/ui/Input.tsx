import { forwardRef, useId, useImperativeHandle, useRef } from "react";
import { inputBaseClasses, inputStateClasses, text } from "../../styles/theme";
import { clearInputValue } from "../../utils/dom";
import { ClearButton } from "./ClearButton";
import { clearableInputTypes, clearFieldLabel } from "./constants/input.const";
import type { InputProps } from "./models/input.model";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      labelAction,
      endAdornment,
      clearable = true,
      id,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const hintId = hint ? `${inputId}-hint` : undefined;

    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
    const showClear =
      clearable &&
      !endAdornment &&
      clearableInputTypes.includes(rest.type ?? "text") &&
      String(rest.value ?? "").length > 0 &&
      !rest.disabled &&
      !rest.readOnly;

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor={inputId}
            className={`text-sm font-medium ${text.label}`}
          >
            {label}
          </label>
          {labelAction}
        </div>
        <div className="relative">
          <input
            id={inputId}
            ref={inputRef}
            aria-invalid={Boolean(error)}
            aria-describedby={errorId ?? hintId}
            className={`h-12 w-full rounded-xl border px-3.5 text-sm ${inputBaseClasses}
              focus:outline-none focus:ring-2 focus:ring-offset-1
              ${endAdornment ? "pr-28" : showClear ? "pr-10" : ""}
              ${error ? inputStateClasses.error : inputStateClasses.default} ${className}`}
            {...rest}
          />
          {endAdornment && (
            <div className="absolute inset-y-0 right-3 flex items-center">
              {endAdornment}
            </div>
          )}
          {showClear && (
            <div className="absolute inset-y-0 right-3 flex items-center">
              <ClearButton
                label={clearFieldLabel(label)}
                onClick={() =>
                  inputRef.current && clearInputValue(inputRef.current)
                }
              />
            </div>
          )}
        </div>
        {error ? (
          <p
            id={errorId}
            className="text-sm text-brand-rose-dark dark:text-brand-rose-light"
          >
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className={`text-sm ${text.muted}`}>
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
