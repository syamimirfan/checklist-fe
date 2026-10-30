import type { ReactNode } from "react";

export type SocialIcon = "globe" | "key";

export interface SocialButtonProps {
  icon: SocialIcon;
  onClick: () => void;
  children: ReactNode;
}
