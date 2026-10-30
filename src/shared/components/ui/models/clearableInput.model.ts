import type { InputHTMLAttributes } from "react";

export interface ClearableInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value"> {
  /** Controlled value. The "×" shows once it's non-empty. */
  value: string;
  /** Called by the "×". Set the caller's state back to "". */
  onClear: () => void;
  /** Accessible name for the "×", e.g. "Clear tag name". */
  clearLabel: string;
  /**
   * Classes for the element wrapping the input. The default suits a row next to a button
   * (`flex-1`); pass `""` inside a stacked label, where the wrapper should just fill the width.
   */
  wrapperClassName?: string;
}
