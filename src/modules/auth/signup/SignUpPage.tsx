import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Alert, Button, Checkbox, Input } from "../../../shared/components/ui";
import { clearAuthError, signUp } from "../shared/authSlice";
import { AuthDivider } from "../shared/AuthDivider";
import { AuthLayout } from "../shared/AuthLayout";
import { PasswordInput } from "../shared/PasswordInput";
import { SocialButton } from "../shared/SocialButton";
import { PasswordStrength } from "./PasswordStrength";
import {
  linkClasses,
  roundedControlClasses,
  text,
} from "../../../shared/styles/theme";
import { isLoadingStatus } from "../shared/constants/auth.const";
import type { FieldErrors } from "./models/signUp.model";
import {
  emailPattern,
  passwordMinLength,
  signUpDividerText,
  signUpEmailInvalidError,
  signUpHaveAccountText,
  signUpHintPassword,
  signUpLabelEmail,
  signUpLabelName,
  signUpLabelPassword,
  signUpNameRequiredError,
  signUpPanel,
  signUpPasswordTooShortError,
  signUpPlaceholderEmail,
  signUpPlaceholderName,
  signUpPlaceholderPassword,
  signUpPrivacyPolicyLink,
  signUpSignInLink,
  signUpSocialButtonGoogle,
  signUpSocialButtonGoogleNotice,
  signUpSubmitButton,
  signUpSubtitle,
  signUpTermsAnd,
  signUpTermsOfServiceLink,
  signUpTermsPrefix,
  signUpTermsRequiredError,
  signUpTitle,
} from "./constants/signUp.const";

function validate(
  name: string,
  email: string,
  password: string,
  hasAcceptedTerms: boolean,
): FieldErrors {
  const errors: FieldErrors = {};
  if (!name.trim()) errors.name = signUpNameRequiredError;
  if (!emailPattern.test(email)) errors.email = signUpEmailInvalidError;
  if (password.length < passwordMinLength)
    errors.password = signUpPasswordTooShortError;
  if (!hasAcceptedTerms) errors.terms = signUpTermsRequiredError;
  return errors;
}

export function SignUpPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState<string | null>(null);

  const isLoading = status === isLoadingStatus;

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validate(name, email, password, hasAcceptedTerms);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const result = await dispatch(signUp({ name, email, password }));
    if (signUp.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  }

  return (
    <AuthLayout
      title={signUpTitle}
      subtitle={signUpSubtitle}
      panel={signUpPanel}
    >
      {notice && (
        <div className="mb-4">
          <Alert variant="info">{notice}</Alert>
        </div>
      )}
      <SocialButton
        icon="globe"
        onClick={() => setNotice(signUpSocialButtonGoogleNotice)}
      >
        {signUpSocialButtonGoogle}
      </SocialButton>

      <AuthDivider>{signUpDividerText}</AuthDivider>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
        {error && <Alert variant="error">{error}</Alert>}

        <Input
          label={signUpLabelName}
          autoComplete="name"
          placeholder={signUpPlaceholderName}
          required
          value={name}
          error={fieldErrors.name}
          onChange={(event) => {
            setName(event.target.value);
            if (error) dispatch(clearAuthError());
          }}
        />
        <Input
          label={signUpLabelEmail}
          type="email"
          autoComplete="email"
          placeholder={signUpPlaceholderEmail}
          required
          value={email}
          error={fieldErrors.email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) dispatch(clearAuthError());
          }}
        />
        <div className="flex flex-col gap-3">
          <PasswordInput
            label={signUpLabelPassword}
            autoComplete="new-password"
            placeholder={signUpPlaceholderPassword}
            required
            value={password}
            error={fieldErrors.password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (error) dispatch(clearAuthError());
            }}
          />
          <PasswordStrength password={password} />
          <p className={`text-sm ${text.muted}`}>{signUpHintPassword}</p>
        </div>

        <Checkbox
          label={
            <>
              {signUpTermsPrefix}{" "}
              <a href="#" className={`underline ${linkClasses}`}>
                {signUpTermsOfServiceLink}
              </a>{" "}
              {signUpTermsAnd}{" "}
              <a href="#" className={`underline ${linkClasses}`}>
                {signUpPrivacyPolicyLink}
              </a>
              .
            </>
          }
          checked={hasAcceptedTerms}
          error={fieldErrors.terms}
          onChange={(event) => setHasAcceptedTerms(event.target.checked)}
        />

        <Button
          type="submit"
          size="lg"
          isLoading={isLoading}
          className={roundedControlClasses}
        >
          {signUpSubmitButton}
        </Button>
      </form>

      <p className={`mt-6 text-center text-sm ${text.body}`}>
        {signUpHaveAccountText}{" "}
        <Link to="/login" className={linkClasses}>
          {signUpSignInLink}
        </Link>
      </p>
    </AuthLayout>
  );
}
