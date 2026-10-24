import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/features/auth/auth-store';
import { authApi } from '@/features/auth/api/auth-api';
import {
  loginFormSchema,
  type LoginFormValues,
} from '@/features/auth/schemas/auth';
import {
  mapAuthErrorToState,
  type AuthFormState,
} from '@/features/auth/utils/auth-error-mapper';
import {
  CountdownTimer,
  GoogleButton,
  AuthLeftPanel,
} from '@/shared/ui';

export default function LoginPage() {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setTokens = useAuthStore((s) => s.setTokens);

  const [formState, setFormState] = useState<AuthFormState>('default');
  const [showPassword, setShowPassword] = useState(false);
  const [bannerError, setBannerError] = useState<{ title: string; desc: string } | null>(null);
  const [passwordFieldError, setPasswordFieldError] = useState<string | null>(null);
  const [lockoutDuration, setLockoutDuration] = useState<number>(900);

  const showGoogleAuth = import.meta.env.VITE_GOOGLE_AUTH_ENABLED === 'true';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setFormState('loading');
    setBannerError(null);
    setPasswordFieldError(null);

    try {
      const response = await authApi.login({
        identifier: data.email,
        password: data.password,
      });

      setTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });

      const redirectPath = searchParams.get('redirect') || '/dashboard';
      navigate(redirectPath, { replace: true });
    } catch (err: unknown) {
      const mapped = mapAuthErrorToState(err);
      setFormState(mapped.state);

      if (mapped.state === 'account_locked') {
        setLockoutDuration(mapped.lockoutSeconds || 900);
        setBannerError({
          title: t('accountLockedTitle', 'Account temporarily locked'),
          desc: t(
            'accountLockedDesc',
            'Too many failed login attempts. Please wait 15 minutes before trying again or reset your credentials now.'
          ),
        });
      } else if (mapped.state === 'incorrect_password') {
        setBannerError({
          title: t('authFailedTitle', 'Authentication failed'),
          desc: t('authFailedDesc', 'Please check your credentials.'),
        });
        setPasswordFieldError(t('incorrectPassword', 'Incorrect password. Please try again.'));
      } else if (mapped.state === 'network_error') {
        setBannerError({
          title: t('common.couldntConnect', "Couldn't connect"),
          desc: t(
            'common.networkErrorDesc',
            'Check your internet connection and try again. Your details are still here.'
          ),
        });
      } else {
        setBannerError({
          title: t('authFailedTitle', 'Authentication failed'),
          desc: mapped.message,
        });
      }
    }
  };

  const handleLockoutExpired = () => {
    setFormState('default');
    setBannerError(null);
  };

  const isLocked = formState === 'account_locked';
  const isLoading = formState === 'loading';

  return (
    <div className="flex w-full flex-col lg:flex-row lg:items-center lg:gap-12">
      {/* Desktop Artboard Preview Left Column */}
      <AuthLeftPanel />

      {/* Right Column / Mobile Form Card */}
      <div className="mx-auto w-full max-w-md">
        <div className="w-full rounded-2xl border border-[#BEC7D3] bg-white p-6 sm:p-8 shadow-sm">
          {/* Top Badges & Heading */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-[#006399]">
                <span className="h-2 w-2 rounded-full bg-[#006399]" aria-hidden="true" />
                {t('versionBadge', 'Tiru Studio v2.4')}
              </span>
              <span className="rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-semibold text-[#D97706]">
                {t('welcomePill', 'Welcome Back')}
              </span>
            </div>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#0f172a] sm:text-3xl">
              {t('welcomeTitle', 'Welcome back')}
            </h2>
            <p className="mt-1 text-sm text-[#3F4851]">
              {t('loginSubtitle', 'Log in to continue designing — access your templates, assets, and Ethiopian font libraries.')}
            </p>
          </div>

          {/* Account Locked Alert */}
          {isLocked && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-6 rounded-xl border border-[#DC2626]/20 bg-[#FEE2E2] p-4 text-[#0f172a]"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#DC2626] text-white">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-[#DC2626]">
                    {bannerError?.title || t('accountLockedTitle', 'Account temporarily locked')}
                  </h3>
                  <p className="mt-1 text-xs text-[#3F4851] leading-relaxed">
                    {bannerError?.desc || t('accountLockedDesc', 'Too many failed login attempts.')}
                  </p>
                  <div className="mt-3 flex items-center justify-between rounded-lg bg-white/80 px-3 py-2 text-xs font-medium text-[#DC2626] border border-[#DC2626]/20">
                    <span className="flex items-center gap-1.5">
                      <svg className="h-4 w-4 animate-spin text-[#DC2626]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
                      </svg>
                      {t('securityLockout', 'Security Lockout')}
                    </span>
                    <CountdownTimer initialSeconds={lockoutDuration} onZero={handleLockoutExpired} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Authentication Failed / Network Error Banner */}
          {!isLocked && bannerError && (
            <div
              role="alert"
              aria-live="assertive"
              className={`mb-6 rounded-xl border p-4 ${
                formState === 'network_error'
                  ? 'border-amber-200 bg-amber-50 text-amber-900'
                  : 'border-[#DC2626]/20 bg-[#FEE2E2] text-[#0f172a]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white ${
                    formState === 'network_error' ? 'bg-[#D97706]' : 'bg-[#DC2626]'
                  }`}
                >
                  {formState === 'network_error' ? (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <line x1="1" y1="1" x2="23" y2="23" />
                      <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
                      <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
                      <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
                      <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
                      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                      <line x1="12" y1="20" x2="12.01" y2="20" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold">{bannerError.title}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#3F4851]">
                    {bannerError.desc}
                  </p>
                  {formState === 'network_error' && (
                    <button
                      type="button"
                      onClick={() => handleSubmit(onSubmit)()}
                      className="mt-2.5 inline-flex min-h-[44px] items-center rounded-md bg-[#006399] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#001D32]"
                    >
                      {t('common.tryAgain', 'Try again')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Google Auth Button (only rendered when VITE_GOOGLE_AUTH_ENABLED === 'true') */}
          {showGoogleAuth && !isLocked && (
            <div className="mb-6 space-y-4">
              <GoogleButton
                disabled={isLoading}
                onClick={() => authApi.googleLogin()}
              />
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-[#BEC7D3]/60" />
                <span className="relative bg-white px-3 text-xs font-medium text-[#3F4851]">
                  {t('orDivider', 'OR •')}
                </span>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            aria-label="Sign in"
            noValidate
            className="space-y-4"
          >
            {/* Email Address */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-email"
                  className="text-sm font-medium text-[#0f172a]"
                >
                  {t('emailLabel', 'Email address')}
                </label>
                {isLocked && (
                  <span className="text-xs font-medium text-emerald-700">
                    ✓ {t('verifiedId', 'Verified ID')}
                  </span>
                )}
              </div>
              <div className="relative">
                <span
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#3F4851]"
                  aria-hidden="true"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  disabled={isLoading || isLocked}
                  placeholder={t('emailPlaceholder', 'alex@example.com')}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'login-email-error' : undefined}
                  {...register('email')}
                  className={`min-h-[44px] w-full rounded-md border pl-10 pr-3 text-base text-[#0f172a] placeholder:text-[#3F4851]/50 focus:outline-none ${
                    errors.email
                      ? 'border-[#DC2626] bg-[#FEE2E2]/20 focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]'
                      : 'border-[#BEC7D3] bg-white focus:border-[#006399] focus:ring-1 focus:ring-[#006399]'
                  } ${isLoading || isLocked ? 'cursor-not-allowed bg-[#F7F9FB] opacity-60' : ''}`}
                />
              </div>
              {errors.email && (
                <p id="login-email-error" role="alert" className="mt-1 text-xs text-[#DC2626]">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="text-sm font-medium text-[#0f172a]"
                >
                  {t('passwordLabel', 'Password')}
                </label>
                {isLocked && (
                  <span className="text-xs font-semibold text-[#DC2626]">
                    {t('accountFrozen', 'Account Frozen')}
                  </span>
                )}
              </div>
              <div className="relative">
                <span
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#3F4851]"
                  aria-hidden="true"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  disabled={isLoading || isLocked}
                  placeholder={t('passwordPlaceholder', 'Enter your password')}
                  aria-invalid={Boolean(errors.password || passwordFieldError)}
                  aria-describedby={
                    errors.password || passwordFieldError ? 'login-password-error' : undefined
                  }
                  {...register('password')}
                  className={`min-h-[44px] w-full rounded-md border pl-10 pr-12 text-base text-[#0f172a] placeholder:text-[#3F4851]/50 focus:outline-none ${
                    errors.password || passwordFieldError
                      ? 'border-[#DC2626] bg-[#FEE2E2]/20 focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]'
                      : 'border-[#BEC7D3] bg-white focus:border-[#006399] focus:ring-1 focus:ring-[#006399]'
                  } ${isLoading || isLocked ? 'cursor-not-allowed bg-[#F7F9FB] opacity-60' : ''}`}
                />
                <button
                  type="button"
                  disabled={isLoading || isLocked}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-0 top-0 flex min-h-[44px] min-w-[44px] items-center justify-center text-[#3F4851] hover:text-[#0f172a]"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Error Message */}
              {(errors.password || passwordFieldError) && (
                <p id="login-password-error" role="alert" className="mt-1 flex items-center gap-1.5 text-xs text-[#DC2626]">
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errors.password?.message || passwordFieldError}</span>
                </p>
              )}
            </div>

            {/* Forgot password link */}
            <div className="flex items-center justify-end pt-1">
              <Link
                to="/forgot-password"
                className="inline-flex min-h-[44px] items-center text-xs font-medium text-[#006399] hover:underline"
              >
                {t('forgotPassword', 'Forgot password?')}
              </Link>
            </div>

            {/* Submit / Lockout Actions */}
            <div className="pt-2">
              {isLocked ? (
                <div className="space-y-3">
                  <button
                    type="button"
                    disabled
                    className="flex min-h-[44px] w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-[#BEC7D3]/50 px-4 py-2.5 text-sm font-semibold text-[#3F4851]"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>
                      {t('loginUnavailable', 'Log in unavailable')} (
                      <CountdownTimer initialSeconds={lockoutDuration} onZero={handleLockoutExpired} />)
                    </span>
                  </button>

                  <Link
                    to="/forgot-password"
                    className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[#006399] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#001D32] transition-colors"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2.5 2v6h6M21.5 22v-6h-6" />
                      <path d="M22 11.5A10 10 0 0 0 3.2 7.2M2 12.5a10 10 0 0 0 18.8 4.2" />
                    </svg>
                    <span>{t('resetPasswordBtn', 'Reset your password')}</span>
                  </Link>

                  {/* Why did this happen educational box */}
                  <div className="mt-4 rounded-xl border border-[#BEC7D3]/60 bg-[#F7F9FB] p-4 text-xs text-[#3F4851]">
                    <div className="flex items-center gap-2 font-semibold text-[#0f172a]">
                      <svg className="h-4 w-4 text-[#D97706]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      <h4>{t('common.whyDidThisHappen', 'Why did this happen?')}</h4>
                    </div>
                    <p className="mt-1.5 leading-relaxed">
                      {t(
                        'common.whyLockoutDesc',
                        'To protect your Ethiopian fonts, saved brand kits, and payment methods, TiruDesign halts access after 5 incorrect password inputs. You can instantly bypass this freeze by clicking Reset your password above.'
                      )}
                    </p>
                    <a
                      href="mailto:support@tirudesign.com"
                      className="mt-2.5 inline-flex min-h-[44px] items-center text-xs font-semibold text-[#006399] hover:underline"
                    >
                      {t('common.needHelp', 'Need help? Contact support')}
                    </a>
                  </div>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[#006399] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#001D32] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006399] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>{t('signingIn', 'Signing in...')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('loginButton', 'Log in')}</span>
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Loading Hint */}
          {isLoading && (
            <p className="mt-3 text-center text-xs text-[#3F4851]">
              {t('signingInHint', "Please wait. We're signing you in securely.")}
            </p>
          )}

          {/* Mobile Promo Banner (per 01-login-default-mobile.png) */}
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-[#BEC7D3]/60 bg-[#F7F9FB] p-3 text-xs">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#0f172a]">
                <span>{t('promoTitle', 'Ethiopian Creative Suite')}</span>
                <span className="rounded bg-[#FEF3C7] px-1.5 py-0.2 text-[10px] font-bold text-[#D97706]">
                  {t('promoBadge', 'PRO')}
                </span>
              </div>
              <p className="text-[11px] text-[#3F4851]">
                {t('promoDesc', "Native Ge'ez typography • 80+ Localized assets")}
              </p>
            </div>
          </div>

          {/* Bottom Signup Link Card */}
          <div className="mt-6 rounded-lg bg-sky-50/60 p-3 text-center text-sm">
            <span className="text-[#3F4851]">{t('noAccount', "Don't have an account?")} </span>
            <Link
              to="/signup"
              className="inline-flex min-h-[44px] items-center font-semibold text-[#006399] hover:underline"
            >
              {t('signupLink', 'Sign up')}
            </Link>
          </div>

          {/* Security Footer Note */}
          <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[11px] text-[#3F4851]">
            <svg className="h-3.5 w-3.5 text-[#22C55E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>{t('securityFooter', '256-bit Secure • Addis Ababa, ET')}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
