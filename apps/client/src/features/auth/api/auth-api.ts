import { client, ApiError } from '@/shared/api';
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
  user: {
    id: string;
    email: string;
    phoneNumber: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    status: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
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
    const response = await clientPost('/auth/login', {
      body,
      params: {
        header: {
          'user-agent': typeof navigator !== 'undefined' ? navigator.userAgent : 'TiruDesign',
        },
      },
    });

    if (response.error) {
      throw new ApiError(400, 'BAD_REQUEST', 'Login failed');
    }

    return response.data as AuthSessionData;
  },

  async signup(body: RegisterRequestBody): Promise<AuthSessionData> {
    const response = await clientPost('/auth/register', {
      body,
      params: {
        header: {
          'user-agent': typeof navigator !== 'undefined' ? navigator.userAgent : 'TiruDesign',
        },
      },
    });

    if (response.error) {
      throw new ApiError(400, 'BAD_REQUEST', 'Registration failed');
    }

    return response.data as AuthSessionData;
  },

  async logout(): Promise<void> {
    await clientPost('/auth/logout', {});
  },

  async getMe() {
    const response = await client.GET('/auth/me');
    return response.data;
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
      const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api$/, '');
      window.location.href = `${baseUrl}/api/auth/google`;
    }
  },
};

export default authApi;
