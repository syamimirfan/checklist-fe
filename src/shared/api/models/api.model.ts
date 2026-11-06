/** The error body every checklist-be endpoint returns (see `apps/core/exception_handler.py`). */
export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    /** Only filled for validation errors: field name -> its messages. */
    fields: Record<string, string[]>;
  };
}

export interface ApiErrorInit {
  /** HTTP status, or 0 when the server could not be reached at all. */
  status: number;
  code: string;
  message: string;
  fields?: Record<string, string[]>;
}

export interface RequestOptions {
  /** Lets the caller cancel the request (e.g. when a component unmounts). */
  signal?: AbortSignal;
}
