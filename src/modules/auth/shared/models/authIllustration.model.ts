export type AuthIllustrationVariant = "progress" | "create";

export type RowState = "done" | "todo" | "add";

export interface Row {
  state: RowState;
  /** Width of the placeholder text line, as a share of the available space. */
  width: string;
  /** The row the illustration is "on": drawn brighter than the rest. */
  active?: boolean;
}
