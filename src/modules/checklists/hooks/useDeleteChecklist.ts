import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useConfirm } from "../../../shared/hooks/useConfirm";
import { deleteChecklist } from "../checklistsSlice";
import {
  deleteChecklistConfirmMessage,
  deleteChecklistConfirmTitle,
  deleteChecklistLabel,
} from "../constants/checklistPage.const";
import type { Checklist } from "../models/checklists.model";
import { selectItemsByChecklistId } from "../selectors";
import { progressOf } from "../utils/checklistUtils";
import { canDeleteChecklist } from "../utils/deletion";

/** Delete rules and the confirm-then-delete action for one checklist. Shared by the card's trash icon and the page's delete section. */
export function useDeleteChecklist(checklist: Checklist) {
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const itemsByChecklistId = useAppSelector(selectItemsByChecklistId);
  const items = itemsByChecklistId.get(checklist.id) ?? [];
  const { done, total } = progressOf(items);
  const canDelete = canDeleteChecklist(items);

  /**
   * Asks to confirm, then deletes. `onConfirmed` runs first: the checklist page uses it
   * to navigate away, because once the checklist leaves the store that page would flash "not found".
   */
  async function requestDelete(onConfirmed?: () => void) {
    if (!canDelete) return;
    const confirmed = await confirm({
      title: deleteChecklistConfirmTitle,
      message: deleteChecklistConfirmMessage,
      name: checklist.title,
      confirmLabel: deleteChecklistLabel,
      tone: "danger",
    });
    if (!confirmed) return;
    onConfirmed?.();
    dispatch(deleteChecklist(checklist.id));
  }

  return { canDelete, remaining: total - done, requestDelete };
}
