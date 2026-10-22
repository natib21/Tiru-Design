import createClient, { type Middleware } from 'openapi-fetch';
import { env } from '@/shared/config/env';
import { ApiError, type BackendErrorFormat } from './api-error';
import {
  getAuthTokenProvider,
  getWorkspaceProvider,
  refreshTokens,
  redirectToLogin,
} from './refresh';
import type { paths } from './schema';

export { ApiError, type BackendErrorFormat };

export function isAuthEndpoint(url: string): boolean {
  return /\/auth\/(login|register|refresh)(\?|$)/.test(url);
}

async function handleNon2xxResponse(response: Response): Promise<never> {
  let body: BackendErrorFormat | null = null;
  try {
    body = (await response.clone().json()) as BackendErrorFormat;
  } catch {
    // not JSON
  }

  const status = response.status;
  const code =
    body?.error ||
    body?.code ||
    (status === 409 ? 'CONFLICT' : status === 401 ? 'UNAUTHORIZED' : `HTTP_${status}`);
  const message =
    (Array.isArray(body?.message) ? body.message.join(', ') : body?.message) ||
    response.statusText ||
    'Request failed';
  const currentVersion = body?.currentVersion;

  throw new ApiError(status, code, message, currentVersion, body);
}

export function createApiMiddleware(): Middleware {
  return {
    async onRequest({ request }) {
      const authProvider = getAuthTokenProvider();
      const workspaceProvider = getWorkspaceProvider();

      const accessToken = authProvider?.getAccessToken();
      if (accessToken) {
        request.headers.set('Authorization', `Bearer ${accessToken}`);
      }

      const activeWorkspaceId = workspaceProvider?.getActiveWorkspaceId();
      if (activeWorkspaceId) {
        request.headers.set('X-Workspace-Id', activeWorkspaceId);
      } else {
        request.headers.delete('X-Workspace-Id');
      }

      return request;
    },

    async onResponse({ request, response }) {
      // On 401 (except for /auth/login, /auth/register and /auth/refresh)
      if (response.status === 401 && !isAuthEndpoint(request.url)) {
        const isRetry = request.headers.get('x-is-retry') === 'true';

        if (isRetry) {
          getAuthTokenProvider()?.clearSession();
          redirectToLogin();
          throw new ApiError(401, 'UNAUTHORIZED', 'Unauthorized after retry');
        }

        try {
          const newAccessToken = await refreshTokens(env.VITE_API_URL);

          const retryHeaders = new Headers(request.headers);
          retryHeaders.set('Authorization', `Bearer ${newAccessToken}`);
          retryHeaders.set('x-is-retry', 'true');

          const retryRequest = new Request(request.url, {
            method: request.method,
            headers: retryHeaders,
            body: request.body,
            // @ts-expect-error duplex is valid in Node/fetch for streaming bodies
            duplex: 'half',
          });

          const retriedResponse = await fetch(retryRequest);
          if (retriedResponse.ok) {
            return retriedResponse;
          }

          return handleNon2xxResponse(retriedResponse);
        } catch (error) {
          if (error instanceof ApiError) {
            throw error;
          }
          throw new ApiError(401, 'UNAUTHORIZED', (error as Error).message || 'Refresh failed');
        }
      }

      if (!response.ok) {
        return handleNon2xxResponse(response);
      }

      return response;
    },
  };
}

export const client = createClient<paths>({
  baseUrl: env.VITE_API_URL,
  fetch: (request) => fetch(request),
});

client.use(createApiMiddleware());
