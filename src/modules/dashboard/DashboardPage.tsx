import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppSelector, useCurrentUser } from "../../app/hooks";
import { Button, Card, Icon } from "../../shared/components/ui";
import { routes } from "../../shared/constants/routes";
import {
  focusVisibleRingClasses,
  surface,
  text,
} from "../../shared/styles/theme";
import {
  ChecklistCard,
  isDueWithin,
  ItemRow,
  NewChecklistDialog,
  progressOf,
  selectItemsByChecklistId,
  selectWorkspaces,
  selectWorkspacesById,
  useCreatableWorkspaces,
  type Checklist,
  type ChecklistItem,
} from "../checklists";
import {
  dueSoonWindowDays,
  newChecklistLabel,
  viewCopy,
  workspaceEmpty,
  workspaceNotFoundText,
  workspaceNotFoundTitle,
  workspaceSubtitle,
} from "./constants/dashboardPage.const";
import type { DashboardPageProps } from "./models/dashboardPage.model";

const byNewest = (a: Checklist, b: Checklist) =>
  b.createdAt.localeCompare(a.createdAt);
const byDueDate = (a: Checklist, b: Checklist) =>
  (a.dueDate ?? "").localeCompare(b.dueDate ?? "");

/**
 * Logged-in home. One page, five views chosen by route: all checklists, due soon,
 * templates, items assigned to me, and a single workspace.
 */
export function DashboardPage({ view }: DashboardPageProps) {
  const user = useCurrentUser();
  const { workspaceId } = useParams();
  const checklists = useAppSelector((state) => state.checklists.checklists);
  const workspaces = useAppSelector(selectWorkspaces);
  const workspacesById = useAppSelector(selectWorkspacesById);
  const itemsByChecklistId = useAppSelector(selectItemsByChecklistId);
  const creatableWorkspaces = useCreatableWorkspaces();
  const [isNewChecklistOpen, setIsNewChecklistOpen] = useState(false);

  const workspace =
    view === "workspace" ? workspacesById.get(workspaceId ?? "") : undefined;
  // Only admins add checklists. Someone with no workspace at all keeps the button, so its dialog can tell them to make one first.
  const canAddChecklist =
    view === "workspace"
      ? creatableWorkspaces.some((candidate) => candidate.id === workspace?.id)
      : creatableWorkspaces.length > 0 || workspaces.length === 0;

  const visibleChecklists = useMemo(() => {
    const isUnfinished = (checklist: Checklist) => {
      const { done, total } = progressOf(itemsByChecklistId.get(checklist.id) ?? []);
      return total === 0 || done < total;
    };
    switch (view) {
      case "all":
        return checklists.filter((c) => !c.isTemplate).sort(byNewest);
      case "dueSoon":
        return checklists
          .filter(
            (c) =>
              !c.isTemplate &&
              c.dueDate !== null &&
              isDueWithin(c.dueDate, dueSoonWindowDays) &&
              isUnfinished(c),
          )
          .sort(byDueDate);
      case "templates":
        return checklists.filter((c) => c.isTemplate).sort(byNewest);
      case "workspace":
        return checklists
          .filter((c) => c.workspaceId === workspaceId)
          .sort(byNewest);
      case "assigned":
        return [];
    }
  }, [view, checklists, itemsByChecklistId, workspaceId]);

  const assignedGroups = useMemo(() => {
    if (view !== "assigned") return [];
    const groups: { checklist: Checklist; items: ChecklistItem[] }[] = [];
    for (const checklist of checklists) {
      if (checklist.isTemplate) continue;
      const items = (itemsByChecklistId.get(checklist.id) ?? []).filter(
        (item) => item.assignedTo === user.id,
      );
      if (items.length > 0) groups.push({ checklist, items });
    }
    return groups;
  }, [view, checklists, itemsByChecklistId, user.id]);

  if (view === "workspace" && !workspace) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-8">
        <h1 className={`text-2xl font-semibold ${text.heading}`}>
          {workspaceNotFoundTitle}
        </h1>
        <p className={`mt-2 text-sm ${text.body}`}>{workspaceNotFoundText}</p>
      </div>
    );
  }

  const copy =
    view === "workspace"
      ? {
          title: workspace?.name ?? "",
          subtitle: workspaceSubtitle,
          empty: workspaceEmpty,
        }
      : viewCopy[view];
  const isEmpty =
    view === "assigned"
      ? assignedGroups.length === 0
      : visibleChecklists.length === 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className={`wrap-break-word text-2xl font-semibold ${text.heading}`}>
            {copy.title}
          </h1>
          <p className={`mt-1 text-sm ${text.muted}`}>{copy.subtitle}</p>
        </div>
        {canAddChecklist && (
          <Button size="sm" onClick={() => setIsNewChecklistOpen(true)}>
            <Icon name="plus" className="h-4 w-4" />
            {newChecklistLabel}
          </Button>
        )}
      </div>

      {isEmpty ? (
        <p
          className={`mt-8 rounded-2xl border border-dashed px-6 py-12 text-center text-sm ${surface.border} ${text.muted}`}
        >
          {copy.empty}
        </p>
      ) : view === "assigned" ? (
        <div className="mt-6 flex flex-col gap-4">
          {assignedGroups.map(({ checklist, items }) => (
            <Card key={checklist.id} className="p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <Link
                  to={routes.checklist(checklist.id)}
                  className={`rounded text-base font-semibold hover:underline ${text.heading} ${focusVisibleRingClasses}`}
                >
                  {checklist.title}
                </Link>
                <span className={`text-xs ${text.muted}`}>
                  {workspacesById.get(checklist.workspaceId)?.name}
                </span>
              </div>
              <ul className={`mt-1 divide-y ${surface.divide}`}>
                {items.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    workspaceId={checklist.workspaceId}
                  />
                ))}
              </ul>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleChecklists.map((checklist) => (
            <ChecklistCard
              key={checklist.id}
              checklist={checklist}
              showWorkspace={view !== "workspace"}
            />
          ))}
        </div>
      )}

      <NewChecklistDialog
        open={isNewChecklistOpen}
        onClose={() => setIsNewChecklistOpen(false)}
        defaultWorkspaceId={workspace?.id}
        defaultIsTemplate={view === "templates"}
      />
    </div>
  );
}
