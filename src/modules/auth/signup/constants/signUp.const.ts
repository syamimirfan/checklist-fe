import type { AuthPanelContent } from "../../shared/models/authLayout.model";

// Side panel
export const signUpPanel: AuthPanelContent = {
  headline: "Turn every to-do into done.",
  description:
    "Create checklists, set reminders and share lists with your team or family.",
  illustration: "create",
};

// Validation rules
export const emailPattern = /^\S+@\S+\.\S+$/;
export const passwordMinLength = 8;

// Validation errors
export const signUpNameRequiredError = "Name is required.";
export const signUpEmailInvalidError = "Enter a valid email address.";
export const signUpPasswordTooShortError = `Password must be at least ${passwordMinLength} characters.`;
export const signUpTermsRequiredError =
  "Please accept the terms to create an account.";

// Sign up form
export const signUpTitle = "Create your account";
export const signUpSubtitle = "Free to start. No credit card required.";
export const signUpSubmitButton = "Create account";

// Social sign-up button
export const signUpSocialButtonGoogle = "Sign up with Google";
export const signUpSocialButtonGoogleNotice =
  "Google sign-up isn't available yet.";
export const signUpDividerText = "or sign up with email";

// Form fields
export const signUpLabelName = "Full name";
export const signUpPlaceholderName = "Alex Morgan";
export const signUpLabelEmail = "Email";
export const signUpPlaceholderEmail = "you@company.com";
export const signUpLabelPassword = "Password";
export const signUpPlaceholderPassword = "Create a password";
export const signUpHintPassword = `Use ${passwordMinLength}+ characters with upper and lower case, a number and a symbol.`;

// Terms checkbox
export const signUpTermsPrefix = "I agree to the";
export const signUpTermsOfServiceLink = "Terms of Service";
export const signUpTermsAnd = "and";
export const signUpPrivacyPolicyLink = "Privacy Policy";

// Sign in prompt below the form
export const signUpHaveAccountText = "Already have an account?";
export const signUpSignInLink = "Sign in";
