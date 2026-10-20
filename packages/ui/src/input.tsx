import React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {};

export const Input: React.FC<InputProps> = ({ className = '', ...rest }) => {
  return <input className={`border rounded-md px-3 py-2 text-sm ${className}`} {...rest} />;
};

export default Input;
