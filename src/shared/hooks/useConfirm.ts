import { createContext, useContext } from "react";
import type { ConfirmFn } from "../components/ui/models/confirmDialog.model";

/** Filled in by `ConfirmProvider`. */
export const ConfirmContext = createContext<ConfirmFn | null>(null);

/**
 * Ask the person to confirm something, in a popup instead of the browser's `window.confirm`.
 * Works the same way: it resolves `true` if they confirmed and `false` if they cancelled.
 *
 *   const confirm = useConfirm();
 *   const confirmed = await confirm({
 *     title: "Delete checklist?",
 *     message: "Are you sure you want to delete {name}? This can't be undone.",
 *     name: checklist.title,
 *     confirmLabel: "Delete checklist",
 *     tone: "danger",
 *   });
 *   if (!confirmed) return;
 */
export function useConfirm(): ConfirmFn {
  const confirm = useContext(ConfirmContext);
  if (!confirm) {
    throw new Error("useConfirm must be used inside <ConfirmProvider>.");
  }
  return confirm;
}
