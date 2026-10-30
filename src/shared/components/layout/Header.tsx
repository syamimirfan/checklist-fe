import { surface } from "../../styles/theme";
import { Logo, ThemeToggle } from "../ui";
import type { HeaderProps } from "./models/header.model";

/** Sticky top bar shared by every page: logo on the left, theme toggle + page actions on the right. */
export function Header({ children }: HeaderProps) {
  return (
    <header
      className={`sticky top-0 z-50 border-b ${surface.border} ${surface.headerTranslucent}`}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-6">
        <Logo />
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {children}
        </div>
      </div>
    </header>
  );
}
