import { ApiError } from '@/shared/api';

export type AuthFormState =
  | 'default'
  | 'loading'
  | 'incorrect_password'
  | 'network_error'
  | 'account_locked'
  | 'validation_error';

export function parseLockoutDuration(error: unknown): number {
  if (!error) return 900;

  const err = error as {
    headers?: Headers;
    data?: Record<string, unknown>;
    retryAfterSeconds?: number;
    message?: string;
  };

  // 1. Check Retry-After header
  const retryHeader = err.headers?.get('retry-after');
  if (retryHeader) {
    const parsedInt = parseInt(retryHeader, 10);
    if (!Number.isNaN(parsedInt) && parsedInt > 0) {
      return parsedInt;
    }
    const parsedDate = new Date(retryHeader).getTime();
    if (!Number.isNaN(parsedDate) && parsedDate > Date.now()) {
      return Math.max(1, Math.round((parsedDate - Date.now()) / 1000));
    }
  }

  // 2. Check retryAfterSeconds field in payload/error
  const secondsField =
    err.retryAfterSeconds ??
    (err.data?.retryAfterSeconds as number | undefined) ??
    (err.data?.retry_after_seconds as number | undefined);
  if (typeof secondsField === 'number' && !Number.isNaN(secondsField) && secondsField > 0) {
    return secondsField;
  }

  // 3. Check for timestamp in error message
  if (typeof err.message === 'string') {
    const isoMatch = err.message.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?/);
    if (isoMatch) {
      const matchDate = new Date(isoMatch[0]).getTime();
      if (!Number.isNaN(matchDate) && matchDate > Date.now()) {
        return Math.max(1, Math.round((matchDate - Date.now()) / 1000));
      }
    }
  }

  // 4. Default fallback: 900 seconds (15 minutes)
  return 900;
}

export function mapAuthErrorToState(error: unknown): {
  state: AuthFormState;
  message: string;
  lockoutSeconds?: number;
} {
  if (error instanceof ApiError) {
    if (error.status === 429) {
      return {
        state: 'account_locked',
        message: error.message || 'Account temporarily locked',
        lockoutSeconds: parseLockoutDuration(error),
      };
    }

    if (error.status === 401) {
      return {
        state: 'incorrect_password',
        message: 'Incorrect password. Please try again.',
      };
    }

    if (error.status === 400 || error.status === 409 || error.status === 422) {
      return {
        state: 'validation_error',
        message: error.message || 'Validation failed. Please fix the errors below.',
      };
    }

    if (error.status === 0) {
      return {
        state: 'network_error',
        message: "Couldn't connect. Please check your internet connection and try again.",
      };
    }
  }

  // Handle standard TypeError / fetch failure
  if (
    error instanceof TypeError ||
    (error instanceof Error &&
      (error.message.includes('fetch') ||
        error.message.includes('network') ||
        error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError')))
  ) {
    return {
      state: 'network_error',
      message: "Couldn't connect. Please check your internet connection and try again.",
    };
  }

  return {
    state: 'validation_error',
    message: (error as Error)?.message || 'An unexpected error occurred. Please try again.',
  };
}
