import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ hasError = false, className = '', disabled, ...props }, ref) => {
    return (
      <input
        ref={ref}
        disabled={disabled}
        className={`w-full h-11 px-3.5 text-base sm:text-sm rounded-lg border bg-surface text-foreground transition-colors placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-text-disabled ${
          hasError
            ? 'border-danger focus-visible:ring-danger'
            : 'border-border focus-visible:border-primary focus-visible:ring-primary'
        } ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
export default Input;
