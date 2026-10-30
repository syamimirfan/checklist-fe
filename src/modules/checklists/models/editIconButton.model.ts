export type EditIconButtonSize = "sm" | "md";

export interface EditIconButtonProps {
  /** Accessible name, e.g. `Edit item Write copy`. */
  label: string;
  onClick: () => void;
  /** Hover tooltip. Defaults to `label`; pass something shorter when the label includes a long name. */
  title?: string;
  /** For a button that opens an editor inline: whether that editor is open (sets `aria-expanded`). */
  expanded?: boolean;
  /** `md` suits a page heading, `sm` a line of body text. */
  size?: EditIconButtonSize;
  /** Applied to the wrapper around the button (spacing/margins), not the button itself. */
  className?: string;
}
