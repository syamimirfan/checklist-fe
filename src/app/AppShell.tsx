import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import {
  dismissMutationError,
  loadWorkspaceData,
  selectChecklistsError,
  selectChecklistsStatus,
  selectMutationError,
} from "../modules/checklists";
import { Copyright } from "../shared/components/layout";
import { Alert, Button, Icon, Logo } from "../shared/components/ui";
import {
  focusVisibleRingClasses,
  surface,
  text,
} from "../shared/styles/theme";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  closeMenuLabel,
  dismissLabel,
  loadFailedText,
  loadingText,
  openMenuLabel,
  retryLabel,
} from "./constants/appShell.const";
import { Sidebar } from "./Sidebar";

/**
 * Layout for every logged-in route: sidebar + page. Also the single auth guard
 * (so individual pages don't repeat it) and the owner of the initial data load,
 * which means pages below it can assume the workspace data is already in the store.
 */
export function AppShell() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const status = useAppSelector(selectChecklistsStatus);
  const loadError = useAppSelector(selectChecklistsError);
  const mutationError = useAppSelector(selectMutationError);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (user && status === "idle") dispatch(loadWorkspaceData(user));
  }, [user, status, dispatch]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <div className={`flex min-h-screen flex-col ${surface.page}`}>
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden w-64 border-r lg:block ${surface.border} ${surface.page}`}
      >
        <Sidebar user={user} />
      </aside>

      <header
        className={`sticky top-0 z-30 flex items-center gap-3 border-b px-4 py-3 lg:hidden ${surface.border} ${surface.headerTranslucent}`}
      >
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          aria-label={openMenuLabel}
          className={`inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg ${text.body} ${surface.hoverSubtle} ${focusVisibleRingClasses}`}
        >
          <Icon name="menu" />
        </button>
        <Logo />
      </header>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            onClick={closeDrawer}
            aria-label={closeMenuLabel}
            className="absolute inset-0 cursor-pointer bg-black/50"
          />
          <aside
            className={`relative h-full w-64 max-w-[85%] border-r ${surface.border} ${surface.page}`}
          >
            <Sidebar user={user} onNavigate={closeDrawer} />
          </aside>
        </div>
      )}

      <main className="flex flex-1 flex-col lg:pl-64">
        {mutationError && (
          <div className="px-4 pt-4 sm:px-8">
            <Alert variant="error">
              <div className="flex items-start justify-between gap-3">
                <span>{mutationError}</span>
                <button
                  type="button"
                  onClick={() => dispatch(dismissMutationError())}
                  className="shrink-0 cursor-pointer font-medium underline"
                >
                  {dismissLabel}
                </button>
              </div>
            </Alert>
          </div>
        )}

        {/* A plain block (not the flex column) so each page's `mx-auto max-w-*` container keeps its width. */}
        <div className="flex-1">
          {status === "succeeded" ? (
            <Outlet context={user} />
          ) : status === "failed" ? (
            <div className="flex flex-col items-start gap-4 px-4 py-10 sm:px-8">
              <Alert variant="error">{loadError ?? loadFailedText}</Alert>
              <Button size="sm" onClick={() => dispatch(loadWorkspaceData(user))}>
                {retryLabel}
              </Button>
            </div>
          ) : (
            <p className={`px-4 py-10 text-sm sm:px-8 ${text.muted}`} role="status">
              {loadingText}
            </p>
          )}
        </div>

        <Copyright className="px-4 py-6 text-center sm:px-8" />
      </main>
    </div>
  );
}
