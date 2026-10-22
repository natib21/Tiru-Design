export interface BackendErrorFormat {
  statusCode?: number;
  status?: number;
  error?: string;
  code?: string;
  message?: string | string[];
  timestamp?: string;
  path?: string;
  currentVersion?: unknown;
  [key: string]: unknown;
}

export class ApiError extends Error {
  status: number;
  code: string;
  override message: string;
  currentVersion?: unknown;
  data?: unknown;

  constructor(
    status: number,
    code: string,
    message: string,
    currentVersion?: unknown,
    data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.message = message;
    this.currentVersion = currentVersion;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
