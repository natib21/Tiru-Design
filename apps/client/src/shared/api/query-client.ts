import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './api-error';

const NO_RETRY_STATUSES = new Set([400, 401, 403, 404, 409, 413, 429]);

export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (failureCount >= 2) {
    return false;
  }

  if (error instanceof ApiError) {
    if (NO_RETRY_STATUSES.has(error.status)) {
      return false;
    }
    // 5xx errors: retry up to 2 times
    if (error.status >= 500 && error.status <= 599) {
      return true;
    }
  }

  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = Number((error as { status: unknown }).status);
    if (NO_RETRY_STATUSES.has(status)) {
      return false;
    }
    if (status >= 500 && status <= 599) {
      return true;
    }
  }

  // Network errors and unexpected exceptions retry up to 2 times
  return true;
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: shouldRetryQuery,
      },
      mutations: {
        retry: shouldRetryQuery,
      },
    },
  });
}

export const queryClient = createQueryClient();
