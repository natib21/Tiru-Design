import { AUTH_ENDPOINTS } from '@/constants/app';
import { apiClient } from '@/lib/api/client';
import { isApiError } from '@/lib/api/errors';
import type {
  ForgotPasswordInput,
  LoginInput,
  ResetPasswordInput,
  SignupInput,
  VerifyEmailInput,
  VerifyPhoneInput,
} from '@/features/auth/schemas/auth';
import type { Session, SessionResponse } from '@/features/auth/types/session';

export const authApi = {
  async getSession(signal?: AbortSignal): Promise<Session | null> {
    try {
      const response = await apiClient.get<SessionResponse>(AUTH_ENDPOINTS.session, {
        signal,
        skipAuthRedirect: true,
      });
      return response.user ? { user: response.user } : null;
    } catch (error) {
      if (isApiError(error) && (error.code === 'unauthorized' || error.code === 'not_found')) {
        return null;
      }
      throw error;
    }
  },
  login(input: LoginInput) {
    return apiClient.post<Session>(AUTH_ENDPOINTS.login, input);
  },
  signup(input: SignupInput) {
    return apiClient.post<Session>(AUTH_ENDPOINTS.signup, input);
  },
  logout() {
    return apiClient.post<void>(AUTH_ENDPOINTS.logout);
  },
  verifyPhone(input: VerifyPhoneInput) {
    return apiClient.post<Session>(AUTH_ENDPOINTS.verifyPhone, input);
  },
  verifyEmail(input: VerifyEmailInput) {
    return apiClient.post<Session>(AUTH_ENDPOINTS.verifyEmail, input);
  },
  forgotPassword(input: ForgotPasswordInput) {
    return apiClient.post<void>(AUTH_ENDPOINTS.forgotPassword, input);
  },
  resetPassword(input: ResetPasswordInput) {
    return apiClient.post<void>(AUTH_ENDPOINTS.resetPassword, {
      token: input.token,
      password: input.password,
    });
  },
  googleLogin() {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, '')}${AUTH_ENDPOINTS.google}`;
  },
};
