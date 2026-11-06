import { useEffect } from "react";
import {
  alertToneMap,
  cursorPointer,
  focusVisibleRingClasses,
  surface,
  toneClasses,
} from "../../styles/theme";
import { dismissToastLabel } from "./constants/toaster.const";
import { Icon } from "./Icon";
import type { ToastItemProps, ToasterProps } from "./models/toaster.model";

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const { id, durationMs } = toast;

  // Dismisses itself when its time is up; the cleanup stops the timer if it's closed earlier.
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(id), durationMs);
    return () => window.clearTimeout(timer);
  }, [id, durationMs, onDismiss]);

  const tone = toneClasses[alertToneMap[toast.tone]];
  return (
    // The tint is translucent in dark mode, so an opaque layer sits under it: page content must not show through.
    <div
      role={toast.tone === "error" ? "alert" : "status"}
      className={`pointer-events-auto w-full max-w-sm rounded-lg shadow-lg ${surface.page}`}
    >
      <div
        className={`flex items-start gap-3 rounded-lg px-4 py-3 text-sm ${tone.bg} ${tone.text}`}
      >
        <p className="min-w-0 flex-1 wrap-break-word">{toast.message}</p>
        <button
          type="button"
          aria-label={dismissToastLabel}
          onClick={() => onDismiss(id)}
          className={`-mr-1 shrink-0 rounded p-0.5 opacity-70 hover:opacity-100 ${cursorPointer} ${focusVisibleRingClasses}`}
        >
          <Icon name="close" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/** Stack of notifications pinned to the bottom of the screen. Presentational: `app/ToastHost` feeds it from the store. */
export function Toaster({ toasts, onDismiss }: ToasterProps) {
  if (toasts.length === 0) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-60 flex flex-col items-center gap-2 p-4 sm:items-end">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
