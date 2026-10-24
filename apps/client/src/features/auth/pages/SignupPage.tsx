import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/features/auth/auth-store';
import { authApi } from '@/features/auth/api/auth-api';
import {
  signupFormSchema,
  type SignupFormValues,
} from '@/features/auth/schemas/auth';
import {
  mapAuthErrorToState,
  type AuthFormState,
} from '@/features/auth/utils/auth-error-mapper';
import {
  PasswordStrengthBar,
  PhoneInput,
  GoogleButton,
  AuthLeftPanel,
} from '@/shared/ui';

export default function SignupPage() {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const setTokens = useAuthStore((s) => s.setTokens);

  const [formState, setFormState] = useState<AuthFormState>('default');
  const [showPassword, setShowPassword] = useState(false);
  const [bannerError, setBannerError] = useState<{ title: string; desc: string } | null>(null);

  const showGoogleAuth = import.meta.env.VITE_GOOGLE_AUTH_ENABLED === 'true';

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: '',
      phone: '',
      password: '',
      agreeTerms: false,
    },
  });

  const passwordValue = watch('password') || '';

  // Calculate password strength
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '' };
    let score = 1;
    if (pwd.length >= 8) score++;
    if (/\d/.test(pwd) && /[a-zA-Z]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd) || pwd.length >= 12) score++;

    const labels = [
      '',
      t('strengthCritical', 'Strength: Critical'),
      t('strengthWeak', 'Strength: Weak'),
      t('strengthMedium', 'Strength: Medium'),
      t('strengthStrong', 'Strength: Strong'),
    ];

    return { score, label: labels[score] };
  };

  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data: SignupFormValues) => {
    setFormState('loading');
    setBannerError(null);

    try {
      // Send phone number formatted with Ethiopian country prefix +251
      const formattedPhone = `+251${data.phone}`;

      const response = await authApi.signup({
        email: data.email,
        phoneNumber: formattedPhone,
        password: data.password,
      });

      setTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });

      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const mapped = mapAuthErrorToState(err);
      setFormState(mapped.state);

      if (mapped.state === 'network_error') {
        setBannerError({
          title: t('common.couldntConnect', "Couldn't connect"),
          desc: t(
            'common.networkErrorDesc',
            'Check your internet connection and try again. Your details are still here.'
          ),
        });
      } else {
        setBannerError({
          title: t('fixErrorsBannerTitle', 'Please fix the errors below'),
          desc: mapped.message,
        });
      }
    }
  };

  const isLoading = formState === 'loading';
  const hasErrors = Object.keys(errors).length > 0 || bannerError !== null;

  return (
    <div className="flex w-full flex-col lg:flex-row lg:items-center lg:gap-12">
      {/* Desktop Split Artwork (Derived Layout from Desktop Login) */}
      <AuthLeftPanel />

      {/* Right Column / Mobile Form Card */}
      <div className="mx-auto w-full max-w-md">
        <div className="w-full rounded-2xl border border-[#BEC7D3] bg-white p-6 sm:p-8 shadow-sm">
          {/* Header Badges & Title */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-[#D97706]">
              <span className="h-2 w-2 rounded-full bg-[#D97706]" aria-hidden="true" />
              {t('hubBadge', 'ADDIS CREATIVE HUB')}
            </div>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#0f172a] sm:text-3xl">
              {t('createAccountTitle', 'Create your account')}
            </h2>
            <p className="mt-1 text-sm text-[#3F4851]">
              {t('signupSubtitle', 'Start designing in Amharic & English')}
            </p>
          </div>

          {/* Validation Error Summary Banner */}
          {hasErrors && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-6 rounded-xl border border-[#DC2626]/20 bg-[#FEE2E2] p-4 text-[#0f172a]"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#DC2626] text-white">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-[#DC2626]">
                    {bannerError?.title || t('fixErrorsBannerTitle', 'Please fix the errors below')}
                  </h3>
                  <p className="mt-0.5 text-xs text-[#3F4851] leading-relaxed">
                    {bannerError?.desc ||
                      `${Object.keys(errors).length} validation items require your attention before continuing.`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Google Auth Button (rendered only if VITE_GOOGLE_AUTH_ENABLED === 'true') */}
          {showGoogleAuth && (
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

          {/* Registration Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            aria-label="Create account"
            noValidate
            className="space-y-4"
          >
            {/* Email Address */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="signup-email"
                  className="text-sm font-medium text-[#0f172a]"
                >
                  {t('emailLabel', 'Email address')} *
                </label>
                {errors.email && (
                  <span className="text-xs font-semibold text-[#DC2626]">
                    {t('invalidFormat', 'Invalid format')}
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
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  disabled={isLoading}
                  placeholder={t('emailPlaceholder', 'alex@example.com')}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'signup-email-error' : undefined}
                  {...register('email')}
                  className={`min-h-[44px] w-full rounded-md border pl-10 pr-3 text-base text-[#0f172a] placeholder:text-[#3F4851]/50 focus:outline-none ${
                    errors.email
                      ? 'border-[#DC2626] bg-[#FEE2E2]/20 focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]'
                      : 'border-[#BEC7D3] bg-white focus:border-[#006399] focus:ring-1 focus:ring-[#006399]'
                  } ${isLoading ? 'cursor-not-allowed bg-[#F7F9FB] opacity-60' : ''}`}
                />
              </div>
              {errors.email && (
                <p id="signup-email-error" role="alert" className="mt-1 text-xs text-[#DC2626]">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Number Field (+251 Ethiopian prefix) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="signup-phone"
                  className="text-sm font-medium text-[#0f172a]"
                >
                  {t('phoneLabel', 'Phone number')} *
                </label>
              </div>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    id="signup-phone"
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isLoading}
                    hasError={Boolean(errors.phone)}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'signup-phone-error' : undefined}
                  />
                )}
              />
              {errors.phone && (
                <p id="signup-phone-error" role="alert" className="mt-1 text-xs text-[#DC2626]">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Password Field with Strength Meter */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="signup-password"
                  className="text-sm font-medium text-[#0f172a]"
                >
                  {t('passwordLabel', 'Password')} *
                </label>
                {strength.score === 1 && (
                  <span className="text-xs font-semibold text-[#DC2626]">
                    {t('tooWeak', 'Too weak')}
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
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  disabled={isLoading}
                  placeholder={t('createPasswordPlaceholder', 'Create a password (min. 8 characters)')}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'signup-password-error' : undefined}
                  {...register('password')}
                  className={`min-h-[44px] w-full rounded-md border pl-10 pr-12 text-base text-[#0f172a] placeholder:text-[#3F4851]/50 focus:outline-none ${
                    errors.password
                      ? 'border-[#DC2626] bg-[#FEE2E2]/20 focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]'
                      : 'border-[#BEC7D3] bg-white focus:border-[#006399] focus:ring-1 focus:ring-[#006399]'
                  } ${isLoading ? 'cursor-not-allowed bg-[#F7F9FB] opacity-60' : ''}`}
                />
                <button
                  type="button"
                  disabled={isLoading}
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

              {/* Password Strength Indicator */}
              <div className="mt-2">
                <PasswordStrengthBar
                  score={strength.score}
                  charCount={passwordValue.length}
                  minChars={8}
                  label={strength.label}
                />
              </div>

              {errors.password ? (
                <p id="signup-password-error" role="alert" className="mt-1 text-xs text-[#DC2626]">
                  {errors.password.message}
                </p>
              ) : (
                <p className="mt-1 text-xs text-[#3F4851]">
                  {t('passwordHint', 'At least 8 characters with letters & numbers')}
                </p>
              )}
            </div>

            {/* Terms of Service Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <div className="relative flex min-h-[44px] min-w-[44px] items-center justify-center">
                  <input
                    type="checkbox"
                    disabled={isLoading}
                    aria-invalid={Boolean(errors.agreeTerms)}
                    aria-describedby={errors.agreeTerms ? 'signup-terms-error' : undefined}
                    {...register('agreeTerms')}
                    className={`h-4 w-4 rounded border ${
                      errors.agreeTerms ? 'border-[#DC2626]' : 'border-[#BEC7D3]'
                    } text-[#006399] focus:ring-[#006399]`}
                  />
                </div>
                <span className="text-xs text-[#3F4851] leading-relaxed pt-2.5">
                  {t('agreeTerms', 'I agree to the')}{' '}
                  <span className="font-semibold text-[#006399] underline cursor-pointer">
                    {t('termsLink', 'Terms of Service')}
                  </span>{' '}
                  {t('and', 'and')}{' '}
                  <span className="font-semibold text-[#006399] underline cursor-pointer">
                    {t('privacyLink', 'Privacy Policy')}
                  </span>
                </span>
              </label>
              {errors.agreeTerms && (
                <p id="signup-terms-error" role="alert" className="text-xs text-[#DC2626] ml-11">
                  {errors.agreeTerms.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
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
                    <span>{t('creatingAccount', 'Creating account...')}</span>
                  </>
                ) : (
                  <>
                    <span>{t('createAccountBtn', 'Create account')}</span>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Ethiopian Font Studio Promo Card */}
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-[#BEC7D3]/60 bg-[#F7F9FB] p-3 text-xs">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-[#D97706]">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7V4h16v3M9 20h6M12 4v16" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#0f172a]">
                <span>{t('fontStudioTitle', "300+ Ge'ez & Latin Fonts")}</span>
              </div>
              <p className="text-[11px] text-[#3F4851]">
                {t('fontStudioDesc', 'Included free with every new creator account')}
              </p>
            </div>
          </div>

          {/* Already have an account link */}
          <div className="mt-6 rounded-lg bg-sky-50/60 p-3 text-center text-sm">
            <span className="text-[#3F4851]">{t('alreadyHaveAccount', 'Already have an account?')} </span>
            <Link
              to="/login"
              className="inline-flex min-h-[44px] items-center font-semibold text-[#006399] hover:underline"
            >
              {t('loginLink', 'Log in')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
