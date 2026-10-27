import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  className = '',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-surface-subtle text-text-secondary border border-border-subtle',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
    warning: 'bg-amber-50 text-warning-text border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300',
    danger: 'bg-danger-surface text-danger-text border border-danger/20',
    info: 'bg-sky-50 text-primary border border-sky-200 dark:bg-sky-950/40 dark:text-sky-300',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
