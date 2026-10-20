import React from 'react';

type Props = {
  length?: number;
  value?: string;
  onChange?: (v: string) => void;
  className?: string;
};

export const OTPInput: React.FC<Props> = ({ length = 6, value = '', onChange, className = '' }) => {
  const values = value.split('').slice(0, length);
  const onDigit = (i: number, digit: string) => {
    const chars = [...values];
    chars[i] = digit.replace(/[^0-9]/g, '')?.charAt(0) ?? '';
    onChange?.(chars.join(''));
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          inputMode="numeric"
          maxLength={1}
          value={values[i] ?? ''}
          onChange={(e) => onDigit(i, e.target.value)}
          className="w-12 h-12 text-center border rounded-md"
        />
      ))}
    </div>
  );
};

export default OTPInput;
