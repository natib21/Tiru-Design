import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { PageSkeleton } from '@/shared/ui';
import { useAuthStore } from '@/features/auth/auth-store';
import { restoreSession } from '@/features/auth/session-restore';

/**
 * Protects private routes: unauthenticated users are redirected to /login,
 * saving the requested path in location.state.from so they can return after login.
 * Shows full-page skeleton while restoring session; never flashes login page.
 */
export function AuthGuard() {
  const location = useLocation();
  const accessToken = useAuthStore((s) => s.accessToken);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const isRestoring = useAuthStore((s) => s.isRestoring);
  const isRestored = useAuthStore((s) => s.isRestored);
  const [, setRerender] = useState(0);

  useEffect(() => {
    if (!isRestored && refreshToken) {
      restoreSession().finally(() => {
        setRerender((v) => v + 1);
      });
    }
  }, [isRestored, refreshToken]);

  if (isRestoring || (!isRestored && refreshToken)) {
    return <PageSkeleton />;
  }

  if (!accessToken) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <Outlet />;
}

/**
 * Guards public auth pages (/login, /signup):
 * A logged-in user who opens /login or /signup is redirected to /dashboard.
 */
export function GuestGuard() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const isRestoring = useAuthStore((s) => s.isRestoring);
  const isRestored = useAuthStore((s) => s.isRestored);
  const [, setRerender] = useState(0);

  useEffect(() => {
    if (!isRestored && refreshToken) {
      restoreSession().finally(() => {
        setRerender((v) => v + 1);
      });
    }
  }, [isRestored, refreshToken]);

  if (isRestoring || (!isRestored && refreshToken)) {
    return <PageSkeleton />;
  }

  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

// Aliases for compatibility
export const ProtectedRoute = AuthGuard;
export const GuestRoute = GuestGuard;
export default AuthGuard;
