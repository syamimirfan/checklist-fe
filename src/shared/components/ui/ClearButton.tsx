import { focusVisibleRingClasses, surface, text } from "../../styles/theme";
import { Icon } from "./Icon";
import type { ClearButtonProps } from "./models/clearButton.model";

/**
 * Small "×" button that sits inside a text field to empty it. It is a mouse/touch
 * shortcut, so it is kept out of the Tab order (`tabIndex={-1}`): otherwise every
 * filled field in a form would add an extra stop. Keyboard users can still select
 * the text and delete it.
 */
export function ClearButton({ label, onClick }: ClearButtonProps) {
  return (
    <button
      type="button"
      tabIndex={-1}
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md ${text.muted} ${surface.hoverSubtle} ${focusVisibleRingClasses}`}
    >
      <Icon name="close" className="h-4 w-4" />
    </button>
  );
}
