import type { InputHTMLAttributes, ReactNode } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  /** Shown on the right of the label row, e.g. a "Forgot password?" link. */
  labelAction?: ReactNode;
  /** Shown inside the field on the right, e.g. a clear button and a show/hide password toggle (the input reserves room for about two small controls). */
  endAdornment?: ReactNode;
  /**
   * Show a built-in "×" once the field has text. On by default for text-like types; it
   * needs a controlled `value`, and is skipped when `endAdornment` is used (which owns
   * the right-hand side, as `PasswordInput` does).
   */
  clearable?: boolean;
}
