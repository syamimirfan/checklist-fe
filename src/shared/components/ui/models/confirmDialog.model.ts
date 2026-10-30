export type ConfirmTone = "danger" | "primary";

/** What to ask. Passed to `useConfirm()`, or straight to `ConfirmDialog` along with its state. */
export interface ConfirmOptions {
  title: string;
  /**
   * The question. Put `{name}` where the name goes: it's replaced by `name`, in bold, e.g.
   * "Are you sure you want to delete {name}? This can't be undone."
   */
  message: string;
  /** What the action is about, e.g. the title of the checklist about to be deleted. */
  name?: string;
  confirmLabel: string;
  /** Defaults to "Cancel". */
  cancelLabel?: string;
  /** `danger` (red) for destructive actions such as deleting; `primary` (the default) otherwise. */
  tone?: ConfirmTone;
}

export interface ConfirmDialogProps extends ConfirmOptions {
  open: boolean;
  onConfirm: () => void;
  /** Cancel, the "×" or Escape. */
  onClose: () => void;
}

/** Resolves `true` if the person confirmed, `false` if they cancelled. */
export type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;
