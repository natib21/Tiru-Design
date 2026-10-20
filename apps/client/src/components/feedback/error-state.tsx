import { Alert, AlertDescription, AlertTitle, Button } from '@tirudesign/ui';

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = 'Unable to load this page',
  description = 'Please try again. If the problem continues, contact support.',
  onRetry,
}: ErrorStateProps) {
  return (
    <Alert variant="destructive" className="max-w-lg">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-col gap-3">
        <p className="min-w-0 wrap-break-word">{description}</p>
        {onRetry ? (
          <Button type="button" variant="outline" onClick={onRetry}>
            Try again
          </Button>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}
