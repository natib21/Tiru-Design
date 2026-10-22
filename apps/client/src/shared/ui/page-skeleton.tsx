export function PageSkeleton() {
  return (
    <div className="flex min-h-svh flex-col gap-4 p-6 animate-pulse">
      <div className="h-8 w-48 rounded bg-muted"></div>
      <div className="h-64 w-full rounded bg-muted/60"></div>
    </div>
  );
}
