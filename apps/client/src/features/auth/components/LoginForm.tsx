import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { authApi } from '@/features/auth/api/auth-api';
import {
  loginFormSchema,
  type LoginFormValues,
} from '@/features/auth/schemas/auth';
import {
  applyApiErrors,
  type BannerErrorInfo,
} from '@/features/auth/utils/apply-api-errors';
import {
  Button,
  Input,
  GoogleButton,
  CountdownTimer,
} from '@/shared/ui';
import { FormField } from '@/shared/ui/form';

export function LoginForm() {
  const { t } = useTranslation(['auth', 'common']);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [bannerError, setBannerError] = useState<BannerErrorInfo | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutDuration, setLockoutDuration] = useState(900);

  const showGoogleAuth = import.meta.env.VITE_GOOGLE_AUTH_ENABLED === 'true';
  const showForgotPassword = import.meta.env.VITE_FORGOT_PASSWORD_ENABLED === 'true';

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setBannerError(null);

    try {
      await authApi.login({
        identifier: data.email,
        password: data.password,
      });

      // Navigate to intended destination or /dashboard
      const fromLocation =
        (location.state as { from?: string } | null)?.from ||
        searchParams.get('redirect') ||
        '/dashboard';

      navigate(fromLocation, { replace: true });
    } catch (err: unknown) {
      applyApiErrors({
        error: err,
        setError,
        setBannerError,
        setLockoutDuration,
        onLockout: () => setIsLocked(true),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Registration success alert */}
      {searchParams.get('registered') === 'true' && !bannerError && !isLocked && (
        <div
          role="status"
          className="mb-6 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900"
        >
          <div className="flex items-center gap-2.5">
            <svg className="h-5 w-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-medium">
              {t('registeredSuccess', 'Account created successfully! Please sign in.')}
            </p>
          </div>
        </div>
      )}

      {/* Account Locked (429) */}
      {isLocked && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 rounded-xl border border-danger/20 bg-danger-surface p-4 text-foreground"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-danger text-white">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-danger-text">
                {bannerError?.title || t('accountLockedTitle', 'Account temporarily locked')}
              </h3>
              <p className="mt-1 text-xs text-text leading-relaxed">
                {bannerError?.desc || t('accountLockedDesc', 'Too many attempts. Please try again later.')}
              </p>
              <div className="mt-3 flex items-center justify-between rounded-lg bg-white/80 px-3 py-2 text-xs font-medium text-danger-text border border-danger/20">
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 animate-spin text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
                  </svg>
                  {t('securityLockout', 'Security Lockout')}
                </span>
                <CountdownTimer
                  initialSeconds={lockoutDuration}
                  onZero={() => {
                    setIsLocked(false);
                    setBannerError(null);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banner Error (401 Generic, 503, Network) */}
      {!isLocked && bannerError && (
        <div
          role="alert"
          aria-live="assertive"
          className={`mb-6 rounded-xl border p-4 ${
            bannerError.retryable
              ? 'border-amber-200 bg-amber-50 text-amber-900'
              : 'border-danger/20 bg-danger-surface text-foreground'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white ${
                bannerError.retryable ? 'bg-warning-text' : 'bg-danger'
              }`}
            >
              {bannerError.retryable ? (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1="1" y1="1" x2="23" y2="23" />
                  <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
                  <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
                  <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
                  <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                  <line x1="12" y1="20" x2="12.01" y2="20" />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h3 className={`text-sm font-bold ${!bannerError.retryable ? 'text-danger-text' : ''}`}>
                {bannerError.title}
              </h3>
              <p className="mt-0.5 text-xs leading-relaxed text-text">
                {bannerError.desc}
              </p>
              {bannerError.retryable && (
                <button
                  type="button"
                  onClick={() => handleSubmit(onSubmit)()}
                  className="mt-2.5 inline-flex min-h-[44px] items-center rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-primary-deep"
                >
                  {t('common.tryAgain', 'Try again')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Google Auth Button (Disabled by default, hidden behind flag) */}
      {showGoogleAuth && (
        <div className="mb-6">
          <GoogleButton
            onClick={() => authApi.googleLogin()}
            text={t('continueWithGoogle', 'Continue with Google')}
          />
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <span className="relative bg-white px-3 text-xs font-bold uppercase tracking-wider text-text-tertiary">
              {t('orDividerDesktop', 'OR LOG IN WITH EMAIL')}
            </span>
          </div>
        </div>
      )}

      {/* Credentials Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          id="login-email"
          label={t('emailLabel', 'Email address')}
          error={errors.email?.message}
        >
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            disabled={isLoading || isLocked}
            placeholder={t('emailPlaceholder', 'alex@example.com')}
            hasError={Boolean(errors.email)}
            {...register('email')}
          />
        </FormField>

        <FormField
          id="login-password"
          label={t('passwordLabel', 'Password')}
          error={errors.password?.message}
        >
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              disabled={isLoading || isLocked}
              placeholder={t('passwordPlaceholder', 'Enter your password')}
              hasError={Boolean(errors.password)}
              className="pr-10"
              {...register('password')}
            />
            <button
              type="button"
              disabled={isLoading || isLocked}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-foreground p-1 focus:outline-none"
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </FormField>

        <div className="flex items-center justify-end pt-1">
          {showForgotPassword ? (
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-primary hover:text-primary-deep"
            >
              {t('forgotPassword', 'Forgot password?')}
            </Link>
          ) : (
            <span
              className="text-xs font-medium text-text-disabled cursor-not-allowed select-none"
              title="Password recovery is currently unavailable"
            >
              {t('forgotPassword', 'Forgot password?')}
            </span >
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          disabled={isLoading || isLocked}
          className="w-full mt-2 font-bold"
        >
          {isLocked
            ? t('loginUnavailable', 'Log in unavailable')
            : isLoading
            ? t('signingIn', 'Signing in...')
            : t('loginButton', 'Log in')}
        </Button>
      </form>

      {/* Footer link to sign up */}
      <div className="mt-6 text-center text-xs text-text-secondary">
        <span>{t('noAccount', "Don't have an account?")} </span>
        <Link
          to="/signup"
          className="font-bold text-primary hover:text-primary-deep underline-offset-4 hover:underline"
        >
          {t('signupLink', 'Sign up')}
        </Link>
      </div>
    </div>
  );
}

export default LoginForm;
