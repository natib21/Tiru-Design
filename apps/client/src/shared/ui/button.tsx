import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, className = '', disabled, children, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 select-none';

    const variants = {
      primary: 'bg-primary text-primary-contrast hover:bg-primary-deep shadow-xs',
      outline: 'border border-border bg-surface text-foreground hover:bg-surface-subtle',
      ghost: 'text-foreground hover:bg-surface-subtle',
      danger: 'bg-danger text-white hover:bg-danger-text shadow-xs',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
      md: 'min-h-[44px] px-4 py-2 text-sm rounded-lg gap-2',
      lg: 'min-h-[48px] px-6 py-2.5 text-base rounded-lg gap-2.5',
      icon: 'h-10 w-10 p-2 rounded-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg className="h-4 w-4 animate-spin text-current shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
