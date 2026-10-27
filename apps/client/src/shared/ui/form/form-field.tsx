import React from 'react';

export interface FormFieldProps {
  label?: React.ReactNode;
  error?: string | null;
  hint?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  hint,
  required,
  children,
  className = '',
  id,
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-text-secondary select-none"
        >
          {label}
          {required && <span className="ml-1 text-danger" aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p role="alert" className="text-xs text-danger font-medium mt-1">
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="text-xs text-text-tertiary mt-1">
          {hint}
        </p>
      )}
    </div>
  );
};

export default FormField;
