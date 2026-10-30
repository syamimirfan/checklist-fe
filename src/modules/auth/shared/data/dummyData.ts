/**
 * Dummy/fixture data for the auth module, used in place of a real backend.
 * Swap this out for real API calls once the backend is available —
 * consumers should only ever import from here, never construct fixtures inline.
 */

import type { DummyUser } from "../models/authApi.model";

export const dummyUsers: DummyUser[] = [
  {
    id: "user-1",
    email: "demo@checklist.app",
    name: "Demo User",
    password: "password123",
    emailVerified: true,
  },
];
