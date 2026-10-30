import type { ReactNode } from "react";
import type { AuthIllustrationVariant } from "./authIllustration.model";

/** Content of the brand panel beside the form (desktop only). */
export interface AuthPanelContent {
  headline: string;
  description: string;
  illustration: AuthIllustrationVariant;
}

export interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  panel?: AuthPanelContent;
  children: ReactNode;
}
