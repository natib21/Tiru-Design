import React from 'react';

export const FormField: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = '' }) => {
  return <div className={`flex flex-col gap-2 ${className}`}>{children}</div>;
};

export default FormField;
