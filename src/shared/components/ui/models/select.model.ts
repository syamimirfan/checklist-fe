import type { SelectHTMLAttributes } from "react";

/** Pass both to show a "×" inside the select while it has a value; omit both for none. */
type SelectClearProps =
  | {
      /** Called by the "×". Set the caller's state back to the empty option (the one with value `""`). */
      onClear: () => void;
      /** Accessible name for the "×", e.g. "Clear workspace". */
      clearLabel: string;
    }
  | { onClear?: undefined; clearLabel?: undefined };

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  /** `compact` matches `compactFieldClasses` (h-10), `roomy` the labelled `Input` (h-12, for dialogs). */
  variant?: "compact" | "roomy";
} & SelectClearProps;
