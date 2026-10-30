import type { ReactNode } from "react";

export type AlertVariant = "error" | "success" | "info";

export interface AlertProps {
  variant?: AlertVariant;
  children: ReactNode;
}
