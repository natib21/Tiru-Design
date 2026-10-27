import React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  hasError?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, hasError = false, className = '', id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="relative flex items-center min-h-[44px]">
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          className={`h-4 w-4 rounded border text-primary transition focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed ${
            hasError ? 'border-danger' : 'border-border'
          } ${className}`}
          {...props}
        />
        {label && (
          <label
            htmlFor={inputId}
            className="ml-2.5 text-xs text-text select-none cursor-pointer leading-relaxed"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
export default Checkbox;
