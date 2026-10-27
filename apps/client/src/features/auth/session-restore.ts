import { env } from '@/shared/config/env';
import { refreshTokens } from '@/shared/api/refresh';
import { client } from '@/shared/api/client';
import { useAuthStore, getTokenStorage, type AuthUser } from './auth-store';

let restorePromise: Promise<AuthUser | null> | null = null;
let restoreCompleted = false;

/**
 * Single-flight module-level session restore.
 * Ensures that even in React StrictMode (effects executing twice),
 * exactly ONE refresh call is dispatched to the backend, followed by GET /auth/me.
 */
export function restoreSession(): Promise<AuthUser | null> {
  const storedRefreshToken = getTokenStorage().getRefreshToken();

  if (!storedRefreshToken) {
    useAuthStore.getState().setIsRestoring(false);
    useAuthStore.getState().setIsRestored(true);
    return Promise.resolve(null);
  }

  if (restoreCompleted) {
    return Promise.resolve(useAuthStore.getState().user);
  }

  if (restorePromise) {
    return restorePromise;
  }

  useAuthStore.getState().setIsRestoring(true);

  restorePromise = (async () => {
    try {
      // 1. Call refresh ONCE
      await refreshTokens(env.VITE_API_URL);

      // 2. Fetch /auth/me
      const meResponse = await client.GET('/auth/me');
      if (meResponse.data) {
        const user = meResponse.data as unknown as AuthUser;
        useAuthStore.getState().setUser(user);
        return user;
      }
      return null;
    } catch {
      useAuthStore.getState().clearSession();
      return null;
    } finally {
      restoreCompleted = true;
      restorePromise = null;
      useAuthStore.getState().setIsRestoring(false);
      useAuthStore.getState().setIsRestored(true);
    }
  })();

  return restorePromise;
}

export function resetRestoreState(): void {
  restorePromise = null;
  restoreCompleted = false;
}
