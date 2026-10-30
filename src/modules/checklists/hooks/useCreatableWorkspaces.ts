import { useAppSelector, useCurrentUser } from "../../../app/hooks";
import type { Workspace } from "../models/checklists.model";
import {
  selectChecklists,
  selectMembersByWorkspaceId,
  selectRoleGrantsByChecklistId,
  selectWorkspaces,
} from "../selectors";
import { canCreateChecklistIn, checklistRoleOf } from "../utils/permissions";

/** The workspaces the signed-in user may add checklists to. */
export function useCreatableWorkspaces(): Workspace[] {
  const user = useCurrentUser();
  const workspaces = useAppSelector(selectWorkspaces);
  const membersByWorkspaceId = useAppSelector(selectMembersByWorkspaceId);
  const checklists = useAppSelector(selectChecklists);
  const grantsByChecklistId = useAppSelector(selectRoleGrantsByChecklistId);

  return workspaces.filter((workspace) => {
    const workspaceRole =
      membersByWorkspaceId
        .get(workspace.id)
        ?.find((member) => member.userId === user.id)?.role ?? null;
    const checklistRoles = checklists
      .filter((checklist) => checklist.workspaceId === workspace.id)
      .map((checklist) =>
        checklistRoleOf(
          checklist,
          grantsByChecklistId.get(checklist.id) ?? [],
          user.id,
        ),
      );
    return canCreateChecklistIn(workspaceRole, checklistRoles);
  });
}
