import { ApiError } from './api-error';

export interface AuthTokenProvider {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  clearSession: () => void;
}

export interface WorkspaceProvider {
  getActiveWorkspaceId: () => string | null;
}

let authProvider: AuthTokenProvider | null = null;
let workspaceProvider: WorkspaceProvider | null = null;

export function setAuthTokenProvider(provider: AuthTokenProvider | null): void {
  authProvider = provider;
}

export function getAuthTokenProvider(): AuthTokenProvider | null {
  return authProvider;
}

export function setWorkspaceProvider(provider: WorkspaceProvider | null): void {
  workspaceProvider = provider;
}

export function getWorkspaceProvider(): WorkspaceProvider | null {
  return workspaceProvider;
}

let inFlightRefresh: Promise<string> | null = null;

export function redirectToLogin(): void {
  if (typeof window !== 'undefined' && window.location) {
    // Only redirect if not already on /login
    if (!window.location.pathname.startsWith('/login')) {
      window.location.href = '/login';
    }
  }
}

/**
 * On 401, calls /auth/refresh ONCE even if many requests fail together (shared in-flight promise).
 * The refresh token is rotated by the backend on every refresh: always store the NEW one.
 * Never send two refresh calls with the same refresh token.
 */
export async function refreshTokens(apiUrl: string): Promise<string> {
  if (inFlightRefresh) {
    return inFlightRefresh;
  }

  inFlightRefresh = (async () => {
    const refreshToken = authProvider?.getRefreshToken();

    if (!refreshToken) {
      authProvider?.clearSession();
      redirectToLogin();
      throw new ApiError(401, 'UNAUTHORIZED', 'No refresh token available');
    }

    try {
      const normalizedBase = apiUrl.replace(/\/$/, '');
      const response = await fetch(`${normalizedBase}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        let errorBody: Record<string, unknown> | null = null;
        try {
          errorBody = (await response.json()) as Record<string, unknown>;
        } catch {
          // not json
        }
        const status = response.status;
        const code = (errorBody?.error as string) || (errorBody?.code as string) || 'UNAUTHORIZED';
        const message =
          (Array.isArray(errorBody?.message) ? errorBody.message.join(', ') : (errorBody?.message as string)) ||
          'Failed to refresh token';

        throw new ApiError(status, code, message, errorBody?.currentVersion, errorBody);
      }

      const data = (await response.json()) as {
        accessToken: string;
        refreshToken: string;
      };

      if (!data.accessToken || !data.refreshToken) {
        throw new ApiError(500, 'INVALID_REFRESH_RESPONSE', 'Invalid tokens returned from refresh endpoint');
      }

      // Always store the NEW rotated refresh token and access token
      authProvider?.setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      return data.accessToken;
    } catch (error) {
      authProvider?.clearSession();
      redirectToLogin();
      throw error;
    } finally {
      inFlightRefresh = null;
    }
  })();

  return inFlightRefresh;
}
