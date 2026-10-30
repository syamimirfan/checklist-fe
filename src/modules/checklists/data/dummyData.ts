/**
 * Dummy/fixture data for the checklists module, used in place of a real backend.
 * Swap this out for real API calls once the backend is available —
 * consumers should only ever import from here, never construct fixtures inline.
 *
 * Dates are relative to "now" and the data is built fresh on every call, so
 * "Due soon" and the overdue styling never go stale and callers can't corrupt a shared copy.
 *
 * Person ids deliberately don't follow the auth mock's `user-N` pattern: sign-ups there
 * mint `user-2`, `user-3`, … and must not inherit someone else's workspaces. The one
 * exception is `user-1`, the demo login.
 */

import type {
  Checklist,
  ChecklistItem,
  ChecklistRoleGrant,
  Comment,
  Person,
  Tag,
  Workspace,
  WorkspaceData,
  WorkspaceMember,
} from "../models/checklists.model";
import { daysFromNow, hoursAgo } from "../utils/date";

const demoUser = "user-1";
const ahmad = "member-ahmad";
const nur = "member-nur";
const kamal = "member-kamal";
const sara = "member-sara";

/** Everyone who exists, member of a workspace or not. Invites look people up here by email. */
export const dummyDirectory: Person[] = [
  { id: demoUser, name: "Demo User", email: "demo@checklist.app" },
  { id: ahmad, name: "Ahmad Zaki", email: "ahmad@acme.co" },
  { id: nur, name: "Nur Rahman", email: "nur@acme.co" },
  { id: kamal, name: "Kamal Lee", email: "kamal@acme.co" },
  { id: sara, name: "Sara Tan", email: "sara@acme.co" },
];

function makeItem(
  checklistId: string,
  position: number,
  content: string,
  extra: Partial<ChecklistItem> = {},
): ChecklistItem {
  return {
    id: `${checklistId}-item-${position + 1}`,
    checklistId,
    assignedTo: null,
    content,
    isChecked: false,
    position,
    dueDate: null,
    tagIds: [],
    completedAt: null,
    createdAt: hoursAgo(24 * 7 - position),
    ...extra,
  };
}

const completed = (hours: number): Partial<ChecklistItem> => ({
  isChecked: true,
  completedAt: hoursAgo(hours),
});

export function buildDummyData(): WorkspaceData {
  const workspaces: Workspace[] = [
    { id: "ws-design", ownerId: demoUser, name: "Design team", createdAt: hoursAgo(24 * 60) },
    { id: "ws-eng", ownerId: kamal, name: "Engineering", createdAt: hoursAgo(24 * 90) },
    { id: "ws-marketing", ownerId: nur, name: "Marketing", createdAt: hoursAgo(24 * 45) },
  ];

  const members: WorkspaceMember[] = [
    { id: "wm-1", workspaceId: "ws-design", userId: demoUser, role: "owner", joinedAt: hoursAgo(24 * 60) },
    { id: "wm-2", workspaceId: "ws-design", userId: ahmad, role: "admin", joinedAt: hoursAgo(24 * 55) },
    { id: "wm-3", workspaceId: "ws-design", userId: nur, role: "member", joinedAt: hoursAgo(24 * 40) },
    { id: "wm-4", workspaceId: "ws-design", userId: kamal, role: "member", joinedAt: hoursAgo(24 * 30) },
    { id: "wm-5", workspaceId: "ws-eng", userId: kamal, role: "owner", joinedAt: hoursAgo(24 * 90) },
    { id: "wm-6", workspaceId: "ws-eng", userId: demoUser, role: "member", joinedAt: hoursAgo(24 * 80) },
    { id: "wm-7", workspaceId: "ws-eng", userId: ahmad, role: "member", joinedAt: hoursAgo(24 * 70) },
    { id: "wm-8", workspaceId: "ws-marketing", userId: nur, role: "owner", joinedAt: hoursAgo(24 * 45) },
    { id: "wm-9", workspaceId: "ws-marketing", userId: demoUser, role: "admin", joinedAt: hoursAgo(24 * 44) },
  ];

  const tags: Tag[] = [
    { id: "tag-design", workspaceId: "ws-design", name: "Design", color: "violet" },
    { id: "tag-content", workspaceId: "ws-design", name: "Content", color: "rose" },
    { id: "tag-research", workspaceId: "ws-design", name: "Research", color: "fuchsia" },
    { id: "tag-backend", workspaceId: "ws-eng", name: "Backend", color: "purple" },
    { id: "tag-infra", workspaceId: "ws-eng", name: "Infra", color: "pink" },
    { id: "tag-campaign", workspaceId: "ws-marketing", name: "Campaign", color: "fuchsia" },
    { id: "tag-social", workspaceId: "ws-marketing", name: "Social", color: "pink" },
  ];

  const checklists: Checklist[] = [
    {
      id: "cl-q3-launch",
      workspaceId: "ws-design",
      createdBy: demoUser,
      title: "Q3 product launch",
      isTemplate: false,
      dueDate: daysFromNow(12),
      tagIds: ["tag-design", "tag-content"],
      createdAt: hoursAgo(24 * 14),
    },
    {
      id: "cl-a11y-audit",
      workspaceId: "ws-design",
      createdBy: ahmad,
      title: "Accessibility audit",
      isTemplate: false,
      dueDate: daysFromNow(2),
      tagIds: ["tag-research"],
      createdAt: hoursAgo(24 * 9),
    },
    {
      id: "cl-release-template",
      workspaceId: "ws-design",
      createdBy: demoUser,
      title: "Release checklist",
      isTemplate: true,
      dueDate: null,
      tagIds: [],
      createdAt: hoursAgo(24 * 30),
    },
    {
      id: "cl-api-v2",
      workspaceId: "ws-eng",
      createdBy: kamal,
      title: "API v2 migration",
      isTemplate: false,
      dueDate: daysFromNow(-1),
      tagIds: ["tag-backend"],
      createdAt: hoursAgo(24 * 20),
    },
    {
      id: "cl-infra",
      workspaceId: "ws-eng",
      createdBy: kamal,
      title: "Infra hardening",
      isTemplate: false,
      dueDate: daysFromNow(21),
      tagIds: ["tag-infra"],
      createdAt: hoursAgo(24 * 5),
    },
    {
      id: "cl-campaign",
      workspaceId: "ws-marketing",
      createdBy: nur,
      title: "Launch campaign",
      isTemplate: false,
      dueDate: daysFromNow(9),
      tagIds: ["tag-campaign", "tag-social"],
      createdAt: hoursAgo(24 * 8),
    },
  ];

  // Gives the demo user every standing: creator of "Q3 product launch", an admin someone else
  // appointed on "API v2 migration", a superuser on "Infra hardening", and a plain user on the rest.
  const checklistRoles: ChecklistRoleGrant[] = [
    {
      id: "cr-1",
      checklistId: "cl-q3-launch",
      userId: ahmad,
      role: "admin",
      grantedBy: demoUser,
      grantedAt: hoursAgo(24 * 10),
    },
    {
      id: "cr-2",
      checklistId: "cl-api-v2",
      userId: demoUser,
      role: "admin",
      grantedBy: kamal,
      grantedAt: hoursAgo(24 * 12),
    },
    {
      id: "cr-3",
      checklistId: "cl-infra",
      userId: demoUser,
      role: "superuser",
      grantedBy: kamal,
      grantedAt: hoursAgo(24 * 4),
    },
    {
      id: "cr-4",
      checklistId: "cl-q3-launch",
      userId: nur,
      role: "superuser",
      grantedBy: demoUser,
      grantedAt: hoursAgo(24 * 8),
    },
  ];

  const items: ChecklistItem[] = [
    // Q3 product launch (the mockup's checklist)
    makeItem("cl-q3-launch", 0, "Finalize homepage wireframes", {
      assignedTo: ahmad,
      dueDate: daysFromNow(5),
      tagIds: ["tag-design"],
    }),
    makeItem("cl-q3-launch", 1, "Write copy for hero section", {
      assignedTo: nur,
      tagIds: ["tag-content"],
    }),
    makeItem("cl-q3-launch", 2, "Set up staging environment", {
      assignedTo: kamal,
      dueDate: daysFromNow(3),
    }),
    makeItem("cl-q3-launch", 3, "Define project scope", { assignedTo: demoUser }),
    makeItem("cl-q3-launch", 4, "Create brand moodboard", {
      tagIds: ["tag-design"],
      ...completed(48),
    }),
    makeItem("cl-q3-launch", 5, "Kick-off meeting with stakeholders", completed(96)),

    // Accessibility audit
    makeItem("cl-a11y-audit", 0, "Audit color contrast on all pages", {
      assignedTo: demoUser,
      dueDate: daysFromNow(1),
      tagIds: ["tag-research"],
    }),
    makeItem("cl-a11y-audit", 1, "Check keyboard navigation", { assignedTo: ahmad }),
    makeItem("cl-a11y-audit", 2, "Write up findings", { dueDate: daysFromNow(1) }),
    makeItem("cl-a11y-audit", 3, "Pick screen readers to test with", completed(30)),

    // Release checklist (template)
    makeItem("cl-release-template", 0, "Run regression tests"),
    makeItem("cl-release-template", 1, "Update the changelog"),
    makeItem("cl-release-template", 2, "Tag the release"),
    makeItem("cl-release-template", 3, "Announce in #general"),

    // API v2 migration
    makeItem("cl-api-v2", 0, "Freeze v1 endpoints", { tagIds: ["tag-backend"], ...completed(120) }),
    makeItem("cl-api-v2", 1, "Migrate auth endpoints", {
      assignedTo: kamal,
      dueDate: daysFromNow(-2),
      tagIds: ["tag-backend"],
    }),
    makeItem("cl-api-v2", 2, "Update API client in the web app", { assignedTo: demoUser }),
    makeItem("cl-api-v2", 3, "Announce deprecation to partners"),

    // Infra hardening
    makeItem("cl-infra", 0, "Rotate service credentials", { tagIds: ["tag-infra"] }),
    makeItem("cl-infra", 1, "Enable audit logging", { assignedTo: kamal, dueDate: daysFromNow(14) }),
    makeItem("cl-infra", 2, "Review backup restore procedure"),

    // Launch campaign
    makeItem("cl-campaign", 0, "Draft launch announcement", {
      assignedTo: nur,
      dueDate: daysFromNow(6),
      tagIds: ["tag-campaign"],
    }),
    makeItem("cl-campaign", 1, "Schedule social posts", { tagIds: ["tag-social"] }),
    makeItem("cl-campaign", 2, "Brief the support team", { assignedTo: demoUser }),
  ];

  const comments: Comment[] = [
    {
      id: "comment-1",
      checklistItemId: "cl-q3-launch-item-1",
      userId: ahmad,
      body: "Pricing page wireframes are done, still working on the hero.",
      createdAt: hoursAgo(20),
    },
    {
      id: "comment-2",
      checklistItemId: "cl-q3-launch-item-1",
      userId: demoUser,
      body: "Great, can you share the Figma link when the hero is ready?",
      createdAt: hoursAgo(6),
    },
    {
      id: "comment-3",
      checklistItemId: "cl-api-v2-item-2",
      userId: kamal,
      body: "Blocked on the token refresh change, should unblock tomorrow.",
      createdAt: hoursAgo(10),
    },
  ];

  const people = dummyDirectory.map((person) => ({ ...person }));

  return {
    people,
    workspaces,
    members,
    tags,
    checklists,
    checklistRoles,
    items,
    comments,
  };
}
