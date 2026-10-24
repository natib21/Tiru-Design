import React from 'react';

export interface PasswordStrengthBarProps {
  score: number; // 0 to 4
  charCount?: number;
  minChars?: number;
  label?: string;
  className?: string;
}

export const PasswordStrengthBar: React.FC<PasswordStrengthBarProps> = ({
  score,
  charCount,
  minChars = 8,
  label,
  className = '',
}) => {
  const getBarColor = (index: number) => {
    if (index >= score) return 'bg-[#BEC7D3]/40';
    if (score === 1) return 'bg-[#DC2626]';
    if (score === 2) return 'bg-[#D97706]';
    if (score === 3) return 'bg-[#006399]';
    return 'bg-[#22C55E]';
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex h-1.5 w-full gap-1.5">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`h-full flex-1 rounded-full transition-colors duration-200 ${getBarColor(index)}`}
          />
        ))}
      </div>
      {(label || charCount !== undefined) && (
        <div className="flex items-center justify-between text-xs text-[#3F4851]">
          <span>{label}</span>
          {charCount !== undefined && (
            <span className="tabular-nums">
              {charCount} / {minChars} chars
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthBar;
