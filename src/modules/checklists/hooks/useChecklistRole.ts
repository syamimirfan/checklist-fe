import { useAppSelector, useCurrentUser } from "../../../app/hooks";
import { selectChecklistsById, selectRoleGrantsByChecklistId } from "../selectors";
import {
  canManageChecklist,
  canManageItems,
  checklistRoleOf,
} from "../utils/permissions";

/**
 * The signed-in user's standing on a checklist, and what that lets them do (see
 * `utils/permissions.ts` for the rules). Someone with no standing, or a checklist that isn't
 * loaded, gets the least: a plain user.
 */
export function useChecklistRole(checklistId: string) {
  const user = useCurrentUser();
  const checklistsById = useAppSelector(selectChecklistsById);
  const grantsByChecklistId = useAppSelector(selectRoleGrantsByChecklistId);

  const checklist = checklistsById.get(checklistId);
  const role = checklist
    ? checklistRoleOf(
        checklist,
        grantsByChecklistId.get(checklistId) ?? [],
        user.id,
      )
    : "user";

  return {
    role,
    /** Edit or delete the checklist itself. */
    canManageChecklist: canManageChecklist(role),
    /** Add, edit and delete items. */
    canManageItems: canManageItems(role),
  };
}
