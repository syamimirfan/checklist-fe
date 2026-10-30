import { useState, type SubmitEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Alert, Button } from "../../../shared/components/ui";
import { confirmPasswordReset } from "../shared/authSlice";
import { AuthLayout } from "../shared/AuthLayout";
import { PasswordInput } from "../shared/PasswordInput";
import {
  linkClasses,
  roundedControlClasses,
} from "../../../shared/styles/theme";
import {
  isLoadingStatus,
  isSucceededStatus,
} from "../shared/constants/auth.const";
import {
  passwordsNotMatchError,
  resetPasswordErrorAlert,
  resetPasswordErrorRequestNewLink,
  resetPasswordErrorSubtitle,
  resetPasswordErrorTitle,
  resetPasswordFormSubtitle,
  resetPasswordHintNewPassword,
  resetPasswordSubmitButton,
  resetPasswordSuccessAlert,
  resetPasswordSuccessLoginLink,
  resetPasswordSuccessSubtitle,
  resetPasswordSuccessTitle,
  resetPasswordTitle,
} from "./constants/resetPassword.const";

export function ResetPasswordPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const { passwordResetStatus, passwordResetError } = useAppSelector(
    (state) => state.auth,
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mismatchError, setMismatchError] = useState<string | null>(null);

  const isLoading = passwordResetStatus === isLoadingStatus;
  const isDone = passwordResetStatus === isSucceededStatus;

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setMismatchError(passwordsNotMatchError);
      return;
    }
    setMismatchError(null);
    await dispatch(confirmPasswordReset({ token, newPassword }));
  }

  if (!token) {
    return (
      <AuthLayout
        title={resetPasswordErrorTitle}
        subtitle={resetPasswordErrorSubtitle}
      >
        <Alert variant="error">{resetPasswordErrorAlert}</Alert>
        <Link
          to="/forgot-password"
          className={`mt-6 inline-block text-sm ${linkClasses}`}
        >
          {resetPasswordErrorRequestNewLink}
        </Link>
      </AuthLayout>
    );
  }

  if (isDone) {
    return (
      <AuthLayout
        title={resetPasswordSuccessTitle}
        subtitle={resetPasswordSuccessSubtitle}
      >
        <Alert variant="success">{resetPasswordSuccessAlert}</Alert>
        <Button
          size="lg"
          className={`mt-6 ${roundedControlClasses}`}
          onClick={() => navigate("/login")}
        >
          {resetPasswordSuccessLoginLink}
        </Button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={resetPasswordTitle} subtitle={resetPasswordFormSubtitle}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        {(passwordResetError || mismatchError) && (
          <Alert variant="error">{passwordResetError ?? mismatchError}</Alert>
        )}

        <PasswordInput
          label="New password"
          autoComplete="new-password"
          required
          value={newPassword}
          hint={resetPasswordHintNewPassword}
          onChange={(event) => setNewPassword(event.target.value)}
        />
        <PasswordInput
          label="Confirm new password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />

        <Button
          type="submit"
          size="lg"
          isLoading={isLoading}
          className={`mt-2 ${roundedControlClasses}`}
        >
          {resetPasswordSubmitButton}
        </Button>
      </form>
    </AuthLayout>
  );
}
