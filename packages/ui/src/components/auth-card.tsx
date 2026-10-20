import React from 'react';

export const AuthCard: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = '' }) => {
  return (
    <div className={`w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export default AuthCard;
