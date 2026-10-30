export interface DeleteIconButtonProps {
  /** Accessible name, e.g. `Delete item Write copy`. */
  label: string;
  onClick: () => void;
  disabled?: boolean;
  /** Hover tooltip. Defaults to `label`; use it to say why the button is disabled. */
  title?: string;
  /** Applied to the wrapper around the button (spacing/margins), not the button itself. */
  className?: string;
}
