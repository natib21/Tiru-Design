import React from 'react';
import { colors } from './tokens';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'icon';
};

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', className = '', children, ...rest }) => {
  const base = 'inline-flex items-center justify-center rounded-md font-medium';
  const sizeClass = size === 'sm' ? 'text-sm px-3 py-1' : size === 'icon' ? 'p-2' : 'text-sm px-3 py-2';
  const variantClass =
    variant === 'primary'
      ? `bg-[${colors.primary}] text-white`
      : variant === 'outline'
      ? 'border'
      : 'bg-transparent';

  return (
    <button className={`${base} ${sizeClass} ${variantClass} ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;
