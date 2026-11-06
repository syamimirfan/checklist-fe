import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import {
  defaultToastDurationMs,
  initialState,
  maxVisibleToasts,
  toastSliceName,
} from "./constants/toastSlice.const";
import type {
  ShowToastPayload,
  Toast,
  ToastRootState,
} from "./models/toastSlice.model";

const toastSlice = createSlice({
  name: toastSliceName,
  initialState,
  reducers: {
    showToast: {
      reducer(state, action: PayloadAction<Toast>) {
        const { message, tone } = action.payload;
        // The same message already on screen (e.g. four calls failing at once) isn't stacked again.
        if (state.items.some((t) => t.message === message && t.tone === tone)) {
          return;
        }
        state.items.push(action.payload);
        if (state.items.length > maxVisibleToasts) {
          state.items.splice(0, state.items.length - maxVisibleToasts);
        }
      },
      // The id is made here, not in the reducer, which must stay pure.
      prepare({
        message,
        tone = "info",
        durationMs = defaultToastDurationMs,
      }: ShowToastPayload) {
        return { payload: { id: nanoid(), message, tone, durationMs } };
      },
    },
    dismissToast(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
  },
});

export const { showToast, dismissToast } = toastSlice.actions;
export const selectToasts = (state: ToastRootState) => state.toast.items;
export default toastSlice.reducer;
