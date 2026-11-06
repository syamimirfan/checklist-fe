import { useCallback } from "react";
import { Toaster } from "../shared/components/ui";
import { dismissToast, selectToasts } from "../shared/toast";
import { useAppDispatch, useAppSelector } from "./hooks";

/** Connects the store's toasts to the on-screen `Toaster`. Mounted once in `App`. */
export function ToastHost() {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector(selectToasts);
  const handleDismiss = useCallback(
    (id: string) => {
      dispatch(dismissToast(id));
    },
    [dispatch],
  );
  return <Toaster toasts={toasts} onDismiss={handleDismiss} />;
}
