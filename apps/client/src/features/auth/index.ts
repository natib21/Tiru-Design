import { setAuthTokenProvider } from '@/shared/api';
import { useAuthStore } from './auth-store';

// Register auth provider with shared api layer
setAuthTokenProvider({
  getAccessToken: () => useAuthStore.getState().accessToken,
  getRefreshToken: () => useAuthStore.getState().refreshToken,
  setTokens: (tokens) => useAuthStore.getState().setTokens(tokens),
  clearSession: () => useAuthStore.getState().clearSession(),
});

export { authApi } from '@/features/auth/api/auth-api';
export { useMe } from '@/features/auth/api/useMe';
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
  resetPasswordSchema,
  signupSchema,
  verifyEmailSchema,
  verifyPhoneSchema,
} from '@/features/auth/schemas/auth';
export type { Session, SessionUser } from '@/features/auth/types/session';
export { useAuthStore } from '@/features/auth/auth-store';
export { authQueryKeys } from '@/features/auth/query-keys';

