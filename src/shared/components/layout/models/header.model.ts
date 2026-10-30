import type { ReactNode } from "react";

export interface HeaderProps {
  /** Page-specific actions (links, buttons, user info) shown after the theme toggle. */
  children?: ReactNode;
}
