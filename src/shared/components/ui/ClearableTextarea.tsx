import { forwardRef, useImperativeHandle, useRef } from "react";
import { ClearButton } from "./ClearButton";
import type { ClearableTextareaProps } from "./models/clearableTextarea.model";

/**
 * The multi-line counterpart of `ClearableInput`: a textarea with a "×" in its top-right corner
 * once there's text. Pass the field's own look through `className` (e.g. `textareaFieldClasses`);
 * this adds right padding for the button and puts the cursor back in the field after clearing.
 */
export const ClearableTextarea = forwardRef<
  HTMLTextAreaElement,
  ClearableTextareaProps
>(
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
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);
    const hasValue = value.length > 0;

    return (
      <div className={`relative ${wrapperClassName}`}>
        <textarea
          ref={textareaRef}
          value={value}
          className={`${className} ${hasValue ? "pr-10" : ""}`}
          {...rest}
        />
        {hasValue && !rest.disabled && !rest.readOnly && (
          <div className="absolute right-2 top-2">
            <ClearButton
              label={clearLabel}
              onClick={() => {
                onClear();
                textareaRef.current?.focus();
              }}
            />
          </div>
        )}
      </div>
    );
  },
);

ClearableTextarea.displayName = "ClearableTextarea";
