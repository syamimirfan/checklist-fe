import { text } from "../../styles/theme";
import { allRightReserved, publisher } from "./constants/footer.const";
import type { CopyrightProps } from "./models/copyright.model";

/**
 * One-line copyright notice for pages that don't use the full `Footer` (auth pages,
 * the logged-in app). Uses the same strings as `Footer` so the wording stays in one place.
 */
export function Copyright({ className = "" }: CopyrightProps) {
  return (
    <p className={`text-xs ${text.muted} ${className}`}>
      {publisher} &middot; &copy; {new Date().getFullYear()} {allRightReserved}
    </p>
  );
}
