import { useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
  useCurrentUser,
} from "../../../app/hooks";
import { Avatar, Button, Icon, Select } from "../../../shared/components/ui";
import { surface, text } from "../../../shared/styles/theme";
import { RoleBadge } from "../components/RoleBadge";
import { setChecklistRole } from "../checklistsSlice";
import {
  assignedCountText,
  inviteMembersLabel,
  joinedText,
  membersEmptyText,
  roleLabels,
  roleSelectAriaLabel,
  youSuffix,
} from "../constants/checklistPage.const";
import { useChecklistRole } from "../hooks/useChecklistRole";
import type { MembersTabProps } from "../models/checklistPage.model";
import {
  selectMembersByWorkspaceId,
  selectPeopleById,
  selectRoleGrantsByChecklistId,
} from "../selectors";
import { formatFullDate } from "../utils/date";
import {
  checklistRoleOf,
  compareRoles,
  roleBadgesFor,
  roleOptionsFor,
  type AssignableRole,
} from "../utils/permissions";

/**
 * Members of the checklist's workspace (access is workspace-level) with each person's
 * standing on this checklist. Admins can make people admins or superusers (and take it back),
 * superusers can do that for the Superuser role only. The creator is always an admin and
 * can't be changed. See `utils/permissions.ts`.
 */
export function MembersTab({ checklist, items, onInvite }: MembersTabProps) {
  const dispatch = useAppDispatch();
  const user = useCurrentUser();
  const { role: viewerRole } = useChecklistRole(checklist.id);
  const membersByWorkspaceId = useAppSelector(selectMembersByWorkspaceId);
  const grantsByChecklistId = useAppSelector(selectRoleGrantsByChecklistId);
  const peopleById = useAppSelector(selectPeopleById);
  // Whose row is waiting on the server, so its picker can't be used twice.
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  const grants = grantsByChecklistId.get(checklist.id) ?? [];
  // Top of the hierarchy first (creator, admins, superusers, then users), A-Z within each group.
  const rows = (membersByWorkspaceId.get(checklist.workspaceId) ?? [])
    .map((member) => {
      const person = peopleById.get(member.userId);
      return {
        member,
        person,
        name: person?.name ?? "Unknown user",
        role: checklistRoleOf(checklist, grants, member.userId),
      };
    })
    .sort(
      (a, b) => compareRoles(a.role, b.role) || a.name.localeCompare(b.name),
    );

  async function changeRole(userId: string, role: AssignableRole) {
    setPendingUserId(userId);
    // A failure lands in the page-level error banner (see `mutationError`).
    await dispatch(
      setChecklistRole({
        checklistId: checklist.id,
        userId,
        role,
        grantedBy: user.id,
      }),
    );
    setPendingUserId(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={onInvite}>
          <Icon name="plus" className="h-4 w-4" />
          {inviteMembersLabel}
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className={`text-sm ${text.muted}`}>{membersEmptyText}</p>
      ) : (
        <ul className={`divide-y ${surface.divide}`}>
          {rows.map(({ member, person, name, role }) => {
            // More than the current role means the viewer is allowed to change it.
            const roleOptions = roleOptionsFor(viewerRole, role);
            const canChange = roleOptions.length > 1;
            const assigned = items.filter(
              (item) => item.assignedTo === member.userId,
            ).length;
            return (
              <li
                key={member.id}
                className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3"
              >
                <Avatar name={name} size="lg" />
                <div className="min-w-0 flex-1 basis-40">
                  {/* The role badges are for everyone, whether or not the viewer can change the role. */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p
                      className={`min-w-0 truncate text-sm font-medium ${text.heading}`}
                    >
                      {name}
                      {member.userId === user.id && (
                        <span className={`ml-1 font-normal ${text.muted}`}>
                          {youSuffix}
                        </span>
                      )}
                    </p>
                    {roleBadgesFor(role).map((badge) => (
                      <RoleBadge key={badge} role={badge} />
                    ))}
                  </div>
                  <p className={`truncate text-xs ${text.muted}`}>
                    {person?.email} · {joinedText(formatFullDate(member.joinedAt))}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`hidden text-xs sm:inline ${text.muted}`}>
                    {assignedCountText(assigned)}
                  </span>
                  {canChange && (
                    <div className="w-36">
                      <Select
                        aria-label={roleSelectAriaLabel(name)}
                        value={role}
                        disabled={pendingUserId !== null}
                        onChange={(event) =>
                          changeRole(
                            member.userId,
                            event.target.value as AssignableRole,
                          )
                        }
                      >
                        {roleOptions.map((option) => (
                          <option key={option} value={option}>
                            {roleLabels[option]}
                          </option>
                        ))}
                      </Select>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
