import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ClientLayout } from '@/layouts/ClientLayout';
import { EditorLayout } from '@/layouts/EditorLayout';
import LoginPage from '@/features/auth/pages/LoginPage';
import SignupPage from '@/features/auth/pages/SignupPage';
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage';
import VerifyPhonePage from '@/features/auth/pages/VerifyPhonePage';
import VerifyEmailPage from '@/features/auth/pages/VerifyEmailPage';

function Placeholder({ title }: { title: string }) {
  return <div className="prose p-4">{title} (placeholder)</div>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-phone" element={<VerifyPhonePage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
        </Route>

        <Route element={<ClientLayout />}>
          <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
          <Route path="/projects" element={<Placeholder title="Projects" />} />
          <Route path="/projects/:projectId" element={<Placeholder title="Project Detail" />} />
          <Route path="/marketplace" element={<Placeholder title="Marketplace" />} />
          <Route path="/templates" element={<Placeholder title="Templates" />} />
          <Route path="/assets" element={<Placeholder title="Assets" />} />
          <Route path="/notifications" element={<Placeholder title="Notifications" />} />
          <Route path="/billing" element={<Placeholder title="Billing" />} />
          <Route path="/settings" element={<Placeholder title="Settings" />} />
          <Route path="/profile" element={<Placeholder title="Profile" />} />
        </Route>

        <Route element={<EditorLayout />}>
          <Route path="/editor/:projectId" element={<Placeholder title="Editor" />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
