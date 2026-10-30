import { useEffect, useId, useRef } from "react";
import { focusVisibleRingClasses, surface, text } from "../../styles/theme";
import { Icon } from "./Icon";
import type { ModalProps } from "./models/modal.model";

/**
 * Dialog built on the native <dialog> element, so focus trapping, Escape and the
 * backdrop come from the browser. Children are only mounted while open, which
 * means any form state inside is reset every time it reopens.
 *
 * Clicking the dimmed area outside the box deliberately does nothing: these dialogs
 * hold forms, and a stray click shouldn't throw away what someone has typed. It closes
 * with the "×", a Cancel button, or Escape.
 */
export function Modal({ open, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // `showModal` focuses the first focusable element (the "×"), and React's `autoFocus` has
      // already run by now, before the dialog was open, so it's lost. A field can opt in with
      // `data-autofocus` to get focus once the dialog is open. Existing text is selected, so
      // typing replaces it (what you want when renaming).
      const field = dialog.querySelector<HTMLElement>("[data-autofocus]");
      field?.focus();
      if (field instanceof HTMLInputElement) field.select();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      className={`m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border p-0 shadow-xl backdrop:bg-black/50 ${surface.border} ${surface.page} ${text.body}`}
    >
      {open && (
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 id={titleId} className={`text-lg font-semibold ${text.heading}`}>
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className={`-mr-1.5 -mt-1 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg ${text.muted} ${surface.hoverSubtle} ${focusVisibleRingClasses}`}
            >
              <Icon name="close" />
            </button>
          </div>
          <div className="mt-4">{children}</div>
        </div>
      )}
    </dialog>
  );
}
