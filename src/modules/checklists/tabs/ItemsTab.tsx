import { text } from "../../../shared/styles/theme";
import { AddItemRow } from "../components/AddItemRow";
import { ItemRow } from "../components/ItemRow";
import {
  completedHeading,
  emptyItemsReadOnlyText,
  emptyItemsText,
  todoHeading,
} from "../constants/checklistPage.const";
import { useChecklistRole } from "../hooks/useChecklistRole";
import type { ItemsTabProps } from "../models/checklistPage.model";

function SectionHeading({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className={`text-sm font-medium ${text.label}`}>{title}</h2>
      <span className={`text-xs ${text.muted}`}>{count}</span>
    </div>
  );
}

/** "To do" (with the inline add row) above "Completed", as in the mockup. */
export function ItemsTab({
  checklist,
  items,
  isAddingItem,
  onAddingItemChange,
}: ItemsTabProps) {
  const { canManageItems } = useChecklistRole(checklist.id);
  const todo = items.filter((item) => !item.isChecked);
  const done = items.filter((item) => item.isChecked);
  const nextPosition =
    items.reduce((max, item) => Math.max(max, item.position), -1) + 1;

  return (
    <div className="flex flex-col gap-8">
      <section aria-label={todoHeading}>
        <SectionHeading title={todoHeading} count={todo.length} />
        {items.length === 0 && !isAddingItem && (
          <p className={`mt-3 text-sm ${text.muted}`}>
            {canManageItems ? emptyItemsText : emptyItemsReadOnlyText}
          </p>
        )}
        <ul className="mt-1">
          {todo.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              workspaceId={checklist.workspaceId}
            />
          ))}
        </ul>
        {canManageItems && (
          <AddItemRow
            checklistId={checklist.id}
            nextPosition={nextPosition}
            isAdding={isAddingItem}
            onAddingChange={onAddingItemChange}
          />
        )}
      </section>

      {done.length > 0 && (
        <section aria-label={completedHeading}>
          <SectionHeading title={completedHeading} count={done.length} />
          <ul className="mt-1">
            {done.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                workspaceId={checklist.workspaceId}
              />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
