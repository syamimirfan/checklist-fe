// Codes the client itself assigns (the server's own codes come in the response body).
export const networkErrorCode = "network_error";
export const httpErrorCode = "http_error";
/** The codes whose message is a generic fallback written here, not one the backend chose. */
export const fallbackErrorCodes: readonly string[] = [
  networkErrorCode,
  httpErrorCode,
];

/** Key the backend files errors under when they belong to no single field (DRF's convention). */
export const nonFieldErrorsKey = "non_field_errors";

// Messages for failures that never reached the server's error format.
export const missingBaseUrlError =
  "CHECKLIST_BASE_URL is not set. Add it to .env.development (or .env.production).";
export const networkError =
  "Can't reach the server. Check your connection and try again.";
export const unexpectedError = "Something went wrong. Please try again.";

/** What to say for an error response that has no usable body (e.g. a proxy's HTML page), by HTTP status. */
export const statusMessages: Record<number, string> = {
  // 4XX
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  413: "Payload Too Large",
  415: "Unsupported Media Type",
  429: "Too Many Requests",
  451: "Unavailable For Legal Reasons",
  499: "Client Closed Request",
  // 5XX
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
};
