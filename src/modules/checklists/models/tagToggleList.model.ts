import type { ReactNode } from "react";
import type { Tag } from "./checklists.model";

export interface TagToggleListProps {
  tags: Tag[];
  selectedIds: string[];
  onToggle: (tagId: string) => void;
  /** Extra chips rendered after the tags, in the same wrapping row (e.g. tags that don't exist yet). */
  children?: ReactNode;
}
