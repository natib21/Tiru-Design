import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

export default function SignupPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto p-6 border rounded-lg shadow-sm">
      <h1 className="text-xl font-bold">{t('signup')}</h1>
      <p className="text-sm text-muted-foreground">Create a new account</p>
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
          {t('signup')} (Placeholder)
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="underline text-primary">
          {t('login')}
        </Link>
      </p>
    </div>
  );
}
