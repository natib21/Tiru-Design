import React from 'react';

export interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, hasError = false, className = '', id, disabled, ...rest }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Allow only digits, max 9 digits
      const cleaned = e.target.value.replace(/\D/g, '').slice(0, 9);
      onChange(cleaned);
    };

    return (
      <div
        className={`flex min-h-[44px] w-full items-center overflow-hidden rounded-md border text-base transition-colors ${
          hasError
            ? 'border-danger bg-danger-surface/20 focus-within:border-danger focus-within:ring-1 focus-within:ring-danger'
            : 'border-border bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary'
        } ${disabled ? 'cursor-not-allowed bg-background opacity-60' : ''} ${className}`}
      >
        <span
          className="flex min-h-[44px] select-none items-center border-r border-border bg-background px-3 font-medium text-text"
          aria-hidden="true"
        >
          ET +251
        </span>
        <input
          ref={ref}
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="9XXXXXXXX or 7XXXXXXXX"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className="min-h-[44px] w-full flex-1 bg-transparent px-3 text-base text-foreground placeholder:text-text/50 focus:outline-none"
          {...rest}
        />
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
