import React from 'react';

export type AlertType = 'error' | 'success' | 'info';
export type AlertVariant = 'destructive' | 'default' | 'success';

export const Alert: React.FC<{
  type?: AlertType;
  variant?: AlertVariant;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>> = ({ type, variant = 'default', children, className = '', ...rest }) => {
  const resolvedType: AlertType = type ?? (variant === 'destructive' ? 'error' : variant === 'success' ? 'success' : 'info');
  const base = 'p-3 rounded-md text-sm';
  const tone =
    resolvedType === 'error'
      ? 'bg-red-50 text-red-800 border border-red-100'
      : resolvedType === 'success'
      ? 'bg-green-50 text-green-800 border border-green-100'
      : 'bg-blue-50 text-blue-800 border border-blue-100';
  return (
    <div className={`${base} ${tone} ${className}`} role="alert" {...rest}>
      {children}
    </div>
  );
};

export default Alert;

export const AlertTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = '', ...rest }) => (
  <h4 className={`font-semibold ${className}`} {...rest}>
    {children}
  </h4>
);

export const AlertDescription: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...rest }) => (
  <div className={`text-sm ${className}`} {...rest}>
    {children}
  </div>
);
