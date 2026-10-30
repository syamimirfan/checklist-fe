export interface CommentToggleButtonProps {
  /** Accessible name, e.g. `Comments on Write copy (3)`. */
  label: string;
  /** Hover tooltip. */
  title: string;
  /** Number of comments, shown as a small badge when above zero. */
  count: number;
  /** Whether the comment box under the item is open (sets `aria-expanded`). */
  expanded: boolean;
  onClick: () => void;
}
