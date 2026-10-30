import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Alert, Button, Checkbox, Input } from "../../../shared/components/ui";
import { clearAuthError, login } from "../shared/authSlice";
import { AuthDivider } from "../shared/AuthDivider";
import { AuthLayout } from "../shared/AuthLayout";
import { PasswordInput } from "../shared/PasswordInput";
import { SocialButton } from "../shared/SocialButton";
import {
  linkClasses,
  roundedControlClasses,
  text,
} from "../../../shared/styles/theme";
import { isLoadingStatus } from "../shared/constants/auth.const";
import {
  authDividerText,
  checkBoxRememberMe,
  forgotPasswordLink,
  inputPlaceholderEmail,
  inputPlaceholderPassword,
  loginCreateAccountLink,
  loginNoAccountText,
  loginSubmitButton,
  loginSubtitle,
  loginTitle,
  socialButtonGoogle,
  socialButtonGoogleNotice,
  socialButtonPasskey,
  socialButtonPasskeyNotice,
} from "./constants/login.const";

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const isLoading = status === isLoadingStatus;

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  }

  return (
    <AuthLayout title={loginTitle} subtitle={loginSubtitle}>
      {notice && (
        <div className="mb-4">
          <Alert variant="info">{notice}</Alert>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <SocialButton
          icon="globe"
          onClick={() => setNotice(socialButtonGoogleNotice)}
        >
          {socialButtonGoogle}
        </SocialButton>
        <SocialButton
          icon="key"
          onClick={() => setNotice(socialButtonPasskeyNotice)}
        >
          {socialButtonPasskey}
        </SocialButton>
      </div>

      <AuthDivider>{authDividerText}</AuthDivider>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
        {error && <Alert variant="error">{error}</Alert>}

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder={inputPlaceholderEmail}
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) dispatch(clearAuthError());
          }}
        />
        <PasswordInput
          label="Password"
          autoComplete="current-password"
          placeholder={inputPlaceholderPassword}
          required
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            if (error) dispatch(clearAuthError());
          }}
          labelAction={
            <Link to="/forgot-password" className={`text-sm ${linkClasses}`}>
              {forgotPasswordLink}
            </Link>
          }
        />

        <Checkbox
          label={checkBoxRememberMe}
          checked={keepSignedIn}
          onChange={(event) => setKeepSignedIn(event.target.checked)}
          className="mt-1"
        />

        <Button
          type="submit"
          size="lg"
          isLoading={isLoading}
          className={`mt-1 ${roundedControlClasses}`}
        >
          {loginSubmitButton}
        </Button>
      </form>

      <p className={`mt-6 text-center text-sm ${text.body}`}>
        {loginNoAccountText}{" "}
        <Link to="/signup" className={linkClasses}>
          {loginCreateAccountLink}
        </Link>
      </p>
    </AuthLayout>
  );
}
