import { QueryClient } from '@tanstack/react-query';

import { isApiError } from '@/lib/api/errors';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 30_000,
        retry: (failureCount, error) => {
          if (
            isApiError(error) &&
            ['unauthorized', 'forbidden', 'validation', 'not_found'].includes(error.code)
          ) {
            return false;
          }
          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}
