/** Input types that get a built-in "×" once they have text. Passwords have their own (with Show/Hide). */
export const clearableInputTypes = ["text", "email", "search", "tel", "url"];

/** Accessible name for a field's "×", e.g. "Email" → "Clear email". */
export const clearFieldLabel = (fieldLabel: string) =>
  `Clear ${fieldLabel.toLowerCase()}`;
