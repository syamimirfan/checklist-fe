import { useAppDispatch } from "../../../app/hooks";
import { useConfirm } from "../../../shared/hooks/useConfirm";
import { deleteItem } from "../checklistsSlice";
import {
  deleteItemConfirmLabel,
  deleteItemConfirmMessage,
  deleteItemConfirmTitle,
} from "../constants/checklistItem.const";
import type { ChecklistItem } from "../models/checklists.model";
import { canDeleteItem } from "../utils/deletion";

/** Delete rules and the confirm-then-delete action for one item, used by the row's trash icon. */
export function useDeleteItem(item: ChecklistItem) {
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const canDelete = canDeleteItem(item);

  async function requestDelete() {
    if (!canDelete) return;
    const confirmed = await confirm({
      title: deleteItemConfirmTitle,
      message: deleteItemConfirmMessage,
      name: item.content,
      confirmLabel: deleteItemConfirmLabel,
      tone: "danger",
    });
    if (confirmed) dispatch(deleteItem(item.id));
  }

  return { canDelete, requestDelete };
}
