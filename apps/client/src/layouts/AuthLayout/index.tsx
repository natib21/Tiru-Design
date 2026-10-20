import { Link, Outlet } from 'react-router';

import { APP_NAME } from '@/constants/app';

export function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="border-b px-6 py-4">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          {APP_NAME}
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md min-w-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
