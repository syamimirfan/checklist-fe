import type {
  LandingFeature,
  LandingPageContent,
  LandingTestimonial,
} from "../models/landingPage.model";

export const landingEndpoint = "/landing/";

// Header
export const login = "Log in";
export const signup = "Sign up free";

export const unexpectedErrorMessage = "Something went wrong loading this page.";

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

export const landingTestimonials: LandingTestimonial[] = [
  {
    id: "testimonial-1",
    quote:
      "Checklist turned our chaotic launch week into something genuinely calm.",
    author: "Priya Nair",
    role: "Product Lead, Orbital",
  },
  {
    id: "testimonial-2",
    quote:
      "The shared workspaces make handing off tasks between teams painless.",
    author: "Marcus Webb",
    role: "Operations Manager, Fenwick & Co",
  },
  {
    id: "testimonial-3",
    quote:
      "Simple enough for personal to-dos, powerful enough for our whole company.",
    author: "Elena Ruiz",
    role: "Founder, Studio Norte",
  },
];

export const readyToGetOrganized = "Ready to get organized?";
export const createYourFreeAccount =
  "Create a free account — no credit card required.";
export const createYourWorkspace = "Create your workspace";

/** What the page shows until the backend answers, or if it can't: the same copy the backend starts with. */
export const defaultLandingContent: LandingPageContent = {
  header: { loginLabel: login, signupLabel: signup },
  hero: {
    badge: nowWithSharedWorkspaces,
    titlePrefix: checklistsThatKeepYourWholeTeamInSync,
    titleHighlight: wholeTeam,
    titleSuffix: inSync,
    description:
      planLaunchesTrackRecurringWorkAndNeverLoseATaskInAChatThreadAgain,
    ctaLabel: readTheDocumentation,
  },
  features: landingFeatures,
  testimonials: { title: trustedByTeamsByShip, items: landingTestimonials },
  cta: {
    title: readyToGetOrganized,
    description: createYourFreeAccount,
    buttonLabel: createYourWorkspace,
  },
};
