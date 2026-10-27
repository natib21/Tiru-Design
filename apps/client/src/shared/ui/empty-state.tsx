import React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-border bg-surface-subtle/50 ${className}`}
    >
      {icon && (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-surface border border-border-subtle text-text-tertiary shadow-xs">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-xs text-text-secondary leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
