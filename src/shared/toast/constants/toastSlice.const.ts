import type { ToastState } from "../models/toastSlice.model";

export const toastSliceName = "toast";

export const initialState: ToastState = { items: [] };

/** How long a toast stays on screen unless the caller says otherwise. */
export const defaultToastDurationMs = 4000;

/** More than this at once and the oldest is dropped, so a burst of errors can't fill the screen. */
export const maxVisibleToasts = 5;
