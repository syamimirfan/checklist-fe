import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
  type SerializedError,
} from "@reduxjs/toolkit";
import {
  loginRequest,
  requestPasswordReset,
  resetPassword,
  signUpRequest,
} from "./authApi";
import {
  authSliceName,
  confirmPasswordResetActionType,
  defaultErrorMessage,
  initialState,
  loginActionType,
  sendPasswordResetEmailActionType,
  signUpActionType,
} from "./constants/authSlice.const";
import type { AuthUser } from "./models/authApi.model";

// A rejected thunk's `action.error` is a plain SerializedError object, not an Error
// instance, so `instanceof Error` would always be false and hide the real message.
function errorMessage(error: SerializedError): string {
  return error.message || defaultErrorMessage;
}

export const login = createAsyncThunk(
  loginActionType,
  async (args: { email: string; password: string }) => {
    return loginRequest(args.email, args.password);
  },
);

export const signUp = createAsyncThunk(
  signUpActionType,
  async (args: { name: string; email: string; password: string }) => {
    return signUpRequest(args.name, args.email, args.password);
  },
);

export const sendPasswordResetEmail = createAsyncThunk(
  sendPasswordResetEmailActionType,
  async (email: string) => {
    await requestPasswordReset(email);
  },
);

export const confirmPasswordReset = createAsyncThunk(
  confirmPasswordResetActionType,
  async (args: { token: string; newPassword: string }) => {
    await resetPassword(args.token, args.newPassword);
  },
);

const authSlice = createSlice({
  name: authSliceName,
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
    resetPasswordResetStatus(state) {
      state.passwordResetStatus = "idle";
      state.passwordResetError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = errorMessage(action.error);
      })
      .addCase(signUp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = "failed";
        state.error = errorMessage(action.error);
      })
      .addCase(sendPasswordResetEmail.pending, (state) => {
        state.passwordResetStatus = "loading";
        state.passwordResetError = null;
      })
      .addCase(sendPasswordResetEmail.fulfilled, (state) => {
        state.passwordResetStatus = "succeeded";
      })
      .addCase(sendPasswordResetEmail.rejected, (state, action) => {
        state.passwordResetStatus = "failed";
        state.passwordResetError = errorMessage(action.error);
      })
      .addCase(confirmPasswordReset.pending, (state) => {
        state.passwordResetStatus = "loading";
        state.passwordResetError = null;
      })
      .addCase(confirmPasswordReset.fulfilled, (state) => {
        state.passwordResetStatus = "succeeded";
      })
      .addCase(confirmPasswordReset.rejected, (state, action) => {
        state.passwordResetStatus = "failed";
        state.passwordResetError = errorMessage(action.error);
      });
  },
});

export const { logout, clearAuthError, resetPasswordResetStatus } =
  authSlice.actions;
export default authSlice.reducer;
