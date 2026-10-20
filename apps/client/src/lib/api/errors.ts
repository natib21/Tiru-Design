export type ApiErrorCode =
  | 'network'
  | 'timeout'
  | 'unauthorized'
  | 'forbidden'
  | 'validation'
  | 'not_found'
  | 'rate_limited'
  | 'payment'
  | 'server'
  | 'unknown';

export type FieldError = {
  path: string;
  message: string;
};

export type ApiError = {
  name: 'ApiError';
  code: ApiErrorCode;
  message: string;
  status: number | null;
  requestId?: string;
  fieldErrors?: FieldError[];
};

export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    value.name === 'ApiError' &&
    'code' in value
  );
}

export function createApiError(partial: Omit<ApiError, 'name'>): ApiError {
  return { name: 'ApiError', ...partial };
}

function codeFromStatus(status: number): ApiErrorCode {
  if (status === 401) return 'unauthorized';
  if (status === 402) return 'payment';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not_found';
  if (status === 408) return 'timeout';
  if (status === 422) return 'validation';
  if (status === 429) return 'rate_limited';
  if (status >= 500) return 'server';
  if (status >= 400) return 'unknown';
  return 'unknown';
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function parseFieldErrors(value: unknown): FieldError[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const errors: FieldError[] = [];
  for (const item of value) {
    if (
      typeof item === 'object' &&
      item !== null &&
      'path' in item &&
      'message' in item &&
      typeof item.path === 'string' &&
      typeof item.message === 'string'
    ) {
      errors.push({ path: item.path, message: item.message });
    }
  }
  return errors.length > 0 ? errors : undefined;
}

export function normalizeHttpError(status: number, body: unknown): ApiError {
  const record = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {};
  const apiCode = readString(record.code);
  const mapped: ApiErrorCode =
    apiCode === 'network' ||
    apiCode === 'timeout' ||
    apiCode === 'unauthorized' ||
    apiCode === 'forbidden' ||
    apiCode === 'validation' ||
    apiCode === 'not_found' ||
    apiCode === 'rate_limited' ||
    apiCode === 'payment' ||
    apiCode === 'server'
      ? apiCode
      : codeFromStatus(status);

  return createApiError({
    code: mapped,
    status,
    message:
      readString(record.message) ??
      readString(record.error) ??
      `Request failed with status ${status}`,
    requestId: readString(record.requestId),
    fieldErrors: parseFieldErrors(record.fieldErrors) ?? parseFieldErrors(record.errors),
  });
}

export function normalizeTransportError(error: unknown): ApiError {
  if (isApiError(error)) return error;
  if (error instanceof DOMException && error.name === 'AbortError') {
    return createApiError({
      code: 'timeout',
      status: null,
      message: 'The request timed out. Please try again.',
    });
  }
  if (error instanceof TypeError) {
    return createApiError({
      code: 'network',
      status: null,
      message: 'Unable to reach the server. Check your connection and try again.',
    });
  }
  return createApiError({
    code: 'unknown',
    status: null,
    message: error instanceof Error ? error.message : 'An unexpected error occurred.',
  });
}

export function getUserFacingErrorMessage(error: unknown): string {
  if (isApiError(error)) return error.message;
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred.';
}
