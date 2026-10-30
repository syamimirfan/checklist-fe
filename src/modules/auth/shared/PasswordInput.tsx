import { useRef, useState } from "react";
import { ClearButton, Input } from "../../../shared/components/ui";
import { clearFieldLabel } from "../../../shared/components/ui/constants/input.const";
import { focusVisibleRingClasses, text } from "../../../shared/styles/theme";
import { clearInputValue } from "../../../shared/utils/dom";
import type { PasswordInputProps } from "./models/passwordInput.model";

/** Password field with a clear (x) button, shown once there's text, and a Show/Hide toggle inside it. */
export function PasswordInput(props: PasswordInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasValue = String(props.value ?? "").length > 0;

  return (
    <Input
      {...props}
      ref={inputRef}
      type={isVisible ? "text" : "password"}
      endAdornment={
        <div className="flex items-center gap-1">
          {hasValue && (
            <ClearButton
              label={clearFieldLabel(props.label)}
              onClick={() =>
                inputRef.current && clearInputValue(inputRef.current)
              }
            />
          )}
          <button
            type="button"
            onClick={() => setIsVisible((visible) => !visible)}
            aria-pressed={isVisible}
            aria-label={isVisible ? "Hide password" : "Show password"}
            className={`cursor-pointer rounded-md px-1.5 py-1 text-sm font-medium ${text.label} ${focusVisibleRingClasses}`}
          >
            {isVisible ? "Hide" : "Show"}
          </button>
        </div>
      }
    />
  );
}
