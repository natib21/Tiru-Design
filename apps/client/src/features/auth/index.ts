import { setAuthTokenProvider } from '@/shared/api';
import { useAuthStore } from './auth-store';

// Register auth provider with shared api layer
setAuthTokenProvider({
  getAccessToken: () => useAuthStore.getState().accessToken,
  getRefreshToken: () => useAuthStore.getState().refreshToken,
  setTokens: (tokens) => useAuthStore.getState().setTokens(tokens),
  clearSession: () => useAuthStore.getState().clearSession(),
});

export { authApi, initializeUserSession } from '@/features/auth/api/auth-api';
export { restoreSession, resetRestoreState } from '@/features/auth/session-restore';
export { applyApiErrors } from '@/features/auth/utils/apply-api-errors';
export {
  useForgotPassword,
  useLogin,
  useLogout,
  useResetPassword,
  useSession,
  useSignup,
  useVerifyEmail,
  useVerifyPhone,
} from '@/features/auth/hooks/use-auth';
export {
  forgotPasswordSchema,
  loginSchema,
  loginFormSchema,
  resetPasswordSchema,
  signupSchema,
  signupFormSchema,
  verifyEmailSchema,
  verifyPhoneSchema,
} from '@/features/auth/schemas/auth';
export type { Session, SessionUser } from '@/features/auth/types/session';
export { useAuthStore, type AuthUser } from '@/features/auth/auth-store';
export { authQueryKeys } from '@/features/auth/query-keys';
export { LoginForm } from '@/features/auth/components/LoginForm';
export { SignupForm } from '@/features/auth/components/SignupForm';
