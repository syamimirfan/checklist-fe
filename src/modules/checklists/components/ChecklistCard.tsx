import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import { Card, TagChip } from "../../../shared/components/ui";
import { routes } from "../../../shared/constants/routes";
import {
  dangerTextClasses,
  surface,
  text,
  toneClasses,
  toneForKey,
} from "../../../shared/styles/theme";
import {
  dueText,
  noItemsText,
  overdueText,
  progressLabel,
  progressText,
  templateBadge,
} from "../constants/checklistCard.const";
import {
  deleteChecklistBlocked,
  deleteChecklistIconLabel,
  deleteChecklistLabel,
  editChecklistIconLabel,
  editChecklistLabel,
} from "../constants/checklistPage.const";
import { useChecklistRole } from "../hooks/useChecklistRole";
import { useDeleteChecklist } from "../hooks/useDeleteChecklist";
import type { ChecklistCardProps } from "../models/checklistCard.model";
import type { Tag } from "../models/checklists.model";
import {
  selectItemsByChecklistId,
  selectTagsById,
  selectWorkspacesById,
} from "../selectors";
import { progressOf } from "../utils/checklistUtils";
import { formatDueDate, isOverdue } from "../utils/date";
import { DeleteIconButton } from "./DeleteIconButton";
import { EditChecklistDialog } from "./EditChecklistDialog";
import { EditIconButton } from "./EditIconButton";

/**
 * Summary tile for a checklist: workspace, title, tags, progress and due date, with edit and trash icons.
 *
 * The whole card opens the checklist, but only the title is a real link (stretched over the card
 * with `after:absolute after:inset-0`): a button can't sit inside a link, and the icons have to.
 */
export function ChecklistCard({
  checklist,
  showWorkspace = true,
}: ChecklistCardProps) {
  const workspacesById = useAppSelector(selectWorkspacesById);
  const tagsById = useAppSelector(selectTagsById);
  const itemsByChecklistId = useAppSelector(selectItemsByChecklistId);
  const { canDelete, remaining, requestDelete } = useDeleteChecklist(checklist);
  const { canManageChecklist } = useChecklistRole(checklist.id);
  const [isEditing, setIsEditing] = useState(false);

  const workspace = workspacesById.get(checklist.workspaceId);
  const { done, total, percent } = progressOf(
    itemsByChecklistId.get(checklist.id) ?? [],
  );
  const tags = checklist.tagIds
    .map((tagId) => tagsById.get(tagId))
    .filter((tag): tag is Tag => tag !== undefined);
  const overdue =
    checklist.dueDate !== null && done < total && isOverdue(checklist.dueDate);

  return (
    <Card className="relative flex h-full flex-col gap-3 p-5 transition-colors hover:border-brand-violet has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-brand-violet dark:hover:border-brand-violet-light">
      {(showWorkspace || checklist.isTemplate) && (
        <div className="flex items-center justify-between gap-2">
          {showWorkspace && workspace ? (
            <span
              className={`inline-flex min-w-0 items-center gap-2 text-xs ${text.muted}`}
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${toneClasses[toneForKey(workspace.id)].solid}`}
                aria-hidden="true"
              />
              <span className="truncate">{workspace.name}</span>
            </span>
          ) : (
            <span />
          )}
          {checklist.isTemplate && (
            <TagChip name={templateBadge} color="purple" />
          )}
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <h2 className={`min-w-0 text-lg font-semibold ${text.heading}`}>
          <Link
            to={routes.checklist(checklist.id)}
            className="after:absolute after:inset-0 focus:outline-none"
          >
            {checklist.title}
          </Link>
        </h2>
        {/* Only admins can edit or delete a checklist, so nobody else sees these icons. */}
        {canManageChecklist && (
        <div className="-mr-1 -mt-0.5 flex shrink-0 items-center">
          {/* `z-10` keeps both buttons above the title link stretched over the card. */}
          <EditIconButton
            label={editChecklistIconLabel(checklist.title)}
            title={editChecklistLabel}
            onClick={() => setIsEditing(true)}
            className="z-10"
          />
          <DeleteIconButton
            label={deleteChecklistIconLabel(checklist.title)}
            title={
              canDelete ? deleteChecklistLabel : deleteChecklistBlocked(remaining)
            }
            disabled={!canDelete}
            onClick={() => requestDelete()}
          />
        </div>
        )}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <TagChip key={tag.id} name={tag.name} color={tag.color} />
          ))}
        </div>
      )}

      <div className="mt-auto flex flex-col gap-2 pt-1">
        {total > 0 ? (
          <>
            <div
              role="progressbar"
              aria-label={progressLabel}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              className={`h-1.5 overflow-hidden rounded-full ${surface.track}`}
            >
              <div
                className={`h-full rounded-full ${toneClasses.violet.solid}`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className={text.muted}>{progressText(done, total)}</span>
              {checklist.dueDate !== null && (
                <span className={overdue ? dangerTextClasses : text.muted}>
                  {(overdue ? overdueText : dueText)(
                    formatDueDate(checklist.dueDate),
                  )}
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className={text.muted}>{noItemsText}</span>
            {checklist.dueDate !== null && (
              <span className={text.muted}>
                {dueText(formatDueDate(checklist.dueDate))}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Closed, it takes no space; open, it's shown above the page, not inside the card. */}
      {canManageChecklist && (
        <EditChecklistDialog
          open={isEditing}
          onClose={() => setIsEditing(false)}
          checklist={checklist}
        />
      )}
    </Card>
  );
}
