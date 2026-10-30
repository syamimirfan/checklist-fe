import type { AuthUser, DummyUser } from "../models/authApi.model";

// Simulates network delay and transforms a DummyUser to an AuthUser.
export const NETWORK_DELAY_MS = 600;
export const delay = (ms = NETWORK_DELAY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));
export const toAuthUser = (user: DummyUser): AuthUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
});

// messages to throw error
export const invalidEmailOrPasswordError = "Invalid email or password.";
export const existingEmailError = "An account with this email already exists.";
export const invalidResetLinkError =
  "This reset link is invalid or has expired.";
export const passwordTooShortError = "Password must be at least 8 characters.";
