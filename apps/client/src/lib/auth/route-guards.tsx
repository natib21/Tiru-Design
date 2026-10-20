import { Navigate, Outlet, useLocation } from 'react-router';

import { PageSkeleton } from '@/components/feedback/page-skeleton';
import { useSession } from '@/features/auth';

export function ProtectedRoute() {
  const location = useLocation();
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <PageSkeleton />;
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export function GuestRoute() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <PageSkeleton />;
  }

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
