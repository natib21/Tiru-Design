import React, { useState } from 'react';
import { Input } from '../input';

export const PasswordInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...rest }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className={`relative ${className}`}>
      <Input type={visible ? 'text' : 'password'} {...rest} />
      <button
        type="button"
        aria-label={visible ? 'Hide password' : 'Show password'}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
      >
        {visible ? 'Hide' : 'Show'}
      </button>
    </div>
  );
};

export default PasswordInput;
