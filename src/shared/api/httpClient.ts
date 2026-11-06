import { apiBaseUrl } from "../config/env";
import { ApiError } from "./ApiError";
import {
  httpErrorCode,
  missingBaseUrlError,
  networkError,
  networkErrorCode,
  statusMessages,
  unexpectedError,
} from "./constants/api.const";
import type { ApiErrorBody, RequestOptions } from "./models/api.model";

async function request<T>(
  path: string,
  { signal }: RequestOptions = {},
): Promise<T> {
  if (!apiBaseUrl) {
    throw new Error(missingBaseUrlError);
  }

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      headers: { Accept: "application/json" },
      signal,
    });
  } catch (error) {
    // A cancelled request is not a failure: let the caller recognise and ignore it.
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    throw new ApiError({
      status: 0,
      code: networkErrorCode,
      message: networkError,
    });
  }

  if (!response.ok) {
    throw await toApiError(response);
  }
  return (await response.json()) as T;
}

/** Reads the backend's `{ error: { code, message, fields } }` body, falling back to a generic error. */
async function toApiError(response: Response): Promise<ApiError> {
  try {
    const { error } = (await response.json()) as Partial<ApiErrorBody>;
    if (error) {
      return new ApiError({
        status: response.status,
        code: error.code,
        message: error.message,
        fields: error.fields,
      });
    }
  } catch {
    // The body wasn't JSON (e.g. an HTML error page from a proxy).
  }
  return new ApiError({
    status: response.status,
    code: httpErrorCode,
    message: statusMessages[response.status] ?? unexpectedError,
  });
}

export const http = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, options),
};
