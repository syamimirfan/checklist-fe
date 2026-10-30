import { useMemo } from "react";
import { useAppSelector } from "../../../app/hooks";
import { Icon } from "../../../shared/components/ui";
import type { IconName } from "../../../shared/components/ui/models/icon.model";
import { surface, text } from "../../../shared/styles/theme";
import {
  activityAdded,
  activityCommented,
  activityCompleted,
  activityCreated,
  activityCreatedAnonymous,
  activityEmptyText,
  activityRoleGranted,
} from "../constants/checklistPage.const";
import type {
  ActivityEvent,
  ActivityTabProps,
} from "../models/checklistPage.model";
import {
  selectCommentsByItemId,
  selectPeopleById,
  selectRoleGrantsByChecklistId,
} from "../selectors";
import { formatRelativeTime } from "../utils/date";

const eventIcons: Record<ActivityEvent["kind"], IconName> = {
  created: "star",
  added: "plus",
  completed: "check",
  commented: "comment",
  roleGranted: "user-check",
};

/**
 * The ERD has no activity/audit table, so this feed is derived from timestamps that
 * already exist: item created_at / completed_at and comment created_at. That means it
 * can't say who added or completed an item, only who commented and who created the checklist.
 * A real activity log would need its own table with an actor column.
 */
export function ActivityTab({ checklist, items }: ActivityTabProps) {
  const peopleById = useAppSelector(selectPeopleById);
  const commentsByItemId = useAppSelector(selectCommentsByItemId);
  const grantsByChecklistId = useAppSelector(selectRoleGrantsByChecklistId);

  const events = useMemo(() => {
    const list: ActivityEvent[] = [
      {
        id: `created-${checklist.id}`,
        at: checklist.createdAt,
        kind: "created",
        actorName: peopleById.get(checklist.createdBy)?.name ?? null,
      },
    ];
    for (const grant of grantsByChecklistId.get(checklist.id) ?? []) {
      list.push({
        id: `role-${grant.id}`,
        at: grant.grantedAt,
        kind: "roleGranted",
        actorName: peopleById.get(grant.grantedBy)?.name ?? "Someone",
        personName: peopleById.get(grant.userId)?.name ?? "Someone",
        role: grant.role,
      });
    }
    for (const item of items) {
      list.push({
        id: `added-${item.id}`,
        at: item.createdAt,
        kind: "added",
        itemContent: item.content,
      });
      if (item.completedAt) {
        list.push({
          id: `completed-${item.id}`,
          at: item.completedAt,
          kind: "completed",
          itemContent: item.content,
        });
      }
      for (const comment of commentsByItemId.get(item.id) ?? []) {
        list.push({
          id: `commented-${comment.id}`,
          at: comment.createdAt,
          kind: "commented",
          actorName: peopleById.get(comment.userId)?.name ?? "Someone",
          itemContent: item.content,
          body: comment.body,
        });
      }
    }
    return list.sort((a, b) => b.at.localeCompare(a.at));
  }, [checklist, items, peopleById, commentsByItemId, grantsByChecklistId]);

  if (events.length === 0) {
    return <p className={`text-sm ${text.muted}`}>{activityEmptyText}</p>;
  }

  return (
    <ol className={`divide-y ${surface.divide}`}>
      {events.map((event) => (
        // The icon, the sentence and the time all start with the same 24px (`h-6` / `leading-6`) first
        // line, so on a one-line row their centres coincide, and a row with a comment aligns to its first line.
        <li key={event.id} className="flex items-start gap-3 py-3">
          {/* Plain muted glyph, no fill or ring: a tinted circle read as a button, and nothing here is clickable. */}
          <span
            className={`inline-flex h-6 w-6 shrink-0 items-center justify-center ${text.muted}`}
          >
            <Icon name={eventIcons[event.kind]} className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className={`wrap-break-word text-sm leading-6 ${text.heading}`}>
              {describe(event)}
            </p>
            {event.kind === "commented" && (
              <p className={`mt-0.5 whitespace-pre-wrap wrap-break-word text-sm ${text.body}`}>
                {event.body}
              </p>
            )}
          </div>
          <time
            dateTime={event.at}
            className={`shrink-0 text-xs leading-6 ${text.muted}`}
          >
            {formatRelativeTime(event.at)}
          </time>
        </li>
      ))}
    </ol>
  );
}

function describe(event: ActivityEvent): string {
  switch (event.kind) {
    case "created":
      return event.actorName
        ? activityCreated(event.actorName)
        : activityCreatedAnonymous;
    case "added":
      return activityAdded(event.itemContent);
    case "completed":
      return activityCompleted(event.itemContent);
    case "commented":
      return activityCommented(event.actorName, event.itemContent);
    case "roleGranted":
      return activityRoleGranted(event.actorName, event.personName, event.role);
  }
}
