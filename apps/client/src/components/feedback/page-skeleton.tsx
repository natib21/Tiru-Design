import { Skeleton } from '@tirudesign/ui';

export function PageSkeleton() {
  return (
    <div className="flex min-h-svh flex-col gap-4 p-6" aria-busy="true" aria-live="polite">
      <Skeleton className="h-8 w-48 max-w-full" />
      <Skeleton className="h-4 w-full max-w-xl" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-36 w-full" />
      </div>
    </div>
  );
}
