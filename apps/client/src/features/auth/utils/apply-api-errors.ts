import type { UseFormSetError, FieldValues, Path } from 'react-hook-form';
import { ApiError } from '@/shared/api';
import { parseLockoutDuration } from './auth-error-mapper';

export interface BannerErrorInfo {
  title: string;
  desc: string;
  retryable?: boolean;
}

export interface ApplyApiErrorsOptions<TFieldValues extends FieldValues> {
  error: unknown;
  setError?: UseFormSetError<TFieldValues>;
  setBannerError: (banner: BannerErrorInfo | null) => void;
  setLockoutDuration?: (seconds: number) => void;
  onLockout?: () => void;
}

export function applyApiErrors<TFieldValues extends FieldValues>({
  error,
  setError,
  setBannerError,
  setLockoutDuration,
  onLockout,
}: ApplyApiErrorsOptions<TFieldValues>): {
  status?: number;
  isRetryable: boolean;
  isLocked: boolean;
} {
  if (error instanceof ApiError) {
    // 1. 401 Unauthorized: generic banner (do not say which field was wrong)
    if (error.status === 401) {
      setBannerError({
        title: 'Authentication failed',
        desc: 'Please check your credentials and try again.',
        retryable: false,
      });
      return { status: 401, isRetryable: false, isLocked: false };
    }

    // 2. 409 Conflict: error on the email (or phone) field
    if (error.status === 409) {
      const msg = error.message || 'Conflict';
      const isPhone = /phone/i.test(msg);
      if (isPhone && setError) {
        setError('phone' as Path<TFieldValues>, {
          type: 'manual',
          message: msg,
        });
      } else if (setError) {
        setError('email' as Path<TFieldValues>, {
          type: 'manual',
          message: msg || 'Email already registered',
        });
      }
      setBannerError({
        title: 'Please fix the errors below',
        desc: msg || 'An account with this email already exists.',
        retryable: false,
      });
      return { status: 409, isRetryable: false, isLocked: false };
    }

    // 3. 429 Too Many Requests: clear "try again later" message, no automatic retry
    if (error.status === 429) {
      const duration = parseLockoutDuration(error);
      setLockoutDuration?.(duration);
      onLockout?.();
      setBannerError({
        title: 'Account temporarily locked',
        desc: 'Too many attempts. Please try again later.',
        retryable: false,
      });
      return { status: 429, isRetryable: false, isLocked: true };
    }

    // 4. 503 Service Unavailable / Rate-limiter outage: banner with a Try again action
    if (error.status === 503) {
      setBannerError({
        title: 'Service temporarily unavailable',
        desc: 'Our authentication service is undergoing brief maintenance. Please try again in a few moments.',
        retryable: true,
      });
      return { status: 503, isRetryable: true, isLocked: false };
    }

    // 5. Other 5xx or server errors
    if (error.status >= 500) {
      setBannerError({
        title: 'Something went wrong',
        desc: 'A server error occurred. Please try again.',
        retryable: true,
      });
      return { status: error.status, isRetryable: true, isLocked: false };
    }
  }

  // 6. Network errors / TypeError / fetch failure: banner with Try again action
  const isNetwork =
    error instanceof TypeError ||
    (error instanceof Error &&
      (error.message.includes('fetch') ||
        error.message.includes('network') ||
        error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError')));

  if (isNetwork) {
    setBannerError({
      title: "Couldn't connect",
      desc: 'Check your internet connection and try again. Your details are still here.',
      retryable: true,
    });
    return { isRetryable: true, isLocked: false };
  }

  // Fallback generic unknown error
  setBannerError({
    title: 'Something went wrong',
    desc: 'Something went wrong, try again.',
    retryable: true,
  });
  return { isRetryable: true, isLocked: false };
}
