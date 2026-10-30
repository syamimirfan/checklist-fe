import { useCallback, useRef, useState, type ReactNode } from "react";
import { ConfirmContext } from "../../hooks/useConfirm";
import { ConfirmDialog } from "./ConfirmDialog";
import type { ConfirmFn, ConfirmOptions } from "./models/confirmDialog.model";

/**
 * Renders the one shared confirmation popup and hands `useConfirm()` to everything below it.
 * Mount it once, near the root of the app, so no feature needs a dialog of its own.
 */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  // Settles the promise `confirm` returned for the popup that's showing.
  const resolveRef = useRef<((confirmed: boolean) => void) | null>(null);

  const settle = useCallback((confirmed: boolean) => {
    resolveRef.current?.(confirmed);
    resolveRef.current = null;
    setOptions(null);
  }, []);

  const confirm = useCallback<ConfirmFn>(
    (next) =>
      new Promise<boolean>((resolve) => {
        // A second request while one is showing replaces it, and the first counts as cancelled.
        resolveRef.current?.(false);
        resolveRef.current = resolve;
        setOptions(next);
      }),
    [],
  );

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {options && (
        <ConfirmDialog
          open
          {...options}
          onConfirm={() => settle(true)}
          onClose={() => settle(false)}
        />
      )}
    </ConfirmContext.Provider>
  );
}
