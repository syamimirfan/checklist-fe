import type { AlertVariant } from "../../components/ui/models/alert.model";

/** Same three looks as `Alert`, so a toast and an inline alert share their colours. */
export type ToastTone = AlertVariant;

export interface Toast {
  id: string;
  message: string;
  tone: ToastTone;
  /** How long it stays before dismissing itself. */
  durationMs: number;
}

export interface ToastState {
  items: Toast[];
}

/** What a caller passes to `showToast`; the id is generated for it. */
export interface ShowToastPayload {
  message: string;
  tone?: ToastTone;
  durationMs?: number;
}

/** The slice of the store this feature reads, so `shared/` needn't import the app's `RootState`. */
export interface ToastRootState {
  toast: ToastState;
}
