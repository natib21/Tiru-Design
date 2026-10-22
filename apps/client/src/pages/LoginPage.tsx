import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto p-6 border rounded-lg shadow-sm">
      <h1 className="text-xl font-bold">{t('login')}</h1>
      <p className="text-sm text-muted-foreground">Log in to your account</p>
      <div className="flex flex-col gap-2">
        <input
          type="email"
          placeholder="Email"
          className="border rounded px-3 py-2 text-sm"
          disabled
        />
        <input
          type="password"
          placeholder="Password"
          className="border rounded px-3 py-2 text-sm"
          disabled
        />
        <button
          type="button"
          className="bg-primary text-white rounded px-4 py-2 text-sm font-medium"
          disabled
        >
          {t('login')} (Placeholder)
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="underline text-primary">
          {t('signup')}
        </Link>
      </p>
    </div>
  );
}
