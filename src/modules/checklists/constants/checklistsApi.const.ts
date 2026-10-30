// Simulated network delay. Short on purpose: item changes wait for the response
// (no optimistic updates), so a long delay would make the checkboxes feel stuck.
export const NETWORK_DELAY_MS = 150;
export const delay = (ms = NETWORK_DELAY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** UUID like the ERD's `uuid` keys; falls back where `crypto.randomUUID` is missing (plain-http LAN dev). */
export const newId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

// messages to throw error
export const unknownInviteeError = "We couldn't find an account with that email.";
