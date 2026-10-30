import type { AuthState } from "../models/authSlice.model";

export const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
  passwordResetStatus: "idle",
  passwordResetError: null,
};

export const authSliceName = "auth";

// thunk action types
export const loginActionType = "auth/login";
export const signUpActionType = "auth/signUp";
export const sendPasswordResetEmailActionType = "auth/sendPasswordResetEmail";
export const confirmPasswordResetActionType = "auth/confirmPasswordReset";

// message used when a rejected thunk carries no error message
export const defaultErrorMessage = "Something went wrong. Please try again.";
