export type IconName =
  | "grid"
  | "clock"
  | "star"
  | "user-check"
  | "share"
  | "plus"
  | "check"
  | "trash"
  | "edit"
  | "info"
  | "comment"
  | "menu"
  | "close"
  | "logout"
  | "calendar"
  | "chevron-down";

export interface IconProps {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}
