import { surface } from "../../../shared/styles/theme";
import { illustrations } from "./constants/authIllustration.const";
import type {
  AuthIllustrationVariant,
  RowState,
} from "./models/authIllustration.model";

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function Box({ state, active }: { state: RowState; active?: boolean }) {
  if (state === "todo") {
    return (
      <span
        className={`h-5 w-5 shrink-0 rounded-md border-2 ${
          active
            ? "border-neutral-800 dark:border-neutral-200"
            : "border-neutral-300 dark:border-neutral-600"
        }`}
      />
    );
  }
  return (
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-brand-violet text-white`}
    >
      {state === "done" ? <CheckIcon /> : <PlusIcon />}
    </span>
  );
}

/** Decorative mini checklist card shown on the side panel next to the auth forms. */
export function AuthIllustration({
  variant,
}: {
  variant: AuthIllustrationVariant;
}) {
  const { rows, progress } = illustrations[variant];

  return (
    <div
      className={`flex w-54 flex-col gap-5 self-center rounded-2xl border ${surface.border} ${surface.page} p-6`}
      aria-hidden="true"
    >
      {rows.map((row, index) => (
        <div key={index} className="flex items-center gap-3">
          <Box state={row.state} active={row.active} />
          <span className="flex-1">
            <span
              className={`block h-0.5 rounded-full ${
                row.active
                  ? "bg-neutral-800 dark:bg-neutral-200"
                  : "bg-neutral-300 dark:bg-neutral-600"
              }`}
              style={{ width: row.width }}
            />
          </span>
        </div>
      ))}
      <div className={`mt-6 h-1.5 rounded-full ${surface.track}`}>
        <div
          className="h-full rounded-full bg-brand-violet"
          style={{ width: progress }}
        />
      </div>
    </div>
  );
}
