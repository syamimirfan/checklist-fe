import { useState } from "react";
import { NavLink } from "react-router-dom";
import { NewWorkspaceDialog, selectWorkspaces } from "../modules/checklists";
import { logout } from "../modules/auth";
import { Avatar, Icon, Logo, ThemeToggle } from "../shared/components/ui";
import { routes } from "../shared/constants/routes";
import {
  focusVisibleRingClasses,
  surface,
  text,
  toneClasses,
  toneForKey,
} from "../shared/styles/theme";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  logOutLabel,
  menuHeading,
  menuItems,
  newWorkspaceLabel,
  noWorkspacesText,
  workspacesHeading,
} from "./constants/appShell.const";
import type { SidebarProps } from "./models/sidebar.model";

const linkBase = `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${focusVisibleRingClasses}`;
const linkIdle = `${text.body} ${surface.hoverSubtle}`;
const linkActive = `font-medium ${toneClasses.violet.bg} ${toneClasses.violet.text}`;
const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `${linkBase} ${isActive ? linkActive : linkIdle}`;

const sectionHeadingClasses = `px-3 text-xs font-medium uppercase tracking-wide ${text.muted}`;

/** Menu, workspaces and the signed-in user. Rendered both as the desktop sidebar and inside the mobile drawer. */
export function Sidebar({ user, onNavigate }: SidebarProps) {
  const dispatch = useAppDispatch();
  const workspaces = useAppSelector(selectWorkspaces);
  const [isNewWorkspaceOpen, setIsNewWorkspaceOpen] = useState(false);

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto px-3 py-5">
      <Logo className="px-3" />

      <nav aria-label="Menu" className="flex flex-col gap-1">
        <h2 className={`mb-1 ${sectionHeadingClasses}`}>{menuHeading}</h2>
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            onClick={onNavigate}
            className={navLinkClass}
          >
            <Icon name={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <nav aria-label="Workspaces" className="flex flex-col gap-1">
        <div className="mb-1 flex items-center justify-between pr-1">
          <h2 className={sectionHeadingClasses}>{workspacesHeading}</h2>
          <button
            type="button"
            onClick={() => setIsNewWorkspaceOpen(true)}
            aria-label={newWorkspaceLabel}
            title={newWorkspaceLabel}
            className={`inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md ${text.muted} ${surface.hoverSubtle} ${focusVisibleRingClasses}`}
          >
            <Icon name="plus" className="h-4 w-4" />
          </button>
        </div>
        {workspaces.length === 0 && (
          <p className={`px-3 text-sm ${text.muted}`}>{noWorkspacesText}</p>
        )}
        {workspaces.map((workspace) => (
          <NavLink
            key={workspace.id}
            to={routes.workspace(workspace.id)}
            onClick={onNavigate}
            className={navLinkClass}
          >
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${toneClasses[toneForKey(workspace.id)].solid}`}
              aria-hidden="true"
            />
            <span className="truncate">{workspace.name}</span>
          </NavLink>
        ))}
      </nav>

      <div
        className={`mt-auto flex items-center gap-3 border-t pt-4 ${surface.border}`}
      >
        <Avatar name={user.name} size="lg" />
        <div className="min-w-0 flex-1">
          <p className={`truncate text-sm font-medium ${text.heading}`}>
            {user.name}
          </p>
          <p className={`truncate text-xs ${text.muted}`} title={user.email}>
            {user.email}
          </p>
        </div>
        <ThemeToggle />
        <button
          type="button"
          onClick={() => dispatch(logout())}
          aria-label={logOutLabel}
          title={logOutLabel}
          className={`inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg ${text.body} ${surface.hoverSubtle} ${focusVisibleRingClasses}`}
        >
          <Icon name="logout" />
        </button>
      </div>

      <NewWorkspaceDialog
        open={isNewWorkspaceOpen}
        onClose={() => setIsNewWorkspaceOpen(false)}
        owner={user}
        onCreated={onNavigate}
      />
    </div>
  );
}
