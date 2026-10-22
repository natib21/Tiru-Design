import type { PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { Toaster } from 'sonner';
import { queryClient } from '@/shared/api';
import i18n from '@/shared/i18n';
import { ErrorBoundary } from '@/shared/ui';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          {children}
          <Toaster richColors position="top-right" />
        </I18nextProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default AppProviders;
