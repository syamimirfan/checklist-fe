import type { ToneName } from "../../../../shared/styles/theme";

// Index = number of criteria met (0-4). Filled segments take the tone of the current level.
export const levels: { label: string; tone: ToneName }[] = [
  { label: "", tone: "rose" },
  { label: "Weak", tone: "rose" },
  { label: "Fair", tone: "pink" },
  { label: "Good", tone: "fuchsia" },
  { label: "Strong", tone: "violet" },
];
