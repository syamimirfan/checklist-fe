import { Button } from "../../../shared/components/ui";
import {
  cursorPointer,
  roundedControlClasses,
} from "../../../shared/styles/theme";
import type {
  SocialButtonProps,
  SocialIcon,
} from "./models/socialButton.model";

function Icon({ name }: { name: SocialIcon }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "globe" ? (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </>
      ) : (
        <>
          <circle cx="7" cy="12" r="4" />
          <path d="M11 12h10M18 12v3M21 12v2" />
        </>
      )}
    </svg>
  );
}

/** Outline button for an alternative sign-in method (Google, passkey). */
export function SocialButton({ icon, onClick, children }: SocialButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={onClick}
      className={`w-full ${roundedControlClasses} ${cursorPointer}`}
    >
      <Icon name={icon} />
      {children}
    </Button>
  );
}
