import { Component, type ErrorInfo, type ReactNode } from 'react';

import { ErrorState } from '@/components/feedback/error-state';

type Props = {
  children: ReactNode;
};

type State = {
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Unhandled UI error', error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="flex min-h-svh items-center justify-center p-6">
          <ErrorState
            title="Something went wrong"
            description={this.state.error.message}
            onRetry={() => this.setState({ error: null })}
          />
        </div>
      );
    }

    return this.props.children;
  }
}
