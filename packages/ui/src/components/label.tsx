import React from 'react';

export const Label: React.FC<{ htmlFor?: string; className?: string } & React.HTMLAttributes<HTMLLabelElement>> = ({ children, className = '', ...rest }) => {
  return (
    <label className={`text-sm font-medium text-muted-foreground ${className}`} {...rest}>
      {children}
    </label>
  );
};

export default Label;
