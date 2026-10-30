/**
 * Mock auth API. Simulates network latency and validation against
 * dummy data so the UI/Redux flow is realistic without a real backend.
 * Replace the bodies of these functions with real HTTP calls later —
 * the function signatures are the contract the rest of the app depends on.
 */

import type { AuthUser, DummyUser } from "./models/authApi.model";
import { dummyUsers } from "./data/dummyData";
import {
  delay,
  existingEmailError,
  invalidEmailOrPasswordError,
  invalidResetLinkError,
  passwordTooShortError,
  toAuthUser,
} from "./constants/authApi.const";

export async function loginRequest(
  email: string,
  password: string,
): Promise<AuthUser> {
  await delay();
  const user = dummyUsers.find(
    (candidate) => candidate.email.toLowerCase() === email.toLowerCase(),
  );
  if (!user || user.password !== password) {
    throw new Error(invalidEmailOrPasswordError);
  }
  return toAuthUser(user);
}

export async function signUpRequest(
  name: string,
  email: string,
  password: string,
): Promise<AuthUser> {
  await delay();
  const exists = dummyUsers.some(
    (candidate) => candidate.email.toLowerCase() === email.toLowerCase(),
  );
  if (exists) {
    throw new Error(existingEmailError);
  }
  const newUser: DummyUser = {
    id: `user-${dummyUsers.length + 1}`,
    email,
    name,
    password,
    emailVerified: false,
  };
  dummyUsers.push(newUser);
  return toAuthUser(newUser);
}

export async function requestPasswordReset(_email: string): Promise<void> {
  await delay();
  // Always resolves without revealing whether the email exists, to avoid account enumeration.
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<void> {
  await delay();
  if (!token) {
    throw new Error(invalidResetLinkError);
  }
  if (newPassword.length < 8) {
    throw new Error(passwordTooShortError);
  }
}
