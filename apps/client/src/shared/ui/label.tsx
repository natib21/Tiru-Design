import React from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ required, children, className = '', ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`block text-xs font-semibold uppercase tracking-wider text-text-secondary select-none ${className}`}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-danger" aria-hidden="true">*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';
export default Label;
