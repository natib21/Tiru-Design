import React from 'react';

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & { className?: string };

export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 ${className}`} {...props} />;
}
