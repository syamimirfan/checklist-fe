import { useEffect, useState, type SubmitEvent } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Alert, Button, Input } from "../../../shared/components/ui";
import {
  resetPasswordResetStatus,
  sendPasswordResetEmail,
} from "../shared/authSlice";
import { AuthLayout } from "../shared/AuthLayout";
import {
  linkClasses,
  roundedControlClasses,
  text,
} from "../../../shared/styles/theme";
import {
  checkEmailAlert,
  backToLoginLink,
  checkEmailSubtitle,
  checkEmailTitle,
  forgotPasswordRememberedPassword,
  forgotPasswordSubmitButton,
  forgotPasswordSubtitle,
  forgotPasswordTitle,
} from "./constants/forgotPassword.const";
import {
  isLoadingStatus,
  isSucceededStatus,
} from "../shared/constants/auth.const";

export function ForgotPasswordPage() {
  const dispatch = useAppDispatch();
  const { passwordResetStatus, passwordResetError } = useAppSelector(
    (state) => state.auth,
  );
  const [email, setEmail] = useState("");

  const isLoading = passwordResetStatus === isLoadingStatus;
  const isSent = passwordResetStatus === isSucceededStatus;

  useEffect(() => {
    return () => {
      dispatch(resetPasswordResetStatus());
    };
  }, [dispatch]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(sendPasswordResetEmail(email));
  }

  // sending the reset email is successful, show a confirmation message instead of the form
  if (isSent) {
    return (
      <AuthLayout title={checkEmailTitle} subtitle={checkEmailSubtitle(email)}>
        <Alert variant="success">{checkEmailAlert}</Alert>
        <Link
          to="/login"
          className={`mt-6 inline-block text-sm ${linkClasses}`}
        >
          {backToLoginLink}
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={forgotPasswordTitle} subtitle={forgotPasswordSubtitle}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        {passwordResetError && (
          <Alert variant="error">{passwordResetError}</Alert>
        )}

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <Button
          type="submit"
          size="lg"
          isLoading={isLoading}
          className={`mt-2 ${roundedControlClasses}`}
        >
          {forgotPasswordSubmitButton}
        </Button>
      </form>

      <p className={`mt-6 text-sm ${text.body}`}>
        {forgotPasswordRememberedPassword}{" "}
        <Link to="/login" className={linkClasses}>
          {backToLoginLink}
        </Link>
      </p>
    </AuthLayout>
  );
}
