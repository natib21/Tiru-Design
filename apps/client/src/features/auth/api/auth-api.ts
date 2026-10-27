import { client, ApiError } from '@/shared/api';
import { env } from '@/shared/config/env';
import { useAuthStore, type AuthUser } from '@/features/auth/auth-store';
import { useActiveWorkspaceStore } from '@/features/workspaces/active-workspace';
import { resetRestoreState } from '@/features/auth/session-restore';
import { redirectToLogin } from '@/shared/api/refresh';
import type {
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
  VerifyPhoneInput,
} from '@/features/auth/schemas/auth';
import type { Session, SessionResponse } from '@/features/auth/types/session';

export interface LoginRequestBody {
  identifier: string;
  password: string;
}

export interface RegisterRequestBody {
  email: string;
  phoneNumber: string;
  password: string;
}

export interface AuthSessionData {
  user?: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresAt?: string;
}

type GenericPostCaller = (
  url: string,
  options?: {
    body?: unknown;
    params?: { header?: Record<string, string> };
    signal?: AbortSignal;
  }
) => Promise<{ data?: unknown; error?: unknown }>;

const clientPost = client.POST as unknown as GenericPostCaller;

/**
 * Common post-login / post-signup pipeline:
 * 1. Store tokens in auth store
 * 2. Fetch GET /auth/me
 * 3. Fetch GET /workspaces
 * 4. Set active workspace to the personal one
 */
export async function initializeUserSession(tokens: {
  accessToken: string;
  refreshToken?: string | null;
}): Promise<{ user: AuthUser; activeWorkspaceId: string | null }> {
  useAuthStore.getState().setTokens(tokens);

  // 1. Load GET /auth/me
  const meResponse = await client.GET('/auth/me');
  const user = (meResponse.data as unknown as AuthUser) || {
    id: 'user-default',
    email: '',
  };
  useAuthStore.getState().setUser(user);

  // 2. Load GET /workspaces
  const workspacesResponse = await client.GET('/workspaces');
  const workspaces = (workspacesResponse.data || []) as Array<{
    id: string;
    type: string;
    name: string;
  }>;

  // 3. Set active workspace to the personal one
  const personalWorkspace =
    workspaces.find((w) => w.type === 'PERSONAL') || workspaces[0];
  const activeWorkspaceId = personalWorkspace?.id ?? null;

  if (activeWorkspaceId) {
    useActiveWorkspaceStore.getState().setActiveWorkspaceId(activeWorkspaceId);
  }

  return { user, activeWorkspaceId };
}

export const authApi = {
  async getSession(signal?: AbortSignal): Promise<Session | null> {
    try {
      const response = await client.GET('/auth/me', { signal });
      if (response.data) {
        return { user: response.data as unknown as Session['user'] };
      }
      return null;
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 404)) {
        return null;
      }
      throw error;
    }
  },

  async login(body: LoginRequestBody): Promise<AuthSessionData> {
    const cleanIdentifier = body.identifier.trim().toLowerCase();

    const response = await clientPost('/auth/login', {
      body: {
        identifier: cleanIdentifier,
        password: body.password,
      },
      params: {
        header: {
          'user-agent': typeof navigator !== 'undefined' ? navigator.userAgent : 'TiruDesign',
        },
      },
    });

    if (response.error) {
      throw new ApiError(400, 'BAD_REQUEST', 'Login failed');
    }

    const data = response.data as AuthSessionData;
    await initializeUserSession({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });

    return data;
  },

  async signup(body: RegisterRequestBody): Promise<AuthSessionData> {
    const cleanEmail = body.email.trim().toLowerCase();
    const cleanPhone = body.phoneNumber.trim();

    const response = await clientPost('/auth/register', {
      body: {
        email: cleanEmail,
        phoneNumber: cleanPhone,
        password: body.password,
      },
      params: {
        header: {
          'user-agent': typeof navigator !== 'undefined' ? navigator.userAgent : 'TiruDesign',
        },
      },
    });

    if (response.error) {
      throw new ApiError(400, 'BAD_REQUEST', 'Registration failed');
    }

    const data = response.data as {
      user?: AuthUser;
      accessToken?: string;
      refreshToken?: string;
    };

    // If sign-up returns no tokens, log in with the same credentials right after!
    if (!data.accessToken || !data.refreshToken) {
      return authApi.login({
        identifier: cleanEmail,
        password: body.password,
      });
    }

    await initializeUserSession({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });

    return data as AuthSessionData;
  },

  async logout(): Promise<void> {
    try {
      await clientPost('/auth/logout', {});
    } catch {
      // Ignore failure: clear state unconditionally
    } finally {
      useAuthStore.getState().clearSession();
      useActiveWorkspaceStore.getState().clearActiveWorkspace();
      resetRestoreState();
      redirectToLogin();
    }
  },

  async getMe(): Promise<AuthUser | null> {
    const response = await client.GET('/auth/me');
    return (response.data as unknown as AuthUser) || null;
  },

  async verifyPhone(input: VerifyPhoneInput): Promise<SessionResponse> {
    const response = await clientPost('/auth/verify-phone', { body: input });
    return response.data as SessionResponse;
  },

  async verifyEmail(input: VerifyEmailInput): Promise<SessionResponse> {
    const response = await clientPost('/auth/verify-email', { body: input });
    return response.data as SessionResponse;
  },

  async forgotPassword(input: ForgotPasswordInput): Promise<void> {
    await clientPost('/auth/forgot-password', { body: input });
  },

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    await clientPost('/auth/reset-password', { body: input });
  },

  googleLogin(): void {
    if (typeof window !== 'undefined') {
      const baseUrl = env.VITE_API_URL.replace(/\/api$/, '');
      window.location.href = `${baseUrl}/api/auth/google`;
    }
  },
};

export default authApi;
