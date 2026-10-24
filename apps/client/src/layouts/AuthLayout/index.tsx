import { Link, Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from '@/shared/ui/language-toggle';

export function AuthLayout() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F9FB] text-[#0f172a]">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#BEC7D3]/60 bg-white/90 px-4 sm:px-8 backdrop-blur-sm">
        {/* Logo & Enterprise Badge */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            aria-label="TiruDesign Home"
            className="flex min-h-[44px] items-center gap-2.5 font-bold tracking-tight text-[#0f172a]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#006399] text-white shadow-xs">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <span className="text-lg">TiruDesign</span>
          </Link>
          <span className="hidden sm:inline-flex rounded-sm bg-[#FEF3C7] px-2 py-0.5 text-[11px] font-bold tracking-wider text-[#D97706]">
            {t('common.enterprise', 'ENTERPRISE')}
          </span>
        </div>

        {/* Right Header Navigation */}
        <div className="flex items-center gap-3 sm:gap-4">
          <LanguageToggle />
          <a
            href="mailto:support@tirudesign.com"
            className="hidden sm:inline-flex min-h-[44px] items-center gap-1.5 text-xs font-medium text-[#3F4851] hover:text-[#0f172a]"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>{t('common.support', 'Support')}</span>
          </a>
          {/* Mobile Profile Icon Dummy */}
          <div
            aria-hidden="true"
            className="flex sm:hidden h-9 w-9 items-center justify-center rounded-md bg-[#006399] text-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-6xl">
          <Outlet />
        </div>
      </main>

      {/* Global Footer */}
      <footer className="border-t border-[#BEC7D3]/40 bg-white px-4 py-4 sm:px-8 text-xs text-[#3F4851]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
          <p>{t('common.copyright', '© 2025 TiruDesign Enterprise. Grounded in creative empowerment.')}</p>
          <div className="flex items-center gap-6">
            <span className="hover:underline cursor-pointer">{t('common.privacyPolicy', 'Privacy Policy')}</span>
            <span className="hover:underline cursor-pointer">{t('common.termsOfService', 'Terms of Service')}</span>
            <span className="hover:underline cursor-pointer">{t('common.security', 'Security')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AuthLayout;
