import type { Toast } from "../../../toast/models/toastSlice.model";

export interface ToasterProps {
  toasts: Toast[];
  /**
   * Called with a toast's id when its "×" is clicked or its time is up. Keep it referentially
   * stable (`useCallback`): each toast's countdown restarts if it changes.
   */
  onDismiss: (id: string) => void;
}

export interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}
