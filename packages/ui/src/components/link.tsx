import React from 'react';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  as?: React.ElementType;
  className?: string;
}

export const Link: React.FC<React.PropsWithChildren<LinkProps>> = ({ to, as, children, className = '', ...rest }) => {
  const Component: React.ElementType = as ?? 'a';
  if (as) {
    return <Component to={to} className={`text-primary-600 underline ${className}`} {...rest}>{children}</Component>;
  }
  return (
    <a href={to} className={`text-primary-600 underline ${className}`} {...rest}>
      {children}
    </a>
  );
};

export default Link;
