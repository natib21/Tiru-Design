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
            ? 'border-[#DC2626] bg-[#FEE2E2]/20 focus-within:border-[#DC2626] focus-within:ring-1 focus-within:ring-[#DC2626]'
            : 'border-[#BEC7D3] bg-white focus-within:border-[#006399] focus-within:ring-1 focus-within:ring-[#006399]'
        } ${disabled ? 'cursor-not-allowed bg-[#F7F9FB] opacity-60' : ''} ${className}`}
      >
        <span
          className="flex min-h-[44px] select-none items-center border-r border-[#BEC7D3] bg-[#F7F9FB] px-3 font-medium text-[#3F4851]"
          aria-hidden="true"
        >
          🇪🇹 +251
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
          className="min-h-[44px] w-full flex-1 bg-transparent px-3 text-base text-[#0f172a] placeholder:text-[#3F4851]/50 focus:outline-none"
          {...rest}
        />
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
