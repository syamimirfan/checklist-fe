/**
 * Turns anything thrown while calling the backend into the messages to show the user.
 * Pure (no Redux, no UI): `useApiErrorHandler` in `app/hooks.ts` shows the result as toasts.
 *
 * Order, like the backend's error body: field errors, then its message, then a generic fallback
 * (`ApiError` already carries the status-based text when there was no body).
 */

import { ApiError } from "./ApiError";
import {
  fallbackErrorCodes,
  nonFieldErrorsKey,
  unexpectedError,
} from "./constants/api.const";
import { humanizeKey } from "../utils/text";

/**
 * `{ name: ["This field is required."] }` -> `["Name: This field is required."]`.
 * DRF's own messages carry no context, so each is prefixed with its field; repeats are dropped.
 */
function fieldMessages(fields: Record<string, string[]>): string[] {
  const messages = Object.entries(fields).flatMap(([field, list]) =>
    list.map((message) =>
      field === nonFieldErrorsKey
        ? message
        : `${humanizeKey(field)}: ${message}`,
    ),
  );
  return [...new Set(messages)];
}

/** Has a readable `message`: a plain `Error`, or the `SerializedError` a rejected thunk puts in `action.error`. */
function hasMessage(error: unknown): error is { message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message.length > 0
  );
}

/** Always at least one message. */
export function getApiErrorMessages(error: unknown): string[] {
  if (error instanceof ApiError) {
    const fromFields = fieldMessages(error.fields);
    return fromFields.length > 0 ? fromFields : [error.message];
  }
  if (hasMessage(error)) {
    return [error.message];
  }
  return [unexpectedError];
}

/** True when the message shown is a generic stand-in, not one the backend wrote — worth logging in full. */
export function isFallbackError(error: unknown): boolean {
  return (
    !(error instanceof ApiError) || fallbackErrorCodes.includes(error.code)
  );
}
