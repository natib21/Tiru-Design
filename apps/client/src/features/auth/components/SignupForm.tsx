import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { authApi } from '@/features/auth/api/auth-api';
import {
  signupFormSchema,
  type SignupFormValues,
} from '@/features/auth/schemas/auth';
import {
  applyApiErrors,
  type BannerErrorInfo,
} from '@/features/auth/utils/apply-api-errors';
import {
  Button,
  Input,
  Checkbox,
  PasswordStrengthBar,
  PhoneInput,
  GoogleButton,
} from '@/shared/ui';
import { FormField } from '@/shared/ui/form';

export function SignupForm() {
  const { t } = useTranslation(['auth', 'common']);
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [bannerError, setBannerError] = useState<BannerErrorInfo | null>(null);

  const showGoogleAuth = import.meta.env.VITE_GOOGLE_AUTH_ENABLED === 'true';

  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
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

    return { score, label: labels[score] || '' };
  };

  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setBannerError(null);

    try {
      const formattedPhone = `+251${data.phone.trim()}`;

      await authApi.signup({
        email: data.email,
        phoneNumber: formattedPhone,
        password: data.password,
      });

      // Navigate to intended destination or /dashboard
      const fromLocation =
        (location.state as { from?: string } | null)?.from || '/dashboard';

      navigate(fromLocation, { replace: true });
    } catch (err: unknown) {
      applyApiErrors({
        error: err,
        setError,
        setBannerError,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Banner Error */}
      {bannerError && (
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
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
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

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          id="signup-email"
          label={t('emailLabel', 'Email address')}
          error={errors.email?.message}
          required
        >
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            disabled={isLoading}
            placeholder={t('emailPlaceholder', 'alex@example.com')}
            hasError={Boolean(errors.email)}
            {...register('email')}
          />
        </FormField>

        <FormField
          id="signup-phone"
          label={t('phoneLabel', 'Phone number')}
          error={errors.phone?.message}
          required
        >
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                value={field.value}
                onChange={field.onChange}
                disabled={isLoading}
                hasError={Boolean(errors.phone)}
                placeholder={t('phonePlaceholder', '9XXXXXXXX or 7XXXXXXXX')}
              />
            )}
          />
        </FormField>

        <FormField
          id="signup-password"
          label={t('passwordLabel', 'Password')}
          error={errors.password?.message}
          required
        >
          <div className="relative">
            <Input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              disabled={isLoading}
              placeholder={t('createPasswordPlaceholder', 'Create a password (min. 8 characters)')}
              hasError={Boolean(errors.password)}
              className="pr-10"
              {...register('password')}
            />
            <button
              type="button"
              disabled={isLoading}
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

          <div className="mt-2">
            <PasswordStrengthBar score={strength.score} label={strength.label} />
          </div>
        </FormField>

        <div>
          <Controller
            name="agreeTerms"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                disabled={isLoading}
                hasError={Boolean(errors.agreeTerms)}
                label={
                  <span>
                    {t('agreeTerms', 'I agree to the')}{' '}
                    <span className="font-semibold text-primary underline underline-offset-2">
                      {t('termsLink', 'Terms of Service')}
                    </span>{' '}
                    {t('and', 'and')}{' '}
                    <span className="font-semibold text-primary underline underline-offset-2">
                      {t('privacyLink', 'Privacy Policy')}
                    </span>
                  </span>
                }
              />
            )}
          />
          {errors.agreeTerms && (
            <p className="text-xs text-danger font-medium mt-1">
              {errors.agreeTerms.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full mt-2 font-bold"
        >
          {isLoading
            ? t('creatingAccount', 'Creating account...')
            : t('createAccountBtn', 'Create account')}
        </Button>
      </form>

      {/* Footer link to log in */}
      <div className="mt-6 text-center text-xs text-text-secondary">
        <span>{t('alreadyHaveAccount', 'Already have an account?')} </span>
        <Link
          to="/login"
          className="font-bold text-primary hover:text-primary-deep underline-offset-4 hover:underline"
        >
          {t('loginLink', 'Log in')}
        </Link>
      </div>
    </div>
  );
}

export default SignupForm;
