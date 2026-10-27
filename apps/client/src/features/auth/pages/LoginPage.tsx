import { useTranslation } from 'react-i18next';
import { AuthLeftPanel } from '@/shared/ui';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  const { t } = useTranslation(['auth', 'common']);

  return (
    <div className="flex w-full flex-col lg:flex-row lg:items-center lg:gap-12">
      {/* Desktop Artboard Preview Left Column */}
      <AuthLeftPanel />

      {/* Right Column / Form Card */}
      <div className="mx-auto w-full max-w-md">
        <div className="w-full rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-sm">
          {/* Top Badges & Heading */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-primary">
                <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                {t('versionBadge', 'Tiru Studio v2.4')}
              </span>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-warning-text">
                {t('welcomePill', 'Welcome Back')}
              </span>
            </div>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t('welcomeTitle', 'Welcome back')}
            </h2>
            <p className="mt-1 text-sm text-text">
              {t(
                'loginSubtitle',
                'Log in to continue designing — access your templates, assets, and Ethiopian font libraries.'
              )}
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
