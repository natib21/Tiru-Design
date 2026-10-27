import { useTranslation } from 'react-i18next';
import { AuthLeftPanel } from '@/shared/ui';
import { SignupForm } from '@/features/auth/components/SignupForm';

export default function SignupPage() {
  const { t } = useTranslation(['auth', 'common']);

  return (
    <div className="flex w-full flex-col lg:flex-row lg:items-center lg:gap-12">
      {/* Desktop Split Artwork (Derived Layout from Desktop Login) */}
      <AuthLeftPanel />

      {/* Right Column / Form Card */}
      <div className="mx-auto w-full max-w-md">
        <div className="w-full rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-sm">
          {/* Header Badges & Title */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-warning-text">
              <span className="h-2 w-2 rounded-full bg-warning-text" aria-hidden="true" />
              {t('hubBadge', 'ADDIS CREATIVE HUB')}
            </div>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t('createAccountTitle', 'Create your account')}
            </h2>
            <p className="mt-1 text-sm text-text">
              {t('signupSubtitle', 'Start designing in Amharic & English')}
            </p>
          </div>

          <SignupForm />
        </div>
      </div>
    </div>
  );
}
