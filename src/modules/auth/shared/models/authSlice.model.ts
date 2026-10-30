import type { AuthUser } from "./authApi.model";

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

export interface AuthState {
  user: AuthUser | null;
  status: RequestStatus;
  error: string | null;
  passwordResetStatus: RequestStatus;
  passwordResetError: string | null;
}
