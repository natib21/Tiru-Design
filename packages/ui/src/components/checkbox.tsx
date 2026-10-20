import React from 'react';

export const Checkbox: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...rest }) => {
  return <input type="checkbox" className={`h-4 w-4 rounded-sm ${className}`} {...rest} />;
};

export default Checkbox;
