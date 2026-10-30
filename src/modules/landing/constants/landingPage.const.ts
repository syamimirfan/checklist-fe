import type { LandingFeature } from "../models/landingPage.model";

// Header
export const login = "Log in";
export const signup = "Sign up free";

// main page
export const nowWithSharedWorkspaces = "Now with shared workspaces";
export const checklistsThatKeepYourWholeTeamInSync =
  "Checklists that keep your";
export const wholeTeam = "whole team";
export const inSync = "in sync";
export const planLaunchesTrackRecurringWorkAndNeverLoseATaskInAChatThreadAgain =
  "Plan launches, track recurring work, and never lose a task in a chat thread again.";
export const readTheDocumentation = "Read the Documentation";

export const landingFeatures: LandingFeature[] = [
  {
    id: "feature-1",
    title: "Shared workspaces",
    description:
      "Invite your team into a workspace and organize checklists together in real time.",
    tone: "violet",
  },
  {
    id: "feature-2",
    title: "Templates that stick",
    description:
      "Turn any checklist into a reusable template so recurring work never starts from scratch.",
    tone: "fuchsia",
  },
  {
    id: "feature-3",
    title: "Tags & due dates",
    description:
      "Keep everything organized with color tags, due dates, and assignees.",
    tone: "pink",
  },
  {
    id: "feature-4",
    title: "Comments built in",
    description:
      "Discuss individual checklist items without leaving the task at hand.",
    tone: "purple",
  },
];

export const trustedByTeamsByShip = "Trusted by teams who ship";

export const readyToGetOrganized = "Ready to get organized?";
export const createYourFreeAccount =
  "Create a free account — no credit card required.";
export const createYourWorkspace = "Create your workspace";
