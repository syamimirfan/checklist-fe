import { Fragment, type ReactNode } from "react";
import { text } from "../../styles/theme";
import { Button } from "./Button";
import { confirmNameToken, defaultCancelLabel } from "./constants/confirmDialog.const";
import { Modal } from "./Modal";
import type { ConfirmDialogProps } from "./models/confirmDialog.model";

/** The message with `name` swapped in for `{name}`, in bold so it stands out in the sentence. */
function renderMessage(message: string, name?: string): ReactNode {
  if (name === undefined || !message.includes(confirmNameToken)) return message;
  return message.split(confirmNameToken).map((part, index) => (
    <Fragment key={index}>
      {index > 0 && (
        <strong className={`font-semibold ${text.heading}`}>{name}</strong>
      )}
      {part}
    </Fragment>
  ));
}

/**
 * A "are you sure?" popup, in place of the browser's `window.confirm`. Most code won't render it
 * directly: call `useConfirm()` instead (see `ConfirmProvider`).
 *
 * It sits on `Modal`, so a click outside doesn't dismiss it; it closes with Cancel, the "×" or
 * Escape. Focus starts on Cancel, so pressing Enter right away never confirms a destructive action.
 */
export function ConfirmDialog({
  open,
  title,
  message,
  name,
  confirmLabel,
  cancelLabel = defaultCancelLabel,
  tone = "primary",
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className={`wrap-break-word text-sm leading-relaxed ${text.body}`}>
        {renderMessage(message, name)}
      </p>
      <div className="mt-6 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose} data-autofocus>
          {cancelLabel}
        </Button>
        <Button
          type="button"
          variant={tone === "danger" ? "danger" : "primary"}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
