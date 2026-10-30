import type {
  AuthIllustrationVariant,
  Row,
} from "../models/authIllustration.model";

export const illustrations: Record<
  AuthIllustrationVariant,
  { rows: Row[]; progress: string }
> = {
  // Returning user: two items checked off, one to go.
  progress: {
    rows: [
      { state: "done", width: "85%" },
      { state: "done", width: "67%" },
      { state: "todo", width: "90%", active: true },
    ],
    progress: "67%",
  },
  // New user: nothing checked yet, adding the first item.
  create: {
    rows: [
      { state: "todo", width: "73%" },
      { state: "todo", width: "55%" },
      { state: "add", width: "90%", active: true },
    ],
    progress: "0%",
  },
};
