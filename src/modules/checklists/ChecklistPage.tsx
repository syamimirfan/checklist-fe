import { useId, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { Button, Icon, TagChip, Tooltip } from "../../shared/components/ui";
import { routes } from "../../shared/constants/routes";
import {
  dangerTextClasses,
  focusVisibleRingClasses,
  surface,
  text,
  toneClasses,
} from "../../shared/styles/theme";
import { EditChecklistDialog } from "./components/EditChecklistDialog";
import { EditIconButton } from "./components/EditIconButton";
import { ShareDialog } from "./components/ShareDialog";
import {
  addItemButtonLabel,
  backToChecklistsLabel,
  completedSummary,
  defaultTab,
  deleteChecklistBlocked,
  deleteChecklistHeading,
  deleteChecklistLabel,
  deleteChecklistRule,
  dueSummary,
  editChecklistLabel,
  notFoundText,
  notFoundTitle,
  tabs,
  templateBadge,
} from "./constants/checklistPage.const";
import { useChecklistRole } from "./hooks/useChecklistRole";
import { useDeleteChecklist } from "./hooks/useDeleteChecklist";
import type { ChecklistTab } from "./models/checklistPage.model";
import type { Checklist, Tag } from "./models/checklists.model";
import {
  selectItemsByChecklistId,
  selectTagsById,
  selectWorkspacesById,
} from "./selectors";
import { ActivityTab } from "./tabs/ActivityTab";
import { ItemsTab } from "./tabs/ItemsTab";
import { MembersTab } from "./tabs/MembersTab";
import { progressOf } from "./utils/checklistUtils";
import { formatDueDate, isOverdue } from "./utils/date";

/** Route page for /checklists/:checklistId. */
export function ChecklistPage() {
  const { checklistId } = useParams();
  const checklist = useAppSelector((state) =>
    state.checklists.checklists.find((candidate) => candidate.id === checklistId),
  );

  if (!checklist) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-8">
        <h1 className={`text-2xl font-semibold ${text.heading}`}>
          {notFoundTitle}
        </h1>
        <p className={`mt-2 text-sm ${text.body}`}>{notFoundText}</p>
        <Link
          to={routes.dashboard}
          className={`mt-6 inline-block rounded text-sm font-medium text-brand-violet hover:text-brand-violet-dark dark:text-brand-violet-light dark:hover:text-brand-violet-soft ${focusVisibleRingClasses}`}
        >
          {backToChecklistsLabel}
        </Link>
      </div>
    );
  }

  // Keyed so switching between checklists starts on a fresh tab with the add row closed.
  return <ChecklistView key={checklist.id} checklist={checklist} />;
}

function ChecklistView({ checklist }: { checklist: Checklist }) {
  const navigate = useNavigate();
  const deleteHintId = useId();
  const [searchParams, setSearchParams] = useSearchParams();
  const workspacesById = useAppSelector(selectWorkspacesById);
  const itemsByChecklistId = useAppSelector(selectItemsByChecklistId);
  const tagsById = useAppSelector(selectTagsById);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const requestedTab = searchParams.get("tab");
  const activeTab: ChecklistTab =
    tabs.find((tab) => tab.id === requestedTab)?.id ?? defaultTab;

  const workspace = workspacesById.get(checklist.workspaceId);
  const items = itemsByChecklistId.get(checklist.id) ?? [];
  const { done, total } = progressOf(items);
  const tags = checklist.tagIds
    .map((tagId) => tagsById.get(tagId))
    .filter((tag): tag is Tag => tag !== undefined);
  const overdue =
    checklist.dueDate !== null && done < total && isOverdue(checklist.dueDate);
  const {
    canDelete: deletable,
    remaining,
    requestDelete,
  } = useDeleteChecklist(checklist);
  const { canManageChecklist, canManageItems } = useChecklistRole(checklist.id);

  // Leave first (the hook runs the callback before deleting): the moment the checklist is gone from the
  // store this page would flash "not found". If the delete fails, the page-level banner explains.
  const handleDelete = () =>
    requestDelete(() => navigate(routes.workspace(checklist.workspaceId)));

  function selectTab(tab: ChecklistTab) {
    setSearchParams(tab === defaultTab ? {} : { tab }, { replace: true });
  }

  function handleAddItem() {
    selectTab("items");
    setIsAddingItem(true);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          {workspace && (
            <Link
              to={routes.workspace(workspace.id)}
              className={`rounded text-sm hover:underline ${text.muted} ${focusVisibleRingClasses}`}
            >
              {workspace.name}
            </Link>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex min-w-0 items-center gap-1.5">
              <h1
                className={`wrap-break-word text-2xl font-semibold ${text.heading}`}
              >
                {checklist.title}
              </h1>
              {canManageChecklist && (
                <EditIconButton
                  label={editChecklistLabel}
                  size="md"
                  onClick={() => setIsEditingTitle(true)}
                />
              )}
            </div>
            {checklist.isTemplate && (
              <TagChip name={templateBadge} color="purple" />
            )}
          </div>
        </div>
        {canManageItems && (
          <Button size="sm" onClick={handleAddItem}>
            <Icon name="plus" className="h-4 w-4" />
            {addItemButtonLabel}
          </Button>
        )}
      </div>

      <div
        role="tablist"
        aria-label="Checklist sections"
        className={`mt-6 flex gap-6 border-b ${surface.border}`}
      >
        {tabs.map((tab) => {
          const isSelected = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isSelected}
              aria-controls={`panel-${tab.id}`}
              onClick={() => selectTab(tab.id)}
              className={`-mb-px cursor-pointer border-b-2 pb-2.5 text-sm font-medium transition-colors ${focusVisibleRingClasses} ${
                isSelected
                  ? `border-brand-violet dark:border-brand-violet-light ${toneClasses.violet.text}`
                  : `border-transparent ${text.body} hover:text-neutral-900 dark:hover:text-neutral-50`
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className={`text-sm ${text.label}`}>{completedSummary(done, total)}</p>
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <TagChip key={tag.id} name={tag.name} color={tag.color} />
          ))}
          {checklist.dueDate !== null && (
            <span className={`text-sm ${overdue ? dangerTextClasses : text.label}`}>
              {dueSummary(formatDueDate(checklist.dueDate))}
            </span>
          )}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="mt-6"
      >
        {activeTab === "items" && (
          <ItemsTab
            checklist={checklist}
            items={items}
            isAddingItem={isAddingItem}
            onAddingItemChange={setIsAddingItem}
          />
        )}
        {activeTab === "activity" && (
          <ActivityTab checklist={checklist} items={items} />
        )}
        {activeTab === "members" && (
          <MembersTab
            checklist={checklist}
            items={items}
            onInvite={() => setIsShareOpen(true)}
          />
        )}
      </div>

      {/* Only admins can delete (or edit) the checklist, so nobody else sees these. */}
      {canManageChecklist && (
        <>
          <section
            className={`mt-12 flex flex-wrap items-center justify-between gap-4 border-t pt-6 ${surface.border}`}
          >
            <div className="min-w-0 flex-1 basis-64">
              <h2 className={`text-sm font-medium ${text.label}`}>
                {deleteChecklistHeading}
              </h2>
              <p id={deleteHintId} className={`mt-1 text-sm ${text.muted}`}>
                {deletable
                  ? deleteChecklistRule
                  : deleteChecklistBlocked(remaining)}
              </p>
            </div>
            <Tooltip
              content={
                deletable ? undefined : deleteChecklistBlocked(remaining)
              }
              align="end"
            >
              <Button
                variant="danger"
                size="sm"
                disabled={!deletable}
                aria-describedby={deleteHintId}
                onClick={handleDelete}
              >
                <Icon name="trash" className="h-4 w-4" />
                {deleteChecklistLabel}
              </Button>
            </Tooltip>
          </section>

          <EditChecklistDialog
            open={isEditingTitle}
            onClose={() => setIsEditingTitle(false)}
            checklist={checklist}
          />
        </>
      )}
      <ShareDialog
        open={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        workspaceId={checklist.workspaceId}
      />
    </div>
  );
}
