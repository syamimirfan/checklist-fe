import { surface, text } from "../../styles/theme";
import { Logo } from "../ui";
import { allRightReserved, publisher } from "./constants/footer.const";

/** Page footer shared across pages: logo on the left, author and copyright on the right. */
export function Footer() {
  return (
    <footer className={`border-t ${surface.border} py-8`}>
      <div
        className={`mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center text-sm sm:flex-row sm:justify-between sm:px-6 sm:text-left ${text.muted}`}
      >
        <Logo />
        <div className="flex flex-col items-center gap-1 sm:items-end">
          <p>{publisher}</p>
          <p>
            &copy; {new Date().getFullYear()} {allRightReserved}
          </p>
        </div>
      </div>
    </footer>
  );
}
