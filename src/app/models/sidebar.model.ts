import type { CurrentUser } from "../hooks";

export interface SidebarProps {
  user: CurrentUser;
  /** Called after any navigation inside the sidebar, so the mobile drawer can close. */
  onNavigate?: () => void;
}
