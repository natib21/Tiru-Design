import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-extrabold mb-2">404</h1>
      <p className="text-muted-foreground mb-4">{t('notFound')}</p>
      <Link
        to="/dashboard"
        className="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        {t('backToHome')}
      </Link>
    </div>
  );
}
