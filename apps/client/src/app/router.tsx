import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { PageSkeleton } from '@/shared/ui';
import { AuthLayout, ClientLayout, EditorLayout } from './layouts';

const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'));
const TemplatesPage = lazy(() => import('@/pages/TemplatesPage'));
const EditorPage = lazy(() => import('@/pages/EditorPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const DevAuthStatesPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/DevAuthStatesPage'))
  : null;

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          {/* Client app routes */}
          <Route element={<ClientLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
          </Route>

          {/* Editor route */}
          <Route element={<EditorLayout />}>
            <Route path="/editor/:projectId" element={<EditorPage />} />
          </Route>

          {/* Dev-only auth states gallery */}
          {import.meta.env.DEV && DevAuthStatesPage && (
            <Route path="/dev/auth-states" element={<DevAuthStatesPage />} />
          )}

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRouter;
