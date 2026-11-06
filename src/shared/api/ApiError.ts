import type { ApiErrorInit } from "./models/api.model";

/** Anything that goes wrong calling the API, in one shape: HTTP failures, the server's own error body, no connection. */
export class ApiError extends Error {
  status: number;
  code: string;
  fields: Record<string, string[]>;

  constructor({ status, code, message, fields = {} }: ApiErrorInit) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}
